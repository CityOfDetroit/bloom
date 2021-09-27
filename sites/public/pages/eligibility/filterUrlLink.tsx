import { encodeToFrontendFilterString, ListingFilterState } from "@bloom-housing/ui-components"

export function getFilterUrlLink(eligibilityRequirements) {
  const SENIOR_AGE = 62

  const params: ListingFilterState = {}

  eligibilityRequirements.age > SENIOR_AGE && (params.seniorHousing = true)

  switch (eligibilityRequirements.householdSizeCount.toString()) {
    case "one":
    case "two":
      params.bedrooms = 1
      break
    case "three":
      params.bedrooms = 2
      break
    case "four":
      params.bedrooms = 3
      break
    default:
      params.bedrooms = 4
  }
  console.log(encodeToFrontendFilterString(params))
  return `/listings?${encodeToFrontendFilterString(params)}`
}
