import { WhereExpression } from "typeorm"
import {
  AvailabilityFilterEnum,
  ListingFilterKeys,
} from "../../listings/types/listing-filter-keys-enum"
import { filterTypeToFieldMap } from "../../listings/dto/filter-type-to-field-map"

export function addAvailabilityQuery(
  qb: WhereExpression,
  filterValue: AvailabilityFilterEnum,
  includeNulls?: boolean
) {
  const whereParameterName = "availability"
  switch (filterValue) {
    case AvailabilityFilterEnum.hasAvailability:
      qb.andWhere(
        `(unitGroups.total_available >= :${whereParameterName}${
          includeNulls ? ` OR unitGroups.total_available IS NULL` : ""
        })`,
        {
          [whereParameterName]: 1,
        }
      )
      return
    case AvailabilityFilterEnum.noAvailability:
      qb.andWhere(
        `(unitGroups.total_available = :${whereParameterName}${
          includeNulls ? ` OR unitGroups.total_available IS NULL` : ""
        })`,
        {
          [whereParameterName]: 0,
        }
      )
      return
    case AvailabilityFilterEnum.waitlist:
      qb.andWhere(
        `(listings.is_waitlist_open = :${whereParameterName}${
          includeNulls ? ` OR listings.is_waitlist_open is NULL` : ""
        })`,
        {
          [whereParameterName]: true,
        }
      )
      return
    default:
      return
  }
}

export function addMinAmiPercentageFilter(
  qb: WhereExpression,
  filterValue: number,
  includeNulls?: boolean
) {
  const whereParameterName = "amiPercentage_unitGroups"
  const whereParameterName2 = "amiPercentage_listings"

  // Check the listing.ami_percentage field iff the field is not set on the Unit Groups table.
  qb.andWhere(
    `(("unitGroupsAmiLevels"."ami_percentage" IS NOT NULL AND "unitGroupsAmiLevels"."ami_percentage" >= :${whereParameterName}) ` +
      `OR ("unitGroupsAmiLevels"."ami_percentage" IS NULL AND listings.ami_percentage_max >= :${whereParameterName2})
      ${
        includeNulls
          ? `OR "unitGroupsAmiLevels"."ami_percentage" is NULL AND listings.ami_percentage_max is NULL`
          : ""
      })`,
    {
      [whereParameterName]: filterValue,
      [whereParameterName2]: filterValue,
    }
  )
  return
}
