/*
Income
Prompts the user for their annual income.
*/
import React, { useContext } from "react"
import { FormCard } from "@bloom-housing/ui-components/src/blocks/FormCard"
import { t } from "@bloom-housing/ui-components/src/helpers/translator"
import { ELIGIBILITY_DISCLAIMER_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { Form } from "@bloom-housing/ui-components/src/forms/Form"
import { Button } from "@bloom-housing/ui-components/src/actions/Button"
import { AppearanceStyleType, Select } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { EligibilityContext } from "../../lib/EligibilityContext"
import { eligibilityRoute } from "../../lib/helpers"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { useRouter } from "next/router"
import EligibilityLayout from "../../layouts/eligibility"
import style from "./EligibilityIncome.module.scss"

const EligibilityIncome = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)

  const incomeRanges = ["below10k", "10kTo20k", "30kTo40k", "40kTo50k", "over50k"]
  const CURRENT_PAGE = 4

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm({
    defaultValues: {
      income: eligibilityRequirements?.income ?? incomeRanges[0],
    },
  })
  const onSubmit = async (data) => {
    eligibilityRequirements.setIncome(data.income)
    await router.push(ELIGIBILITY_DISCLAIMER_ROUTE)
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <EligibilityLayout currentPageSection={5}>
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
            <ul className={`${style.wage_types} field-note`}>
              <li>{t("eligibility.income.examples.wages")}</li>
              <li>{t("eligibility.income.examples.socialSecurity")}</li>
              <li>{t("eligibility.income.examples.retirement")}</li>
              <li>{t("eligibility.income.examples.unemployment")}</li>
            </ul>
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
              <Button styleType={AppearanceStyleType.primary}>{t("t.finish")}</Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </EligibilityLayout>
  )
}

export default EligibilityIncome
