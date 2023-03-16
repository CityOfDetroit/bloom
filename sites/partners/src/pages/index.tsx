import React, { useMemo, useContext, useState, useEffect } from "react"
import Head from "next/head"
import { ListingStatus } from "@bloom-housing/backend-core/types"
import { t, LocalizedLink, SiteAlert, AppearanceStyleType } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { Button } from "../../../../detroit-ui-components/src/actions/Button"
import { PageHeader } from "../../../../detroit-ui-components/src/headers/PageHeader"
import { AgTable, useAgTable } from "../../../../detroit-ui-components/src/tables/AgTable"
import dayjs from "dayjs"
import { ColDef, ColGroupDef } from "ag-grid-community"
import { useListingsData, useListingZip } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../../src/components/shared/MetaTags"
import { faFileExport } from "@fortawesome/free-solid-svg-icons"
import { AlertBox } from "../../../../detroit-ui-components/src/notifications/AlertBox"

class formatLinkCell {
  link: HTMLAnchorElement

  init(params) {
    this.link = document.createElement("a")
    this.link.classList.add("text-blue-700")
    this.link.innerText = params.valueFormatted || params.value
    this.link.setAttribute("href", `/listings/${params.data.id}/`)
  }

  getGui() {
    return this.link
  }
}

class formatWaitlistStatus {
  text: HTMLSpanElement

  init({ data }) {
    const isWaitlistOpen = data.waitlistCurrentSize < data.waitlistMaxSize

    this.text = document.createElement("span")
    this.text.innerHTML = isWaitlistOpen ? t("t.yes") : t("t.no")
  }

  getGui() {
    return this.text
  }
}
class ListingsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", `/listings/${params.data.id}`)
  }
}

export default function ListingsList() {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const [errorAlert, setErrorAlert] = useState(false)
  const { profile } = useContext(AuthContext)
  const isAdmin = profile?.roles?.isAdmin || false

  const tableOptions = useAgTable()

  const { onExport, zipCompleted, zipExportLoading, zipExportError } = useListingZip()
  useEffect(() => {
    setErrorAlert(zipExportError)
  }, [zipExportError])

  const gridComponents = {
    formatLinkCell,
    formatWaitlistStatus,
    ListingsLink,
  }

  const columnDefs = useMemo(() => {
    const columns: (ColDef | ColGroupDef)[] = [
      {
        headerName: t("listings.listingName"),
        field: "name",
        sortable: true,
        unSortIcon: true,
        sort: "asc",
        filter: false,
        cellRenderer: "formatLinkCell",
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: t("listings.buildingAddress"),
        field: "buildingAddress.street",
        sortable: false,
        filter: false,
        width: 350,
        minWidth: 100,
        valueFormatter: ({ value }) => (value ? value : t("t.none")),
      },
      {
        headerName: t("listings.listingStatusText"),
        field: "status",
        sortable: true,
        unSortIcon: true,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: ({ value }) => {
          switch (value) {
            case ListingStatus.active:
              return t("t.public")
            case ListingStatus.pending:
              return t("t.draft")
            case ListingStatus.closed:
              return t("listings.closed")
            default:
              return ""
          }
        },
      },
      {
        headerName: t("listings.verified"),
        field: "isVerified",
        colId: "verified",
        sortable: true,
        unSortIcon: true,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: ({ value }) => (value ? t("t.yes") : t("t.no")),
      },
      {
        headerName: t("listing.lastUpdated"),
        field: "updatedAt",
        sortable: true,
        filter: false,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
      },
    ]
    return columns
  }, [])

  const { listingDtos, listingsLoading } = useListingsData({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
    listingIds: !isAdmin
      ? profile?.leasingAgentInListings?.map((listing) => listing.id)
      : undefined,
    sort: tableOptions.sort.sortOptions,
    view: "partnerList",
  })
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitlePartners")} description={metaDescription} />
      <PageHeader title={t("nav.listings")} className={"realtive md:pt-16"}>
        {zipCompleted && (
          <div className="flex absolute right-4 z-50 flex-col items-center">
            <SiteAlert
              dismissable
              timeout={5000}
              sticky={true}
              alertMessage={{ message: t("listings.exportSuccess"), type: "success" }}
            />
          </div>
        )}
      </PageHeader>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          {errorAlert && (
            <AlertBox
              className="mb-8"
              onClose={() => setErrorAlert(false)}
              closeable
              type="alert"
              inverted
            >
              {t("errors.alert.exportFailed")}
            </AlertBox>
          )}
          <AgTable
            id="listings-table"
            pagination={{
              perPage: tableOptions.pagination.itemsPerPage,
              setPerPage: tableOptions.pagination.setItemsPerPage,
              currentPage: tableOptions.pagination.currentPage,
              setCurrentPage: tableOptions.pagination.setCurrentPage,
            }}
            config={{
              gridComponents,
              columns: columnDefs,
              totalItemsLabel: t("listings.totalListings"),
            }}
            data={{
              items: listingDtos?.items,
              loading: listingsLoading,
              totalItems: listingDtos?.meta.totalItems,
              totalPages: listingDtos?.meta.totalPages,
            }}
            search={{
              setSearch: tableOptions.filter.setFilterValue,
            }}
            sort={{
              setSort: tableOptions.sort.setSortOptions,
            }}
            headerContent={
              <div className="flex-row">
                {isAdmin && (
                  <div className="flex-row">
                    <LocalizedLink href={`/listings/add`}>
                      <Button
                        className="mx-1"
                        styleType={AppearanceStyleType.primary}
                        onClick={() => false}
                      >
                        {t("listings.addListing")}
                      </Button>
                    </LocalizedLink>
                    <Button
                      className="mx-1"
                      dataTestId="export-listings"
                      onClick={() => onExport()}
                      icon={!zipExportLoading ? faFileExport : null}
                      iconSize="medium"
                      iconPlacement="right"
                      loading={zipExportLoading}
                    >
                      {t("t.exportToCSV")}
                    </Button>
                  </div>
                )}
              </div>
            }
          />
        </article>
      </section>
    </Layout>
  )
}
