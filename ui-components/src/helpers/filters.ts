import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"

function getComparisonForFilter(filterKey: ListingFilterKeys) {
  switch (filterKey) {
    case ListingFilterKeys.name:
    case ListingFilterKeys.neighborhood:
    case ListingFilterKeys.status:
    case ListingFilterKeys.seniorHousing:
      return EnumListingFilterParamsComparison["NA"]
    case ListingFilterKeys.bedrooms:
      return EnumListingFilterParamsComparison[">="]
    case ListingFilterKeys.zipcode:
      return EnumListingFilterParamsComparison["IN"]
    default: {
      const _exhaustiveCheck: never = filterKey
      return _exhaustiveCheck
    }
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

    if (filterType in ListingFilterKeys && value !== undefined && value !== "") {
      queryString += `&${filterType}=${value}`
    }
  }
  return queryString
}

export function decodeFiltersFromFrontendUrl(query: ParsedUrlQuery) {
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
