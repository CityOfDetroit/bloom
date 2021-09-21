import Head from "next/head"
import {
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
  FrontendFilterState,
  blankFrontendFilters,
  adaCompliantOptions,
  imageUrlFromListing,
  getSummariesTableFromUnitsSummary,
  getSummariesTableFromUnitSummary,
  ListingCard,
  LoadingOverlay,
  FrontendFilterKey,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"
import { OrderByFieldsEnum, Listing, Address } from "@bloom-housing/backend-core/types"

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

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

const getListingTableData = (listing: Listing) => {
  if (listing.unitsSummary !== undefined && listing.unitsSummary.length > 0) {
    return getSummariesTableFromUnitsSummary(listing.unitsSummary)
  } else if (listing.unitsSummarized !== undefined) {
    return getSummariesTableFromUnitSummary(listing.unitsSummarized.byUnitTypeAndRent)
  }
  return []
}

const getListings = (listings: Listing[]) => {
  const unitSummariesHeaders = {
    unitType: t("t.unitType"),
    rent: t("t.rent"),
    availability: t("t.availability"),
  }
  return listings.map((listing: Listing, index) => {
    return (
      <ListingCard
        key={index}
        imageCardProps={{
          imageUrl:
            imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize || "1302")) || "",
          subtitle: getListingCardSubtitle(listing.buildingAddress),
          title: listing.name,
          href: `/listing/${listing.id}/${listing.urlSlug}`,
          tagLabel: listing.reservedCommunityType
            ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
            : undefined,
        }}
        tableProps={{
          headers: unitSummariesHeaders,
          data: getListingTableData(listing),
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        seeDetailsLink={`/listing/${listing.id}/${listing.urlSlug}`}
        detailsLinkClass="float-right"
        tableHeader={listing.showWaitlist ? t("listings.waitlist.open") : null}
      />
    )
  })
}

const ListingsPage = () => {
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filterState, setFilterState] = useState<FrontendFilterState>(() => blankFrontendFilters())

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

    setFilterState(decodeFiltersFromFrontendUrl(router.query))
  }, [router.query])

  // Fetches the listing data.
  const { listingsData, listingsLoading, listingsError } = useListingsData(
    currentPage,
    itemsPerPage,
    filterState.filters,
    OrderByFieldsEnum.mostRecentlyUpdated
  )

  const numberOfFilters = filterState.getFilterCount()

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
    for (const filterKey in data) {
      if (filterState.filters[filterKey] !== undefined) {
        filterState.setValue(FrontendFilterKey[filterKey], data[filterKey])
      }
    }
    setFilterModalVisible(false)
    setQueryString(/*page=*/ 1, filterState.filters)
  }

  function resetFilters() {
    setQueryString(1, blankFrontendFilters().filters)
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
              name={FrontendFilterKey.availability}
              label={t("listingFilters.availability")}
              register={register}
              controlClassName="control"
              options={filterState.filters[FrontendFilterKey.availability].selectOptions()}
              defaultValue={filterState.filters[FrontendFilterKey.availability].value}
            />
            <Select
              id="unitOptions"
              name={FrontendFilterKey.bedrooms}
              label={t("listingFilters.bedrooms")}
              register={register}
              controlClassName="control"
              options={filterState.filters[FrontendFilterKey.bedrooms].selectOptions()}
              defaultValue={filterState.filters[FrontendFilterKey.bedrooms].value}
            />
            <Field
              id="zipCodeField"
              name={FrontendFilterKey.zipcode}
              label={t("listingFilters.zipCode")}
              register={register}
              controlClassName="control"
              placeholder={t("listingFilters.zipCodeDescription")}
              validation={{
                validate: (value) => isValidZipCodeOrEmpty(value),
              }}
              error={errors?.[FrontendFilterKey.zipcode]}
              errorMessage={t("errors.multipleZipCodeError")}
              defaultValue={filterState.filters[FrontendFilterKey.zipcode].value}
            />
            <label className="field-label">Rent Range</label>
            <div className="flex flex-row">
              <Field
                id="minRent"
                name={FrontendFilterKey.minRent}
                register={register}
                type="number"
                placeholder={t("t.min")}
                prepend="$"
                defaultValue={filterState.filters[FrontendFilterKey.minRent].value}
              />
              <div className="flex items-center p-3">{t("t.to")}</div>
              <Field
                id="maxRent"
                name={FrontendFilterKey.maxRent}
                register={register}
                type="number"
                placeholder={t("t.max")}
                prepend="$"
                defaultValue={filterState.filters[FrontendFilterKey.maxRent].value}
              />
            </div>
            <Select
              id="adaCompliant"
              name="adaCompliant"
              label={t("listingFilters.adaCompliant")}
              register={register}
              controlClassName="control"
              options={adaCompliantOptions()}
            />
            <Select
              id="communityType"
              name={FrontendFilterKey.communityType}
              label={t("listingFilters.communityType")}
              register={register}
              controlClassName="control"
              options={filterState.filters[FrontendFilterKey.communityType].selectOptions()}
              defaultValue={filterState.filters[FrontendFilterKey.communityType].value}
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
            onClick={() => resetFilters()}
            icon="close"
            iconPlacement="left"
          >
            {t("listingFilters.resetButton")}
          </Button>
        )}
      </div>
      <LoadingOverlay isLoading={listingsLoading}>
        <>
          {listingsLoading && (
            <div className="container max-w-3xl my-4 px-4 py-10 content-start mx-auto" />
          )}
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
              {listingsData?.meta.totalItems > 0 && getListings(listingsData?.items)}
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
        </>
      </LoadingOverlay>
    </Layout>
  )
}
export default ListingsPage
