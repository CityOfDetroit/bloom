import Head from "next/head"
import {
  ListingsList,
  PageHeader,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
  t,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData, usePrevPage } from "../lib/hooks"

const ListingsPage = () => {
  const router = useRouter()

  /* Pagination state */
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])

  const prevPage = usePrevPage(currentPage)

  useEffect(() => {
    if (currentPage != prevPage) {
      setCurrentPage(1)
    }
  }, [itemsPerPage])

  useEffect(() => {
    // Check if the page actually changed so we don't get stuck in an infinite loop
    if (currentPage != prevPage) {
      void router.push("/listings?page=" + String(currentPage), undefined, { shallow: true })
    }
  }, [currentPage])

  useEffect(() => {
    // Check if the page actually changed so we don't get stuck in an infinite loop
    if (router.query.page && Number(router.query.page) != prevPage) {
      setCurrentPage(Number(router.query.page))
    }
  }, [router.query.page])

  const { listingsData, listingsLoading } = useListingsData(currentPage, itemsPerPage)

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
      {!listingsLoading && (
        <div>
          <ListingsList listings={listingsData?.items} />
          <AgPagination
            totalItems={listingsData?.meta.totalItems}
            totalPages={listingsData?.meta.totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            sticky={true}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}
    </Layout>
  )
}
export default ListingsPage
