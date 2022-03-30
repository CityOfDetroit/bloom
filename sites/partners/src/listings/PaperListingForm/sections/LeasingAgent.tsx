import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea, Field, PhoneField } from "@bloom-housing/ui-components"
import { fieldMessage, fieldHasError } from "../../../../lib/helpers"
import { isURL } from "class-validator"

const LeasingAgent = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, errors, clearErrors, watch, trigger } = formMethods

  const leasingAgentPhoneField: string = watch("leasingAgentPhone")

  useEffect(() => {
    clearErrors("leasingAgentPhone")
  }, [leasingAgentPhoneField, clearErrors])

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.leasingAgentTitle")}
        description={t("listings.sections.leasingAgentSubtitle")}
      >
        <GridSection columns={3}>
          <Field
            label={t("leasingAgent.name")}
            name={"leasingAgentName"}
            id={"leasingAgentName"}
            error={fieldHasError(errors?.leasingAgentName)}
            errorMessage={fieldMessage(errors?.leasingAgentName)}
            placeholder={t("leasingAgent.namePlaceholder")}
            register={register}
            inputProps={{
              onChange: () => clearErrors("leasingAgentName"),
            }}
          />
          <Field
            label={t("t.email")}
            name={"leasingAgentEmail"}
            id={"leasingAgentEmail"}
            error={fieldHasError(errors?.leasingAgentEmail)}
            errorMessage={fieldMessage(errors?.leasingAgentEmail)}
            placeholder={t("t.emailAddressPlaceholder")}
            register={register}
            inputProps={{
              onChange: () => clearErrors("leasingAgentEmail"),
            }}
          />
          <PhoneField
            label={t("t.phone")}
            name={"leasingAgentPhone"}
            id={"leasingAgentPhone"}
            error={fieldHasError(errors?.leasingAgentPhone)}
            errorMessage={fieldMessage(errors?.leasingAgentPhone)}
            placeholder={t("t.phoneNumberPlaceholder")}
            control={control}
            controlClassName={"control"}
            required={true}
          />
        </GridSection>
        <GridSection columns={2}>
          <GridSection columns={1}>
            <Field
              label={t("leasingAgent.title")}
              name={"leasingAgentTitle"}
              id={"leasingAgentTitle"}
              placeholder={t("leasingAgent.title")}
              register={register}
            />
            <Field
              label={t("leasingAgent.managementWebsite")}
              name={"managementWebsite"}
              id={"managementWebsite"}
              placeholder={t("leasingAgent.managementWebsite")}
              register={register}
              validation={{
                validate: (value) => isURL(value) || t("errors.urlError"),
              }}
              error={fieldHasError(errors?.managementWebsite)}
              errorMessage={t("errors.urlError")}
              type="url"
              onChange={(e) => trigger("managementWebsite")}
            />
          </GridSection>
          <Textarea
            label={t("leasingAgent.officeHours")}
            name={"leasingAgentOfficeHours"}
            id={"leasingAgentOfficeHours"}
            fullWidth={true}
            placeholder={t("leasingAgent.officeHoursPlaceholder")}
            register={register}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default LeasingAgent
