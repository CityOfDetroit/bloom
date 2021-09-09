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
import { adaCompliantOptions, blankFrontEndFilters, FrontEndFilters } from "../lib/FrontEndFilters"

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
  const [{ filters }, setFilters] = useState<FrontEndFilters>(() => blankFrontEndFilters())

  const itemsPerPage = 10

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)

  function setQueryString(page: number, filters) {
    void router.push(`/listings?page=${page}${encodeToFrontendFilterString(filters)}`, undefined, {
      shallow: true,
    })
  }

  // Checks for changes in url params.
  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page))
    }

    // setFilters(decodeFiltersFromFrontendUrl(router.query))
  }, [router.query])

  const { listingsData, listingsLoading, listingsError } = useListingsData(
    currentPage,
    itemsPerPage,
    filterState
  )

  let numberOfFilters = 0
  if (filterState) {
    numberOfFilters = Object.keys(filters).filter(
      (filterType) => filters[filterType].value !== undefined && filters[filterType].value != ""
    ).length
    // We want to consider rent as a single filter, so if both min and max are defined, reduce the count.
    if (filterState.minRent !== undefined && filterState.maxRent != undefined) {
      numberOfFilters -= 1
    }
  }

  const buttonTitle = numberOfFilters
    ? t("listingFilters.buttonTitleWithNumber", { number: numberOfFilters })
    : t("listingFilters.buttonTitle")

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = (data: Record<string, string>) => {
    for (const filterName in data) {
      if (filters[filterName] !== undefined) {
        filters[filterName].value = data[filterName]
      }
    }
    setFilterModalVisible(false)
    setQueryString(/*page=*/ 1, filters)
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
              id={"availability"}
              name={ListingFilterKeys.availability}
              label={t("listingFilters.availability")}
              register={register}
              controlClassName="control"
              options={filters[ListingFilterKeys.availability].options}
              defaultValue={filters[ListingFilterKeys.availability].value}
            />
            <Select
              id="unitOptions"
              name={ListingFilterKeys.bedrooms}
              label={t("listingFilters.bedrooms")}
              register={register}
              controlClassName="control"
              options={filters[ListingFilterKeys.bedrooms].options}
              defaultValue={filters[ListingFilterKeys.bedrooms].value}
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
              defaultValue={filters[ListingFilterKeys.zipcode].value}
            />
            <label className="field-label">Rent Range</label>
            <div className="flex flex-row">
              <Field
                id="minRent"
                name={ListingFilterKeys.minRent}
                register={register}
                type="number"
                placeholder={t("t.min")}
                prepend="$"
                defaultValue={filterState?.minRent}
              />
              <div className="flex items-center p-3">{t("t.to")}</div>
              <Field
                id="maxRent"
                name={ListingFilterKeys.maxRent}
                register={register}
                type="number"
                placeholder={t("t.max")}
                prepend="$"
                defaultValue={filterState?.maxRent}
              />
            </div>
            <Select
              id="neighborhoodOptions"
              name={ListingFilterKeys.neighborhood}
              label={t("listingFilters.neighborhood")}
              register={register}
              controlClassName="control"
              options={filters[ListingFilterKeys.neighborhood].options}
              defaultValue={filters[ListingFilterKeys.neighborhood].value}
            />
            <Select
              id="adaCompliant"
              name="adaCompliant"
              label={t("listingFilters.adaCompliant")}
              register={register}
              controlClassName="control"
              options={adaCompliantOptions}
            />
            <Select
              id="communityType"
              name="communityType"
              label={t("listingFilters.communityType")}
              register={register}
              controlClassName="control"
              options={filters["communityType"].options}
              defaultValue={filters["communityType"].value}
            />
          </div>
          <div className="text-center mt-6">
            <Button type="submit" styleType={AppearanceStyleType.primary}>
              {t("listingFilters.applyFilters")}
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
          {buttonTitle}
        </Button>
        {numberOfFilters > 0 && (
          <Button
            className="mx-2 mt-6"
            size={AppearanceSizeType.small}
            styleType={AppearanceStyleType.secondary}
            // "Submit" the form with no params to trigger a reset.
            onClick={() => onSubmit({})}
            icon="close"
            iconPlacement="left"
          >
            {t("listingFilters.resetButton")}
          </Button>
        )}
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
