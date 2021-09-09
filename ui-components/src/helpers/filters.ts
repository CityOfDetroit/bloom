import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
  AvailabilityFilterEnum,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"

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
    case ListingFilterKeys.seniorHousing:
    case ListingFilterKeys.availability:
      return EnumListingFilterParamsComparison["NA"]
    default: {
      const _exhaustiveCheck: never = filterKey
      return _exhaustiveCheck
    }
  }
}

export enum CommunityTypeOptionsEnum {
  "all" = "all",
  "seniorHousing" = "seniorHousing",
  "specialNeedsAndDisability" = "specialNeedsAndDisability",
}

export interface ListingFilterState {
  // todo avaleske use the values from filter keys for these field names
  /**  */
  neighborhood?: string

  /**  */
  bedrooms?: number

  /**  */
  zipcode?: string

  /**  */
  availability?: AvailabilityFilterEnum

  /**  */
  seniorHousing?: boolean

  /** */
  communityType?: CommunityTypeOptionsEnum

  /**  */
  minRent?: number

  /**  */
  maxRent?: number
}

// todo is this the best way to do this?
const FrontendFilterKeys = { ...ListingFilterKeys, communityType: "communityType" }

export function encodeToBackendFilterString(filterParams: ListingFilterState) {
  let queryString = ""
  for (const filterType in filterParams) {
    if (filterType in ListingFilterKeys && filterType !== ListingFilterKeys.seniorHousing) {
      const comparison = getComparisonForFilter(ListingFilterKeys[filterType])
      queryString += `&filter[$comparison]=${comparison}&filter[${filterType}]=${filterParams[filterType]}`
    }
  }
  // manually override the seniorHousing filter if the communityType was set
  // todo this would be easier if we stored the query params as an object first.
  // todo think more about the logic doing the override here. maybe we want to override differently
  if (filterParams.communityType !== undefined || filterParams.seniorHousing !== undefined) {
    if (filterParams.communityType === CommunityTypeOptionsEnum.seniorHousing) {
      queryString += `&filter[$comparison]=NA&filter[seniorHousing]=true}`
    } else if (filterParams.seniorHousing === true) {
      queryString += `&filter[$comparison]=NA&filter[seniorHousing]=true}`
    } else if (filterParams.seniorHousing === false) {
      queryString += `&filter[$comparison]=NA&filter[seniorHousing]=false}`
    }
  }
  return queryString
}

// so the question then is when to make the transformation from drop down to booleans.
// the frontend url needs to support booleans so the eligibility questionnaire can say "not senior housing"
// but the modal doesn't support that. so we need a way to transform from the boolean to the modal.
// but if the query string doesn't support the false option, we'll lose that data before we make the url request
// there's a ux question here of why it needs to be a dropdown, but let's go with it for now.
// seniorHousing = true -> store it that way -> add it to the url
// communityType = true -> store it that way -> add the right communityType to the URL


// so now these just pass through the url to the filter state, and do nothing to normalize it and ensure
// the state makes sense re senior housing
export function encodeToFrontendFilterString(filterParams: ListingFilterState) {
  let queryString = ""
  for (const filterType in filterParams) {
    const value = filterParams[filterType]
    if (filterType in FrontendFilterKeys && value !== undefined && value !== "") {
      queryString += `&${filterType}=${value}`
    }
  }
  return queryString
}

export function decodeFiltersFromFrontendUrl(query: ParsedUrlQuery) {
  const filters: ListingFilterState = {}
  let foundFilterKey = false
  for (const queryKey in query) {
    if (queryKey in FrontendFilterKeys) {
      filters[queryKey] = query[queryKey]
      foundFilterKey = true
    }
  }
  return foundFilterKey ? filters : undefined
}
