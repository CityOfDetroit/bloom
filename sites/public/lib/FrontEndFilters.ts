import { SelectOption, t } from "@bloom-housing/ui-components"
import { AvailabilityFilterEnum, ListingFilterKeys } from "@bloom-housing/backend-core/dist"
import React from "react"
import { blankEligibilityRequirements } from "./EligibilityContext"

export const COMMUNITY_TYPE = "communityType"
const EMPTY_OPTION = { value: "", label: "" }

// TODO: Select options should come from the database (#252)
export const adaCompliantOptions: SelectOption[] = [
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

class FrontEndFilter {
  name: string
  value: any
  options: SelectOption[]

  constructor(name: string, options: SelectOption[]) {
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
