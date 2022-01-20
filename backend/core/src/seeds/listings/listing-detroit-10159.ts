import {
  AssetDtoSeedType,
  ListingSeedType,
  PropertySeedType,
} from "../../seeder/seeds/listings/listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "../../seeder/seeds/listings/listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

const propertySeed: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "112 Seward Avenue",
    zipCode: "48202",
    latitude: 42.373219,
    longitude: -83.079147,
  },
  buildingTotalUnits: 49,
  neighborhood: "New Center Commons",
}

const listingSeed: ListingSeedType = {
  jurisdictionName: "Detroit",
  amiPercentageMax: 60,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  isWaitlistOpen: true,
  waitlistCurrentSize: 20,
  waitlistMaxSize: 50,
  hrdId: "HRD10159",
  leasingAgentName: "Kim Hagood",
  leasingAgentPhone: "313-656-4146",
  managementCompany: "Elite Property Management LLC",
  managementWebsite: "www.elitep-m.com",
  name: "New Center Square",
  status: ListingStatus.active,
  image: undefined,
  digitalApplication: undefined,
  paperApplication: undefined,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  leasingAgentEmail: undefined,
  rentalAssistance: undefined,
  reviewOrderType: undefined,
  features: {
    elevator: false,
    wheelchairRamp: true,
    serviceAnimalsAllowed: true,
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: true,
    laundryInBuilding: false,
    barrierFreeEntrance: true,
    rollInShower: false,
    grabBars: false,
    heatingInUnit: true,
    acInUnit: true,
  },
}

export class Listing10159Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId:
          "https://rentpath-res.cloudinary.com/t_rp,cs_tinysrgb,fl_force_strip,w_400,h_240,c_fill,q_auto:low,dpr_1.0/e_unsharp_mask:50/ed25c8ac2a650c47de36884830f2cf2d",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [],
      assets: JSON.parse(JSON.stringify(assets)),
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 49,
      listing: listing,
    }
    await this.unitsSummaryRepository.save([threeBdrmUnitsSummary])

    return listing
  }
}
