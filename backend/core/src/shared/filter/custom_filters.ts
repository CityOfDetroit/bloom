import { WhereExpression } from "typeorm"
import { ListingFilterKeys } from "../../listings/types/listing-filter-keys-enum"
import { filterTypeToFieldMap } from "../../listings/dto/listing.dto"

export function buildSeniorHousingQuery(qb: WhereExpression, filterValue: string) {
  const seniorHousingCommunityType = "senior62"
  const reservedCommunityTypeColumnName = `LOWER(CAST(${
    filterTypeToFieldMap[ListingFilterKeys.seniorHousing]
  } as text))`
  if (filterValue == "true") {
    qb.andWhere(`${reservedCommunityTypeColumnName} = '${seniorHousingCommunityType}'`)
  } else if (filterValue == "false") {
    qb.andWhere(
      `${reservedCommunityTypeColumnName} is null or ${reservedCommunityTypeColumnName} <> '${seniorHousingCommunityType}'`
    )
  }
}
