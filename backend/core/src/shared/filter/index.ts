import { HttpException, HttpStatus } from "@nestjs/common"
import { WhereExpression } from "typeorm"
import { Filter } from "../../shared/dto/filter.dto"

// is this too generic? should it instead just provide a map from filter type to
// entity and then use the same logic to build the where clauses?
// are there situations where we'd want more control over the where clause, or
// are they going to look all the same?
// if they're all the same, we don't want to repeat ourselves by writing the same
// formatted where clause.
// if they're different, then a map from filterName to entityName isn't enough.
// I need to know more about how the preferences will work.

export function handleListingsFilter(
  qb: WhereExpression,
  filterType: string,
  comparisons: unknown[],
  values: unknown[]
) {
  switch (filterType.toUpperCase()) {
    case Filter.status:
    case Filter.name:
      addFilterClause(values as string[], filterType, comparisons)
      break
    case Filter.neighborhood:
      values.forEach((val: unknown, i: number) => {
        // TODO(#255): add support for multiple neighborhoods by using an IN expression
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        qb["andWhere"](`property.neighborhood ${comparisons[i]} :neighborhood`, {
          neighborhood: val,
        })
      })
      break
    default:
      throw new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
  }

  function addFilterClause(values: string[], filterType: string, comparisons: unknown[]) {
    values.forEach((val: unknown, i: number) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      qb["andWhere"](`listings.${filterType} ${comparisons[i]} :${filterType}`, {
        [filterType]: val,
      })
    })
  }
}

/**
 *
 * @param filter
 * @param schema
 * @param qb
 */
/**
 * This is super simple right now, but we can expand to include complex filter with ands, ors, more than one schema, etc
 */
export function addFilters<FilterParams>(
  filter: FilterParams,
  qb: WhereExpression,
  filterHandler: (
    qb: WhereExpression,
    filterType: string,
    comparisons: unknown[],
    values: unknown[]
  ) => void
): void {
  let comparisons: unknown[],
    comparisonCount = 0

  // TODO(#210): This assumes that the order of keys is consistent across browsers,
  // that the key order is the insertion order, and that the $comaprison field is first.
  // This may not always be the case.
  for (const key in filter) {
    const value = filter[key]
    if (key === "$comparison") {
      if (Array.isArray(value)) {
        comparisons = value
      } else {
        comparisons = [value]
      }
    } else {
      if (value !== undefined) {
        let values
        // handle multiple values for the same key
        if (Array.isArray(value)) {
          values = value
        } else {
          values = [value]
        }

        const comparisonsForCurrentFilter = comparisons.slice(comparisonCount, values.length)
        comparisonCount += values.length

        // TODO(#202): Refactor this out into a provided map, so addFilter() is generic again
        filterHandler(qb, key, comparisonsForCurrentFilter, values)
      }
    }
  }
}
