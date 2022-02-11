import React, { useContext, useEffect, useState } from "react"
import Head from "next/head"
import { HorizontalScrollSection } from "../lib/HorizontalScrollSection"
import axios from "axios"
import styles from "./index.module.scss"
import { Listing } from "@bloom-housing/backend-core/types"
import { getListings } from "../lib/helpers"
import moment from "moment"
import {
  Region,
  regionImageUrls,
} from "@bloom-housing/ui-components/src/helpers/regionNeighborhoodMap"

export default function Home({ latestListings }) {
import { Jurisdiction } from "@bloom-housing/backend-core/types"
import {
  AuthContext,
  AlertBox,
  Hero,
  t,
  SiteAlert,
} from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { ConfirmationModal } from "../src/ConfirmationModal"
import { MetaTags } from "../src/MetaTags"

interface IndexProps {
  jurisdiction: Jurisdiction
}

export default function Home(props: IndexProps) {
  const blankAlertInfo = {
    alertMessage: null,
    alertType: null,
  }
  const { profile } = useContext(AuthContext)
  const [alertInfo, setAlertInfo] = useState(blankAlertInfo)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const heroTitle = <>{t("welcome.title")}</>

  const heroInset: React.ReactNode = (
    <>
      <a href="/listings" className="hero__button__first hero__button">
        {t("welcome.seeRentalListings")}
      </a>
      <a href="/eligibility/welcome" className="hero__button__second hero__button">
        {t("welcome.findRentalsForMe")}
      </a>
    </>
  )

  /**
   * Get the listing with the latest 'updatedAt' field and format it
   *
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
    return t("welcome.lastUpdated", { date: latestDate })
  }

  // TODO(#674): Fill out region buttons with real data
  const RegionButton = (props: { region: [string, Region] }) => (
    <a
      className={styles.region}
      href={`/listings/filtered?page=1&${props.region[0]}=true`}
      style={{ backgroundImage: `url(${regionImageUrls.get(props.region[1])})` }}
    >
      <p className={styles.region__text}>{props.region[1]}</p>
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
      {latestListings && latestListings.items && (
        <HorizontalScrollSection
          title={t("welcome.latestListings")}
          subtitle={getLastUpdatedString(latestListings.items)}
          scrollAmount={560}
          icon="clock"
          className={`${styles["latest-listings"]} latest-listings`}
        >
          {getListings(latestListings.items)}
        </HorizontalScrollSection>
      )}
      <HorizontalScrollSection
        title={t("welcome.cityRegions")}
        scrollAmount={311}
        icon="map"
        className={styles.regions}
      >
        {Object.entries(Region).map((region) => (
          <RegionButton region={region} />
        ))}
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
