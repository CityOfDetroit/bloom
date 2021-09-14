import { ListingDefaultSeed } from "./listing-default-seed"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

export class ListingDefaultSummaryWideRangingMinRent1Br2Br3Br extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const newListing = await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Summary With Wide-Ranging Minimum Rents",
    })

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })

    const unitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const oneBdrmUnitsSummaryCheap: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 5,
      listing: listing,
      monthlyRentMin: 200,
    }
    unitsSummaryToBeCreated.push(oneBdrmUnitsSummaryCheap)

    const oneBdrmUnitsSummaryExpensive: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 5,
      listing: listing,
      monthlyRentMin: 2000,
    }
    unitsSummaryToBeCreated.push(oneBdrmUnitsSummaryExpensive)

    const twoBdrmUnitsSummaryCheap: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 5,
      listing: listing,
      monthlyRentMin: 400,
    }
    unitsSummaryToBeCreated.push(twoBdrmUnitsSummaryCheap)

    const twoBdrmUnitsSummaryExpensive: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 5,
      listing: listing,
      monthlyRentMin: 4000,
    }
    unitsSummaryToBeCreated.push(twoBdrmUnitsSummaryExpensive)

    const threeBdrmUnitsSummaryCheap: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 5,
      listing: listing,
      monthlyRentMin: 600,
    }
    unitsSummaryToBeCreated.push(threeBdrmUnitsSummaryCheap)

    const threeBdrmUnitsSummaryExpensive: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 5,
      listing: listing,
      monthlyRentMin: 6000,
    }
    unitsSummaryToBeCreated.push(threeBdrmUnitsSummaryExpensive)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return newListing
  }
}
