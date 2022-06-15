import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

const DetailAdditionalFees = () => {
  const listing = useContext(ListingContext)
  const getUtilitiesIncluded = () => {
    let utilitiesExist = false
    const utilities = Object.keys(listing?.utilities ?? {}).map((utility) => {
      if (listing?.utilities[utility]) {
        utilitiesExist = true
        return (
          <li className={"list-disc mx-5 mb-1 md:w-1/3 w-full grow"}>
            {t(`listings.utilities.${utility}`)}
          </li>
        )
      }
    })
    return utilitiesExist ? utilities : <>None</>
  }

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.additionalFees")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell>
          <ViewItem id="applicationFee" label={t("listings.applicationFee")}>
            {getDetailFieldString(listing.applicationFee)}
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem id="depositMin" label={t("listings.depositMin")}>
            {getDetailFieldString(listing.depositMin)}
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem id="depositMax" label={t("listings.depositMax")}>
            {getDetailFieldString(listing.depositMax)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.sections.depositHelperText")}>
            {getDetailFieldString(listing.depositHelperText)}
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem id="costsNotIncluded" label={t("listings.sections.costsNotIncluded")}>
            {getDetailFieldString(listing.costsNotIncluded)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell className={"m-h-1"}>
          <ViewItem label={t("listings.sections.utilities")}>
            <ul className={"flex flex-wrap"}>{getUtilitiesIncluded()}</ul>
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailAdditionalFees
