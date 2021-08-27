import { WhereExpression } from "typeorm"
import { ListingFilterKeys } from "../../listings/types/listing-filter-keys-enum"
import { filterTypeToFieldMap } from "../../listings/dto/listing.dto"
import { ReservedCommunityType } from "../../listings/types/listing-reserved-community-type-enum"

export function addSeniorHousingQuery(qb: WhereExpression, filterValue: string) {
  const whereParameterName = ListingFilterKeys.seniorHousing
  const seniorHousingCommunityType = ReservedCommunityType.senior62
  const reservedCommunityTypeColumnName = `LOWER(CAST(${
    filterTypeToFieldMap[ListingFilterKeys.seniorHousing]
  } as text))`
  if (filterValue == "true") {
    qb.andWhere(`${reservedCommunityTypeColumnName} = LOWER(:${whereParameterName})`, {
      [whereParameterName]: seniorHousingCommunityType,
    })
  } else if (filterValue == "false") {
    qb.andWhere(
      `(${reservedCommunityTypeColumnName} IS NULL OR ${reservedCommunityTypeColumnName} <> LOWER(:${whereParameterName}))`,
      {
        [whereParameterName]: seniorHousingCommunityType,
      }
    )
  }
}

export function addCommunityTypeQuery(qb: WhereExpression, filterValue: string) {
  if (filterValue == ReservedCommunityType.senior62) {
    addSeniorHousingQuery(qb, "true")
  }
}
