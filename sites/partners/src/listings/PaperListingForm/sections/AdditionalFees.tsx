import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Field, Textarea, FieldGroup, ViewItem } from "@bloom-housing/ui-components"
import { fieldHasError, fieldMessage } from "../../../../lib/helpers"
import { utilities } from "@bloom-housing/shared-helpers"

const AdditionalFees = () => {
  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors } = formMethods
  const utilitiesOptions = useMemo(() => {
    return utilities.map((item) => ({
      id: item,
      label: item,
      defaultChecked: false,
      register,
    }))
  }, [register])
  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.additionalFees")}
        description={t("listings.sections.additionalFeesSubtitle")}
      >
        <GridSection columns={3}>
          <Field
            label={t("listings.applicationFee")}
            name={"applicationFee"}
            id={"applicationFee"}
            register={register}
            type={"currency"}
            prepend={"$"}
            placeholder={"0.00"}
          />
          <Field
            label={t("listings.depositMin")}
            name={"depositMin"}
            id={"depositMin"}
            register={register}
            type={"currency"}
            prepend={"$"}
            placeholder={"0.00"}
            error={fieldHasError(errors?.depositMin)}
            errorMessage={fieldMessage(errors?.depositMin)}
            inputProps={{
              onChange: () => clearErrors("depositMin"),
            }}
          />
          <Field
            label={t("listings.depositMax")}
            name={"depositMax"}
            id={"depositMax"}
            register={register}
            type={"currency"}
            prepend={"$"}
            placeholder={"0.00"}
            error={fieldHasError(errors?.depositMax)}
            errorMessage={fieldMessage(errors?.depositMax?.message)}
            inputProps={{
              onChange: () => clearErrors("depositMax"),
            }}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("listings.sections.depositHelperText")}
            name={"depositHelperText"}
            id={"depositHelperText"}
            aria-describedby={"depositHelperText"}
            fullWidth={true}
            register={register}
          />
          <Textarea
            label={t("listings.sections.costsNotIncluded")}
            name={"costsNotIncluded"}
            id={"costsNotIncluded"}
            aria-describedby={"costsNotIncluded"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
        <GridSection columns={1}>
          <ViewItem label={"Accessibility Features"}>
            <FieldGroup
              type="checkbox"
              name="listingFeatures"
              fields={utilitiesOptions}
              register={register}
              fieldGroupClassName="grid grid-cols-2 mt-4"
            />
          </ViewItem>
        </GridSection>
      </GridSection>
    </div>
  )
}

export default AdditionalFees
