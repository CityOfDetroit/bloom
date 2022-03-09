import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Field } from "@bloom-housing/ui-components"

const Verification = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.verification")}
        description={t("listings.sections.verificationSubtitle")}
      >
        <GridSection columns={1}>
          <Field
            label={t("listings.isVerified")}
            name={"isVerified"}
            id={"isVerified"}
            type={"checkbox"}
            register={register}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default Verification
