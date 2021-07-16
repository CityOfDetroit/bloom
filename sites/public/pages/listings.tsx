import Head from "next/head"
import axios from "axios"
import moment from "moment"
import {
  ListingsGroup,
  ListingsList,
  PageHeader,
  openDateState,
  Button,
  AppearanceSizeType,
  Modal,
  Drawer,
  AppearanceStyleType,
  AppearanceBorderType,
  t,
  Select,
} from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Form } from "@bloom-housing/ui-components/src/forms/Form"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
}

const openListings = (listings) => {
  return listings.length > 0 ? (
    <ListingsList listings={listings} />
  ) : (
    <div className="notice-block">
      <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
    </div>
  )
}

const closedListings = (listings) => {
  return (
    listings.length > 0 && (
      <ListingsGroup
        listings={listings}
        header={t("listings.closedListings")}
        hideButtonText={t("listings.hideClosedListings")}
        showButtonText={t("listings.showClosedListings")}
      />
    )
  )
}

export default function ListingsPage(props: ListingsProps) {
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState<boolean>(false)

  const preferredUnitOptions = ["1", "2", "3", "4", "studio"]
  const accessibilityOptions = ["n", "y"]
  const communityOptions = ["general", "senior", "assisted"]
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm()
  const onSubmit = () => {
    // Not yet implemented.
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
        title={t("listingFilters.modelTitle")}
        actions={[
          <Button
            onClick={() => setFilterModalVisible(false)}
            styleType={AppearanceStyleType.primary}
          >
            Apply
          </Button>,
          <Button
            onClick={() => setFilterModalVisible(false)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
          >
            Close
          </Button>,
        ]}
        hideCloseIcon
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <p className="field-note mb-4">{t("listingFilters.modelHeader")}</p>
            <Select
              id="filter.unitOptions"
              name="filter.unitOptions"
              label={t("listingFilters.unitOptions.label")}
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              options={preferredUnitOptions}
              keyPrefix="listingFilters.unitOptions.unitOptionsTypes"
            />
            <Select
              id="filter.accessibilityOptions"
              name="filter.accessibilityOptions"
              label={t("listingFilters.accessibilityOptions.label")}
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              options={accessibilityOptions}
              keyPrefix="listingFilters.accessibilityOptions.accessibilityOptionsTypes"
            />
            <Select
              id="filter.communityOptions"
              name="filter.communityOptions"
              label={t("listingFilters.communityOptions.label")}
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              options={communityOptions}
              keyPrefix="listingFilters.communityOptions.communityOptionsTypes"
            />
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
      <div>
        {openListings(props.openListings)}
        {closedListings(props.closedListings)}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  let openListings = []
  let closedListings = []

  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: { page: "1", limit: "10" },
    })
    const nowTime = moment()
    openListings = response.data.items.filter((listing: Listing) => {
      return (
        openDateState(listing) ||
        nowTime <= moment(listing.applicationDueDate) ||
        listing.applicationDueDate == null
      )
    })
    closedListings = response.data.items.filter((listing: Listing) => {
      return nowTime > moment(listing.applicationDueDate)
    })
  } catch (error) {
    console.error(error)
  }

  return { props: { openListings, closedListings } }
}
