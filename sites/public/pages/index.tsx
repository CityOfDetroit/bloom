import React, { useState, useContext } from "react"
import Head from "next/head"
import {
  AlertBox,
  Hero,
  t,
  SiteAlert,
  OneLineAddress,
  imageUrlFromListing,
  NavigationContext,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { ConfirmationModal } from "../src/ConfirmationModal"
import { MetaTags } from "../src/MetaTags"
import { HorizontalScrollSection } from "../lib/HorizontalScrollSection"
import axios from "axios"
import styles from "./index.module.scss"
import { Address, Listing, UnitSummary } from "@bloom-housing/backend-core/types"
import { getGenericAddress } from "../lib/helpers"
import moment from "moment"
import Link from "next/link"
import qs from "qs"

export default function Home({ latestListings }) {
  const blankAlertInfo = {
    alertMessage: null,
    alertType: null,
  }

  const [alertInfo, setAlertInfo] = useState(blankAlertInfo)

  // TODO(https://github.com/CityOfDetroit/bloom/issues/712): avoid concatenating translated strings
  const heroTitle = (
    <>
      {t("welcome.title")} {t("region.name")}
    </>
  )

  const heroInset: React.ReactNode = (
    <div className="hero__inset">
      <div className="hero__text">{t("welcome.heroText")}</div>
      <a href="/listings" className="hero__button__first hero__button">
        {t("welcome.seeRentalListings")}
      </a>
      <a href="/eligibility/welcome" className="hero__button__second hero__button">
        {t("welcome.checkEligibility")}
      </a>
    </div>
  )

  /**
   * Get the listing with the latest 'updatedAt' field and format it
   *
   * TODO(#672): Translate last updated string
   * @param listings
   * @returns
   */
  const getLastUpdatedString = (listings: Array<Listing>) => {
    // Get the latest updateAt date and format it as localized 'MM/D/YYYY'
    const latestDate = moment
      .max(
        listings.map((listing) => {
          return moment(listing.updatedAt)
        })
      )
      .format("l")
    return `Last updated ${latestDate}`
  }

  /**
   * Convert the number of bedrooms to a human readable string
   *
   * TODO(#672): Translate unitBedrooms string
   * @param numBedrooms
   * @param plural
   * @returns
   */
  const unitBedroomsToString = (numBedrooms: number, plural: boolean) => {
    if (numBedrooms < 0 || numBedrooms == null) {
      return ""
    }

    switch (numBedrooms) {
      case 0:
        return plural ? "studios" : "studio"
      case 1:
        return plural ? "1 bedrooms" : "1 bedroom"
      case 2:
        return plural ? "2 bedrooms" : "2 bedroom"
      default:
        return plural ? "3+ bedrooms" : "3+ bedroom"
    }
  }

  /**
   * Build a string of concatenated available units
   *
   * TODO(#672): Translate unit summary string
   *
   * For example: '(1) studio availble, (3) 2 bedrooms available'
   * @param units Array of UnitSummarys
   * @returns string
   */
  const buildUnitSummaryString = (units: Array<UnitsSummary>) => {
    return units
      .filter((unitSummary) => {
        return unitSummary.totalAvailable > 0
      })
      .map((unitSummary) => {
        return `(${unitSummary.totalAvailable}) ${unitBedroomsToString(
          unitSummary.unitType.numBedrooms,
          unitSummary.totalAvailable > 1
        )} available`
      })
      .join(", ")
  }

  interface LatestListingLinkProps {
    listing: Listing
  }
  const linearGradient = "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(24, 37, 42, .8))"
  const LatestListingsLink = (props: LatestListingLinkProps) => (
    <Link href={`/listing/${props.listing.id}/${props.listing.urlSlug}`}>
      <a
        className={styles["latest-listing"]}
        style={{
          backgroundImage: `${linearGradient}, url(${
            imageUrlFromListing(props.listing, 520) || "/images/detroitDefault.png"
          })`,
        }}
      >
        <h3 className={styles["latest-listing__name"]}>{props.listing.name}</h3>
        <p className={styles["latest-listing__address"]}>
          <OneLineAddress address={getGenericAddress(props.listing.buildingAddress)} />
        </p>
        {props.listing.unitsSummary && (
          <div className={styles["latest-listing__availability"]}>
            {buildUnitSummaryString(props.listing.unitsSummary)}
          </div>
        )}
      </a>
    </Link>
  )

  // TODO(#674): Fill out neighborhood buttons with real data
  const NeighborhoodButton = (props: { label: string }) => (
    <a className={styles.neighborhood} href="/listings">
      <p className={styles.neighborhood__text}>{props.label}</p>
    </a>
  )

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image
  const alertClasses = "flex-grow mt-6 max-w-6xl w-full"
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <div className="flex absolute w-full flex-col items-center">
        <SiteAlert type="alert" className={alertClasses} />
        <SiteAlert type="success" className={alertClasses} timeout={30000} />
      </div>
      {alertInfo.alertMessage && (
        <AlertBox
          className=""
          onClose={() => setAlertInfo(blankAlertInfo)}
          type={alertInfo.alertType}
        >
          {alertInfo.alertMessage}
        </AlertBox>
      )}
      <Hero title={heroTitle} backgroundImage={"/images/hero.png"} heroInset={heroInset} />
      {/* TODO(#672): Translate title */}
      <HorizontalScrollSection
        title="Latest listings"
        subtitle={getLastUpdatedString(latestListings.items)}
        scrollAmount={560}
        icon="clock"
        className={styles["latest-listings"]}
      >
        {latestListings.items.map((listing) => {
          return (
            <LatestListingsLink
              key={listing.id}
              listing={listing}
              // name={listing.name}
              // address={listing.buildingAddress}
              // availability={buildUnitSummaryString(listing.unitsSummary)}
              // imageUrl={imageUrlFromListing(listing, 520)}
            />
          )
        })}
      </HorizontalScrollSection>
      {/* TODO(#674): Translate title*/}
      <HorizontalScrollSection
        title="Neighborhoods"
        scrollAmount={311}
        icon="map"
        className={styles.neighborhoods}
      >
        <NeighborhoodButton label="Midtown" />
        <NeighborhoodButton label="Elmwood Park" />
        <NeighborhoodButton label="Islandview" />
        <NeighborhoodButton label="Brightmoor" />
        <NeighborhoodButton label="Fox Creek" />
      </HorizontalScrollSection>
      <ConfirmationModal
        setSiteAlertMessage={(alertMessage, alertType) => setAlertInfo({ alertMessage, alertType })}
      />
    </Layout>
  )
}

export async function getStaticProps() {
  let latestListings = []
  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: {
        limit: 5,
        orderBy: "mostRecentlyUpdated",
        availability: "hasAvailability",
      },
    })
    latestListings = response.data
  } catch (error) {
    console.error(error)
  }
  return { props: { latestListings }, revalidate: process.env.cacheRevalidate }
}
