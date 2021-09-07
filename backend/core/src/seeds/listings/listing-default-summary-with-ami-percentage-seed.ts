import { ListingDefaultSeed } from "./listing-default-seed"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

export class ListingDefaultSummaryWithAmiPercentageSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary With Ami Percentage",
    })

    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const unitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const twoBdrm30AmiUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 8,
      listing: listing,
      amiPercentage: 30,
    }
    unitsSummaryToBeCreated.push(twoBdrm30AmiUnitsSummary)

    const twoBdrm60AmiUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 8,
      listing: listing,
      amiPercentage: 60,
    }
    unitsSummaryToBeCreated.push(twoBdrm60AmiUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return newListing
  }
}
