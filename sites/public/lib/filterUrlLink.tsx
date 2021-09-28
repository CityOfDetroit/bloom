import { encodeToFrontendFilterString, ListingFilterState } from "@bloom-housing/ui-components"

export function getFilterUrlLink(eligibilityRequirements) {
  /** This is where any logic for the filtered results from the eligibility questionnaire should be located.
   *  Example if household size dictated bedrooms:
   *  switch (eligibilityRequirements.householdSizeCount.toString()) {
   *  case "one":
   *  case "two":
   *    params.bedrooms = 1
   *    break
   *  case "three":
   *    params.bedrooms = 2
   *    break
   *  case "four":
   *    params.bedrooms = 3
   *    break
   *  default:
   *    params.bedrooms = 4
   *  }
   */

  const SENIOR_AGE = 62

  const params: ListingFilterState = {}

  if (eligibilityRequirements.age >= SENIOR_AGE) {
    params.seniorHousing = true
  }

  return `/listings?${encodeToFrontendFilterString(params)}`
}
