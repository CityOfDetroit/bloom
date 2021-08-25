/*
Section 8
Asks whether the user has a section 8 voucher.
*/
import React, { useContext } from "react"
import { FormCard } from "@bloom-housing/ui-components/src/blocks/FormCard"
import { t } from "@bloom-housing/ui-components/src/helpers/translator"
import { ProgressNav } from "@bloom-housing/ui-components/src/navigation/ProgressNav"
import { ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { Form } from "@bloom-housing/ui-components/src/forms/Form"
import { Button } from "@bloom-housing/ui-components/src/actions/Button"
import {
  AppearanceStyleType,
  encodeToFrontendFilterString,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { EligibilityContext } from "../../lib/EligibilityContext"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { eligibilityRoute } from "../../lib/helpers"
import { useRouter } from "next/router"
import {
  EnumListingFilterParamsComparison,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"
import FormsLayout from "../../layouts/forms"

const EligibilitySection8 = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)
  const CURRENT_PAGE = 5
  const SENIOR_AGE = 62

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors, getValues } = useForm({
    defaultValues: {
      section8: eligibilityRequirements?.section8,
    },
  })
  const onSubmit = () => {
    const data = getValues()
    const { section8 } = data
    eligibilityRequirements.setSection8(section8)
    void router.push(getFilterUrl())
  }

  const section8Values = [
    {
      id: "section8No",
      value: "no",
      label: t("t.no"),
    },
    {
      id: "section8Yes",
      value: "yes",
      label: t("t.yes"),
    },
  ]

  function getFilterUrl() {
    const params: ListingFilterParams = {}

    if (eligibilityRequirements.age < SENIOR_AGE) {
      params.seniorHousing = false
    }

    return `/listings?${encodeToFrontendFilterString(params)}`
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={6}
          completedSections={5}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
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
            <h2 className="form-card__title is-borderless">{t("eligibility.section8.prompt")}</h2>
          </div>
          <div className="form-card__group">
            <fieldset>
              <legend className="sr-only">{t("eligibility.section8.prompt")}</legend>
              <FieldGroup
                type="radio"
                name="section8"
                error={errors.section8 != null}
                errorMessage={t("errors.selectOption")}
                register={register}
                validation={{ required: true }}
                fields={section8Values}
              />
            </fieldset>
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

export default EligibilitySection8
