import { HttpException, HttpStatus } from "@nestjs/common"
import { WhereExpression } from "typeorm"
import { ListingFilterKeys } from "../../listings/types/listing-filter-keys-enum"
import { Compare } from "../dto/filter.dto"

/**
 *
 * @param filterParams
 * @param filterTypeToFieldMap
 * @param qb The query on which filters are applied.
 */
/**
 * Add filters to provided QueryBuilder, using the provided map to find the field name.
 * The order of the params matters:
 * - A $comparison must be first.
 * - Comparisons in $comparison will be applied to each filter in order.
 */
export function addFilters<FilterParams, FilterFieldMap>(
  filterParams: FilterParams,
  filterTypeToFieldMap: FilterFieldMap,
  qb: WhereExpression
): void {
  let comparisons: string[],
    comparisonCount = 0

  // TODO(https://github.com/CityOfDetroit/bloom/issues/210): This assumes that
  // the order of keys is consistent across browsers, that the key order is the
  // insertion order, and that the $comaprison field is first.
  // This may not always be the case.
  for (const filterType in filterParams) {
    const value = filterParams[filterType]
    if (filterType === "$comparison") {
      if (Array.isArray(value)) {
        comparisons = value
      } else if (typeof value === "string") {
        // todo avaleske check comparison is one of the allowed ones here (otherwise it'd be easy to add another filter type that uses it incorrectly) asdfa asdf asd f
        comparisons = [value]
      }
    } else {
      if (value !== undefined) {
        let values: string[]
        // Handle multiple values for the same key
        if (Array.isArray(value)) {
          values = value
        } else if (typeof value === "string") {
          values = [value]
        }

        const comparisonsForCurrentFilter = comparisons.slice(
          comparisonCount,
          comparisonCount + values.length
        )
        comparisonCount += values.length

        // Throw if this is not a supported filter type
        if (!(filterType.toLowerCase() in filterTypeToFieldMap)) {
          throw new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
        }

        values.forEach((filterValue: string, i: number) => {
          // Each WHERE param must be unique across the entire QueryBuilder
          const whereParameterName = `${filterType}_${i}`
          const comparison = comparisonsForCurrentFilter[i]
          const filterField = filterTypeToFieldMap[filterType.toLowerCase()]

          // Explicitly check for allowed comparisons, to prevent SQL injections
          switch (comparison) {
            case Compare.IN:
              qb.andWhere(`LOWER(CAST(${filterField} as text)) IN (:...${whereParameterName})`, {
                [whereParameterName]: filterValue
                  .split(",")
                  .map((s) => s.trim().toLowerCase())
                  .filter((s) => s.length !== 0),
              })
              break
            case Compare["<>"]:
            case Compare["="]:
            case Compare[">"]:
              qb.andWhere(
                `LOWER(CAST(${filterField} as text)) ${comparison} LOWER(:${whereParameterName})`,
                {
                  [whereParameterName]: filterValue,
                }
              )
              break
            default:
              throw new HttpException("Comparison Not Implemented", HttpStatus.NOT_IMPLEMENTED)
          }
        })
      }
    }
  }
}
