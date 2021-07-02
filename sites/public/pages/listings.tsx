import Head from "next/head"
import axios from "axios"
import moment from "moment"
import {
  ListingsGroup,
  ListingsList,
  PageHeader,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
  t,
} from "@bloom-housing/ui-components"
import { Listing, PaginationMeta } from "@bloom-housing/backend-core/types"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import { useEffect, useState, useMemo } from "react"
import { renderToString } from 'react-dom/server'
import { GridOptions, ColumnApi, ColumnState } from "ag-grid-community"
import { useListingsData } from "../lib/hooks"

const ListingsPage = () => {
  const COLUMN_STATE_KEY = "column-state"

  /* Pagination */
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(2/*AG_PER_PAGE_OPTIONS[0]*/)
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)

  const { listingsData } = useListingsData(currentPage, itemsPerPage)
    let listings = listingsData?.items || []
    const listingsMeta = listingsData?.meta

  // Load state on initial render & pagination change (because the new data comes from the API)
  useEffect(() => {
    setCurrentPage(currentPage)
    let { listingsData } = useListingsData(currentPage, itemsPerPage)
    listings = listingsData?.items || []
  }, [currentPage])

  // Reset page to 1 when user change limit
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  function onGridReady(params) {
    setGridColumnApi(params.columnApi)
  }

  function saveColumnState(api: ColumnApi) {
    const columnState = api.getColumnState()
    const columnStateJSON = JSON.stringify(columnState)
    sessionStorage.setItem(COLUMN_STATE_KEY, columnStateJSON)
  }

  class formatListings {
    content: HTMLDivElement

    init({ data }) {
      this.content = document.createElement("div")
      const innerHtml = <ListingsList listings={data} />
      console.log(innerHtml)
      // const innerHtml = data.length > 0 ? (
      //   <ListingsList listings={data} />
      // ) : (
      //   <div className="notice-block">
      //     <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
      //   </div>
      // )
      this.content.innerHTML = renderToString(innerHtml)
    }

    getGui() {
      return this.content
    }
  }

  const gridOptions: GridOptions = {
    onSortChanged: (params) => saveColumnState(params.columnApi),
    onColumnMoved: (params) => saveColumnState(params.columnApi),
    components: {
      formatListings: formatListings,
    },
  }

  const columnDefs = useMemo(
    () => [
      {
        headerName: "listings",
        // field: listings,
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatListings",
      },
    ],
    [listings]
  )

  const openListings = (listings) => {
    return listings.length > 0 ? (
      <ListingsList listings={listings} />
    ) : (
      <div className="notice-block">
        <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
      </div>
    )
  }

  const closedListings = (listings) => {
    return (
      listings.length > 0 && (
        <ListingsGroup
          listings={listings}
          header={t("listings.closedListings")}
          hideButtonText={t("listings.hideClosedListings")}
          showButtonText={t("listings.showClosedListings")}
        />
      )
    )
  }
  
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
      <div>
      <ListingsList listings={listings} />
      <AgPagination
        totalItems={listingsMeta?.totalItems}
        totalPages={listingsMeta?.totalPages}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        quantityLabel={t("applications.totalApplications")}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
      />
      </div>
    </Layout>
  )
}
export default ListingsPage
