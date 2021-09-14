import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"
import { SelectOption } from "./formOptions"
import { t } from "./translator"
import { AvailabilityFilterEnum } from "@bloom-housing/backend-core/dist"

export const COMMUNITY_TYPE = "communityType"

export const EMPTY_OPTION = { value: "", label: "" }

// TODO: Select options should come from the database (#252)
// The options needs to be methods to avoid a race condition in translation
// generation. The translations need to be generated after the app is
// initialized.
export const adaCompliantOptions: () => SelectOption[] = () => [
  EMPTY_OPTION,
  { value: "n", label: t("t.no") },
  { value: "y", label: t("t.yes") },
]

export const preferredUnitOptions: () => SelectOption[] = () => [
  EMPTY_OPTION,
  { value: "0", label: t("listingFilters.bedroomsOptions.studioPlus") },
  { value: "1", label: t("listingFilters.bedroomsOptions.onePlus") },
  { value: "2", label: t("listingFilters.bedroomsOptions.twoPlus") },
  { value: "3", label: t("listingFilters.bedroomsOptions.threePlus") },
  { value: "4", label: t("listingFilters.bedroomsOptions.fourPlus") },
]

export const neighborhoodOptions: () => SelectOption[] = () => [
  EMPTY_OPTION,
  { value: "Foster City", label: "Foster City" },
]
export const availabilityOptions: () => SelectOption[] = () => [
  EMPTY_OPTION,
  { value: AvailabilityFilterEnum.hasAvailability, label: t("listingFilters.hasAvailability") },
  { value: AvailabilityFilterEnum.noAvailability, label: t("listingFilters.noAvailability") },
  { value: AvailabilityFilterEnum.waitlist, label: t("listingFilters.waitlist") },
]

export const communityTypeOptions: () => SelectOption[] = () => [
  EMPTY_OPTION,
  { value: "seniorHousing", label: t("listingFilters.communityTypeOptions.senior") },
  {
    value: "specialNeeds",
    label: t("listingFilters.communityTypeOptions.specialNeeds"),
  },
]

export class FrontEndFilter {
  name: string
  value: any
  options: () => SelectOption[]

  constructor(name: string, options: () => SelectOption[]) {
    this.name = name
    this.options = options
  }

  getFilterType() {
    return this.name
  }
  getFilterValue() {
    return this.value
  }
}

export class FrontEndFilters {
  filters: Record<string, FrontEndFilter>

  constructor() {
    this.filters = [
      new CommunityTypeFilter(COMMUNITY_TYPE, communityTypeOptions),
      new FrontEndFilter(ListingFilterKeys.availability, availabilityOptions),
      new FrontEndFilter(ListingFilterKeys.neighborhood, neighborhoodOptions),
      new FrontEndFilter(ListingFilterKeys.bedrooms, preferredUnitOptions),
      new FrontEndFilter(ListingFilterKeys.zipcode, null),
      new FrontEndFilter(ListingFilterKeys.minRent, null),
      new FrontEndFilter(ListingFilterKeys.maxRent, null),
    ].reduce(function (filters: Record<string, FrontEndFilter>, currFilter: FrontEndFilter) {
      filters[currFilter.name] = currFilter
      return filters
    }, {})
  }
}

export class CommunityTypeFilter extends FrontEndFilter {
  getFilterType() {
    return this.value
  }
  getFilterValue() {
    if (this.value == EMPTY_OPTION || this.value == undefined) {
      return undefined
    } else {
      return true
    }
  }
}

export const blankFrontEndFilters = () => {
  return new FrontEndFilters()
}

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
      return EnumListingFilterParamsComparison["NA"]
    default: {
      const _exhaustiveCheck: never = filterKey
      return _exhaustiveCheck
    }
  }
}

export function encodeToBackendFilterString(filters: Record<string, FrontEndFilter>) {
  let queryString = ""
  for (const filterName in filters) {
    const type = filters[filterName].getFilterType()
    const value = filters[filterName].getFilterValue()
    if (type in ListingFilterKeys && value !== undefined && value !== "") {
      const comparison = getComparisonForFilter(ListingFilterKeys[type])
      queryString += `&filter[$comparison]=${comparison}&filter[${type}]=${value}`
    }
  }
  return queryString
}

export function encodeToFrontendFilterString(filters: Record<string, FrontEndFilter>) {
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
  const frontEndFilters = blankFrontEndFilters()
  for (const queryKey in query) {
    if (queryKey == ListingFilterKeys.seniorHousing && query[queryKey] == "true") {
      frontEndFilters.filters[COMMUNITY_TYPE].value = ListingFilterKeys.seniorHousing
    }
    if (frontEndFilters.filters[queryKey] !== undefined) {
      frontEndFilters.filters[queryKey].value = query[queryKey]
    }
  }
  return frontEndFilters
}
