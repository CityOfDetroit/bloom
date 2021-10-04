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
import { AppearanceStyleType, Field } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { EligibilityContext } from "../../lib/EligibilityContext"
import { eligibilityRoute } from "../../lib/helpers"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { useRouter } from "next/router"
import { useAmiChartList } from "../../lib/hooks"
import { getFilterUrlLink } from "../../lib/filterUrlLink"

const EligibilityIncome = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)
  const { data: amiCharts = [] } = useAmiChartList()
  const CURRENT_PAGE = 4

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = async (data) => {
    eligibilityRequirements.setIncome(data.income)
    await router.push(getFilterUrlLink(eligibilityRequirements, amiCharts))
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={5}
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

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__lead pb-0 pt-8">
            <h2 className="form-card__title is-borderless">{t("eligibility.income.prompt")}</h2>
          </div>
          <div className="form-card__group">
            <p className="field-note mb-4" id="income-description">
              {t("eligibility.income.description")}
            </p>
            <Field
              id="income"
              name="income"
              label={t("eligibility.income.label")}
              describedBy="income-description"
              defaultValue={eligibilityRequirements.income}
              inputProps={{ maxLength: 7 }}
              type={"number"}
              validation={{ required: true }}
              error={errors.income}
              errorMessage={t("errors.numberError")}
              register={register}
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button styleType={AppearanceStyleType.primary}>{t("t.done")}</Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default EligibilityIncome
