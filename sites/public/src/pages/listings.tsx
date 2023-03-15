import React, { useEffect, useContext, useState } from "react"
import Head from "next/head"
import { AppearanceSizeType, Button, t } from "@bloom-housing/ui-components"
import { Drawer } from "../../../../detroit-ui-components/src/overlays/Drawer"
import { PageHeader } from "../../../../detroit-ui-components/src/headers/PageHeader"
import { AgPagination } from "../../../../detroit-ui-components/src/global/vendor/AgPagination"
import Layout from "../layouts/application"
import { MetaTags } from "../components/shared/MetaTags"
import { useRouter } from "next/router"
import FilterForm from "../components/filters/FilterForm"
import { getListings } from "../lib/helpers"
import { fetchBaseListingData } from "../lib/hooks"
import {
  ListingList,
  pushGtmEvent,
  encodeToFrontendFilterString,
  ListingFilterState,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"

const ListingsPage = ({ initialListings }) => {
  const router = useRouter()

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const { profile } = useContext(AuthContext)
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const onSubmit = (page: number, limit: number, data: ListingFilterState) => {
    setFilterModalVisible(false)
    void router.push(
      `/listings/filtered?page=${page}&limit=${limit}${encodeToFrontendFilterString(data)}`
    )
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
      <PageHeader className="listings-title" title={t("pageTitle.rent")} inverse={true} />
      <Drawer
        open={filterModalVisible}
        title={t("listingFilters.modalTitle")}
        onClose={() => setFilterModalVisible(false)}
        contentAreaClassName={"px-0 pt-0 pb-0 h-full"}
      >
        <FilterForm
          onSubmit={(data) => onSubmit(/*page=*/ 1, 8, data)}
          onClose={setFilterModalVisible}
        />
      </Drawer>

      <div className={"bg-gray-300"}>
        <div className="max-w-5xl flex sm:flex-row flex-col justify-between container mx-auto px-4 py-8  gap-y-2">
          <h2 className="text-3xl text-primary-darker font-bold">
            {t("listingFilters.allRentals")}
          </h2>
          <Button
            className="bg-lush border-lush text-black"
            size={AppearanceSizeType.normal}
            icon="search"
            iconPlacement="left"
            iconSize="md-large"
            onClick={() => setFilterModalVisible(true)}
            passToIconClass={"ui-icon__filledBlack"}
          >
            {t("listingFilters.buttonTitleExtended")}
          </Button>
        </div>
      </div>
      {initialListings?.meta?.totalItems === 0 && (
        <div className="container max-w-5xl my-4 px-4 content-start mx-auto">
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
            itemsPerPage={8}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={(page) => onSubmit(page, 8, {})}
            setItemsPerPage={(limit) => onSubmit(1, Number(limit), {})}
            includeBorder={false}
            matchListingCardWidth={true}
          />
        </div>
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const initialListings = await fetchBaseListingData()
  return { props: { initialListings } }
}

export default ListingsPage
