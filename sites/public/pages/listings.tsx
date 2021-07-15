import Head from "next/head"
import {
  ListingsList,
  PageHeader,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
  Button,
  AppearanceSizeType,
  t,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"

const ListingsPage = () => {
  const router = useRouter()

  /* Pagination state */
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [filterState, setFilterState] = useState<string>(null)
  
  function setPage(page: number) {
    if (page != currentPage) {
      setCurrentPage(page)
      void router.push(
        {
          pathname: "/listings",
          query: { 
            page: page,
            neighborhood: filterState },
        },
        undefined,
        { shallow: true }
      )  
    } 
  }

  useEffect(() => {
    if (currentPage != 1) {
      setPage(1)
    }
  }, [itemsPerPage])

  // Checks if the url is updated manually.
  useEffect(() => {
    if (router.query.page && Number(router.query.page) != currentPage) {
      setCurrentPage(Number(router.query.page))
    } else if (router.query.neighborhood && router.query.neighborhood != filterState) {
      
    }
  }, [router.query])

  function toggleFilter() {
    if (!filterState) {
      setFilterState("Foster City")
    } else {
      setFilterState(null)
    }
    setPage(1)
  }

  const { listingsData, listingsLoading } = useListingsData(currentPage, itemsPerPage, filterState)

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
          <div className="max-w-3xl m-auto">
            <Button size={AppearanceSizeType.small} onClick={toggleFilter}>
              {filterState ? "Remove filter" : "Filter to Foster City"}
            </Button>
          </div>
          {listingsData && <ListingsList listings={listingsData.items} />}
          <AgPagination
            totalItems={listingsData?.meta.totalItems}
            totalPages={listingsData?.meta.totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            quantityLabel={t("applications.totalApplications")}
            setCurrentPage={setPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}
    </Layout>
  )
}
export default ListingsPage
