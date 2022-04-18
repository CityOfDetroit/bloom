import React, { useEffect, useContext, useState } from "react"
import Head from "next/head"
import {
  PageHeader,
  AgPagination,
  Button,
  AppearanceSizeType,
  t,
  encodeToFrontendFilterString,
  ListingFilterState,
  FrontendListingFilterStateKeys,
  AuthContext,
  Drawer,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import { useRouter } from "next/router"
import FilterForm from "../src/forms/filters/FilterForm"
import { getListings } from "../lib/helpers"
import { fetchBaseListingData } from "../lib/hooks"
import FindRentalsForMeLink from "../lib/FindRentalsForMeLink"
import { ListingList, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"

const ListingsPage = ({ initialListings }) => {
  const router = useRouter()

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const { profile } = useContext(AuthContext)
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const onSubmit = (page: number, data: ListingFilterState) => {
    setFilterModalVisible(false)
    void router.push(`/listings/filtered?page=${page}${encodeToFrontendFilterString(data)}`)
  }
  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: initialListings?.meta?.totalItems,
      listingIds: initialListings?.items?.map((listing) => listing.id),
    })
  }, [profile, initialListings?.meta?.totalItems, initialListings?.items])

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader
        className="listings-title"
        title={t("pageTitle.rent")}
        inverse={true}
        tabNav={<FindRentalsForMeLink title={t("welcome.findRentalsForMe")} />}
      />
      <Drawer
        open={filterModalVisible}
        title={t("listingFilters.modalTitle")}
        onClose={() => setFilterModalVisible(false)}
        contentAreaClassName={"px-0 pt-0"}
      >
        <FilterForm onSubmit={(data) => onSubmit(1, data)} onClose={setFilterModalVisible} />
      </Drawer>
      <div className="flex container content-center max-w-5xl px-4 pt-8 mx-auto">
        <h3 className="text-3xl text-primary-darker font-bold">All rentals</h3>
        <Button
          className="mx-5"
          size={AppearanceSizeType.normal}
          icon="filter"
          iconPlacement="left"
          iconSize="base"
          onClick={() => setFilterModalVisible(true)}
        >
          {t("listingFilters.buttonTitle")}
        </Button>
      </div>
      {initialListings?.meta?.totalItems === 0 && (
        <div className="container max-w-3xl my-4 px-4 content-start mx-auto">
          <header>
            <h2 className="page-header__title">{t("listingFilters.noResults")}</h2>
            <p className="page-header__lead">{t("listingFilters.noResultsSubtitle")}</p>
          </header>
        </div>
      )}
      {initialListings?.meta?.totalItems > 0 && (
        <div>
          {initialListings?.meta?.totalItems > 0 && getListings(initialListings?.items)}
          <AgPagination
            totalItems={initialListings?.meta.totalItems}
            totalPages={initialListings?.meta.totalPages}
            currentPage={1}
            itemsPerPage={10}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={(page) => onSubmit(page, {})}
            includeBorder={false}
            matchListingCardWidth={true}
          />
        </div>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  const initialListings = await fetchBaseListingData()
  return { props: { initialListings }, revalidate: process.env.cacheRevalidate }
}

export default ListingsPage
