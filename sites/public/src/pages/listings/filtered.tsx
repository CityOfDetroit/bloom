import Head from "next/head"
import {
  ActionBlock,
  AG_PER_PAGE_OPTIONS,
  AppearanceSizeType,
  Button,
  Drawer,
  Heading,
  LinkButton,
  LoadingOverlay,
  PageHeader,
  t,
} from "@bloom-housing/ui-components"
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import DetroitIcon from "../../components/core/DetroitIcon"
import {
  decodeFiltersFromFrontendUrl,
  encodeToFrontendFilterString,
  FrontendListingFilterStateKeys,
  ListingFilterState,
} from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import { MetaTags } from "../../components/shared/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../../lib/hooks"
import { EnumListingFilterParamsStatus, OrderByFieldsEnum } from "@bloom-housing/backend-core/types"
import FilterForm from "../../components/filters/FilterForm"
import ListingPagination from "../../components/listing/ListingPagination"
import { getListings, removeCommas } from "../../lib/helpers"

const FilteredListingsPage = () => {
  const router = useRouter()

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filterState, setFilterState] = useState<ListingFilterState>()

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)

  function setQueryString(page: number, limit: number, filters = filterState) {
    void router.push(
      `/listings/filtered?page=${page}&limit=${limit}${encodeToFrontendFilterString(filters)}`,
      undefined,
      {
        shallow: true,
      }
    )
  }

  // Checks for changes in url params.
  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page))
    }
    if (router.query.limit) {
      setItemsPerPage(Number(router.query.limit))
    }
    router.query[FrontendListingFilterStateKeys.status] = EnumListingFilterParamsStatus.active
    setFilterState(decodeFiltersFromFrontendUrl(router.query))
  }, [router.query])

  const { listingsData, listingsLoading, listingsError } = useListingsData(
    currentPage,
    itemsPerPage,
    filterState,
    OrderByFieldsEnum.comingSoon,
    "publicListings"
  )

  let numberOfFilters = 0
  if (filterState) {
    numberOfFilters = Object.keys(filterState).filter(
      (p) => p !== "$comparison" && p !== "includeNulls" && p !== "status"
    ).length
    // We want to consider rent as a single filter, so if both min and max are defined, reduce the count.
    if (filterState.minRent !== undefined && filterState.maxRent != undefined) {
      numberOfFilters -= 1
    }
  }

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const onSubmit = (page: number, limit: number, data: ListingFilterState) => {
    // hide status filter
    delete data[FrontendListingFilterStateKeys.status]
    data[FrontendListingFilterStateKeys.minRent] = removeCommas(
      data[FrontendListingFilterStateKeys.minRent]
    )
    data[FrontendListingFilterStateKeys.maxRent] = removeCommas(
      data[FrontendListingFilterStateKeys.maxRent]
    )
    setFilterModalVisible(false)
    setQueryString(page, limit, data)
  }

  let rentalsFoundTitle: string
  if (listingsLoading) {
    rentalsFoundTitle = t("listingFilters.loading")
  } else {
    rentalsFoundTitle = t("listingFilters.rentalsFound", {
      smart_count: listingsData?.meta.totalItems ?? 0,
    })
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader className="listings-title" title={t("pageTitle.rent")} inverse={true} />
      <Drawer
        open={filterModalVisible}
        title={t("listingFilters.modalTitle")}
        onClose={() => setFilterModalVisible(false)}
      >
        <FilterForm
          onSubmit={(data) => onSubmit(1, itemsPerPage, data)}
          filterState={filterState}
          onClose={setFilterModalVisible}
        />
      </Drawer>
      <div className={"bg-gray-300"}>
        <h3 className="max-w-5xl container mx-auto text-3xl text-primary-darker font-bold px-4 pt-6 pb-4">
          {rentalsFoundTitle}
        </h3>
        <div className="flex container content-center max-w-5xl px-4 mx-auto pb-6">
          <Button
            size={AppearanceSizeType.normal}
            icon={faSliders}
            iconPlacement="left"
            iconSize="md-large"
            ariaLabel={
              numberOfFilters
                ? t("listingFilters.buttonTitleWithNumber", { number: numberOfFilters })
                : t("listingFilters.buttonTitle")
            }
            onClick={() => setFilterModalVisible(true)}
          >
            {t("listingFilters.buttonTitle")}
            {numberOfFilters ? (
              <span className={"bg-gray-450 text-gray-750 rounded-full px-2.5 py-1 ml-2"}>
                {numberOfFilters}
              </span>
            ) : null}
          </Button>
          {numberOfFilters > 0 && (
            <Button
              className={"ms-4"}
              size={AppearanceSizeType.normal}
              // "Submit" the form with no params to trigger a reset.
              onClick={() => onSubmit(1, itemsPerPage, {})}
              icon="closeSmall"
              iconPlacement="right"
              iconClass="pl-2 me-0"
              iconSize="small"
            >
              {t("listingFilters.resetButton")}
            </Button>
          )}
        </div>
      </div>

      <LoadingOverlay isLoading={listingsLoading}>
        <>
          {listingsLoading && (
            <div className="container max-w-3xl my-4 px-4 py-10 content-start mx-auto" />
          )}
          {!listingsLoading && !listingsError && listingsData?.meta.totalItems === 0 && (
            <div className="container max-w-5xl my-8 px-4 mx-auto">
              <ActionBlock
                actions={[
                  <LinkButton key={"additional-resources"} href="/additional-resources">
                    {t("listings.additionalResources")}
                  </LinkButton>,
                ]}
                className={"p-8 has-bold-header"}
                background="primary-lighter"
                icon={<DetroitIcon size="2xl" symbol={"houseThin"} />}
                header={<Heading priority={2}>{t("listingFilters.noResults")}</Heading>}
                subheader={t("listingFilters.noResultsSubtitle")}
              />
            </div>
          )}
          {!listingsLoading && listingsData?.meta.totalItems > 0 && (
            <div>
              {listingsData?.meta.totalItems > 0 && getListings(listingsData?.items)}
              <ListingPagination
                totalItems={listingsData?.meta.totalItems}
                totalPages={listingsData?.meta.totalPages}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                quantityLabel={t("listings.totalListings")}
                setCurrentPage={(page) => onSubmit(page, itemsPerPage, filterState)}
                setItemsPerPage={(limit) => onSubmit(1, Number(limit), filterState)}
                includeBorder={false}
                matchListingCardWidth={true}
              />
            </div>
          )}
        </>
      </LoadingOverlay>
    </Layout>
  )
}

export default FilteredListingsPage
