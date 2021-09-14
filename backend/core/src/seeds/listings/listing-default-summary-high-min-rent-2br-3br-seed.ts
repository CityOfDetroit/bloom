import { ListingDefaultSeed } from "./listing-default-seed"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

export class ListingDefaultSummaryHighMinRent2Br3Br extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary With High Minimum Rents",
    })

    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })

    const unitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const twoBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 5,
      listing: listing,
      monthlyRentMin: 1200,
    }
    unitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 5,
      listing: listing,
      monthlyRentMin: 1500,
    }
    unitsSummaryToBeCreated.push(threeBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return newListing
  }
}
