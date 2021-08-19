/*
Income
Prompts the user for their annual income.
*/
import FormsLayout from "../../layouts/forms"
import React, { useContext } from "react"
import { FormCard } from "@bloom-housing/ui-components/src/blocks/FormCard"
import { t } from "@bloom-housing/ui-components/src/helpers/translator"
import { ProgressNav } from "@bloom-housing/ui-components/src/navigation/ProgressNav"
import { ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { Form } from "@bloom-housing/ui-components/src/forms/Form"
import { Button } from "@bloom-housing/ui-components/src/actions/Button"
import { AppearanceStyleType, Select } from "@bloom-housing/ui-components"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { EligibilityContext } from "../../lib/EligibilityContext"
import { eligibilityRoute } from "../../lib/helpers"
import FormBackLink from "../../src/forms/applications/FormBackLink"

const EligibilityIncome = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)

  const incomeRanges = ["below10k", "10kTo20k", "30kTo40k", "40kTo50k", "over50k"]
  const CURRENT_PAGE = 4

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, getValues } = useForm({
    defaultValues: {
      income: eligibilityRequirements?.income ?? incomeRanges[0],
    },
  })
  const onSubmit = () => {
    const data = getValues()
    const { income } = data
    eligibilityRequirements.setIncome(income)

    const completed = eligibilityRequirements.completedSections
    eligibilityRequirements.setCompletedSections(
      completed > CURRENT_PAGE ? completed : CURRENT_PAGE + 1
    )

    void router.push(eligibilityRoute(CURRENT_PAGE + 1))
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={5}
          completedSections={eligibilityRequirements.completedSections + 1}
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
          <h2 className="form-card__title is-borderless">{t("eligibility.income.prompt")}</h2>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <p className="field-note mb-4" id="income-description">
              {t("eligibility.income.description")}
            </p>
            <Select
              id="income"
              name="income"
              label={t("eligibility.income.label")}
              describedBy="income-description"
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              options={incomeRanges}
              keyPrefix="eligibility.income.ranges"
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

export default EligibilityIncome
