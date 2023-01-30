import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Pagination } from "nestjs-typeorm-paginate"
import { In, Repository, SelectQueryBuilder } from "typeorm"
import { plainToClass } from "class-transformer"
import { Listing } from "./entities/listing.entity"
import { PropertyCreateDto, PropertyUpdateDto } from "../property/dto/property.dto"
import { addFilters } from "../shared/query-filter"
import { getView } from "./views/view"
import { summarizeUnits } from "../shared/units-transformations"
import { Language } from "../../types"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { OrderByFieldsEnum } from "./types/listing-orderby-enum"
import { ListingCreateDto } from "./dto/listing-create.dto"
import { ListingUpdateDto } from "./dto/listing-update.dto"
import { ListingFilterParams } from "./dto/listing-filter-params"
import { ListingsQueryParams } from "./dto/listings-query-params"
import { filterTypeToFieldMap } from "./dto/filter-type-to-field-map"
import { ListingStatus } from "./types/listing-status-enum"
import { TranslationsService } from "../translations/services/translations.service"
import { UnitGroup } from "../units-summary/entities/unit-group.entity"
import { ListingMetadataDto } from "./dto/listings-metadata.dto"
import { UnitType } from "../unit-types/entities/unit-type.entity"
import { Program } from "../program/entities/program.entity"
import { ListingSeasonEnum } from "./types/listing-season-enum"
import { User } from "../auth/entities/user.entity"
import { getBaseAddressSelect } from "../../src/views/base.view"

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing) private readonly listingRepository: Repository<Listing>,
    @InjectRepository(AmiChart) private readonly amiChartsRepository: Repository<AmiChart>,
    @InjectRepository(UnitGroup) private readonly unitGroupRepository: Repository<UnitGroup>,
    @InjectRepository(UnitType) private readonly unitTypeRepository: Repository<UnitType>,
    @InjectRepository(Program) private readonly programRepository: Repository<Program>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly translationService: TranslationsService
  ) {}

  private getFullyJoinedQueryBuilder() {
    return getView(this.listingRepository.createQueryBuilder("listings"), "full").getViewQb()
  }

  public async list(params: ListingsQueryParams): Promise<Pagination<Listing>> {
    // Inner query to get the sorted listing ids of the listings to display
    // TODO(avaleske): Only join the tables we need for the filters that are applied
    let innerFilteredQuery = this.listingRepository
      .createQueryBuilder("listings")
      .select("listings.id", "listings_id")
      .leftJoin("listings.property", "property")
      .leftJoin("property.buildingAddress", "buildingAddress")
      .leftJoin("listings.reservedCommunityType", "reservedCommunityType")
      .leftJoin("listings.features", "listing_features")
      .leftJoin("listings.listingPrograms", "listing_programs")
      .leftJoin("listing_programs.program", "programs")
      .leftJoin("listings.unitGroups", "unitgroups")
      .leftJoin("unitgroups.amiLevels", "amilevels")
      .leftJoin("unitgroups.unitType", "unitTypes")
      .groupBy("listings.id")

    innerFilteredQuery = ListingsService.addOrderByToQb(innerFilteredQuery, params)
    innerFilteredQuery = ListingsService.addSearchByListingNameCondition(
      innerFilteredQuery,
      params.search
    )
    if (params.filter) {
      addFilters<Array<ListingFilterParams>, typeof filterTypeToFieldMap>(
        params.filter,
        filterTypeToFieldMap,
        innerFilteredQuery
      )
    }

    // TODO(avaleske): Typescript doesn't realize that the `paginate` bool is a
    // type guard, but it will in version 4.4. Once this codebase is upgraded to
    // v4.4, remove the extra type assertions on `params.limit` below.
    const paginate = params.limit !== "all" && params.limit > 0 && params.page > 0
    if (paginate) {
      // Calculate the number of listings to skip (because they belong to lower page numbers).
      const offset = (params.page - 1) * (params.limit as number)
      // Add the limit and offset to the inner query, so we only do the full
      // join on the listings we want to show.
      innerFilteredQuery.offset(offset).limit(params.limit as number)
    }
    const view = getView(this.listingRepository.createQueryBuilder("listings"), params.view)

    let mainQuery = view
      .getViewQb()
      .andWhere("listings.id IN (" + innerFilteredQuery.getQuery() + ")")
      // Set the inner WHERE params on the outer query, as noted in the TypeORM docs.
      // (WHERE params are the values passed to andWhere() that TypeORM escapes
      // and substitues for the `:paramName` placeholders in the WHERE clause.)
      .setParameters(innerFilteredQuery.getParameters())

    mainQuery = ListingsService.addOrderByToQb(mainQuery, params)

    let listings = await mainQuery.getMany()

    listings = await this.addUnitSummariesToListings(listings)
    // Set pagination info
    const itemsPerPage = paginate ? (params.limit as number) : listings.length
    const totalItems = paginate ? await innerFilteredQuery.getCount() : listings.length
    const paginationInfo = {
      currentPage: paginate ? params.page : 1,
      itemCount: listings.length,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage), // will be 1 if no pagination
    }

    // There is a bug in nestjs-typeorm-paginate's handling of complex, nested
    // queries (https://github.com/nestjsx/nestjs-typeorm-paginate/issues/6) so
    // we build the pagination metadata manually. Additional details are in
    // https://github.com/CityOfDetroit/bloom/issues/56#issuecomment-865202733
    const paginatedListings: Pagination<Listing> = {
      items: listings,
      meta: paginationInfo,
      // nestjs-typeorm-paginate leaves these empty if no route is defined
      // This matches what other paginated endpoints, such as the applications
      // service, currently return.
      links: {
        first: "",
        previous: "",
        next: "",
        last: "",
      },
    }
    return paginatedListings
  }

  private async addUnitSummariesToListings(listings: Listing[]) {
    const res = await this.unitGroupRepository.find({
      cache: true,
      where: {
        listing: {
          id: In(listings.map((listing) => listing.id)),
        },
      },
    })

    const unitGroupMap = res.reduce(
      (
        obj: Record<string, Array<UnitGroup>>,
        current: UnitGroup
      ): Record<string, Array<UnitGroup>> => {
        if (obj[current.listingId] !== undefined) {
          obj[current.listingId].push(current)
        } else {
          obj[current.listingId] = [current]
        }

        return obj
      },
      {}
    )

    // using map with {...listing, unitSummaries} throws a type error
    listings.forEach((listing) => {
      listing.unitSummaries = summarizeUnits(unitGroupMap[listing.id], [])
    })

    return listings
  }

  async create(listingDto: ListingCreateDto): Promise<Listing> {
    const listing = this.listingRepository.create({
      ...listingDto,
      publishedAt: listingDto.status === ListingStatus.active ? new Date() : null,
      closedAt: listingDto.status === ListingStatus.closed ? new Date() : null,
      property: plainToClass(PropertyCreateDto, listingDto),
    })
    return await listing.save()
  }

  async update(listingDto: ListingUpdateDto) {
    const qb = this.getFullyJoinedQueryBuilder()
    qb.where("listings.id = :id", { id: listingDto.id })
    const listing = await qb.getOne()

    if (!listing) {
      throw new NotFoundException()
    }
    let availableUnits = 0
    listingDto.units.forEach((unit) => {
      if (!unit.id) {
        delete unit.id
      }
      if (unit.status === "available") {
        availableUnits++
      }
    })
    listingDto.unitGroups.forEach((summary) => {
      if (!summary.id) {
        delete summary.id
      }
    })
    listingDto.unitsAvailable = availableUnits
    let newVerifyDate = listingDto.isVerified === false ? null : listing.verifiedAt
    if (listingDto.isVerified === true && !listing.verifiedAt) {
      newVerifyDate = new Date()
    }
    Object.assign(listing, {
      ...plainToClass(Listing, listingDto, { excludeExtraneousValues: false }),
      publishedAt:
        listing.status !== ListingStatus.active && listingDto.status === ListingStatus.active
          ? new Date()
          : listing.publishedAt,
      closedAt:
        listing.status !== ListingStatus.closed && listingDto.status === ListingStatus.closed
          ? new Date()
          : listing.closedAt,
      verifiedAt: newVerifyDate,
      property: plainToClass(
        PropertyUpdateDto,
        {
          // NOTE: Create a property out of fields encapsulated in listingDto
          ...listingDto,
          // NOTE: Since we use the entire listingDto to create a property object the listing ID
          //  would overwrite propertyId fetched from DB
          id: listing.property.id,
        },
        { excludeExtraneousValues: true }
      ),
    })

    return await this.listingRepository.save(listing)
  }

  async delete(listingId: string) {
    const listing = await this.listingRepository.findOneOrFail({
      where: { id: listingId },
    })
    return await this.listingRepository.remove(listing)
  }

  async findOne(listingId: string, lang: Language = Language.en, view = "full") {
    const qb = getView(this.listingRepository.createQueryBuilder("listings"), view).getViewQb()
    const result = await qb
      .where("listings.id = :id", { id: listingId })
      .orderBy({
        "listingPreferences.ordinal": "ASC",
      })
      .getOne()
    if (!result) {
      throw new NotFoundException()
    }

    if (lang !== Language.en) {
      await this.translationService.translateListing(result, lang)
    }

    await this.addUnitSummaries(result)
    return result
  }

  async rawListWithFlagged(userId) {
    // verify user has access to get the list of listings
    const userAccess = await this.userRepository
      .createQueryBuilder("user")
      .select("user.id")
      .leftJoin("user.roles", "userRole")
      .where("user.id = :id", { id: userId })
      .andWhere("userRole.is_admin = :is_admin", { is_admin: true })
      .getOne()

    if (!userAccess) {
      throw new UnauthorizedException()
    }

    // generated out list of permissioned listings
    const permissionedListings = await this.listingRepository
      .createQueryBuilder("listing")
      .select("listing.id")
      // should we include draft listings (or listings that aren't live on the site atm)
      .getMany()

    // pulled out on the ids
    const listingIds = permissionedListings.map((listing) => listing.id)

    // generating the list of general listing data
    const generalListingData = await this.listingRepository
      .createQueryBuilder("listing")
      .select([
        "listing.id",
        "listing.createdAt",
        "listing.status",
        "listing.publishedAt",
        "listing.closedAt",
        "listing.isVerified",
        "listing.verifiedAt",
        "listing.updatedAt",
        "listing.name",
        "listing.leasingAgentName",
        // "programs.description",
        "property.id",
        ...getBaseAddressSelect(["buildingAddress"]),
        "property.yearBuilt",
        // "property.neighborhood",
        // "property.region",
        // "listing.homeType",
        // "listing.section8Acceptance",
        // "unitGroups.totalCount",
        // //community type comma separated
        // "listing.applicationFee",
        // "listing.depositMin",
        // "listing.depositMax",
        // "listing.depositHelperText",
        // "listing.costsNotIncluded",
        // "utilities.id",
        // "utilities.water",
        // "utilities.gas",
        // "utilities.trash",
        // "utilities.sewer",
        // "utilities.electricity",
        // "utilities.cable",
        // "utilities.phone",
        // "utilities.internet",
        // "property.amenities",
        // "property.accessibility",
        // //unit amenities
        // "property.smokingPolicy",
        // "property.petPolicy",
        // "property.servicesOffered",
        // // Continue Here
        // "listing.name",
        // "listing.applicationDueDate",
        // "listing.applicationOpenDate",
        // "listing.marketingType",
        // "listing.marketingDate",
        // "listing.marketingSeason",
        // "listing.reviewOrderType",
        // "listing.status",
        // "listing.assets",
        // "listing.isVerified",
        // "jurisdiction.id",
        // "jurisdiction.name",
        // "reservedCommunityType.id",
        // "reservedCommunityType.name",
        // "property.id",
        // ...getBaseAddressSelect(["buildingAddress"]),
        // "listingImages.ordinal",
        // "listingImagesImage.id",
        // "listingImagesImage.fileId",
        // "listingImagesImage.label",
        // "features.id",
        // "features.elevator",
        // "features.wheelchairRamp",
        // "features.serviceAnimalsAllowed",
        // "features.accessibleParking",
        // "features.parkingOnSite",
        // "features.inUnitWasherDryer",
        // "features.barrierFreeEntrance",
        // "features.rollInShower",
        // "features.grabBars",
        // "features.heatingInUnit",
        // "features.acInUnit",
        // "features.laundryInBuilding",
        // "features.barrierFreeUnitEntrance",
        // "features.loweredLightSwitch",
        // "features.barrierFreeBathroom",
        // "features.wideDoorways",
        // "features.loweredCabinets",
        "utilities.id",
        "utilities.water",
        "utilities.gas",
        "utilities.trash",
        "utilities.sewer",
        "utilities.electricity",
        "utilities.cable",
        "utilities.phone",
        "utilities.internet",
        // "listingPrograms.ordinal",
        // "listingsProgramsProgram.id",
        // "listingsProgramsProgram.title",
        // "summaryUnitType.numBedrooms",
      ])
      // .leftJoin("listing.listingPrograms", "listing_programs")
      // .leftJoin("listing_programs.program", "programs")
      .leftJoin("listing.property", "property")
      .leftJoin("property.buildingAddress", "buildingAddress")
      .leftJoin("listing.utilities", "utilities")

      // .leftJoin("listings.leasingAgentAddress", "leasingAgentAddress")
      // .leftJoin("listings.applicationPickUpAddress", "applicationPickUpAddress")
      // .leftJoin("listings.applicationMailingAddress", "applicationMailingAddress")
      // .leftJoin("listings.applicationDropOffAddress", "applicationDropOffAddress")

      .where("listing.id IN (:...listingIds)", { listingIds })
      .getMany()

    // generating the list of unit group listing data (parsed data)
    return generalListingData
  }

  private async addUnitSummaries(listing: Listing) {
    if (Array.isArray(listing.unitGroups) && listing.unitGroups.length > 0) {
      const amiChartIds = listing.unitGroups.reduce((acc: string[], curr: UnitGroup) => {
        curr.amiLevels.forEach((level) => {
          if (acc.includes(level.amiChartId) === false) {
            acc.push(level.amiChartId)
          }
        })
        return acc
      }, [])
      const amiCharts = await this.amiChartsRepository.find({
        where: { id: In(amiChartIds) },
      })
      listing.unitSummaries = summarizeUnits(listing.unitGroups, amiCharts)
    }
    return listing
  }

  /**
   *
   * @param user
   * @param listing
   * @param action
   *
   * authz gaurd should already be used at this point,
   * so we know the user has general permissions to do this action.
   * We also have to check what the previous status was.
   * A partner can save a listing as any status as long as the previous status was active. Otherwise they can only save as pending
   */
  private userCanUpdateOrThrow(
    user,
    listing: ListingUpdateDto,
    previousListingStatus: ListingStatus
  ): boolean {
    const { isAdmin } = user.roles
    let canUpdate = false

    if (isAdmin) {
      canUpdate = true
    } else if (previousListingStatus !== ListingStatus.pending) {
      canUpdate = true
    } else if (listing.status === ListingStatus.pending) {
      canUpdate = true
    }

    if (!canUpdate) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
    }

    return canUpdate
  }

  public async getMetadata(): Promise<ListingMetadataDto> {
    const unitTypes = await this.unitTypeRepository
      .createQueryBuilder("unitTypes")
      .select("unitTypes.id")
      .addSelect("unitTypes.name")
      .addSelect("unitTypes.numBedrooms")
      .orderBy("unitTypes.numBedrooms")
      .getMany()

    const programs = await this.programRepository
      .createQueryBuilder("programs")
      .select("programs.id")
      .addSelect("programs.title")
      .orderBy("programs.title")
      .getMany()

    return { programs, unitTypes }
  }

  private static addSearchByListingNameCondition(
    qb: SelectQueryBuilder<Listing>,
    searchName?: string
  ) {
    if (searchName) {
      qb.andWhere(`${qb.alias}.name ILIKE :search`, { search: `%${searchName}%` })
    }
    return qb
  }

  private static addOrderByToQb(qb: SelectQueryBuilder<Listing>, params: ListingsQueryParams) {
    switch (params.orderBy) {
      case OrderByFieldsEnum.mostRecentlyUpdated:
        qb.orderBy({ "listings.updated_at": params.orderDir ?? "DESC" })
        break
      case OrderByFieldsEnum.mostRecentlyClosed:
        qb.orderBy({
          "listings.closedAt": { order: params.orderDir ?? "DESC", nulls: "NULLS LAST" },
          "listings.publishedAt": { order: "DESC", nulls: "NULLS LAST" },
        })
        break
      case OrderByFieldsEnum.applicationDates:
        qb.orderBy({
          "listings.applicationDueDate": params.orderDir ?? "ASC",
        })
        break
      case OrderByFieldsEnum.comingSoon:
        qb.orderBy("listings.marketingType", "DESC", "NULLS LAST")
        qb.addOrderBy(`to_char(listings.marketingDate, 'YYYY')`, "ASC")
        qb.addOrderBy(
          `CASE listings.marketingSeason WHEN '${ListingSeasonEnum.Spring}' THEN 1 WHEN '${ListingSeasonEnum.Summer}' THEN 2  WHEN '${ListingSeasonEnum.Fall}' THEN 3  WHEN '${ListingSeasonEnum.Winter}' THEN 4 END`,
          "ASC"
        )
        qb.addOrderBy("listings.updatedAt", "DESC")
        break
      case OrderByFieldsEnum.status:
        qb.orderBy({
          "listings.status": params.orderDir ?? "ASC",
          "listings.name": "ASC",
        })
        break
      case OrderByFieldsEnum.verified:
        qb.orderBy({
          "listings.isVerified": params.orderDir ?? "ASC",
          "listings.name": "ASC",
        })
        break
      case OrderByFieldsEnum.updatedAt:
        qb.orderBy({
          "listings.updatedAt": params.orderDir ?? "ASC",
          "listings.name": "ASC",
        })
        break
      case OrderByFieldsEnum.name:
      case undefined:
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        qb.orderBy({
          "listings.name": params.orderDir ?? "ASC",
        })
        break
      default:
        throw new HttpException(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `OrderBy parameter (${params.orderBy}) not recognized or not yet implemented.`,
          HttpStatus.NOT_IMPLEMENTED
        )
    }
    return qb
  }
}
