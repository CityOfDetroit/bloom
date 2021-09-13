import Head from "next/head"
import axios from "axios"
import {
  PageHeader,
  AgPagination,
  Button,
  AppearanceSizeType,
  Modal,
  t,
  LinkButton,
  encodeToFrontendFilterString,
} from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import { MetaTags } from "../../src/MetaTags"
import React, { useState } from "react"
import { useRouter } from "next/router"
import {
  EnumListingFilterParamsComparison,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"
import FilterForm from "../../src/forms/filters/FilterForm"
import { getListings } from "../../lib/helpers"

const emptyFilters: ListingFilterParams = {
  $comparison: EnumListingFilterParamsComparison.NA,
}

const ListingsPage = ({ initialListings }) => {
  const router = useRouter()

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const onSubmit = (page: number, filters: ListingFilterParams) => {
    setFilterModalVisible(false)
    router.push(`/listings/filtered?page=${page}${encodeToFrontendFilterString(filters)}`)
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />
      <Modal
        open={filterModalVisible}
        title={t("listingFilters.modalTitle")}
        onClose={() => setFilterModalVisible(false)}
      >
        <FilterForm onSubmit={(data) => onSubmit(/*page=*/ 1, data)} />
      </Modal>
      <div className="container max-w-3xl px-4 content-start mx-auto">
        <LinkButton
          className="mx-2 mt-6"
          size={AppearanceSizeType.small}
          href="/eligibility/welcome"
        >
          {t("welcome.checkEligibility")}
        </LinkButton>
        <Button
          className="mx-2 mt-6"
          size={AppearanceSizeType.small}
          onClick={() => setFilterModalVisible(true)}
        >
          {t("listingFilters.buttonTitle")}
        </Button>
      </div>
      {initialListings?.meta.totalItems === 0 && (
        <div className="container max-w-3xl my-4 px-4 content-start mx-auto">
          <header>
            <h2 className="page-header__title">{t("listingFilters.noResults")}</h2>
            <p className="page-header__lead">{t("listingFilters.noResultsSubtitle")}</p>
          </header>
        </div>
      )}
      {initialListings?.meta.totalItems > 0 && (
        <div>
          {initialListings?.meta.totalItems > 0 && getListings(initialListings?.items)}
          <AgPagination
            totalItems={initialListings?.meta.totalItems}
            totalPages={initialListings?.meta.totalPages}
            currentPage={1}
            itemsPerPage={10}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={(page) => onSubmit(page, emptyFilters)}
          />
        </div>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  let initialListings = []
  try {
    const response = await axios.get(`${process.env.listingServiceUrl}?page=1?limit=10`)
    initialListings = response.data
  } catch (error) {
    console.error(error)
  }
  return { props: { initialListings } }
}

export default ListingsPage
