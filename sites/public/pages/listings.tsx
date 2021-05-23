import Head from "next/head"
import axios from "axios"
import moment from "moment"
import {
  ListingsGroup,
  ListingsList,
  PageHeader,
  openDateState,
  t,
} from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import { useState } from "react"

export interface ListingsProps {
  listings: Listing[]
}

const listingsList = (listings) => {
  return listings.length > 0 ? (
    <ListingsList listings={listings} />
  ) : (
    <div className="notice-block">
      <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
    </div>
  )
}

export default function ListingsPage(props: ListingsProps) {
  const [openClosedValue, setOpenClosedValue] = useState("All")
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image
  const [listingsToShow, setListingsToShow] = useState(props.listings)

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOpenClosedValue(event.target.value as string)
    const nowTime = moment()
    switch (event.target.value) {
      case "Open":
        setListingsToShow(
          props.listings.filter((listing: Listing) => {
            return (
              openDateState(listing) ||
              nowTime <= moment(listing.applicationDueDate) ||
              listing.applicationDueDate == null
            )
          })
        )
        break
      case "Closed":
        setListingsToShow(
          props.listings.filter((listing: Listing) => {
            return nowTime > moment(listing.applicationDueDate)
          })
        )
        break
      default:
        setListingsToShow(props.listings)
        break
    }
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />
      <div className="notice-block">
        <Select value={openClosedValue} onChange={handleChange} displayEmpty>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="Closed">Closed</MenuItem>
        </Select>
      </div>
      <div>{listingsList(listingsToShow)}</div>
    </Layout>
  )
}

export async function getStaticProps() {
  let listings = []

  try {
    const response = await axios.get(process.env.listingServiceUrl)
    listings = response.data
  } catch (error) {
    console.error(error)
  }

  return { props: { listings } }
}
