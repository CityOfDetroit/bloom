import { encodeToFrontendFilterString, ListingFilterState } from "@bloom-housing/ui-components"
import { AgeRangeType } from "./EligibilityContext"
import { getMinAmi } from "./helpers"

export function getFilterUrlLink(eligibilityRequirements, amiCharts = undefined) {
  /** This is where any logic for the filtered results from the eligibility questionnaire should be located.*/

  const state: ListingFilterState = {}

  // If the user does not qualify for the senior-only communities, filter those out.
  // If the user does qualify, we want to show everything that user qualifies for,
  // which includes communities that are not senior-only, so don't set the filter at all.
  if (
    eligibilityRequirements?.age == AgeRangeType.LessThanFiftyFive ||
    eligibilityRequirements?.age == AgeRangeType.FiftyFiveToSixtyOne
  ) {
    state.seniorHousing = false
  }

  // If the user has as a disability or they prefer not to reveal they're
  // disability status, we don't need to filter the listings down further.
  // We show all listings as well as the communities that require a disability
  // status to apply.
  if (eligibilityRequirements.disability === "false") {
    state.independentLivingHousing = false
  }

  if (
    amiCharts != undefined &&
    !amiCharts.isEmpty &&
    eligibilityRequirements.householdSizeCount != undefined &&
    eligibilityRequirements.income != undefined
  ) {
    state.minAmiPercentage = getMinAmi(
      amiCharts[0],
      eligibilityRequirements.householdSizeCount,
      eligibilityRequirements.income
    )
  }

  return `/listings/filtered?${encodeToFrontendFilterString(state)}`
}
