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
    case ListingFilterKeys.maxAvailability:
    case ListingFilterKeys.waitlist:
      return EnumListingFilterParamsComparison["="]
    case ListingFilterKeys.bedrooms:
    case ListingFilterKeys.minAvailability:
      return EnumListingFilterParamsComparison[">="]
    case ListingFilterKeys.zipcode:
      return EnumListingFilterParamsComparison["IN"]
    case ListingFilterKeys.seniorHousing:
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

export enum AvailabilityFilterType {
  any = "any",
  hasAvailability = "hasAvailability",
  noAvailability = "noAvailability",
  waitlist = "waitlist",
}

export type FormFilterData = ListingFilterParams & {
  availability?: AvailabilityFilterType
}

export function decodeFiltersFromFrontendUrl(query: ParsedUrlQuery) {
  const filters: FormFilterData = {}
  let foundFilterKey = false
  for (const queryKey in query) {
    if (!(queryKey in ListingFilterKeys)) continue
    foundFilterKey = true
    filters[queryKey] = query[queryKey]
    // Map relevant fields back to `availability` to allow us to track form state.
    switch (queryKey as ListingFilterKeys) {
      case ListingFilterKeys.minAvailability:
        filters.availability = AvailabilityFilterType.hasAvailability
        break
      case ListingFilterKeys.maxAvailability:
        filters.availability = AvailabilityFilterType.noAvailability
        break
      case ListingFilterKeys.waitlist:
        filters.availability = AvailabilityFilterType.waitlist
        break
    }
  }
  return foundFilterKey ? filters : undefined
}
