/*
Bedroom Count
Prompts the user for the number of bedrooms they need.
*/
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  preferredUnit,
  FieldGroup,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../lib/hooks"
import React from "react"

const EligibilityBedrooms = () => {
  const { conductor } = useFormConductor("bedrooms")

  /* Form Handler */
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = () => {
    conductor.routeToNextOrReturnUrl()
  }

  const preferredUnitOptions = preferredUnit?.map((item) => ({
    id: item.id,
    label: t(`application.household.preferredUnit.options.${item.id}`)
  }))

  return (
    <FormsLayout>
      <FormCard>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group is-borderless">
            <legend className="sr-only">{t("application.household.preferredUnit.legend")}</legend>
            <FieldGroup
              type="checkbox"
              name="preferredUnit"
              groupNote={t("eligibility.bedroomCountPrompt")}
              fields={preferredUnitOptions}
              error={errors.preferredUnit}
              errorMessage={t("errors.selectAtLeastOne")}
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

export default EligibilityBedrooms
