import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { getDetailFieldString } from "./helpers"
import { ListingContext } from "../../ListingContext"

const DetailBuildingFeatures = () => {
  const listing = useContext(ListingContext)
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
            {getDetailFieldString(listing.neighborhoodAmenities?.grocery)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="pharmacy" label={t("t.pharmacy")}>
            {getDetailFieldString(listing.neighborhoodAmenities?.pharmacy)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="medicalClinic" label={t("t.medicalClinic")}>
            {getDetailFieldString(listing.neighborhoodAmenities?.medicalClinic)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="park" label={t("t.park")}>
            {getDetailFieldString(listing.neighborhoodAmenities?.park)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="seniorCenter" label={t("t.seniorCenter")}>
            {getDetailFieldString(listing.neighborhoodAmenities?.seniorCenter)}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailBuildingFeatures
