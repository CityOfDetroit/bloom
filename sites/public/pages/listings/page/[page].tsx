import Head from "next/head"
import axios, { AxiosResponse } from "axios"
import { ListingsList, PageHeader, t } from "@bloom-housing/ui-components"
import { Listing, PaginatedListings } from "@bloom-housing/backend-core/types"
import Layout from "../../../layouts/application"
import { MetaTags } from "../../../src/MetaTags"

export interface ListingsProps {
  listings: Listing[]
}

const openListings = (listings) => {
  return listings.length > 0 ? (
    <ListingsList listings={listings} />
  ) : (
    <div className="notice-block">
      <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
    </div>
  )
}

export default function ListingsPage(props: ListingsProps) {
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />
      <div>{openListings(props.listings)}</div>
    </Layout>
  )
}

export async function getStaticPaths(context: { locales: Array<string> }) {
  try {
    const response: AxiosResponse<PaginatedListings> = await axios.get(
      process.env.listingServiceUrl,
      {
        // TODO: Think about making this limit configurable.
        params: { page: "1", limit: "10" },
      }
    )

    /**
     * We want to return an array inside paths that contains an entry for each combination
     * of locale and page number. So we create an array that goes from 1 .. totalPages and
     * map that with locales.
     */
    return {
      paths: context.locales.flatMap((locale: string) =>
        Array.from({ length: response.data.meta.totalPages }, (_, index) => index + 1).map(
          (currentPage: number) => ({
            params: { page: currentPage.toString() },
            locale: locale,
          })
        )
      ),
      fallback: false,
    }
  } catch (e) {
    return {
      paths: [],
      fallback: false,
    }
  }
}

export async function getStaticProps(context: { params: Record<string, string> }) {
  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: { page: context.params.page, limit: "10" },
    })
    return { props: { listings: response.data.items } }
  } catch (error) {
    console.error(error)
  }

  return { props: { listings: [] } }
}
