import { encodeToFrontendFilterString, ListingFilterState } from "@bloom-housing/ui-components"
import { AgeRangeType } from "./EligibilityContext"

export function getFilterUrlLink(eligibilityRequirements) {
  /** This is where any logic for the filtered results from the eligibility questionnaire should be located.*/

  const params: ListingFilterState = {}

  if (
    eligibilityRequirements?.age == AgeRangeType.LessThanFiftyFive ||
    eligibilityRequirements?.age == AgeRangeType.FiftyFiveToSixtyOne
  ) {
    params.seniorHousing = false
  }

  return `/listings/filtered?${encodeToFrontendFilterString(params)}`
}
