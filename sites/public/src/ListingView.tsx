import React from "react"
import ReactDOMServer from "react-dom/server"
import Markdown from "markdown-to-jsx"
import moment from "moment"
import {
  ApplicationMethod,
  ApplicationMethodType,
  Listing,
  ListingApplicationAddressType,
  ListingEvent,
  ListingEventType,
} from "@bloom-housing/backend-core/types"
import {
  AdditionalFees,
  Description,
  FavoriteButton,
  GetApplication,
  GroupedTable,
  Heading,
  ImageCard,
  InfoCard,
  LeasingAgent,
  ListSection,
  ListingDetailItem,
  ListingDetails,
  ListingMap,
  ListingUpdated,
  OneLineAddress,
  OpenHouseEvent,
  ReferralApplication,
  StandardTable,
  SubmitApplication,
  Waitlist,
  WhatToExpect,
  t,
} from "@bloom-housing/ui-components"
import {
  cloudinaryPdfFromId,
  imageUrlFromListing,
  occupancyTable,
} from "@bloom-housing/shared-helpers"
import dayjs from "dayjs"
import { ErrorPage } from "../pages/_error"
import {
  getGenericAddress,
  getHmiSummary,
  getImageCardTag,
  getListingTag,
  getListingTags,
  getUnitGroupSummary,
  openInFuture,
} from "../lib/helpers"

interface ListingProcessProps {
  listing: Listing
  openHouseEvents: ListingEvent[]
  applicationsClosed: boolean
  hasNonReferralMethods: boolean
  applySidebar: () => JSX.Element
}

interface ListingProps {
  listing: Listing
  preview?: boolean
  allowFavoriting?: boolean
}

export const ListingProcess = (props: ListingProcessProps) => {
  const {
    listing,
    openHouseEvents,
    applicationsClosed,
    hasNonReferralMethods,
    applySidebar,
  } = props

  return (
    <aside className="w-full static md:me-8 md:ms-2 md:border-r md:border-l md:border-b border-gray-400 bg-white text-gray-750">
      <ListingUpdated listingUpdated={listing.updatedAt} />
      {openHouseEvents && <OpenHouseEvent events={openHouseEvents} />}
      {!applicationsClosed && (
        <Waitlist
          isWaitlistOpen={listing.isWaitlistOpen}
          waitlistMaxSize={listing.waitlistMaxSize}
          waitlistCurrentSize={listing.waitlistCurrentSize}
          waitlistOpenSpots={listing.waitlistOpenSpots}
        />
      )}
      {hasNonReferralMethods && !applicationsClosed && applySidebar()}
      {listing?.referralApplication && (
        <ReferralApplication
          phoneNumber={
            listing.referralApplication.phoneNumber ||
            t("application.referralApplication.phoneNumber")
          }
          description={
            listing.referralApplication.externalReference ||
            t("application.referralApplication.instructions")
          }
          title={t("application.referralApplication.furtherInformation")}
        />
      )}
      {openHouseEvents && (
        <div className="mb-2 md:hidden">
          <OpenHouseEvent events={openHouseEvents} />
        </div>
      )}
      <WhatToExpect
        content={listing.whatToExpect}
        expandableContent={listing.whatToExpectAdditionalText}
      />
      <LeasingAgent
        listing={listing}
        managementCompany={{
          name: listing.managementCompany,
          website: listing.managementWebsite,
        }}
      />
      {listing.neighborhood && (
        <section className="hidden md:block aside-block">
          <h4 className="text-caps-underline">{t("listings.sections.neighborhoodTitle")}</h4>
          <p>{listing.neighborhood}</p>
        </section>
      )}
    </aside>
  )
}

