import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

const treymoreProperty: PropertySeedType = {
  // See http://rentlinx.kmgprestige.com/457-Brainard-Street-Detroit-MI-48201
  amenities: "Parking Elevator in Building (Community Room)",
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "457 Brainard St",
    zipCode: "48201",
    latitude: 42.3461357,
    longitude: -83.0645436,
  },
  petPolicy: "No Pets Allowed",
  unitAmenities:
    "Air Conditioning(Central Air Conditioning) Garbage Disposal Range Refrigerator (Coin Laundry Room in building)",
  unitsAvailable: 4,
  yearBuilt: 1916,
  accessibility: "2 units are barrier free; 2 units are bi-level 1.5 bath",
}

const treymoreListing: ListingSeedType = {
  applicationAddress: {
    city: "Detroit",
    state: "MI",
    street: "2140 Martin Luther King Jr Blvd",
    zipCode: "48208",
  },
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded: "Water Included Resident Pays Electricity Resident Pays Gas Resident Pays Heat",
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  isWaitlistOpen: false,
  leasingAgentPhone: "313-462-4123",
  managementCompany: "KMG Prestige",
  managementWebsite: "http://rentlinx.kmgprestige.com/Company.aspx?CompanyID=107",
  name: "Treymore Apartments",
  status: ListingStatus.active,
}

export class ListingTreymoreSeed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const property = await this.propertyRepository.save({
      ...treymoreProperty,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId: "https://s3.amazonaws.com/photos.rentlinx.com/L800/51354687.jpg",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...treymoreListing,
      applicationMethods: [],
      assets: JSON.parse(JSON.stringify(assets)),
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const treymoreUnitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const studioUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeStudio,
      totalCount: 2,
      listing: listing,
      totalAvailable: 0,
    }
    treymoreUnitsSummaryToBeCreated.push(studioUnitsSummary)

    const twoBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 4,
      monthlyRentMin: 707,
      listing: listing,
      sqFeetMin: "720",
      sqFeetMax: "1003",
      totalAvailable: 4,
    }
    treymoreUnitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(treymoreUnitsSummaryToBeCreated)

    return listing
  }
}