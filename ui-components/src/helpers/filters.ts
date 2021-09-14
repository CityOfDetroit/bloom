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
// The options need to be methods to avoid a race condition in translation
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
  // Do not set this value directly! Use the setValue method in FrontEndFilters.
  value: any
  options: () => SelectOption[]

  constructor(name: string, options?: () => SelectOption[]) {
    this.name = name
    if (options) {
      this.options = options
    }
  }

  getBackendFilterType() {
    return this.name
  }
  getBackendFilterValue() {
    return this.value
  }
}

export class FrontEndFilters {
  filters: Record<string, FrontEndFilter>

  setValue(filterName: string, filterValue: any) {
    this.filters[filterName].value = filterValue
    if (filterName === COMMUNITY_TYPE && filterValue === ListingFilterKeys.seniorHousing) {
      this.filters[ListingFilterKeys.seniorHousing].value = true
    } else if (filterName === ListingFilterKeys.seniorHousing && filterValue == true) {
      this.filters[COMMUNITY_TYPE].value = ListingFilterKeys.seniorHousing
    }
  }

  constructor() {
    this.filters = [
      new CommunityTypeFilter(COMMUNITY_TYPE, communityTypeOptions),
      new FrontEndFilter(ListingFilterKeys.availability, availabilityOptions),
      new FrontEndFilter(ListingFilterKeys.neighborhood, neighborhoodOptions),
      new FrontEndFilter(ListingFilterKeys.bedrooms, preferredUnitOptions),
      new FrontEndFilter(ListingFilterKeys.zipcode),
      new FrontEndFilter(ListingFilterKeys.minRent),
      new FrontEndFilter(ListingFilterKeys.maxRent),
      new FrontEndFilter(ListingFilterKeys.seniorHousing),
    ].reduce(function (filters: Record<string, FrontEndFilter>, currFilter: FrontEndFilter) {
      filters[currFilter.name] = currFilter
      return filters
    }, {})
  }
}

export class CommunityTypeFilter extends FrontEndFilter {
  getBackendFilterType() {
    return this.value
  }
  getBackendFilterValue() {
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
    case ListingFilterKeys.leasingAgents:
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
    case ListingFilterKeys.ami:
      return EnumListingFilterParamsComparison["NA"]
    default: {
      const _exhaustiveCheck: never = filterKey
      return _exhaustiveCheck
    }
  }
}

export function encodeToBackendFilterArray(filters: Record<string, FrontEndFilter>) {
  const filterArray = []
  for (const filterName in filters) {
    const type = filters[filterName].getBackendFilterType()
    const value = filters[filterName].getBackendFilterValue()
    if (type in ListingFilterKeys && value !== undefined && value !== "") {
      const comparison = getComparisonForFilter(ListingFilterKeys[type])
      filterArray.push({ $comparison: comparison, [type]: value })
    }
  }
  return filterArray
}

export function encodeToFrontendFilterString(filters: Record<string, FrontEndFilter>) {
  let queryString = ""
  for (const filterName in filters) {
    const type = filters[filterName].getBackendFilterType()
    const value = filters[filterName].getBackendFilterValue()
    if (type in ListingFilterKeys && value !== undefined && value !== "") {
      queryString += `&${type}=${value}`
    }
  }
  return queryString
}

export function decodeFiltersFromFrontendUrl(query: ParsedUrlQuery) {
  const frontEndFilters = blankFrontEndFilters()
  for (const queryKey in query) {
    if (frontEndFilters.filters[queryKey] !== undefined) {
      frontEndFilters.setValue(queryKey, query[queryKey])
    }
  }
  return frontEndFilters
}
