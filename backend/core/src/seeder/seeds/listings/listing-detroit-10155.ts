import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"
import { HomeTypeEnum } from "../../../listings/types/home-type-enum"

const propertySeed: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "20000 Dequindre St",
    zipCode: "48234",
    latitude: 42.44133,
    longitude: -83.08308,
  },
  buildingTotalUnits: 151,
  neighborhood: "Nolan",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 50,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10155",
  leasingAgentName: "Ryan Beale",
  leasingAgentPhone: "313-366-1616",
  managementCompany: "Premier Property Management",
  name: "Morton Manor",
  status: ListingStatus.active,
  images: [
    {
      image: {
        label: "building",
        fileId:
          "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
      },
    },
    {
      image: {
        label: "building",
        fileId:
          "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/oakhouse_cgdqmx.jpg",
      },
    },
    {
      image: {
        label: "building",
        fileId:
          "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/house_goo3cp.jpg",
      },
    },
    {
      image: {
        label: "building",
        fileId:
          "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
      },
    },
  ],
  digitalApplication: undefined,
  paperApplication: undefined,
  section8Acceptance: false,
  homeType: HomeTypeEnum.apartment,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  leasingAgentEmail: undefined,
  rentalAssistance: undefined,
  reviewOrderType: undefined,
  isWaitlistOpen: undefined,
  features: {
    elevator: true,
    wheelchairRamp: true,
    serviceAnimalsAllowed: true,
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: false,
    laundryInBuilding: false,
    barrierFreeEntrance: true,
    rollInShower: true,
    grabBars: true,
    heatingInUnit: true,
    acInUnit: true,
  },
  utilities: {
    water: null,
    gas: null,
    trash: null,
    sewer: null,
    electricity: null,
    cable: null,
    phone: null,
    internet: null,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.ComingSoon,
  whatToExpect: `This property is still under construction by the property owners. If you sign up for notifications through Detroit Home Connect, we will send you updates when this property has opened up applications for residents. You can also check back later to this page for updates.`,
  whatToExpectAdditionalText: null,
}

export class Listing10155Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const assets: Array<AssetDtoSeedType> = []

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [],
      assets: assets,
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const oneBdrmUnitsSummary: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 150,
      listing: listing,
    }
    await this.unitGroupRepository.save([oneBdrmUnitsSummary])

    return listing
  }
}
