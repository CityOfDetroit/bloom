import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { getDate } from "./shared"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { MonthlyRentDeterminationType } from "../../../units-summary/types/monthly-rent-determination.enum"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"
import { HomeTypeEnum } from "../../../listings/types/home-type-enum"

const grandRivProperty: PropertySeedType = {
  // See http://rentlinx.kmgprestige.com/640-Delaware-Street-Detroit-MI-48202
  amenities: "Parking, Elevator in Building",
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "28 W. Grand River",
    zipCode: "48226",
    latitude: 42.334007,
    longitude: -83.04893,
  },
  buildingTotalUnits: 175,
  neighborhood: "Downtown",
  petPolicy: "No Pets Allowed",
  unitAmenities: "Air Conditioning, Dishwasher, Garbage Disposal, Range, Refrigerator",
  unitsAvailable: 5,
  yearBuilt: 1929,
}

const grandRivListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationOpenDate: getDate(1000),
  applicationDueDate: getDate(1500),
  applicationFee: "25",
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded:
    "Water Included, Resident Pays Electricity, Resident Pays Gas, Resident Pays Heat(Heat is gas.)",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10157",
  leasingAgentPhone: "313-545-8720",
  managementCompany: "Rock Management Company",
  managementWebsite: "https://www.28granddetroit.com",
  name: "Capitol Park Micro Units",
  status: ListingStatus.active,
  images: [],
  digitalApplication: undefined,
  paperApplication: undefined,
  section8Acceptance: null,
  homeType: HomeTypeEnum.townhome,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  leasingAgentEmail: undefined,
  leasingAgentName: undefined,
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
    trash: true,
    sewer: null,
    electricity: null,
    cable: true,
    phone: null,
    internet: null,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.Marketing,
  whatToExpect: `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`,
  whatToExpectAdditionalText: `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</li></ul>`,
}

export class Listing10157Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const property = await this.propertyRepository.save({
      ...grandRivProperty,
    })

    const assets: Array<AssetDtoSeedType> = []

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...grandRivListing,
      applicationMethods: [],
      assets: JSON.parse(JSON.stringify(assets)),
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const nccUnitGroupToBeCreated: DeepPartial<UnitGroup>[] = []

    const zeroBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeStudio],
      totalCount: 1,
      amiLevels: [
        {
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 470,
        },
      ],
      listing: listing,
      sqFeetMax: 550,
    }
    nccUnitGroupToBeCreated.push(zeroBdrmUnitGroup)

    const oneBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 2,
      amiLevels: [
        {
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 650,
        },
      ],
      listing: listing,
      sqFeetMin: 800,
      sqFeetMax: 1000,
    }
    nccUnitGroupToBeCreated.push(oneBdrmUnitGroup)

    const twoBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 2,
      amiLevels: [
        {
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 750,
        },
      ],
      listing: listing,
      sqFeetMin: 900,
      sqFeetMax: 1100,
    }
    nccUnitGroupToBeCreated.push(twoBdrmUnitGroup)

    await this.unitGroupRepository.save(nccUnitGroupToBeCreated)

    return listing
  }
}
