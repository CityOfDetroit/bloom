import { FrontendListingFilterStateKeys } from "@bloom-housing/shared-helpers"
import { Field, t } from "@bloom-housing/ui-components"
import { UseFormMethods } from "react-hook-form"
import { FinderQuestion } from "../../../pages/finder"

const FinderRentalCosts = (props: {
  activeQuestion: FinderQuestion
  register: UseFormMethods["register"]
  errors: UseFormMethods["errors"]
  trigger: UseFormMethods["trigger"]
  minRent: number
  maxRent: number
}) => {
  const numericFields = props.activeQuestion?.fields.filter((field) => field.type === "number")
  const section8Field = props.activeQuestion?.fields.find((field) => field.type === "checkbox")
  return (
    <div className="finder-grid finder-grid__rental_costs">
      {numericFields.map((field) => {
        const isMin = field.label === "minRent"
        return (
          <div className="finder-grid__field" key={field.label}>
            <Field
              id={field.label}
              name={FrontendListingFilterStateKeys[field.label]}
              type="number"
              placeholder={`${t("t.no")} ${field.translation}`}
              label={field.translation}
              register={props.register}
              prepend={"$"}
              defaultValue={typeof field?.value != "boolean" && field?.value}
              error={
                isMin ? props.errors?.minRent !== undefined : props.errors?.maxRent !== undefined
              }
              errorMessage={
                isMin
                  ? props.errors?.minRent?.type === "min"
                    ? t("errors.negativeMinRent")
                    : t("errors.minGreaterThanMaxRentError")
                  : t("errors.maxLessThanMinRentError")
              }
              validation={
                isMin ? { max: props.maxRent || props.minRent, min: 0 } : { min: props.minRent }
              }
              inputProps={{
                onBlur: () => {
                  void props.trigger("minRent")
                  void props.trigger("maxRent")
                },
                min: 0,
              }}
            />
          </div>
        )
      })}
      {section8Field && (
        <Field
          id={section8Field.label}
          name={FrontendListingFilterStateKeys[section8Field.label]}
          type="checkbox"
          label={section8Field.translation}
          className={"finder-grid__row"}
          register={props.register}
          inputProps={{
            defaultChecked: section8Field.value,
          }}
          bordered
        />
      )}
    </div>
  )
}

export default FinderRentalCosts