export const ListingView = (props: ListingProps) => {
  const { listing } = props

  const appOpenInFuture = openInFuture(listing)
  const hasNonReferralMethods = listing?.applicationMethods
    ? listing.applicationMethods.some((method) => method.type !== ApplicationMethodType.Referral)
    : false

  if (!listing) {
    return <ErrorPage />
  }

  const oneLineAddress = <OneLineAddress address={getGenericAddress(listing.buildingAddress)} />

  const googleMapsHref =
    "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)

  const { headers: groupedUnitHeaders, data: groupedUnitData } = getUnitGroupSummary(listing)

  const { headers: hmiHeaders, data: hmiData } = getHmiSummary(listing)

  const occupancyData = occupancyTable(listing)

  let openHouseEvents: ListingEvent[] | null = null
  if (Array.isArray(listing.events)) {
    listing.events.forEach((event) => {
      switch (event.type) {
        case ListingEventType.openHouse:
          if (!openHouseEvents) {
            openHouseEvents = []
          }
          openHouseEvents.push(event)
          break
      }
    })
  }
  const shouldShowFeaturesDetail = () => {
    return (
      listing.neighborhood ||
      listing.region ||
      listing.yearBuilt ||
      listing.smokingPolicy ||
      listing.petPolicy ||
      listing.amenities ||
      listing.unitAmenities ||
      listing.servicesOffered ||
      listing.accessibility ||
      // props for UnitTables
      (listing.units && listing.units.length > 0) ||
      listing.unitSummaries ||
      // props for AdditionalFees
      listing.depositMin ||
      listing.depositMax ||
      listing.applicationFee ||
      listing.costsNotIncluded
    )
  }

  // TODO: Move the below methods into our shared helper library when setup
  const hasMethod = (applicationMethods: ApplicationMethod[], type: ApplicationMethodType) => {
    return applicationMethods.some((method) => method.type == type)
  }

  const getMethod = (applicationMethods: ApplicationMethod[], type: ApplicationMethodType) => {
    return applicationMethods.find((method) => method.type == type)
  }

  type AddressLocation = "dropOff" | "pickUp" | "mailIn"

  const addressMap = {
    dropOff: listing.applicationDropOffAddress,
    pickUp: listing.applicationPickUpAddress,
    mailIn: listing.applicationMailingAddress,
  }

  const getAddress = (
    addressType: ListingApplicationAddressType | undefined,
    location: AddressLocation
  ) => {
    if (addressType === ListingApplicationAddressType.leasingAgent) {
      return listing.leasingAgentAddress
    }
    return addressMap[location]
  }

  const getOnlineApplicationURL = () => {
    let onlineApplicationURL
    // Disabling common application
    // if (hasMethod(listing.applicationMethods, ApplicationMethodType.Internal)) {
    //   onlineApplicationURL = `/applications/start/choose-language?listingId=${listing.id}`
    // } else
    if (hasMethod(listing.applicationMethods, ApplicationMethodType.ExternalLink)) {
      onlineApplicationURL =
        getMethod(listing.applicationMethods, ApplicationMethodType.ExternalLink)
          ?.externalReference || ""
    }
    return onlineApplicationURL
  }

  const getPaperApplications = () => {
    return (
      getMethod(listing.applicationMethods, ApplicationMethodType.FileDownload)
        ?.paperApplications.sort((a, b) => {
          // Ensure English is always first
          if (a.language == "en") return -1
          if (b.language == "en") return 1

          // Otherwise, do regular string sort
          const aLang = t(`languages.${a.language}`)
          const bLang = t(`languages.${b.language}`)
          if (aLang < bLang) return -1
          if (aLang > bLang) return 1
          return 0
        })
        .map((paperApp) => {
          return {
            fileURL: paperApp?.file?.fileId.includes("https")
              ? paperApp?.file?.fileId
              : cloudinaryPdfFromId(
                  paperApp?.file?.fileId || "",
                  process.env.cloudinaryCloudName || ""
                ),
            languageString: t(`languages.${paperApp.language}`),
          }
        }) ?? null
    )
  }

  // Move the above methods into our shared helper library when setup

  const getDateString = (date: Date, format: string) => {
    return date ? dayjs(date).format(format) : null
  }

  const applySidebar = () => (
    <>
      <GetApplication
        onlineApplicationURL={getOnlineApplicationURL()}
        applicationsOpen={!appOpenInFuture}
        applicationsOpenDate={getDateString(listing.applicationOpenDate, "MMMM D, YYYY")}
        paperApplications={getPaperApplications()}
        paperMethod={!!getMethod(listing.applicationMethods, ApplicationMethodType.FileDownload)}
        postmarkedApplicationsReceivedByDate={getDateString(
          listing.postmarkedApplicationsReceivedByDate,
          `MMM DD, YYYY [${t("t.at")}] hh:mm A`
        )}
        applicationPickUpAddressOfficeHours={listing.applicationPickUpAddressOfficeHours}
        applicationPickUpAddress={getAddress(listing.applicationPickUpAddressType, "pickUp")}
        preview={props.preview}
        listingStatus={listing.status}
      />
      <SubmitApplication
        applicationMailingAddress={getAddress(listing.applicationMailingAddressType, "mailIn")}
        applicationDropOffAddress={getAddress(listing.applicationDropOffAddressType, "dropOff")}
        applicationDropOffAddressOfficeHours={listing.applicationDropOffAddressOfficeHours}
        applicationOrganization={listing.applicationOrganization}
        postmarkedApplicationData={{
          postmarkedApplicationsReceivedByDate: getDateString(
            listing.postmarkedApplicationsReceivedByDate,
            `MMM DD, YYYY [${t("t.at")}] hh:mm A`
          ),
          developer: listing.developer,
          applicationsDueDate: getDateString(
            listing.applicationDueDate,
            `MMM DD, YYYY [${t("t.at")}] hh:mm A`
          ),
        }}
        listingStatus={listing.status}
      />
    </>
  )

  const additionalInformationCard = (cardTitle: string, cardData: string) => {
    return (
      <div className="info-card">
        <h3 className="text-serif-lg">{cardTitle}</h3>
        <p className="text-sm text-gray-700 break-words">
          <Markdown children={cardData} options={{ disableParsingRawHTML: true }} />
        </p>
      </div>
    )
  }

  const applicationsClosed = moment() > moment(listing.applicationDueDate)
  const useMarkdownForPropertyAmenities = listing.amenities?.includes(",")
  const useMarkdownForUnitAmenities = listing.unitAmenities?.includes(",")
  const propertyAmenities = useMarkdownForPropertyAmenities
    ? listing.amenities
        .split(",")
        .map((a) => `* ${a.trim()}`)
        .join("\n")
    : listing.amenities
  const unitAmenities = useMarkdownForUnitAmenities
    ? listing.unitAmenities
        .split(",")
        .map((a) => `* ${a.trim()}`)
        .join("\n")
    : listing.unitAmenities

  const getAccessibilityFeatures = () => {
    let featuresExist = false
    const features = Object.keys(listing?.features ?? {}).map((feature, index) => {
      if (listing?.features[feature]) {
        featuresExist = true
        return <li key={index}>{t(`eligibility.accessibility.${feature}`)}</li>
      }
    })
    return featuresExist ? <ul>{features}</ul> : null
  }

  const accessibilityFeatures = getAccessibilityFeatures()

  return (
    <article className="flex flex-wrap relative max-w-5xl m-auto">
      <div className="w-full md:w-2/3">
        <header className="image-card--leader">
          <ImageCard
            imageUrl={imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))}
            tags={getImageCardTag(listing)}
          />
          <div className="py-3 mx-3">
            <Heading priority={1} style={"cardHeader"}>
              {listing.name}
            </Heading>
            <Heading priority={2} style={"cardSubheader"} className={"mb-1"}>
              {oneLineAddress}
            </Heading>
            <p className="text-gray-750 text-base mb-1">{listing.developer}</p>
            <p className="text-base">
              <a href={googleMapsHref} target="_blank" aria-label="Opens in new window">
                {t("t.viewOnMap")}
              </a>
            </p>
          </div>
          <div className={"flex flex-wrap mx-2"}>
            {getListingTags(listing.listingPrograms, listing.features)?.map((cardTag) =>
              getListingTag(cardTag)
            )}
          </div>
          <div className="text-right px-2">
            <FavoriteButton name={listing.name} id={listing.id} />
          </div>
        </header>

        <div className="w-full md:mt-6 md:mb-6 md:px-3 md:pe-8">
          {groupedUnitData?.length > 0 && (
            <>
              <GroupedTable
                headers={groupedUnitHeaders}
                data={[{ data: groupedUnitData }]}
                responsiveCollapse={true}
              />
              {hmiData.length > 0 && (
                <div className="text-sm leading-5 mt-4 invisible md:visible">
                  {t("listings.unitSummaryGroupMessage")}
                </div>
              )}
            </>
          )}
        </div>
        <ListingDetails>
          <ListingDetailItem
            imageAlt={t("listings.processInfo")}
            imageSrc="/images/listing-process.svg"
            title={t("listings.sections.processTitle")}
            subtitle={t("listings.sections.processSubtitle")}
            hideHeader={true}
            desktopClass="header-hidden"
          >
            <div className="block md:hidden">
              <ListingProcess
                listing={listing}
                openHouseEvents={openHouseEvents}
                applicationsClosed={applicationsClosed}
                hasNonReferralMethods={hasNonReferralMethods}
                applySidebar={applySidebar}
              />
            </div>
          </ListingDetailItem>

          {hmiData?.length || occupancyData?.length || listing.listingPrograms?.length ? (
            <ListingDetailItem
              imageAlt={t("listings.eligibilityNotebook")}
              imageSrc="/images/listing-eligibility.svg"
              title={t("listings.sections.eligibilityTitle")}
              subtitle={t("listings.sections.eligibilitySubtitle")}
              desktopClass="bg-primary-lighter"
            >
              <ul>
                {hmiData?.length > 0 && (
                  <ListSection
                    id="household_maximum_income_summary"
                    title={t("listings.householdMaximumIncome")}
                    subtitle={t("listings.forIncomeCalculations")}
                  >
                    <StandardTable headers={hmiHeaders} data={hmiData} responsiveCollapse={false} />
                  </ListSection>
                )}
                {occupancyData.length > 0 && (
                  <ListSection
                    title={t("t.occupancy")}
                    subtitle={t("listings.occupancyDescriptionNoSro")}
                  >
                    <StandardTable
                      headers={{
                        unitType: "t.unitType",
                        occupancy: "t.occupancy",
                      }}
                      data={occupancyData}
                      responsiveCollapse={false}
                    />
                  </ListSection>
                )}
                {listing.listingPrograms?.length > 0 && (
                  <ListSection
                    title={t("publicFilter.communityPrograms")}
                    subtitle={t("listings.communityProgramsDescription")}
                  >
                    {listing.listingPrograms
                      .sort((a, b) => (a.ordinal < b.ordinal ? -1 : 1))
                      .map((program) => (
                        <InfoCard className="" title={program.program.title}>
                          {program.program.description}
                        </InfoCard>
                      ))}
                    <p className="text-gray-700 text-tiny">
                      {t("listings.sections.publicProgramNote")}
                    </p>
                  </ListSection>
                )}
              </ul>
            </ListingDetailItem>
          ) : null}

          <ListingDetailItem
            imageAlt={t("listings.featuresCards")}
            imageSrc="/images/listing-features.svg"
            title={t("listings.sections.featuresTitle")}
            subtitle={t("listings.sections.featuresSubtitle")}
            desktopClass="bg-primary-lighter"
          >
            {!shouldShowFeaturesDetail() ? (
              t("errors.noData")
            ) : (
              <div className="listing-detail-panel">
                <dl className="column-definition-list">
                  {listing.neighborhood && (
                    <Description term={t("t.neighborhood")} description={listing.neighborhood} />
                  )}
                  {listing.region && (
                    <Description term={t("t.region")} description={listing.region} />
                  )}
                  {listing.yearBuilt && (
                    <Description term={t("t.built")} description={listing.yearBuilt} />
                  )}
                  {listing.smokingPolicy && (
                    <Description term={t("t.smokingPolicy")} description={listing.smokingPolicy} />
                  )}
                  {listing.petPolicy && (
                    <Description term={t("t.petsPolicy")} description={listing.petPolicy} />
                  )}
                  {listing.amenities && (
                    <Description
                      term={t("t.propertyAmenities")}
                      description={propertyAmenities}
                      markdown={useMarkdownForPropertyAmenities}
                    />
                  )}
                  {listing.unitAmenities && (
                    <Description
                      term={t("t.unitAmenities")}
                      description={unitAmenities}
                      markdown={useMarkdownForUnitAmenities}
                    />
                  )}
                  {listing.servicesOffered && (
                    <Description
                      term={t("t.servicesOffered")}
                      description={listing.servicesOffered}
                    />
                  )}
                  {accessibilityFeatures && (
                    <Description term={t("t.accessibility")} description={accessibilityFeatures} />
                  )}
                  {listing.accessibility && (
                    <Description
                      term={t("t.additionalAccessibility")}
                      description={listing.accessibility}
                    />
                  )}
                  {/* <Description
                  term={t("t.unitFeatures")}
                  description={
                    <UnitTables
                      units={listing.units}
                      unitSummaries={listing?.unitSummaries?.unitGroupSummary}
                      disableAccordion={listing.disableUnitsAccordion}
                    />
                  }
                /> */}
                </dl>
                <AdditionalFees
                  depositMin={listing.depositMin}
                  depositMax={listing.depositMax}
                  applicationFee={listing.applicationFee}
                  costsNotIncluded={listing.costsNotIncluded}
                  containerClass={"mt-4"}
                />
              </div>
            )}
          </ListingDetailItem>

          <ListingDetailItem
            imageAlt={t("listings.neighborhoodBuildings")}
            imageSrc="/images/listing-neighborhood.svg"
            title={t("listings.sections.neighborhoodTitle")}
            subtitle={t("listings.sections.neighborhoodSubtitle")}
          >
            <div className="listing-detail-panel">
              <ListingMap
                address={getGenericAddress(listing.buildingAddress)}
                listingName={listing.name}
              />
            </div>
          </ListingDetailItem>

          {(listing.requiredDocuments || listing.programRules || listing.specialNotes) && (
            <ListingDetailItem
              imageAlt={t("listings.additionalInformationEnvelope")}
              imageSrc="/images/listing-legal.svg"
              title={t("listings.sections.additionalInformationTitle")}
              subtitle={t("listings.sections.additionalInformationSubtitle")}
              desktopClass="bg-primary-lighter"
            >
              <div className="listing-detail-panel">
                {listing.requiredDocuments &&
                  additionalInformationCard(
                    t("listings.requiredDocuments"),
                    listing.requiredDocuments
                  )}
                {listing.programRules &&
                  additionalInformationCard(
                    t("listings.importantProgramRules"),
                    listing.programRules
                  )}
                {listing.specialNotes &&
                  additionalInformationCard(t("listings.specialNotes"), listing.specialNotes)}
              </div>
            </ListingDetailItem>
          )}
        </ListingDetails>
      </div>
      <div className="hidden md:block md:w-1/3">
        <ListingProcess
          listing={listing}
          openHouseEvents={openHouseEvents}
          applicationsClosed={applicationsClosed}
          hasNonReferralMethods={hasNonReferralMethods}
          applySidebar={applySidebar}
        />
      </div>
    </article>
  )
}
