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
  const numericFields = props.activeQuestion?.fields.slice(0, 2)
  const section8Field = props.activeQuestion?.fields[2]
  return (
    <div className="finder-grid finder-grid__rental_costs">
      {numericFields.map((field) => {
        const isMin = field.label === "minRent"
        return (
          <div className="finder-grid__field">
            <Field
              id={field.label}
              name={FrontendListingFilterStateKeys[field.label]}
              type="number"
              placeholder={`${t("t.no")} ${
                isMin ? t("finder.rentalCosts.minRent") : t("finder.rentalCosts.maxRent")
              }`}
              label={isMin ? t("finder.rentalCosts.minRent") : t("finder.rentalCosts.maxRent")}
              register={props.register}
              prepend={"$"}
              defaultValue={typeof field?.value != "boolean" && field?.value}
              error={
                isMin ? props.errors?.minRent !== undefined : props.errors?.maxRent !== undefined
              }
              errorMessage={
                isMin ? t("errors.minGreaterThanMaxRentError") : t("errors.maxLessThanMinRentError")
              }
              validation={isMin ? { max: props.maxRent || props.minRent } : { min: props.minRent }}
              inputProps={{
                onBlur: () => {
                  void props.trigger("minRent")
                  void props.trigger("maxRent")
                },
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
          label={t("finder.rentalCosts.section8")}
          className={"finder-grid__row"}
          register={props.register}
          inputProps={{
            value: section8Field.label,
            defaultChecked: section8Field.value,
          }}
          bordered
        />
      )}
    </div>
  )
}

export default FinderRentalCosts
