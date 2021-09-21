import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"
import { ParsedUrlQuery } from "querystring"
import { SelectOption } from "./formOptions"
import { t } from "./translator"
import { AvailabilityFilterEnum } from "@bloom-housing/backend-core/dist"

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

export enum FrontendFilterKey {
  status = "status",
  name = "name",
  bedrooms = "bedrooms",
  zipcode = "zipcode",
  availability = "availability",
  seniorHousing = "seniorHousing",
  minRent = "minRent",
  maxRent = "maxRent",
  ami = "ami",
  leasingAgents = "leasingAgents",
  communityType = "communityType",
}

/* Representation of the front end filters.
 *
 * This is decoupled from the backend representation in ListingFilterParams to
 * allow greater flexibility in how filters are displayed in the front end.
 */
export class FrontendFilter {
  /* The frontend filter name. */
  readonly filterKey: FrontendFilterKey

  /* The frontend filter value.
   *
   * Do not set this value directly! Use the setValue method in FrontEndFilters.
   */
  value: any

  /* Comparison operator needed by the backend filter representation. */
  readonly comparison: EnumListingFilterParamsComparison

  /* The allowed options if this is a dropdown filter. */
  readonly selectOptions: () => SelectOption[]

  readonly hasBackendFilter: boolean

  constructor(
    filterKey: FrontendFilterKey,
    comparison: EnumListingFilterParamsComparison,
    selectOptions?: () => SelectOption[],
    hasBackendFilter = true
  ) {
    this.filterKey = filterKey
    this.comparison = comparison
    if (hasBackendFilter) {
      this.hasBackendFilter = hasBackendFilter
    }
    if (selectOptions) {
      this.selectOptions = selectOptions
    }
  }

  getBackendFilterType(): ListingFilterKeys {
    return ListingFilterKeys[this.filterKey]
  }

  getBackendFilterValue(): any {
    return this.value
  }
}

export class FrontendFilterState {
  filters: Record<FrontendFilterKey, FrontendFilter>

  constructor() {
    const filters: Record<string, FrontendFilter> = {}
    filters[FrontendFilterKey.communityType] = new CommunityTypeFilter(
      FrontendFilterKey.communityType,
      EnumListingFilterParamsComparison["NA"],
      communityTypeOptions,
      false
    )
    filters[FrontendFilterKey.availability] = new FrontendFilter(
      FrontendFilterKey.availability,
      EnumListingFilterParamsComparison["NA"],
      availabilityOptions
    )
    filters[FrontendFilterKey.bedrooms] = new FrontendFilter(
      FrontendFilterKey.bedrooms,
      EnumListingFilterParamsComparison[">="],
      preferredUnitOptions
    )
    filters[FrontendFilterKey.zipcode] = new FrontendFilter(
      FrontendFilterKey.zipcode,
      EnumListingFilterParamsComparison["IN"]
    )
    filters[FrontendFilterKey.minRent] = new FrontendFilter(
      FrontendFilterKey.minRent,
      EnumListingFilterParamsComparison[">="]
    )
    filters[FrontendFilterKey.maxRent] = new FrontendFilter(
      FrontendFilterKey.maxRent,
      EnumListingFilterParamsComparison["<="]
    )
    filters[FrontendFilterKey.seniorHousing] = new FrontendFilter(
      FrontendFilterKey.seniorHousing,
      EnumListingFilterParamsComparison["NA"]
    )
    filters[FrontendFilterKey.name] = new FrontendFilter(
      FrontendFilterKey.name,
      EnumListingFilterParamsComparison["="]
    )
    filters[FrontendFilterKey.leasingAgents] = new FrontendFilter(
      FrontendFilterKey.leasingAgents,
      EnumListingFilterParamsComparison["="]
    )
    filters[FrontendFilterKey.status] = new FrontendFilter(
      FrontendFilterKey.status,
      EnumListingFilterParamsComparison["="]
    )
    filters[FrontendFilterKey.ami] = new FrontendFilter(
      FrontendFilterKey.ami,
      EnumListingFilterParamsComparison["NA"]
    )
    this.filters = filters
  }

  setValue(filterName: FrontendFilterKey, filterValue: any): void {
    this.filters[filterName].value = filterValue
    if (
      filterName === FrontendFilterKey.communityType &&
      filterValue === FrontendFilterKey.seniorHousing
    ) {
      this.filters[FrontendFilterKey.seniorHousing].value = true
    } else if (filterName === FrontendFilterKey.seniorHousing && filterValue == "true") {
      this.filters[FrontendFilterKey.communityType].value = FrontendFilterKey.seniorHousing
    }
  }

  getFilterCount(): number {
    let numberOfFilters = Object.keys(this.filters).filter(
      (filterKey) =>
        this.filters[filterKey].value !== undefined &&
        this.filters[filterKey].value != "" &&
        this.filters[filterKey].hasBackendFilter
    ).length
    // We want to consider rent as a single filter, so if both min and max are defined, reduce the count.
    const hasMinMaxRentOverCount =
      this.filters[FrontendFilterKey.minRent].value !== undefined &&
      this.filters[FrontendFilterKey.maxRent].value != undefined
    // The false senior housing filter is not displayed in the filter modal,
    // so we shouldn't count it
    const hasSeniorHousingFalseFilter =
      this.filters[FrontendFilterKey.seniorHousing].value === "false"
    if (hasMinMaxRentOverCount) {
      numberOfFilters -= 1
    }
    if (hasSeniorHousingFalseFilter) {
      numberOfFilters -= 1
    }

    return numberOfFilters
  }

  getBackendFilterArray(): ListingFilterParams[] {
    const filterArray = []
    for (const filterKey in this.filters) {
      if (this.filters[filterKey].hasBackendFilter) {
        const type = this.filters[filterKey].getBackendFilterType()
        const value = this.filters[filterKey].getBackendFilterValue()
        const comparison = this.filters[filterKey].comparison

        if (type in ListingFilterKeys && value !== undefined && value !== "") {
          filterArray.push({ $comparison: comparison, [type]: value })
        }
      }
    }
    return filterArray
  }

  getFrontendFilterString(): string {
    let queryString = ""
    for (const filterKey in this.filters) {
      if (this.filters[filterKey].hasBackendFilter) {
        const type = this.filters[filterKey].getBackendFilterType()
        const value = this.filters[filterKey].getBackendFilterValue()
        if (value !== undefined && value !== "") {
          queryString += `&${type}=${value}`
        }
      }
    }
    return queryString
  }

  getFiltersFromFrontendUrl(query: ParsedUrlQuery): FrontendFilterState {
    const filterState = new FrontendFilterState()
    for (const queryKey in query) {
      if (filterState.filters[queryKey] !== undefined) {
        filterState.setValue(FrontendFilterKey[queryKey], query[queryKey])
      }
    }
    return filterState
  }
}

export class CommunityTypeFilter extends FrontendFilter {
  getBackendFilterType(): ListingFilterKeys {
    throw new Error("The community filter does not have a corresponding backend filter type.")
  }
  getBackendFilterValue(): any {
    throw new Error("The community filter does not have a corresponding backend filter value.")
  }
}
