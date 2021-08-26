import { WhereExpression } from "typeorm"
import { ListingFilterKeys } from "../../listings/types/listing-filter-keys-enum"
import { filterTypeToFieldMap } from "../../listings/dto/listing.dto"

export function buildSeniorHousingQuery(qb: WhereExpression, filterValue: string) {
  const seniorHousingCommunityType = "senior62"
  if (filterValue == "true") {
    qb.andWhere(
      `LOWER(CAST(${
        filterTypeToFieldMap[ListingFilterKeys.seniorHousing]
      } as text)) = '${seniorHousingCommunityType}'`
    )
  } else if (filterValue == "false") {
    qb.andWhere(
      `LOWER(CAST(${
        filterTypeToFieldMap[ListingFilterKeys.seniorHousing]
      } as text)) is null or LOWER(CAST(${
        filterTypeToFieldMap[ListingFilterKeys.seniorHousing]
      } as text)) <> '${seniorHousingCommunityType}'`
    )
  }
}
