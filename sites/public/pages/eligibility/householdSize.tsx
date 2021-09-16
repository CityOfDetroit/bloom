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
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { EligibilityContext } from "../../lib/EligibilityContext"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { eligibilityRoute } from "../../lib/helpers"

const EligibilityHouseholdSize = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)
  const CURRENT_PAGE = 1

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, getValues } = useForm({
    defaultValues: {
      householdSize: eligibilityRequirements?.householdSizeCount.toString(),
    },
  })

  const onSubmit = () => {
    const data = getValues()
    const { householdSize } = data
    eligibilityRequirements.setHouseholdSizeCount(parseInt(householdSize))

    void router.push(eligibilityRoute(CURRENT_PAGE + 1))
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  const householdSizeRanges = Array.from({ length: 8 }, (_, i) => (i + 1).toString())

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
              <Button styleType={AppearanceStyleType.primary}>{t("t.next")}</Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default EligibilityHouseholdSize
