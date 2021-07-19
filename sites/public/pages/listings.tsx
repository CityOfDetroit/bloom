import Head from "next/head"
import {
  ListingsList,
  PageHeader,
  AgPagination,
  Button,
  AppearanceSizeType,
  Modal,
  Drawer,
  AppearanceStyleType,
  AppearanceBorderType,
  t,
  Select,
  Form,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { FilterOptions, useListingsData } from "../lib/hooks"

const ListingsPage = () => {
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filterState, setFilterState] = useState<FilterOptions>(null)
  const itemsPerPage = 10

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState<boolean>(false)

  const preferredUnitOptions = ["", "1", "2", "3", "4", "studio"]
  const accessibilityOptions = ["", "n", "y"]
  const communityOptions = ["", "general", "senior", "assisted"]
  const nameOptions = ["", "triton", "coliseum"]

  function setPageData(page: number, filters = filterState) {
    if (page != currentPage || filters != filterState) {
      setCurrentPage(page)
      setFilterState(filters)
      // TODO(abbiefarr): update the url with filter data.
      void router.push(
        {
          pathname: "/listings",
          query: {
            page: page,
          },
        },
        undefined,
        { shallow: true }
      )
    }
  }

  // Checks for changes in url params.
  useEffect(() => {
    if (router.query.page && Number(router.query.page) != currentPage) {
      setCurrentPage(Number(router.query.page))
    }
    // TODO(abbiefarr): update filter params if the url is manually updated.
  }, [router.query])

  const { listingsData, listingsLoading } = useListingsData(currentPage, itemsPerPage, filterState)

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm()
  const onSubmit = (data: FilterOptions) => {
    setFilterModalVisible(false)
    setPageData(/*page=*/ 1, data)
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
        actions={[]}
        hideCloseIcon
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <p className="field-note mb-4">{t("listingFilters.modalHeader")}</p>
            <Select
              id="unitOptions"
              name="preferredUnit"
              label={t("listingFilters.unitOptions.label")}
              register={register}
              controlClassName="control"
              options={preferredUnitOptions}
              keyPrefix="listingFilters.unitOptions.unitOptionsTypes"
              defaultValue={filterState?.preferredUnit}
            />
            <Select
              id="accessibilityOptions"
              name="accessibility"
              label={t("listingFilters.accessibilityOptions.label")}
              register={register}
              controlClassName="control"
              options={accessibilityOptions}
              keyPrefix="listingFilters.accessibilityOptions.accessibilityOptionsTypes"
              defaultValue={filterState?.accessibility}
            />
            <Select
              id="communityOptions"
              name="community"
              label={t("listingFilters.communityOptions.label")}
              register={register}
              controlClassName="control"
              options={communityOptions}
              keyPrefix="listingFilters.communityOptions.communityOptionsTypes"
              defaultValue={filterState?.community}
            />
            <Select
              id="nameOptions"
              name="name"
              label={t("listingFilters.nameOptions.label")}
              register={register}
              controlClassName="control"
              options={nameOptions}
              keyPrefix="listingFilters.nameOptions.nameOptionsTypes"
              defaultValue={filterState?.name}
            />
          </div>
          <div className="text-center mt-6">
            <Button styleType={AppearanceStyleType.primary}>Apply Filters</Button>
          </div>
          <div className="text-center mt-6">
            <a href="#" onClick={() => setFilterModalVisible(false)}>
              {t("t.cancel")}
            </a>
          </div>
        </Form>
      </Modal>
      <Drawer
        open={filterDrawerVisible}
        title="Drawer Title"
        onClose={() => setFilterDrawerVisible(false)}
        actions={[
          <Button
            key={0}
            onClick={() => setFilterDrawerVisible(false)}
            styleType={AppearanceStyleType.primary}
          >
            Submit
          </Button>,
          <Button
            key={1}
            onClick={() => setFilterDrawerVisible(false)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
          >
            Cancel
          </Button>,
        ]}
      >
        <p>Placeholder for future text</p>
      </Drawer>
      <div className="max-w-3xl m-auto">
        <Button size={AppearanceSizeType.small} onClick={() => setFilterModalVisible(true)}>
          {/* TODO:avaleske make this a string */}
          Filter listings
        </Button>
        <Button size={AppearanceSizeType.small} onClick={() => setFilterDrawerVisible(true)}>
          {/* TODO:avaleske make this a string */}
          Filter listings (drawer)
        </Button>
      </div>
      {!listingsLoading && (
        <div>
          {listingsData && <ListingsList listings={listingsData.items} />}
          <AgPagination
            totalItems={listingsData?.meta.totalItems}
            totalPages={listingsData?.meta.totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            quantityLabel={t("applications.totalApplications")}
            setCurrentPage={setPageData}
          />
        </div>
      )}
    </Layout>
  )
}
export default ListingsPage
