import Head from "next/head"
import {
  ListingsList,
  PageHeader,
  AgPagination,
  Button,
  AppearanceSizeType,
  Modal,
  AppearanceStyleType,
  t,
  Select,
  Form,
  SelectOption,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"
import { FilterKeys, ListingFilterParams } from "@bloom-housing/backend-core/types"

const ListingsPage = () => {
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filterState, setFilterState] = useState<ListingFilterParams>()
  const itemsPerPage = 10

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)

  // TODO: Select options should come from the database (#252)
  const neighborhoodOptions: SelectOption[] = [
    { value: "", label: "" },
    { value: "Foster City", label: "Foster City" },
  ]

  function setPageAndFilterState(page: number, filters = filterState) {
    if (page != currentPage || filters != filterState) {
      setCurrentPage(page)
      setFilterState(filters)
      // TODO(abbiefarr): update the url with filter data (#240)
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
    // TODO(abbiefarr): update filter params if the url is manually updated (#240)
  }, [router.query])

  const { listingsData, listingsLoading } = useListingsData(currentPage, itemsPerPage, filterState)

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm()
  const onSubmit = (data: ListingFilterParams) => {
    setFilterModalVisible(false)
    setPageAndFilterState(/*page=*/ 1, data)
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
              id="neighborhoodOptions"
              name={FilterKeys.neighborhood}
              label={t("listingFilters.neighborhood")}
              register={register}
              controlClassName="control"
              options={neighborhoodOptions}
              defaultValue={filterState?.neighborhood}
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
      <div className="max-w-3xl m-auto">
        <Button size={AppearanceSizeType.small} onClick={() => setFilterModalVisible(true)}>
          {/* TODO:avaleske make this a string */}
          Filter listings
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
            setCurrentPage={setPageAndFilterState}
          />
        </div>
      )}
    </Layout>
  )
}
export default ListingsPage
