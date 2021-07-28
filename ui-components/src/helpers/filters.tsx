import {
  ListingFilterParams,
  ListingFilterKeys,
  EnumListingFilterParamsComparison,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"

function getComparisonForFilter(filterKey: ListingFilterKeys) {
  switch (filterKey) {
    case ListingFilterKeys.name:
      return EnumListingFilterParamsComparison["="]
    case ListingFilterKeys.neighborhood:
      return EnumListingFilterParamsComparison["="]
    case ListingFilterKeys.status:
      return EnumListingFilterParamsComparison["="]
  }
}

export function encodeToBackendFilterString(filterParams: ListingFilterParams) {
  let queryString = ""
  for (const filterType in filterParams) {
    if (filterType in ListingFilterKeys) {
      const comparison = getComparisonForFilter(ListingFilterKeys[filterType])
      queryString += `&filter[$comparison]=${comparison}&filter[${filterType}]=${filterParams[filterType]}`
    }
  }
  return queryString
}

export function encodeToFrontendFilterString(filterParams: ListingFilterParams) {
  let queryString = ""
  for (const filterType in filterParams) {
    const value = filterParams[filterType]
    if (filterType in ListingFilterKeys && value && value != "") {
      queryString += `&${filterType}=${value}`
    }
  }
  return queryString
}

export function getFiltersFromFrontendUrl(query: ParsedUrlQuery) {
  const filters: ListingFilterParams = {}
  let foundFilterKey = false
  for (const queryKey in query) {
    if (queryKey in ListingFilterKeys) {
      filters[queryKey] = query[queryKey]
      foundFilterKey = true
    }
  }
  return foundFilterKey ? filters : undefined
}
