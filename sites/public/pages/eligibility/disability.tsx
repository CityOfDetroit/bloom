/*
Disability
Whether the applicant has accessibility needs.
*/
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  Field,
  ProgressNav,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_SECTIONS } from "../../lib/constants"

const EligibilityDisability = () => {
  const router = useRouter()

  /* Form Handler */
  const { handleSubmit, register } = useForm()
  const onSubmit = () => {
    // Not yet implemented.
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={4}
          completedSections={3}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
        />
      </FormCard>
      <FormCard>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__lead pb-0">
            <h2 className="form-card__title is-borderless">{t("eligibility.disability.prompt")}</h2>
          </div>
          <div className="form-card__group">
            <fieldset>
              <p className="field-note mb-4">{t("eligibility.disability.description")}</p>
              <Field
                type="radio"
                id="disabilityNo"
                name="disabilityNo"
                label={t("t.no")}
                register={register}
                validation={{ required: true }}
                inputProps={{
                  value: "no",
                }}
              />

              <Field
                type="radio"
                id="disabilityYes"
                name="disabilityYes"
                label={t("t.yes")}
                register={register}
                validation={{ required: true }}
                inputProps={{
                  value: "yes",
                }}
              />

              <Field
                type="radio"
                id="disabilityPreferNotToSay"
                name="disabilityPreferNotToSay"
                label={t("eligibility.disability.preferNotToSay")}
                register={register}
                validation={{ required: true }}
                inputProps={{
                  value: "preferNotToSay",
                }}
              />
            </fieldset>
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => router.push("/eligibility/income")}
              >
                {t("t.next")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default EligibilityDisability
