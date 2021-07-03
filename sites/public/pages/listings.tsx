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
import { useEffect, useState } from "react"
import { useListingsData } from "../lib/hooks"

const ListingsPage = () => {
  /* Pagination state */
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const { listingsData, listingsLoading } = useListingsData(currentPage, itemsPerPage)

  // Reset page to 1 when user changes items per page.
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])
  
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
      { !listingsLoading && <div>
      <ListingsList listings={listingsData.items} />
      <AgPagination
        totalItems={listingsData.meta.totalItems}
        totalPages={listingsData.meta.totalPages}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        quantityLabel={t("applications.totalApplications")}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
      />
      </div>}
    </Layout>
  )
}
export default ListingsPage
