import {
  ListingFilterParams,
  ListingFilterKeys,
  EnumListingFilterParamsComparison,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"

export function encodeFilterString(filterParams: ListingFilterParams) {
  let queryString = ""
  let comparisons: string[] = []
  let comparisonCount = 0
  for (const filterType in filterParams) {
    const value = filterParams[filterType]
    if (filterType === "$comparison") {
      if (Array.isArray(value)) {
        comparisons = value
      } else if (typeof value == "string") {
        comparisons = [value]
      }
    } else {
      const comparison = comparisons[comparisonCount]
      ++comparisonCount
      queryString += `&filter[$comparison]=${comparison}&filter[${filterType}]=${value}`
    }
  }
  return queryString
}

export function getFiltersFromUrl(query: ParsedUrlQuery) {
  const comparisonValue = query["comparisons"]
  if (!comparisonValue) {
    return undefined
  }

  const value = (comparisonValue as string).split(",")
  const comparisons = value.map<EnumListingFilterParamsComparison>(
    (value) => EnumListingFilterParamsComparison[value]
  )
  const filters: ListingFilterParams = {
    $comparison: comparisons,
  }

  let foundFilterKey = false
  for (const queryKey in query) {
    if (queryKey in ListingFilterKeys) {
      filters[queryKey] = query[queryKey]
      foundFilterKey = true
    }
  }
  return foundFilterKey ? filters : undefined
}
