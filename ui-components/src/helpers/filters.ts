import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"
import { Region, regionNeighborhoodMap } from "./regionNeighborhoodMap"

// TODO(#629): Refactor filter state storage strategy
// Currently, the knowledge of "what a filter is" is spread across multiple
// places: getComparisonForFilter(), ListingFilterState, FrontendListingFilterStateKeys,
// ListingFilterKeys, the encode/decode methods, and the various enums with options
// for the filters. It could be worth unifying this into a ListingFilterStateManager
// class that can hold all this in one place. Work toward this is in
// https://github.com/CityOfDetroit/bloom/pull/484, but was set aside.

// On the frontend, we assume a filter will always use the same comparison. (For
// example, that minRent will always use a >= comparison.) The backend doesn't
// make this assumption, so we need to tell it what comparison to use.
function getComparisonForFilter(filterKey: ListingFilterKeys) {
  switch (filterKey) {
    case ListingFilterKeys.name:
    case ListingFilterKeys.status:
    case ListingFilterKeys.leasingAgents:
    case ListingFilterKeys.elevator:
    case ListingFilterKeys.wheelchairRamp:
    case ListingFilterKeys.serviceAnimalsAllowed:
    case ListingFilterKeys.accessibleParking:
    case ListingFilterKeys.parkingOnSite:
    case ListingFilterKeys.inUnitWasherDryer:
    case ListingFilterKeys.laundryInBuilding:
    case ListingFilterKeys.barrierFreeEntrance:
    case ListingFilterKeys.rollInShower:
    case ListingFilterKeys.grabBars:
    case ListingFilterKeys.heatingInUnit:
    case ListingFilterKeys.acInUnit:
    case ListingFilterKeys.jurisdiction:
    case ListingFilterKeys.favorited:
    case ListingFilterKeys.isVerified:
    case ListingFilterKeys.hearing:
    case ListingFilterKeys.mobility:
    case ListingFilterKeys.visual:
    case ListingFilterKeys.vacantUnits:
    case ListingFilterKeys.openWaitlist:
    case ListingFilterKeys.closedWaitlist:
    case ListingFilterKeys.Families:
    case ListingFilterKeys.ResidentswithDisabilities:
    case ListingFilterKeys.Seniors55:
    case ListingFilterKeys.Seniors62:
    case ListingFilterKeys.SupportiveHousingfortheHomeless:
    case ListingFilterKeys.Veterans:
      return EnumListingFilterParamsComparison["="]
    case ListingFilterKeys.minRent:
      return EnumListingFilterParamsComparison[">="]
    case ListingFilterKeys.maxRent:
      return EnumListingFilterParamsComparison["<="]
    case ListingFilterKeys.bedrooms:
    case ListingFilterKeys.neighborhood:
    case ListingFilterKeys.bedRoomSize:
    case ListingFilterKeys.communityPrograms:
    case ListingFilterKeys.region:
    case ListingFilterKeys.accessibility:
    case ListingFilterKeys.availability:
      return EnumListingFilterParamsComparison["IN"]
    default: {
      const _exhaustiveCheck: any = filterKey
      return _exhaustiveCheck
    }
  }
}

// Define the keys we expect to see in the frontend URL. These are also used for
// the filter state object, ListingFilterState.
// We exclude bedrooms, since that is constructed from studio, oneBdrm, and so on
// We exclude neighborhood, since we map to neighborhoods from the region filter
const { bedrooms, neighborhood, ...IncludedBackendKeys } = ListingFilterKeys
enum BedroomFields {
  studio = "studio",
  oneBdrm = "oneBdrm",
  twoBdrm = "twoBdrm",
  threeBdrm = "threeBdrm",
  fourBdrm = "fourBdrm",
  SRO = "SRO",
}
export const FrontendListingFilterStateKeys = {
  ...IncludedBackendKeys,
  ...BedroomFields,
  ...Region,
  favorited: "favorited" as const,
  bedRoomSize: "bedRoomSize" as const,
  communityPrograms: "communityPrograms" as const,
  region: "region" as const,
  accessibility: "accessibility" as const,
}

