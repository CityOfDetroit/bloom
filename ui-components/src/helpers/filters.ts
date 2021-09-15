import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"
import { SelectOption } from "./formOptions"
import { t } from "./translator"
import { AvailabilityFilterEnum } from "@bloom-housing/backend-core/dist"
import Listing from "@bloom-housing/backend-core/dist/src/listings/entities/listing.entity"

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

/* Representation of the front end filters.
 *
 * This is decoupled from the backend representation in ListingFilterParams to
 * allow greater flexibility in how filters are displayed in the front end.
 */
export class FrontEndFilter {
  /* The frontend filter name. */
  readonly name: string

  /* The frontend filter value.
   *
   * Do not set this value directly! Use the setValue method in FrontEndFilters.
   */
  value: any

  /* Comparison operator needed by the backend filter representation. */
  readonly comparison: EnumListingFilterParamsComparison

  /* The allowed options if this is a dropdown filter. */
  readonly options: () => SelectOption[]

  constructor(
    name: string,
    comparison: EnumListingFilterParamsComparison,
    options?: () => SelectOption[]
  ) {
    this.name = name
    this.comparison = comparison
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
    } else if (filterName === ListingFilterKeys.seniorHousing && filterValue == "true") {
      this.filters[COMMUNITY_TYPE].value = ListingFilterKeys.seniorHousing
    }
  }

  getFilterCount(): number {
    let numberOfFilters = Object.keys(this.filters).filter(
      (filterType) =>
        this.filters[filterType].value !== undefined && this.filters[filterType].value != ""
    ).length
    // We want to consider rent as a single filter, so if both min and max are defined, reduce the count.
    const hasMinMaxRentOverCount =
      this.filters[ListingFilterKeys.minRent].value !== undefined &&
      this.filters[ListingFilterKeys.maxRent].value != undefined
    const hasSeniorHousingCommunityTypeOverCount =
      this.filters[ListingFilterKeys.seniorHousing].value != undefined &&
      this.filters[COMMUNITY_TYPE].value != undefined
    if (hasMinMaxRentOverCount) {
      numberOfFilters -= 1
    }
    if (hasSeniorHousingCommunityTypeOverCount) {
      numberOfFilters -= 1
    }
    return numberOfFilters
  }

  constructor() {
    this.filters = [
      new CommunityTypeFilter(
        COMMUNITY_TYPE,
        EnumListingFilterParamsComparison["NA"],
        communityTypeOptions
      ),
      new FrontEndFilter(
        ListingFilterKeys.availability,
        EnumListingFilterParamsComparison["NA"],
        availabilityOptions
      ),
      new FrontEndFilter(
        ListingFilterKeys.bedrooms,
        EnumListingFilterParamsComparison[">="],
        preferredUnitOptions
      ),
      new FrontEndFilter(ListingFilterKeys.zipcode, EnumListingFilterParamsComparison["IN"]),
      new FrontEndFilter(ListingFilterKeys.minRent, EnumListingFilterParamsComparison[">="]),
      new FrontEndFilter(ListingFilterKeys.maxRent, EnumListingFilterParamsComparison["<="]),
      new FrontEndFilter(ListingFilterKeys.seniorHousing, EnumListingFilterParamsComparison["NA"]),
      // Check if the filters below are used or should be deleted
      new FrontEndFilter(ListingFilterKeys.name, EnumListingFilterParamsComparison["="]),
      new FrontEndFilter(ListingFilterKeys.leasingAgents, EnumListingFilterParamsComparison["="]),
      new FrontEndFilter(ListingFilterKeys.status, EnumListingFilterParamsComparison["="]),
      new FrontEndFilter(ListingFilterKeys.ami, EnumListingFilterParamsComparison["NA"]),
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

export function encodeToBackendFilterArray(filters: Record<string, FrontEndFilter>) {
  const filterArray = []
  for (const filterName in filters) {
    const type = filters[filterName].getBackendFilterType()
    const value = filters[filterName].getBackendFilterValue()
    const comparison = filters[filterName].comparison

    if (type in ListingFilterKeys && value !== undefined && value !== "") {
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
