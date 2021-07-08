/*
Age
Prompts the user for their age to filter for properties that are age dependent.
*/
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  Field,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../lib/hooks"
import "./age.scss"
import React from "react"

const EligibilityAge = () => {
  // The conductor is not yet implemented.
  const { conductor } = useFormConductor("age")

  /* Form Handler */
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = () => {
    conductor.routeToNextOrReturnUrl()
  }

  return (
    <FormsLayout>
      <FormCard>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group is-borderless">
            <legend className="field-label--caps">{t("eligibility.agePrompt")}</legend>

            <p className="field-note mb-4">
              {t("eligibility.agePromptDescription")}
            </p>

            <Field
                className="age-field"
                id="age"
                name="age"
                label={t("eligibility.ageLabel")}
                isLabelAfterField={true}
                inputProps={{ maxLength: 3 }}
                validation={{ required: true }}
                register={register}
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => conductor.setNavigatedBack(false)}
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

export default EligibilityAge
