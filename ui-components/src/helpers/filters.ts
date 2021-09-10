import {
  AvailabilityFilterEnum,
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"
import { SelectOption } from "@bloom-housing/ui-components"
import { t } from "../helpers/translator"

const EMPTY_OPTION = { value: "", label: "" }

// TODO: Select options should come from the database (#252)
export const adaCompliantOptions = [
  EMPTY_OPTION,
  { value: "n", label: t("t.no") },
  { value: "y", label: t("t.yes") },
]

const preferredUnitOptions: SelectOption[] = [
  EMPTY_OPTION,
  { value: "0", label: t("listingFilters.bedroomsOptions.studioPlus") },
  { value: "1", label: t("listingFilters.bedroomsOptions.onePlus") },
  { value: "2", label: t("listingFilters.bedroomsOptions.twoPlus") },
  { value: "3", label: t("listingFilters.bedroomsOptions.threePlus") },
  { value: "4", label: t("listingFilters.bedroomsOptions.fourPlus") },
]

const neighborhoodOptions: SelectOption[] = [
  EMPTY_OPTION,
  { value: "Foster City", label: "Foster City" },
]
const availabilityOptions: SelectOption[] = [
  EMPTY_OPTION,
  { value: AvailabilityFilterEnum.hasAvailability, label: t("listingFilters.hasAvailability") },
  { value: AvailabilityFilterEnum.noAvailability, label: t("listingFilters.noAvailability") },
  { value: AvailabilityFilterEnum.waitlist, label: t("listingFilters.waitlist") },
]

const communityTypeOptions: SelectOption[] = [
  EMPTY_OPTION,
  { value: "seniorHousing", label: t("listingFilters.communityTypeOptions.senior") },
  {
    value: "specialNeeds",
    label: t("listingFilters.communityTypeOptions.specialNeeds"),
  },
]

interface FrontEndFilter {
  value?: any
  options?: SelectOption[]
}

export type FrontEndFilters = { [key: string]: FrontEndFilter }

export const defaultFrontendFilters: FrontEndFilters = {
  [ListingFilterKeys.communityType]: { options: communityTypeOptions },
  [ListingFilterKeys.availability]: { options: availabilityOptions },
  [ListingFilterKeys.neighborhood]: { options: neighborhoodOptions },
  [ListingFilterKeys.bedrooms]: { options: preferredUnitOptions },
  [ListingFilterKeys.zipcode]: {},
}

function getComparisonForFilter(filterKey: ListingFilterKeys) {
  switch (filterKey) {
    case ListingFilterKeys.name:
    case ListingFilterKeys.neighborhood:
    case ListingFilterKeys.status:
      return EnumListingFilterParamsComparison["="]
    case ListingFilterKeys.bedrooms:
      return EnumListingFilterParamsComparison[">="]
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

export function encodeToBackendFilterString(filterParams: FrontEndFilters) {
  let queryString = ""
  for (const filterType in filterParams) {
    if (filterType in ListingFilterKeys && filterParams[filterType].value) {
      const comparison = getComparisonForFilter(ListingFilterKeys[filterType])
      queryString += `&filter[$comparison]=${comparison}&filter[${filterType}]=${filterParams[filterType].value}`
    }
  }
  return queryString
}

export function encodeToFrontendFilterString(filters: FrontEndFilters) {
  let queryString = ""
  for (const filterName in filters) {
    const value = filters[filterName].value
    if (filterName in ListingFilterKeys && value !== undefined && value !== "") {
      queryString += `&${filterName}=${value}`
    }
  }
  return queryString
}

export function decodeFiltersFromFrontendUrl(query: ParsedUrlQuery) {
  // This is causing a "TypeError: Object(...) is not a function" error
  const filters = Object.assign({}, defaultFrontendFilters)
  let foundFilterKey = false
  for (const queryKey in query) {
    if (filters[queryKey] !== undefined) {
      filters[queryKey].value = query[queryKey]
      foundFilterKey = true
    }
  }
  return foundFilterKey ? filters : undefined
}
