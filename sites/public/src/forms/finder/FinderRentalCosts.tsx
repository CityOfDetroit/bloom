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
    <div className="finder-grid">
      {numericFields.map((field) => {
        const isMin = field.label === "minRent"
        console.log(numericFields)
        return (
          <Field
            id={field.label}
            name={FrontendListingFilterStateKeys[field.label]}
            type="number"
            placeholder={isMin ? t("publicFilter.rentRangeMin") : t("publicFilter.rentRangeMax")}
            label={isMin ? t("publicFilter.rentRangeMin") : t("publicFilter.rentRangeMax")}
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
            className={"finder-grid__field"}
            inputProps={{
              onBlur: () => {
                void props.trigger("minRent")
                void props.trigger("maxRent")
              },
            }}
            readerOnly
          />
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
