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
  encodeToFrontendFilterString,
  decodeFiltersFromFrontendUrl,
  LinkButton,
  Field,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"
import { ListingFilterKeys, ListingFilterParams } from "@bloom-housing/backend-core/types"

const isValidZipCodeOrEmpty = (value: string) => {
  // Empty strings or whitespace are valid and will reset the filter.
  if (!value.trim()) {
    return true
  }
  let returnValue = true
  value.split(",").forEach((element) => {
    if (!/^[0-9]{5}$/.test(element.trim())) {
      returnValue = false
    }
  })
  return returnValue
}

const ListingsPage = () => {
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filterState, setFilterState] = useState<ListingFilterParams>()
  const itemsPerPage = 10

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)

  // TODO: Select options should come from the database (#252)
  const EMPTY_OPTION = { value: "", label: "" }
  const preferredUnitOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "0", label: t("listingFilters.bedroomsOptions.studioPlus") },
    { value: "1", label: t("listingFilters.bedroomsOptions.onePlus") },
    { value: "2", label: t("listingFilters.bedroomsOptions.twoPlus") },
    { value: "3", label: t("listingFilters.bedroomsOptions.threePlus") },
    { value: "4", label: t("listingFilters.bedroomsOptions.fourPlus") },
  ]
  const accessibilityOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "n", label: "No" },
    { value: "y", label: "Yes" },
  ]
  const communityOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "general", label: "General" },
    { value: "senior", label: "Senior" },
    { value: "assisted", label: "Assisted" },
  ]
  const neighborhoodOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "Foster City", label: "Foster City" },
  ]

  const seniorHousingOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "true", label: t("t.yes") },
    { value: "false", label: t("t.no") },
  ]

  function setQueryString(page: number, filters = filterState) {
    void router.push(`/listings?page=${page}${encodeToFrontendFilterString(filters)}`, undefined, {
      shallow: true,
    })
  }

  // Checks for changes in url params.
  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page))
    }

    setFilterState(decodeFiltersFromFrontendUrl(router.query))
  }, [router.query])

  const { listingsData, listingsLoading, listingsError } = useListingsData(
    currentPage,
    itemsPerPage,
    filterState
  )

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = (data: ListingFilterParams) => {
    setFilterModalVisible(false)
    setQueryString(/*page=*/ 1, data)
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
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <p className="field-note mb-4">{t("listingFilters.modalHeader")}</p>
            <Select
              id="unitOptions"
              name={ListingFilterKeys.bedrooms}
              label={t("listingFilters.bedrooms")}
              register={register}
              controlClassName="control"
              options={preferredUnitOptions}
              defaultValue={filterState?.bedrooms?.toString()}
            />
            <Field
              id="zipCodeField"
              name={ListingFilterKeys.zipcode}
              label={t("listingFilters.zipCode")}
              register={register}
              controlClassName="control"
              placeholder={t("listingFilters.zipCodeDescription")}
              validation={{
                validate: (value) => isValidZipCodeOrEmpty(value),
              }}
              error={errors.zipCodeField}
              errorMessage={t("errors.multipleZipCodeError")}
              defaultValue={filterState?.zipcode}
            />
            <Select
              id="neighborhoodOptions"
              name={ListingFilterKeys.neighborhood}
              label={t("listingFilters.neighborhood")}
              register={register}
              controlClassName="control"
              options={neighborhoodOptions}
              defaultValue={filterState?.neighborhood}
            />
            <Select
              id="accessibilityOptions"
              name="accessibility"
              label="Accessibility"
              register={register}
              controlClassName="control"
              options={accessibilityOptions}
            />
            <Select
              id="communityOptions"
              name="community"
              label="Community Type"
              register={register}
              controlClassName="control"
              options={communityOptions}
            />
            <Select
              id="seniorHousing"
              name="seniorHousing"
              label={t("listingFilters.seniorHousing")}
              register={register}
              options={seniorHousingOptions}
            />
          </div>
          <div className="text-center mt-6">
            <Button type="submit" styleType={AppearanceStyleType.primary}>
              Apply Filters
            </Button>
          </div>
        </Form>
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
      {!listingsLoading && !listingsError && listingsData?.meta.totalItems === 0 && (
        <div className="container max-w-3xl my-4 px-4 content-start mx-auto">
          <header>
            <h2 className="page-header__title">{t("listingFilters.noResults")}</h2>
            <p className="page-header__lead">{t("listingFilters.noResultsSubtitle")}</p>
          </header>
        </div>
      )}
      {!listingsLoading && (
        <div>
          {listingsData?.meta.totalItems > 0 && (
            <ListingsList listings={listingsData.items} hideApplicationStatus />
          )}
          <AgPagination
            totalItems={listingsData?.meta.totalItems}
            totalPages={listingsData?.meta.totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={setQueryString}
          />
        </div>
      )}
    </Layout>
  )
}
export default ListingsPage
