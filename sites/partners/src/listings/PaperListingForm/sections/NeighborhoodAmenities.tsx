import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea } from "@bloom-housing/ui-components"

const NeighborhoodAmenities = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.neighborhoodAmenitiesTitle")}
        description={t("listings.sections.neighborhoodAmenitiesSubtitle")}
      >
        <GridSection columns={2}>
          <Textarea
            label={t("t.grocery")}
            name={"grocery"}
            id={"grocery"}
            fullWidth={true}
            register={register}
          />
          <Textarea
            label={t("t.pharmacy")}
            name={"pharmacy"}
            id={"pharmacy"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("t.medicalClinic")}
            name={"medicalClinic"}
            id={"medicalClinic"}
            fullWidth={true}
            register={register}
          />
          <Textarea
            label={t("t.park")}
            name={"park"}
            id={"park"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
        <GridSection columns={2}>
          <Textarea
            label={t("t.seniorCenter")}
            name={"seniorCenter"}
            id={"seniorCenter"}
            fullWidth={true}
            register={register}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default NeighborhoodAmenities
