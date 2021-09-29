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
  ProgressNav,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import styles from "./EligibilityAge.module.scss"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { AgeRangeType, EligibilityContext } from "../../lib/EligibilityContext"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { eligibilityRoute } from "../../lib/helpers"

const EligibilityAge = () => {
  const router = useRouter()
  // Check if they need to be 18 or older to apply?
  const MIN_AGE = 0
  const MAX_AGE = 120
  const CURRENT_PAGE = 2

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm()
  const { eligibilityRequirements } = useContext(EligibilityContext)

  const onSubmit = (data) => {
    if (data.age !== "preferNotSay") {
      eligibilityRequirements.setAge(data.age)
    }
    void router.push(eligibilityRoute(CURRENT_PAGE + 1))
  }

  const ageValues = [
    {
      id: "ageLessThan55",
      value: AgeRangeType.lessThanFiftyFive,
      label: t("eligibility.age.lessThan55"),
    },
    {
      id: "age55to61",
      value: AgeRangeType.FiftyFiveToSixtyOne,
      label: t("eligibility.age.55to61"),
    },
    {
      id: "age62+",
      value: AgeRangeType.SixtyTwoAndUp,
      label: t("eligibility.age.62plus"),
    },
    {
      id: "preferNotToSay",
      value: "preferNotToSay",
      label: t("eligibility.preferNotToSay"),
    },
  ]

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={3}
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
            <h2 className="form-card__title is-borderless">{t("eligibility.age.prompt")}</h2>
          </div>
          <div className="form-card__group is-borderless">
            <p className="field-note mb-4" id="age-description">
              {t("eligibility.age.description")}
            </p>
            <FieldGroup
              type="radio"
              className={styles.age_field}
              name="age"
              describedBy="age-description"
              isLabelAfterField={true}
              defaultValue={eligibilityRequirements.age}
              register={register}
              fields={ageValues}
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

export default EligibilityAge