// The types in this interface are `string | ...` because we don't currently parse
// the values pulled from the URL querystring to their types, so they could be
// strings or the type the form fields set them to be.
// TODO: Update `decodeFiltersFromFrontendUrl` to parse each filter into its
// correct type, so we can remove the `string` type from these fields.
export interface ListingFilterState {
  // confirmedListings & listing status
  [FrontendListingFilterStateKeys.status]?: string
  [FrontendListingFilterStateKeys.isVerified]?: string | boolean
  // availability
  [FrontendListingFilterStateKeys.vacantUnits]?: string | boolean
  [FrontendListingFilterStateKeys.openWaitlist]?: string | boolean
  [FrontendListingFilterStateKeys.closedWaitlist]?: string | boolean
  [FrontendListingFilterStateKeys.availability]?: string
  // bedRoomSize
  [FrontendListingFilterStateKeys.bedRoomSize]?: string
  [FrontendListingFilterStateKeys.studio]?: string | boolean
  [FrontendListingFilterStateKeys.SRO]?: string | boolean
  [FrontendListingFilterStateKeys.oneBdrm]?: string | boolean
  [FrontendListingFilterStateKeys.twoBdrm]?: string | boolean
  [FrontendListingFilterStateKeys.threeBdrm]?: string | boolean
  [FrontendListingFilterStateKeys.fourBdrm]?: string | boolean
  // rentRange
  [FrontendListingFilterStateKeys.minRent]?: string | number
  [FrontendListingFilterStateKeys.maxRent]?: string | number
  // communityPrograms
  [FrontendListingFilterStateKeys.communityPrograms]?: string
  [FrontendListingFilterStateKeys.ResidentswithDisabilities]?: string | number
  [FrontendListingFilterStateKeys.Seniors55]?: string | number
  [FrontendListingFilterStateKeys.Seniors62]?: string | number
  [FrontendListingFilterStateKeys.SupportiveHousingfortheHomeless]?: string | number
  // region
  [FrontendListingFilterStateKeys.region]?: string
  [FrontendListingFilterStateKeys.downtown]?: string | boolean
  [FrontendListingFilterStateKeys.eastside]?: string | boolean
  [FrontendListingFilterStateKeys.midtownNewCenter]?: string | boolean
  [FrontendListingFilterStateKeys.southwest]?: string | boolean
  [FrontendListingFilterStateKeys.westside]?: string | boolean
  // accessibility
  [FrontendListingFilterStateKeys.accessibility]?: string
  [FrontendListingFilterStateKeys.elevator]?: string | boolean
  [FrontendListingFilterStateKeys.wheelchairRamp]?: string | boolean
  [FrontendListingFilterStateKeys.serviceAnimalsAllowed]?: string | boolean
  [FrontendListingFilterStateKeys.accessibleParking]?: string | boolean
  [FrontendListingFilterStateKeys.parkingOnSite]?: string | boolean
  [FrontendListingFilterStateKeys.inUnitWasherDryer]?: string | boolean
  [FrontendListingFilterStateKeys.laundryInBuilding]?: string | boolean
  [FrontendListingFilterStateKeys.barrierFreeEntrance]?: string | boolean
  [FrontendListingFilterStateKeys.rollInShower]?: string | boolean
  [FrontendListingFilterStateKeys.grabBars]?: string | boolean
  [FrontendListingFilterStateKeys.heatingInUnit]?: string | boolean
  [FrontendListingFilterStateKeys.acInUnit]?: string | boolean
  [FrontendListingFilterStateKeys.hearing]?: string | boolean
  [FrontendListingFilterStateKeys.mobility]?: string | boolean
  [FrontendListingFilterStateKeys.visual]?: string | boolean
  // favorites
  [FrontendListingFilterStateKeys.favorited]?: string | boolean

  // misc
  [FrontendListingFilterStateKeys.zipcode]?: string
}

// Since it'd be tricky to OR a separate ">=" comparison with an "IN"
// comparison, we fake it by mapping 4+ bedrooms to being IN 4,5,...,10. If we
// ever have units with > 10 bedrooms, we'll need to update this.
const BedroomValues = {
  [BedroomFields.studio]: 0,
  [BedroomFields.SRO]: 0,
  [BedroomFields.oneBdrm]: 1,
  [BedroomFields.twoBdrm]: 2,
  [BedroomFields.threeBdrm]: 3,
  [BedroomFields.fourBdrm]: "4,5,6,7,8,9,10",
}

export function encodeToBackendFilterArray(filterState: ListingFilterState) {
  const filterArray: {
    [x: string]: any
    $comparison: EnumListingFilterParamsComparison
    bedrooms?: string
  }[] = []
  if (filterState === undefined) {
    return filterArray
  }
  // Only include things that are a backend filter type. The keys of
  // ListingFilterState are a superset of ListingFilterKeys that may include
  // keys not recognized by the backend, so we check against ListingFilterKeys
  // here.
  for (const filterType in ListingFilterKeys) {
    if (filterType in filterState && filterState[filterType] !== null) {
      const comparison = getComparisonForFilter(ListingFilterKeys[filterType])
      filterArray.push({
        $comparison: comparison,
        [filterType]: filterState[filterType],
      })
    }
  }

  // Special-case the bedroom filters, since they get combined from separate fields.
  const bedrooms = []
  const bedroomSize = filterState?.bedRoomSize?.split(",")
  for (const bedroomFilterType in BedroomFields) {
    if (bedroomSize && bedroomSize.includes(bedroomFilterType)) {
      bedrooms.push(BedroomValues[bedroomFilterType])
    }
  }
  if (bedrooms.length > 0) {
    filterArray.push({
      $comparison: getComparisonForFilter(ListingFilterKeys.bedrooms),
      [ListingFilterKeys.bedrooms]: bedrooms.join(),
    })
  }

  // Special-case the region filters, since they are mapped to neighborhoods.
  const neighborhoods = []
  const regions = filterState?.region?.split(",")
  for (const region in Region) {
    if (filterState[region]) {
      neighborhoods.push(regionNeighborhoodMap.get(Region[region])?.map((n) => n.name))
    }
    if (regions && regions.includes(region)) {
      neighborhoods.push(regionNeighborhoodMap.get(Region[region])?.map((n) => n.name))
    }
  }
  if (neighborhoods.length > 0) {
    filterArray.push({
      $comparison: getComparisonForFilter(ListingFilterKeys.neighborhood),
      [ListingFilterKeys.neighborhood]: neighborhoods.join(),
    })
  }

  return filterArray
}

export function encodeToFrontendFilterString(filterState: ListingFilterState) {
  let queryString = ""
  for (const filterType in filterState) {
    const value = filterState[filterType]
    if (filterType in FrontendListingFilterStateKeys && value !== undefined && value) {
      queryString += `&${filterType}=${value}`
    }
  }
  return queryString
}

export function decodeFiltersFromFrontendUrl(
  query: ParsedUrlQuery
): ListingFilterState | undefined {
  const filterState: ListingFilterState = {}
  let foundFilterKey = false
  for (const queryKey in query) {
    if (queryKey in FrontendListingFilterStateKeys && query[queryKey] !== "") {
      filterState[queryKey] = query[queryKey]
      foundFilterKey = true
    }
  }
  return foundFilterKey ? filterState : undefined
}
