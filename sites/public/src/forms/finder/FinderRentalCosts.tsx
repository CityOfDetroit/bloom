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
}) => (
  <div>
    {props.activeQuestion?.fields?.map((field) => (
      <Field
        id={field.label}
        name={FrontendListingFilterStateKeys[field.label]}
        type="number"
        placeholder={t("publicFilter.rentRangeMin")}
        label={t("publicFilter.rentRangeMin")}
        register={props.register}
        prepend={"$"}
        defaultValue={typeof field?.value != "boolean" && field?.value}
        error={props.errors?.minRent !== undefined}
        errorMessage={t("errors.minGreaterThanMaxRentError")}
        validation={{ max: props.maxRent || props.minRent }}
        inputProps={{
          onBlur: () => {
            void props.trigger("minRent")
            void props.trigger("maxRent")
          },
        }}
      />
    ))}
  </div>
)

export default FinderRentalCosts
