import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"
import { FrontEndFilters, blankFrontEndFilters } from "@bloom-housing/public/lib/FrontEndFilters"

function getComparisonForFilter(filterKey: ListingFilterKeys) {
  switch (filterKey) {
    case ListingFilterKeys.name:
    case ListingFilterKeys.neighborhood:
    case ListingFilterKeys.status:
      return EnumListingFilterParamsComparison["="]
    case ListingFilterKeys.bedrooms:
    case ListingFilterKeys.minRent:
      return EnumListingFilterParamsComparison[">="]
    case ListingFilterKeys.maxRent:
      return EnumListingFilterParamsComparison["<="]
    case ListingFilterKeys.zipcode:
      return EnumListingFilterParamsComparison["IN"]
    case ListingFilterKeys.availability:
    case ListingFilterKeys.seniorHousing:
    case ListingFilterKeys.communityType:
      return EnumListingFilterParamsComparison["NA"]
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

export function encodeToFrontendFilterString(filters: FrontEndFilters) {
  let queryString = ""
  for (const filterName in filters) {
    const type = filters[filterName].getFilterType()
    const value = filters[filterName].getFilterValue()
    if (type in ListingFilterKeys && value !== undefined && value !== "") {
      queryString += `&${type}=${value}`
    }
  }
  return queryString
}

export function decodeFiltersFromFrontendUrl(query: ParsedUrlQuery) {
  // This is causing a "TypeError: Object(...) is not a function" error
  const frontEndFilters = blankFrontEndFilters()
  let foundFilterKey = false
  for (const queryKey in query) {
    if (frontEndFilters.filters[queryKey] !== undefined) {
      frontEndFilters.filters[queryKey].value = query[queryKey]
      foundFilterKey = true
    }
  }
  return foundFilterKey ? frontEndFilters : undefined
}
