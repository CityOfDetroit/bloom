import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindConditions, RemoveOptions, Repository, SaveOptions } from "typeorm"
import { paginate, Pagination } from "nestjs-typeorm-paginate"
import { decode, encode } from "jwt-simple"
import moment from "moment"
import crypto from "crypto"
import { User } from "../entities/user.entity"
import { assignDefined } from "../../shared/assign-defined"
import { ConfirmDto } from "../dto/confirm.dto"
import { USER_ERRORS } from "../user-errors"
import { UpdatePasswordDto } from "../dto/update-password.dto"
import { EmailService } from "../../shared/email/email.service"
import { AuthService } from "./auth.service"
import { AuthzService } from "./authz.service"
import { ForgotPasswordDto } from "../dto/forgot-password.dto"

import { AuthContext } from "../types/auth-context"
import { PasswordService } from "./password.service"
import { JurisdictionResolverService } from "../../jurisdictions/services/jurisdiction-resolver.service"
import { EmailDto } from "../dto/email.dto"
import { UserCreateDto } from "../dto/user-create.dto"
import { UserUpdateDto } from "../dto/user-update.dto"
import { UserListQueryParams } from "../dto/user-list-query-params"
import { UserInviteDto } from "../dto/user-invite.dto"
import { ConfigService } from "@nestjs/config"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"
import { authzActions } from "../enum/authz-actions.enum"
import { addFilters } from "../../shared/filter"
import { UserFilterParams } from "../dto/user-filter-params"
import { userFilterTypeToFieldMap } from "../dto/user-filter-type-to-field-map"
import { Application } from "../../applications/entities/application.entity"
import { Listing } from "../../listings/entities/listing.entity"
import { UserRoles } from "../entities/user-roles.entity"
import { UserPreferences } from "../../../src/user-preferences/entities/user-preferences.entity"
import { SanMateoHUD2019 } from "../../../archer"
import { ListingReviewOrder, ListingStatus, CSVFormattingType, UnitStatus } from "../../../types"
import { Property } from "../../property/entities/property.entity"
import { ApplicationMethodDto } from "../../../src/application-methods/dto/application-method.dto"
import { UnitType } from "src/unit-types/entities/unit-type.entity"

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Application) private readonly applicationsRepository: Repository<Application>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly authzService: AuthzService,
    private readonly passwordService: PasswordService,
    private readonly jurisdictionResolverService: JurisdictionResolverService
  ) {}

  public async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ["leasingAgentInListings"],
    })
  }

  public async find(options: FindConditions<User>) {
    return await this.userRepository.findOne({
      where: options,
      relations: ["leasingAgentInListings"],
    })
  }

  public async list(
    params: UserListQueryParams,
    authContext: AuthContext
  ): Promise<Pagination<User>> {
    const options = {
      limit: params.limit === "all" ? undefined : params.limit,
      page: params.page || 10,
    }
    // https://www.npmjs.com/package/nestjs-typeorm-paginate
    const qb = this._getQb()

    if (params.filter) {
      addFilters<Array<UserFilterParams>, typeof userFilterTypeToFieldMap>(
        params.filter,
        userFilterTypeToFieldMap,
        qb
      )
    }

    const result = await paginate<User>(qb, options)
    /**
     * admin are the only ones that can access all users
     * so this will throw on the first user that isn't their own (non admin users can access themselves)
     */
    await Promise.all(
      result.items.map(async (user) => {
        await this.authzService.canOrThrow(authContext.user, "user", authzActions.read, user)
      })
    )

    return result
  }

  async update(dto: UserUpdateDto, authContext: AuthContext) {
    const user = await this.find({
      id: dto.id,
    })
    if (!user) {
      throw new NotFoundException()
    }

    let passwordHash
    if (dto.password) {
      if (!dto.currentPassword) {
        // Validation is handled at DTO definition level
        throw new BadRequestException()
      }
      if (!(await this.passwordService.verifyUserPassword(user, dto.currentPassword))) {
        throw new UnauthorizedException("invalidPassword")
      }

      passwordHash = await this.passwordService.passwordToHash(dto.password)
      delete dto.password
    }

    /**
     * jurisdictions should be filtered based off of what the authContext user has
     */
    if (authContext.user.jurisdictions) {
      if (dto.jurisdictions) {
        dto.jurisdictions = dto.jurisdictions.filter(
          (jurisdiction) =>
            authContext.user.jurisdictions.findIndex((val) => val.id === jurisdiction.id) > -1
        )
      }
    } else {
      delete dto.jurisdictions
    }

    if (dto.newEmail && dto.appUrl) {
      user.confirmationToken = UserService.createConfirmationToken(user.id, dto.newEmail)
      const confirmationUrl = UserService.getPublicConfirmationUrl(dto.appUrl, user)
      await this.emailService.changeEmail(user, dto.appUrl, confirmationUrl, dto.newEmail)
    }

    delete dto.newEmail
    delete dto.appUrl

    assignDefined(user, {
      ...dto,
      passwordHash,
    })

    return await this.userRepository.save(user)
  }

  public async confirm(dto: ConfirmDto) {
    const token = decode(dto.token, process.env.APP_SECRET)

    const user = await this.find({ id: token.id })
    if (!user) {
      console.error(`Trying to confirm non-existing user ${token.id}.`)
      throw new HttpException(USER_ERRORS.NOT_FOUND.message, USER_ERRORS.NOT_FOUND.status)
    }

    if (user.confirmationToken !== dto.token) {
      console.error(`Confirmation token mismatch for user ${token.id}.`)
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }

    user.confirmedAt = new Date()
    user.confirmationToken = null

    if (dto.password) {
      user.passwordHash = await this.passwordService.passwordToHash(dto.password)
    }

    try {
      await this.userRepository.save({
        ...user,
        ...(token.email && { email: token.email }),
      })
      return this.authService.generateAccessToken(user)
    } catch (err) {
      throw new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
    }
  }

  private static createConfirmationToken(userId: string, email: string) {
    const payload = {
      id: userId,
      email,
      exp: Number.parseInt(moment().add(24, "hours").format("X")),
    }
    return encode(payload, process.env.APP_SECRET)
  }

  public async resendPublicConfirmation(dto: EmailDto) {
    const user = await this.findByEmail(dto.email)
    if (!user) {
      throw new HttpException(USER_ERRORS.NOT_FOUND.message, USER_ERRORS.NOT_FOUND.status)
    }
    if (user.confirmedAt) {
      throw new HttpException(
        USER_ERRORS.ACCOUNT_CONFIRMED.message,
        USER_ERRORS.ACCOUNT_CONFIRMED.status
      )
    } else {
      user.confirmationToken = UserService.createConfirmationToken(user.id, user.email)
      try {
        await this.userRepository.save(user)
        const confirmationUrl = UserService.getPublicConfirmationUrl(dto.appUrl, user)
        await this.emailService.welcome(user, dto.appUrl, confirmationUrl)
        return user
      } catch (err) {
        throw new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
      }
    }
  }

  private static getPublicConfirmationUrl(appUrl: string, user: User) {
    return `${appUrl}?token=${user.confirmationToken}`
  }

  private static getPartnersConfirmationUrl(appUrl: string, user: User) {
    return `${appUrl}/users/confirm?token=${user.confirmationToken}`
  }

  public async connectUserWithExistingApplications(user: User) {
    const applications = await this.applicationsRepository
      .createQueryBuilder("applications")
      .leftJoinAndSelect("applications.applicant", "applicant")
      .where("applications.user IS NULL")
      .andWhere("applicant.emailAddress = :email", { email: user.email })
      .getMany()

    for (const application of applications) {
      application.user = user
    }

    await this.applicationsRepository.save(applications)
  }

  public async _createUser(dto: Partial<User>, authContext: AuthContext) {
    if (dto.confirmedAt) {
      await this.authzService.canOrThrow(authContext.user, "user", authzActions.confirm, {
        ...dto,
      })
    }
    const existingUser = await this.findByEmail(dto.email)
    if (existingUser) {
      throw new HttpException(USER_ERRORS.EMAIL_IN_USE.message, USER_ERRORS.EMAIL_IN_USE.status)
    }

    try {
      let newUser = await this.userRepository.save(dto)

      newUser.confirmationToken = UserService.createConfirmationToken(newUser.id, newUser.email)
      newUser = await this.userRepository.save(newUser)

      return newUser
    } catch (err) {
      console.error(err)
      throw new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
    }
  }

  public async createPublicUser(
    dto: UserCreateDto,
    authContext: AuthContext,
    sendWelcomeEmail = false
  ) {
    const newUser = await this._createUser(
      {
        ...dto,
        passwordHash: await this.passwordService.passwordToHash(dto.password),
        jurisdictions: dto.jurisdictions
          ? (dto.jurisdictions as JurisdictionDto[])
          : [await this.jurisdictionResolverService.getJurisdiction()],
        preferences: dto.preferences as UserPreferences,
      },
      authContext
    )
    if (sendWelcomeEmail) {
      const confirmationUrl = UserService.getPublicConfirmationUrl(dto.appUrl, newUser)
      //await this.emailService.welcome(newUser, dto.appUrl, confirmationUrl)
      await this.emailService.sendlisting(this.ArcherListing, newUser)
    }
    await this.connectUserWithExistingApplications(newUser)
    return newUser
  }

  ArcherListing:  Listing ={
    id: "Uvbk5qurpB2WI9V6WnNdH",
    applicationDueDate: new Date("2019-12-31T15:22:57.000-07:00"),
    applicationConfig: undefined,
    applicationOpenDate: new Date("2019-12-31T15:22:57.000-07:00"),
    applicationDueTime: new Date("2019-12-31T15:22:57.000-07:00"),
    applicationPickUpAddress: undefined,
    applicationPickUpAddressOfficeHours: "",
    applicationDropOffAddress: null,
    applicationDropOffAddressOfficeHours: null,
    applicationMailingAddress: null,
    //countyCode: CountyCode["San Jose"],
    jurisdiction: {
      id: "id",
      name: "San Jose",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    depositMax: "",
    disableUnitsAccordion: false,
    events: [],
    showWaitlist: false,
    reviewOrderType: ListingReviewOrder.firstComeFirstServe,
    //urlSlug: "listing-slug-abcdef",
    whatToExpect: "Applicant will be contacted. All info will be verified. Be prepared if chosen.",
    status: ListingStatus.active,
    postmarkedApplicationsReceivedByDate: new Date("2019-12-31T15:22:57.000-07:00"),
    applicationAddress: {
      id: "sQ19KuyILEo0uuNqti2fl",
      createdAt: new Date("2019-12-31T15:22:57.000-07:00"),
      updatedAt: new Date("2019-12-31T15:22:57.000-07:00"),
      city: "San Jose",
      street: "98 Archer Street",
      zipCode: "95112",
      state: "CA",
      latitude: 37.36537,
      longitude: -121.91071,
    },
    applicationMethods: [],
    applicationOrganization: "98 Archer Street",
    // TODO confirm not used anywhere
    // applicationPhone: "(408) 217-8562",
    assets: [
      {
        // TODO confirm not used anywhere
        // referenceType: "Listing",
        // TODO confirm not used anywhere
        // referenceId: "Uvbk5qurpB2WI9V6WnNdH",
        label: "building",
        fileId: "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/archer/archer-studios.jpg",
      },
    ],
    buildingSelectionCriteria: "Tenant Selection Criteria will be available to all applicants upon request.",
    costsNotIncluded: "Resident responsible for PG&E, internet and phone.  Owner pays for water, trash, and sewage.  Residents encouraged to obtain renter's insurance but this is not a requirement.  Rent is due by the 5th of each month. Late fee $35 and returned check fee is $35 additional.",
    creditHistory: "Applications will be rated on a score system for housing. An applicant's score may be impacted by negative tenant peformance information provided to the credit reporting agency.  All applicants are expected have a passing acore of 70 points out of 100 to be considered for housing.  Applicants with no credit history will receive a maximum of 80 points to fairly outweigh positive and/or negative trades as would an applicant with established credit history. Refer to Tenant Selection Criteria or Qualification Criteria for details related to the qualification process. ",
    depositMin: "1140.0",
    programRules: "Applicants must adhere to minimum & maximum income limits. Tenant Selection Criteria applies.",
    // TODO confirm not used anywhere
    // externalId: null,
    waitlistMaxSize: 300,
    name: "Archer Studios",
    waitlistCurrentSize: 300,
    waitlistOpenSpots: 0,
    isWaitlistOpen: true,
    // Addng displayWaitListSize for #707
    displayWaitlistSize: false,
    // TODO confirm not used anywhere
    // prioritiesDescriptor: null,
    requiredDocuments: "Completed application and government issued IDs",
    // TODO confirm not used anywhere
    // reservedCommunityMaximumAge: null,
    // TODO confirm not used anywhere
    // reservedCommunityMinimumAge: null,
    // TODO confirm not used anywhere
    // reservedDescriptor: null,
    createdAt: new Date("2019-07-08T15:37:19.565-07:00"),
    updatedAt: new Date("2019-07-09T14:35:11.142-07:00"),
    // TODO confirm not used anywhere
    // groupId: 1,
    // TODO confirm not used anywhere
    // hideUnitFeatures: false,
    applicationFee: "30.0",
    criminalBackground: "A criminal background investigation will be obtained on each applicant.  As criminal background checks are done county by county and will be ran for all counties in which the applicant lived,  Applicants will be disqualified for tenancy if they have been convicted of a felony or misdemeanor.  Refer to Tenant Selection Criteria or Qualification Criteria for details related to the qualification process. ",
    CSVFormattingType: CSVFormattingType.basic,
    leasingAgentAddress: {
      id: "sQ19KuyILEo0uuNqti2fl",
      createdAt: new Date("2019-12-31T15:22:57.000-07:00"),
      updatedAt: new Date("2019-12-31T15:22:57.000-07:00"),
      city: "San Jose",
      street: "98 Archer Street",
      zipCode: "95112",
      state: "CA",
      latitude: 37.36537,
      longitude: -121.91071,
    },
    leasingAgentEmail: "mbaca@charitieshousing.org",
    leasingAgentName: "Marisela Baca",
    leasingAgentOfficeHours: "Monday, Tuesday & Friday, 9:00AM - 5:00PM",
    leasingAgentPhone: "(408) 217-8562",
    leasingAgentTitle: "",
    rentalAssistance: "Custom rental assistance",
    rentalHistory: "Two years of rental history will be verified with all applicable landlords.  Household family members and/or personal friends are not acceptable landlord references.  Two professional character references may be used in lieu of rental history for applicants with no prior rental history.  An unlawful detainer report will be processed thourhg the U.D. Registry, Inc. Applicants will be disqualified if they have any evictions filing within the last 7 years.  Refer to Tenant Selection Criteria or Qualification Criteria for details related to the qualification process.",
    preferences: [],
    //householdSizeMin: 2,
    //householdSizeMax: 3,
    //smokingPolicy: "Non-smoking building",
    //unitsAvailable: 0,
    unitsSummary: [{
      id : "id",
      unitType: undefined,
      totalCount: 4,
      monthlyRentMin: 707,
      monthlyRentMax: 900,
      listing: undefined,
      sqFeetMin: "720",
      sqFeetMax: "1003",
      totalAvailable: 4,
    },
    {
      id : "id",
      unitType: undefined,
      totalCount: 4,
      monthlyRentMin: 787,
      monthlyRentMax: 1000,
      listing: undefined,
      sqFeetMin: "720",
      sqFeetMax: "1003",
      totalAvailable: 4,
    },
    {
      id : "id",
      unitType: undefined,
      totalCount: 4,
      monthlyRentMin: 727,
      monthlyRentMax: 900,
      listing: undefined,
      sqFeetMin: "720",
      sqFeetMax: "1003",
      totalAvailable: 4,
    }],
    unitsSummarized: undefined,
    //unitAmenities: "Dishwasher",
    //developer: "Charities Housing ",
    //yearBuilt: 2012,
    //accessibility:
    //"There is a total of 5 ADA units in the complex, all others are adaptable. Exterior Wheelchair ramp (front entry)",
    //amenities:
    //"Community Room, Laundry Room, Assigned Parking, Bike Storage, Roof Top Garden, Part-time Resident Service Coordinator",
    //buildingTotalUnits: 35,
    property: {
      id: "buildingId",
      createdAt: new Date(),
      updatedAt: new Date(),
      unitsAvailable: 3,
      units: [
        {
          id: "sQ19KuyILEo0uuNqti2fl",
          property: new Property(),
          amiPercentage: "45.0",
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 2,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-07-09T21:20:05.783Z"),
          updatedAt: new Date("2019-08-14T23:05:43.913Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "Cq870hwYXcPxCYT4_uW_3",
          property: new Property(),
          amiPercentage: "45.0",
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 3,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:53:09.982Z"),
          updatedAt: new Date("2019-08-14T23:06:59.015Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "9XQrfuAPOn8wtD7HlhCTR",
          property: new Property(),
          amiPercentage: "45.0",
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 2,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:52:08.758Z"),
          updatedAt: new Date("2019-08-14T23:06:59.023Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "bamrJpZA9JmnLSMEbTlI4",
          property: new Property(),
          amiPercentage: "45.0",
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 2,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:52:08.766Z"),
          updatedAt: new Date("2019-08-14T23:06:59.031Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "BCwOFAHJDpyPbKcVBjIUM",
          amiPercentage: "45.0",
          property: new Property(),
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 2,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:52:08.771Z"),
          updatedAt: new Date("2019-08-14T23:06:59.039Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "5t56gXJdJLZiksBuX8BtL",
          amiPercentage: "45.0",
          property: new Property(),
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 2,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:52:08.777Z"),
          updatedAt: new Date("2019-08-14T23:06:59.046Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "7mmAuJ0x7l_2VxJLoSzX5",
          property: new Property(),
          amiPercentage: "45.0",
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 2,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:52:08.783Z"),
          updatedAt: new Date("2019-08-14T23:06:59.053Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "LVsJ-_PYy8x2rn5V8Deo9",
          property: new Property(),
          amiPercentage: "45.0",
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 3,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:53:09.976Z"),
          updatedAt: new Date("2019-08-14T23:06:59.161Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "neDXHUzJkL2YZ2CQOZx1i",
          property: new Property(),
          amiPercentage: "45.0",
          annualIncomeMin: "26496.0",
          monthlyIncomeMin: "2208.0",
          floor: 3,
          annualIncomeMax: "46125.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "1104.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:53:09.976Z"),
          updatedAt: new Date("2019-08-14T23:06:59.167Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "3_cr3dd76rGY7tDYlvfEO",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 2,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-07-09T21:24:14.122Z"),
          updatedAt: new Date("2019-08-14T23:06:59.173Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "_38QsH2XMgHEzn_Sn4b2r",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 2,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:55:22.950Z"),
          updatedAt: new Date("2019-08-14T23:06:59.179Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "gTHXtJ37uP8R8zkOp7wOt",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 2,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:55:22.956Z"),
          updatedAt: new Date("2019-08-14T23:06:59.186Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "me-MRbUEn6ox-OYpzosO1",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 2,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:55:22.961Z"),
          updatedAt: new Date("2019-08-14T23:06:59.192Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "ZOtuFSb79LX7p6CVW3H4w",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 2,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:55:22.967Z"),
          updatedAt: new Date("2019-08-14T23:06:59.198Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "nISGOCiWoCzQXkMZGV5bV",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 2,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:55:22.972Z"),
          updatedAt: new Date("2019-08-14T23:06:59.204Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "Ppne-7ChrEht1HxwfO0gc",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 2,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:55:22.978Z"),
          updatedAt: new Date("2019-08-14T23:06:59.210Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "78hBgnEoHw3aW5r4Mn2Jf",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 2,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:55:22.984Z"),
          updatedAt: new Date("2019-08-14T23:06:59.216Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          id: "0RtHf-Iogw3x643r46y-a",
          property: new Property(),
          amiPercentage: "30.0",
          annualIncomeMin: "17256.0",
          monthlyIncomeMin: "1438.0",
          floor: 3,
          annualIncomeMax: "30750.0",
          maxOccupancy: 2,
          minOccupancy: 1,
          monthlyRent: "719.0",
          numBathrooms: null,
          numBedrooms: null,
          number: null,
          priorityType: null,
          sqFeet: "285",
          status: UnitStatus.occupied,
          unitType: {
            id: "random_id_35edf",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
            numBedrooms: 0,
          },
          createdAt: new Date("2019-08-14T22:56:06.563Z"),
          updatedAt: new Date("2019-08-14T23:06:59.222Z"),
          amiChart: SanMateoHUD2019,
          monthlyRentAsPercentOfIncome: null,
        },
      ],
      propertyGroups: [],
      buildingAddress: { 
        id: "buildingId",
        createdAt: new Date(),
        updatedAt: new Date(),
        city: "San Jose",
        street: "98 Archer Street",
        zipCode: "95112",
        state: "CA",
        latitude: 37.36537,
        longitude: -121.91071,
      }
    },
    referralApplication: new ApplicationMethodDto,
    applications: [],
    hasId: function (): boolean {
      throw new Error("Function not implemented.")
    },
    save: function (options?: SaveOptions): Promise<Listing> {
      throw new Error("Function not implemented.")
    },
    remove: function (options?: RemoveOptions): Promise<Listing> {
      throw new Error("Function not implemented.")
    },
    softRemove: function (options?: SaveOptions): Promise<Listing> {
      throw new Error("Function not implemented.")
    },
    recover: function (options?: SaveOptions): Promise<Listing> {
      throw new Error("Function not implemented.")
    },
    reload: function (): Promise<void> {
      throw new Error("Function not implemented.")
    }
  };

  public async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.findByEmail(dto.email)
    if (!user) {
      throw new HttpException(USER_ERRORS.NOT_FOUND.message, USER_ERRORS.NOT_FOUND.status)
    }

    // Token expires in 1 hour
    const payload = { id: user.id, exp: Number.parseInt(moment().add(1, "hour").format("X")) }
    user.resetToken = encode(payload, process.env.APP_SECRET)
    await this.userRepository.save(user)
    await this.emailService.forgotPassword(user, dto.appUrl)
    return user
  }

  public async updatePassword(dto: UpdatePasswordDto) {
    const user = await this.find({ resetToken: dto.token })
    if (!user) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }

    const token = decode(user.resetToken, process.env.APP_SECRET)
    if (token.id !== user.id) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }

    user.passwordHash = await this.passwordService.passwordToHash(dto.password)
    user.resetToken = null
    await this.userRepository.save(user)
    return this.authService.generateAccessToken(user)
  }

  private _getQb() {
    const qb = this.userRepository.createQueryBuilder("user")
    qb.leftJoinAndSelect("user.leasingAgentInListings", "listings")
    qb.leftJoinAndSelect("user.roles", "user_roles")

    return qb
  }

  async invitePartnersPortalUser(dto: UserInviteDto, authContext: AuthContext) {
    const password = crypto.randomBytes(8).toString("hex")
    const user = await this._createUser(
      {
        ...dto,
        passwordHash: await this.passwordService.passwordToHash(password),
        leasingAgentInListings: dto.leasingAgentInListings as Listing[],
        roles: dto.roles as UserRoles,
        jurisdictions: dto.jurisdictions
          ? (dto.jurisdictions as JurisdictionDto[])
          : [await this.jurisdictionResolverService.getJurisdiction()],
        preferences: dto.preferences as UserPreferences,
      },
      authContext
    )

    await this.emailService.invite(
      user,
      this.configService.get("PARTNERS_PORTAL_URL"),
      UserService.getPartnersConfirmationUrl(this.configService.get("PARTNERS_PORTAL_URL"), user)
    )
    return user
  }
}
