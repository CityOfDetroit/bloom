import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "./constants"
import { Address, Listing } from "@bloom-housing/backend-core/types"
import {
  t,
  ListingCard,
  imageUrlFromListing,
  getSummariesTableFromUnitSummary,
  getSummariesTableFromUnitsSummary,
} from "@bloom-housing/ui-components"
import React from "react"

export const eligibilityRoute = (page: number) =>
  `/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[page]}`

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const getGenericAddress = (bloomAddress: Address) => {
  return {
    city: bloomAddress.city,
    street: bloomAddress.street,
    street2: bloomAddress.street2,
    state: bloomAddress.state,
    zipCode: bloomAddress.zipCode,
    latitude: bloomAddress.latitude,
    longitude: bloomAddress.longitude,
    placeName: bloomAddress.placeName,
  }
}

/**
 * Gets the minimum AMI that the user qualifies for.
 *
 * AMI is computed using a chart keyed off of the household size and income.
 *
 * For example, for a simplified chart:
 * AMI | 1 Person | 2 Person
 * 20% | 11,000   | 12,560
 * 30% | 13,750   | 15,700
 * 35% | 19,250   | 18,840
 *
 * If the user has annual income of $14,000 for a 2 person household, they
 * qualify for properties at 30% and 35% AMI. We look at the 2 person column
 * and find all AMIs with income equal to or greater than the user's income.
 *
 * In this method, we return the minimum AMI that they qualify for. For the
 * above example, we would return 30.
 */
export function getMinAmi(amiChart, householdSize: number, income: number) {
  const maxPossibleAmi = Math.max(...amiChart.items.map((item) => item.percentOfAmi))
  const minAmi = Math.min(
    ...amiChart.items
      .filter((item) => item.householdSize === householdSize && item.income >= income)
      .map((item) => item.percentOfAmi)
  )
  // We get a minAmi of Infinity if the user does not qualify for any AMI.
  // In that case, use the maxPossibleAmi + 1 to filter out all results,
  // because the backend cannot handle a value of Infinity.
  return minAmi === Infinity ? maxPossibleAmi + 1 : minAmi
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

const getListingTableData = (listing: Listing) => {
  if (listing.unitsSummary !== undefined && listing.unitsSummary.length > 0) {
    return getSummariesTableFromUnitsSummary(listing.unitsSummary)
  } else if (listing.unitsSummarized !== undefined) {
    return getSummariesTableFromUnitSummary(listing.unitsSummarized.byUnitTypeAndRent)
  }
  return []
}

export const getListings = (listings: Listing[]) => {
  const unitSummariesHeaders = {
    unitType: t("t.unitType"),
    rent: t("t.rent"),
    availability: t("t.availability"),
  }
  return listings.map((listing: Listing, index) => {
    return (
      <ListingCard
        key={index}
        imageCardProps={{
          imageUrl:
            imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize || "1302")) || "",
          subtitle: getListingCardSubtitle(listing.buildingAddress),
          title: listing.name,
          href: `/listing/${listing.id}/${listing.urlSlug}`,
          tagLabel: listing.reservedCommunityType
            ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
            : undefined,
        }}
        tableProps={{
          headers: unitSummariesHeaders,
          data: getListingTableData(listing),
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        seeDetailsLink={`/listing/${listing.id}/${listing.urlSlug}`}
        detailsLinkClass="float-right"
        tableHeader={listing.showWaitlist ? t("listings.waitlist.open") : null}
      />
    )
  })
}
