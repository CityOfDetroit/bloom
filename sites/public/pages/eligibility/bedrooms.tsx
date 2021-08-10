/*
Bedroom Count
Prompts the user for the number of bedrooms they need.
*/
import {
  AppearanceStyleType,
  Button,
  FieldGroup,
  Form,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { EligibilityContext } from "../../lib/EligibilityContext"

const EligibilityBedrooms = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors, getValues } = useForm({
    defaultValues: {
      bedrooms: eligibilityRequirements?.bedroomCounts,
    },
  })

  const onSubmit = () => {
    const data = getValues()
    const { bedrooms } = data
    eligibilityRequirements.setBedroomCounts(bedrooms)

    void router.push(`/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[2]}`)
  }

  const bedroomsOptions = [
    { id: "studio", label: t("eligibility.bedrooms.studio") },
    { id: "oneBdrm", label: "1" },
    { id: "twoBdrm", label: "2" },
    { id: "threeBdrm", label: "3" },
    { id: "fourBdrm", label: "4+" },
  ]

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={2}
          completedSections={1}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead pb-0 pt-8">
          <h2 className="form-card__title is-borderless">{t("eligibility.bedrooms.prompt")}</h2>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <fieldset>
              <legend className="sr-only">{t("eligibility.bedrooms.prompt")}</legend>
              <FieldGroup
                type="checkbox"
                name="bedrooms"
                fields={bedroomsOptions}
                error={errors.bedrooms != null}
                errorMessage={t("errors.selectAtLeastOne")}
                validation={{ required: true }}
                register={register}
              />
            </fieldset>
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

export default EligibilityBedrooms
