import { ListingDefaultSeed } from "./listing-default-seed"
import { getDefaultUnits, getDefaultProperty } from "./shared"
import { BaseEntity } from "typeorm"
import { CountyCode } from "../../../shared/types/county-code"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"

export class ListingDefaultMultipleAMI extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const detroitJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.detroit,
    })
    const amiChartOne = await this.amiChartRepository.findOneOrFail({
      name: "San Jose TCAC 2019",
      jurisdiction: detroitJurisdiction,
    })
    const amiChartTwo = await this.amiChartRepository.findOneOrFail({
      name: "CountyTCAC2021",
      jurisdiction: detroitJurisdiction,
    })

    const property = await this.propertyRepository.save({
      ...getDefaultProperty(),
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = getDefaultUnits().map(
      (unit, index) => {
        return {
          ...unit,
          property: {
            id: property.id,
          },
          amiChart: index % 2 === 0 ? amiChartOne : amiChartTwo,
        }
      }
    )

    unitsToBeCreated[0].unitType = unitTypeOneBdrm
    unitsToBeCreated[1].unitType = unitTypeOneBdrm

    await this.unitsRepository.save(unitsToBeCreated)

    return await this.listingRepository.save({
      ...listing,
      property: property,
      name: "Test: Default, Multiple AMI",
    })
  }
}
