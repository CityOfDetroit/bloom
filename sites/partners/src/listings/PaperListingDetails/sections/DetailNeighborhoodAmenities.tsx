import React from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { getDetailFieldString } from "./helpers"

const DetailBuildingFeatures = () => {
  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.neighborhoodAmenitiesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="grocery" label={t("t.grocery")}>
            {getDetailFieldString("")}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="pharmacy" label={t("t.pharmacy")}>
            {getDetailFieldString("")}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="medicalClinic" label={t("t.medicalClinic")}>
            {getDetailFieldString("")}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="park" label={t("t.park")}>
            {getDetailFieldString("")}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="seniorCenter" label={t("t.seniorCenter")}>
            {getDetailFieldString("")}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailBuildingFeatures
