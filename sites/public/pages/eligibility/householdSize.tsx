/*
Household Size Count
Prompts the user for the number of members in their household.
*/
import {
  AppearanceStyleType,
  Button,
  Form,
  FormCard,
  ProgressNav,
  Select,
  t,
  encodeToFrontendFilterString,
  Waitlist,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { EligibilityContext } from "../../lib/EligibilityContext"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { eligibilityRoute } from "../../lib/helpers"
import {
  EnumListingFilterParamsComparison,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"

const EligibilityHouseholdSize = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)
  const CURRENT_PAGE = 1

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, getValues } = useForm({
    defaultValues: {
      householdSize: eligibilityRequirements?.householdSizeCount,
    },
  })

  const onSubmit = () => {
    const data = getValues()
    const { householdSize } = data
    eligibilityRequirements.setHouseholdSizeCount(householdSize)

    void router.push(eligibilityRoute(CURRENT_PAGE + 1))
  }

  const onClick = () => {
    const data = getValues()
    const { householdSize } = data
    eligibilityRequirements.setHouseholdSizeCount(householdSize)
    console.log(eligibilityRequirements.householdSizeCount.valueOf())
    void router.push(getFilterUrl())
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  function getFilterUrl() {
    const params: ListingFilterParams = {
      // $comparison is a required field even though it won't be used on the frontend. Will be fixed in #484.
      $comparison: EnumListingFilterParamsComparison.NA,
    }
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
    params.seniorHousing = true

    return `/listings?${encodeToFrontendFilterString(params)}`
  }

  const householdSizeRanges = ["one", "two", "three", "four", "five", "six", "seven", "eight"]

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={2}
          completedSections={eligibilityRequirements.completedSections}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
          routes={ELIGIBILITY_SECTIONS.map((_label, i) => eligibilityRoute(i))}
        />
      </FormCard>
      <FormCard>
        <FormBackLink
          url={eligibilityRoute(CURRENT_PAGE - 1)}
          onClick={() => {
            // Not extra actions needed.
          }}
        />
        <div className="form-card__lead pb-0 pt-8">
          <h2 className="form-card__title is-borderless">
            {t("eligibility.householdSize.prompt")}
          </h2>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <legend className="sr-only">{t("eligibility.householdSize.prompt")}</legend>
            <Select
              id="householdSize"
              name="householdSize"
              label={t("eligibility.householdSize.srCountLabel")}
              describedBy="householdSize-description"
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              options={householdSizeRanges}
              keyPrefix="eligibility.householdSize.ranges"
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button className="mx-2 mt-6" styleType={AppearanceStyleType.primary}>
                {t("t.next")}
              </Button>
              <Button
                onClick={handleSubmit(onClick)}
                className="mx-2 mt-6"
                styleType={AppearanceStyleType.primary}
              >
                {t("t.viewListings")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default EligibilityHouseholdSize
