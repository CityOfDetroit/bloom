import React from "react"
import ReactDOMServer from "react-dom/server"
import Markdown from "markdown-to-jsx"
import moment from "moment"
import {
  ApplicationMethod,
  ApplicationMethodType,
  Listing,
  ListingMetadata,
  ListingApplicationAddressType,
  ListingEvent,
  ListingEventType,
} from "@bloom-housing/backend-core/types"
import {
  AdditionalFees,
  Contact,
  Description,
  EventSection,
  EventType,
  ExpandableSection,
  ExpandableText,
  AlertBox,
  Heading,
  ImageCard,
  InfoCard,
  ListingDetailItem,
  ListingDetails,
  ListingMap,
  ListSection,
  OneLineAddress,
  QuantityRowSection,
  ReferralApplication,
  StandardTable,
  t,
} from "@bloom-housing/ui-components"
import {
  cloudinaryPdfFromId,
  imageUrlFromListing,
  occupancyTable,
  getTimeRangeString,
  getPostmarkString,
  getCurrencyRange,
} from "@bloom-housing/shared-helpers"
import dayjs from "dayjs"
import { ErrorPage } from "../../pages/_error"
import {
  getApplicationSeason,
  getGenericAddress,
  getHmiSummary,
  getImageCardTag,
  getListingTag,
  getListingTags,
  getUnitGroupSummary,
  openInFuture,
} from "../../lib/helpers"
import { FavoriteButton } from "./FavoriteButton"

import { GetApplication } from "./GetApplication"
import { SubmitApplication } from "./SubmitApplication"

interface ListingProcessProps {
  listing: Listing
  openHouseEvents: EventType[]
  applicationsClosed: boolean
  hasNonReferralMethods: boolean
  applySidebar: () => JSX.Element
}

interface ListingProps {
  listing: Listing
  listingMetadata: ListingMetadata
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

  const appOpenInFuture = openInFuture(listing)

  return (
    <aside className="w-full static md:me-8 md:ms-2 md:border-r md:border-l md:border-b border-gray-400 bg-white text-gray-750">
      {listing.marketingDate && (
        <AlertBox className="warn desktop-only" customIcon="info">
          {getApplicationSeason(listing)}
        </AlertBox>
      )}
      {openHouseEvents && (
        <EventSection events={openHouseEvents} headerText={t("listings.openHouseEvent.header")} />
      )}
      {listing.isWaitlistOpen &&
        (listing.waitlistCurrentSize || listing.waitlistOpenSpots || listing.waitlistMaxSize) && (
          <QuantityRowSection
            quantityRows={[
              {
                text: t("listings.waitlist.currentSize"),
                amount: listing.waitlistCurrentSize,
              },
              {
                text: t("listings.waitlist.openSlots"),
                amount: listing.waitlistOpenSpots,
                emphasized: true,
              },
              {
                text: t("listings.waitlist.finalSize"),
                amount: listing.waitlistMaxSize,
              },
            ]}
            strings={{
              sectionTitle: t("listings.waitlist.unitsAndWaitlist"),
              description: t("listings.waitlist.submitAnApplication"),
            }}
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
          strings={{
            title: t("application.referralApplication.furtherInformation"),
          }}
        />
      )}
      {openHouseEvents && (
        <div className="mb-2 md:hidden">
          <EventSection events={openHouseEvents} headerText={t("listings.openHouseEvent.header")} />
        </div>
      )}
      <ExpandableSection
        content={listing.whatToExpect}
        expandableContent={listing.whatToExpectAdditionalText}
        strings={{
          title: t("whatToExpect.label"),
          readMore: t("t.readMore"),
          readLess: t("t.readLess"),
        }}
      />

      {!appOpenInFuture &&
        (listing.leasingAgentName || listing.leasingAgentEmail || listing.leasingAgentPhone) && (
          <Contact
            sectionTitle={t("leasingAgent.contact")}
            additionalInformation={
              listing.leasingAgentOfficeHours
                ? [
                    {
                      title: t("leasingAgent.officeHours"),
                      content: listing.leasingAgentOfficeHours,
                    },
                  ]
                : undefined
            }
            contactAddress={listing.leasingAgentAddress}
            contactEmail={listing.leasingAgentEmail}
            contactName={listing.leasingAgentName}
            contactPhoneNumber={
              listing.leasingAgentPhone ? `${t("t.call")} ${listing.leasingAgentPhone}` : undefined
            }
            contactPhoneNumberNote={t("leasingAgent.dueToHighCallVolume")}
            contactTitle={listing.leasingAgentTitle}
            strings={{
              email: t("t.email"),
              website: t("t.website"),
              getDirections: t("t.getDirections"),
            }}
          />
        )}
      {listing.neighborhood && (
        <section className="hidden md:block aside-block">
          <Heading styleType={"underlineWeighted"} priority={4}>
            {t("listings.sections.neighborhoodTitle")}
          </Heading>
          <p>{listing.neighborhood}</p>
        </section>
      )}
      <section className="aside-block">
        <p className="text-tiny text-gray-750">
          {`${t("listings.listingUpdated")}: ${dayjs(listing.updatedAt).format("MMMM DD, YYYY")}`}
        </p>
      </section>
    </aside>
  )
}

export const ListingView = (props: ListingProps) => {
  let buildingSelectionCriteria
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

  const occupancyHeaders = {
    unitType: "t.unitType",
    occupancy: "t.occupancy",
  }
  const occupancyData = occupancyTable(listing)

  if (listing.buildingSelectionCriteriaFile) {
    buildingSelectionCriteria = (
      <p>
        <a
          href={cloudinaryPdfFromId(
            listing.buildingSelectionCriteriaFile.fileId,
            process.env.cloudinaryCloudName
          )}
        >
          {t("listings.moreBuildingSelectionCriteria")}
        </a>
      </p>
    )
  } else if (listing.buildingSelectionCriteria) {
    buildingSelectionCriteria = (
      <p>
        <a href={listing.buildingSelectionCriteria}>
          {t("listings.moreBuildingSelectionCriteria")}
        </a>
      </p>
    )
  }

  const getEvent = (event: ListingEvent, note?: string | React.ReactNode): EventType => {
    return {
      timeString: getTimeRangeString(event.startTime, event.endTime),
      dateString: dayjs(event.startTime).format("MMMM D, YYYY"),
      linkURL: event.url,
      linkText: event.label || t("listings.openHouseEvent.seeVideo"),
      note: note || event.note,
    }
  }

  let openHouseEvents: EventType[] | null = null
  if (Array.isArray(listing.events)) {
    listing.events.forEach((event) => {
      switch (event.type) {
        case ListingEventType.openHouse:
          if (!openHouseEvents) {
            openHouseEvents = []
          }
          openHouseEvents.push(getEvent(event))
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
        paperMethod={getPaperApplications()?.length > 0}
        postmarkedApplicationsReceivedByDate={getDateString(
          listing.postmarkedApplicationsReceivedByDate,
          `MMM DD, YYYY [${t("t.at")}] hh:mm A`
        )}
        applicationPickUpAddressOfficeHours={listing.applicationPickUpAddressOfficeHours}
        applicationPickUpAddress={getAddress(listing.applicationPickUpAddressType, "pickUp")}
        preview={props.preview}
      />
      <SubmitApplication
        applicationMailingAddress={getAddress(listing.applicationMailingAddressType, "mailIn")}
        applicationDropOffAddress={getAddress(listing.applicationDropOffAddressType, "dropOff")}
        applicationDropOffAddressOfficeHours={listing.applicationDropOffAddressOfficeHours}
        applicationOrganization={listing.applicationOrganization}
        strings={{
          postmark: getPostmarkString(
            listing.applicationDueDate
              ? getDateString(listing.applicationDueDate, `MMM DD, YYYY [${t("t.at")}] hh:mm A`)
              : null,
            listing.postmarkedApplicationsReceivedByDate
              ? getDateString(
                  listing.postmarkedApplicationsReceivedByDate,
                  `MMM DD, YYYY [${t("t.at")}] hh:mm A`
                )
              : null,
            listing.developer
          ),
          mailHeader: t("listings.apply.sendByUsMail"),
          dropOffHeader: t("listings.apply.dropOffApplication"),
          sectionHeader: t("listings.apply.submitAPaperApplication"),
          officeHoursHeader: t("leasingAgent.officeHours"),
          mapString: t("t.getDirections"),
        }}
      />
    </>
  )

  const additionalInformationCard = (cardTitle: string, cardData: string) => {
    return (
      <div className="info-card">
        <Heading className={"text-xl mb-4"} priority={3}>
          {cardTitle}
        </Heading>
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

  const showEligibilitySection =
    !!listing.creditHistory ||
    !!listing.rentalHistory ||
    !!listing.criminalBackground ||
    !!buildingSelectionCriteria ||
    !!hmiData?.length ||
    !!occupancyData?.length ||
    !!listing.listingPrograms?.length

  const getUtilitiesIncluded = () => {
    let utilitiesExist = false
    const utilitiesIncluded = Object.keys(listing?.utilities ?? {}).reduce(
      (acc, current, index) => {
        if (listing?.utilities[current]) {
          utilitiesExist = true
          acc.push(
            <li key={index} className={"list-disc list-inside"}>
              {t(`listings.utilities.${current}`)}
            </li>
          )
        }
        return acc
      },
      []
    )
    return utilitiesExist ? (
      <div>
        <div className="text-base">{t("listings.sections.utilities")}</div>
        {utilitiesIncluded.length <= 4 ? (
          <ul>{utilitiesIncluded}</ul>
        ) : (
          <div className="flex">
            <ul className="float-left w-1/2">{utilitiesIncluded.slice(0, 4)}</ul>
            <ul className="float-right w-1/2">{utilitiesIncluded.slice(4)}</ul>
          </div>
        )}
      </div>
    ) : null
  }

  const getFooterContent = () => {
    const footerContent: (string | React.ReactNode)[] = []
    const utilitiesDisplay = getUtilitiesIncluded()
    if (utilitiesDisplay) footerContent.push(utilitiesDisplay)
    if (listing?.costsNotIncluded) footerContent.push(listing.costsNotIncluded)
    return footerContent
  }

  return (
    <article className="flex flex-wrap relative max-w-5xl m-auto">
      <div className="w-full md:w-2/3">
        {listing.marketingDate && (
          <AlertBox className="warn mobile-only" customIcon="info">
            {getApplicationSeason(listing)}
          </AlertBox>
        )}
        <header className="image-card--leader">
          <ImageCard
            images={imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize)).map(
              (imageUrl: string) => {
                return {
                  url: imageUrl,
                }
              }
            )}
            description={listing.name}
            tags={getImageCardTag(listing)}
            moreImagesLabel={t("listings.moreImagesLabel")}
            moreImagesDescription={t("listings.moreImagesAltDescription", {
              listingName: listing.name,
            })}
            modalCloseLabel={t("t.backToListing")}
          />
          <div className="py-3 mx-3">
            <Heading priority={1} styleType={"largePrimary"}>
              {listing.name}
            </Heading>
            <Heading priority={2} styleType={"mediumNormal"} className={"mb-1"}>
              {oneLineAddress}
            </Heading>
            <p className="text-gray-750 text-base mb-1">{listing.developer}</p>
            <p className="text-base">
              <a href={googleMapsHref} target="_blank" rel="noreferrer noopener">
                {t("t.viewOnMap")}
              </a>
            </p>
          </div>
          <div className={"flex flex-wrap mx-2"}>
            {getListingTags(
              listing.listingPrograms,
              listing.features,
              listing.homeType
            )?.map((cardTag) => getListingTag(cardTag))}
          </div>
          <div className="text-right px-2">
            <FavoriteButton name={listing.name} id={listing.id} />
          </div>
        </header>

        <div className="w-full md:mt-6 md:mb-6 md:px-3 md:pe-8">
          {groupedUnitData?.length > 0 && (
            <>
              <StandardTable
                headers={groupedUnitHeaders}
                data={groupedUnitData}
                responsiveCollapse={true}
                ariaLabel={t("t.unitInformation")}
              />
              {listing?.section8Acceptance && (
                <div className="text-sm leading-5 mt-4 invisible md:visible">
                  {t("listings.section8MessageOpening")}
                  <b>{t("listings.section8FullName")}</b>
                  {t("listings.section8MessageClosing")}
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

          {showEligibilitySection && (
            <ListingDetailItem
              imageAlt={t("listings.eligibilityNotebook")}
              imageSrc="/images/listing-eligibility.svg"
              title={t("listings.sections.eligibilityTitle")}
              subtitle={t("listings.sections.eligibilitySubtitle")}
              desktopClass="bg-primary-lighter"
            >
              <ul>
                {hmiData?.length > 0 && (
                  <li
                    id="household_maximum_income_summary"
                    className="list-section custom-counter__item"
                  >
                    <header className="list-section__header custom-counter__header">
                      <hgroup>
                        <h4 className="custom-counter__title">
                          {t("listings.householdMaximumIncome")}
                        </h4>
                        <span className="custom-counter__subtitle">
                          {t("listings.forIncomeCalculations")}
                        </span>
                        {listing?.section8Acceptance && (
                          <>
                            <br />
                            <br />
                            <span className="custom-counter__subtitle">
                              {t("listings.section8MessageOpening")}
                              <b>{t("listings.section8FullName")}</b>
                              {t("listings.section8MessageClosing")}
                            </span>
                          </>
                        )}
                      </hgroup>
                    </header>
                    <StandardTable
                      headers={hmiHeaders}
                      data={hmiData}
                      responsiveCollapse={false}
                      ariaLabel={t("listings.householdMaximumIncome")}
                    />
                  </li>
                )}
                {occupancyData.length > 0 && (
                  <ListSection
                    title={t("t.occupancy")}
                    subtitle={t("listings.occupancyDescriptionNoSro")}
                  >
                    <StandardTable
                      headers={occupancyHeaders}
                      data={occupancyData}
                      responsiveCollapse={false}
                      ariaLabel={t("t.occupancy")}
                    />
                  </ListSection>
                )}
                {listing.listingPrograms?.length > 0 && (
                  <ListSection
                    title={t("publicFilter.communityTypes")}
                    subtitle={t("listings.communityProgramsDescription")}
                  >
                    {listing.listingPrograms
                      .sort((a, b) => (a.ordinal < b.ordinal ? -1 : 1))
                      .map((program) => (
                        <InfoCard
                          className=""
                          title={program.program.title}
                          key={program.program?.id}
                        >
                          {program.program.description}
                        </InfoCard>
                      ))}
                    <p className="text-gray-700 text-sm">
                      {t("listings.sections.publicProgramNote")}
                    </p>
                  </ListSection>
                )}
                {(!!listing.creditHistory ||
                  !!listing.rentalHistory ||
                  !!listing.criminalBackground ||
                  !!buildingSelectionCriteria) && (
                  <ListSection
                    title={t("listings.sections.additionalEligibilityTitle")}
                    subtitle={t("listings.sections.additionalEligibilitySubtitle")}
                  >
                    <>
                      {!!listing.creditHistory && (
                        <InfoCard title={t("listings.creditHistory")}>
                          <ExpandableText
                            className="text-sm text-gray-700"
                            strings={{
                              readMore: t("t.more"),
                              readLess: t("t.less"),
                            }}
                          >
                            {listing.creditHistory}
                          </ExpandableText>
                        </InfoCard>
                      )}
                      {!!listing.rentalHistory && (
                        <InfoCard title={t("listings.rentalHistory")}>
                          <ExpandableText
                            className="text-sm text-gray-700"
                            strings={{
                              readMore: t("t.more"),
                              readLess: t("t.less"),
                            }}
                          >
                            {listing.rentalHistory}
                          </ExpandableText>
                        </InfoCard>
                      )}
                      {!!listing.criminalBackground && (
                        <InfoCard title={t("listings.criminalBackground")}>
                          <ExpandableText
                            className="text-sm text-gray-700"
                            strings={{
                              readMore: t("t.more"),
                              readLess: t("t.less"),
                            }}
                          >
                            {listing.criminalBackground}
                          </ExpandableText>
                        </InfoCard>
                      )}
                      {buildingSelectionCriteria}
                    </>
                  </ListSection>
                )}
              </ul>
            </ListingDetailItem>
          )}

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
                <dl className="column-definition-list mb-4">
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
                  deposit={getCurrencyRange(
                    parseInt(listing.depositMin),
                    parseInt(listing.depositMax)
                  )}
                  applicationFee={listing.applicationFee ? `$${listing.applicationFee}` : undefined}
                  footerContent={getFooterContent()}
                  strings={{
                    sectionHeader: t("listings.sections.additionalFees"),
                    applicationFee: t("listings.applicationFee"),
                    deposit: t("t.deposit"),
                    applicationFeeSubtext: [
                      t("listings.applicationPerApplicantAgeDescription"),
                      t("listings.applicationFeeDueAt"),
                    ],
                    depositSubtext: [listing.depositHelperText],
                  }}
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
              <p className="text-sm underline block mt-4 mb-8">
                <a
                  href={googleMapsHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={t("t.viewOnMap")}
                >
                  {t("t.getDirections")}
                </a>
              </p>
            </div>
            {listing.neighborhoodAmenities && (
              <>
                <header className="detail-header pt-0 ps-0 md:ps-4 pb-6 border-none flex justify-start">
                  <div className="flex justify-between w-full">
                    <hgroup className="detail-header__hgroup ps-0 md:ps-4">
                      <Heading priority={2} className="detail-header__title">
                        {t("listings.sections.neighborhoodAmenitiesPublicTitle")}
                      </Heading>
                      <span className="detail-header__subtitle">
                        {t("listings.sections.neighborhoodAmenitiesPublicSubtitle")}
                      </span>
                    </hgroup>
                  </div>
                </header>
                <div className="listing-detail-panel">
                  <dl className="column-definition-list">
                    {listing.neighborhoodAmenities?.groceryStores && (
                      <Description
                        term={t("listings.amenities.groceryStores")}
                        description={listing.neighborhoodAmenities.groceryStores}
                      />
                    )}
                    {listing.neighborhoodAmenities?.publicTransportation && (
                      <Description
                        term={t("listings.amenities.publicTransportation")}
                        description={listing.neighborhoodAmenities.publicTransportation}
                      />
                    )}
                    {listing.neighborhoodAmenities?.schools && (
                      <Description
                        term={t("listings.amenities.schools")}
                        description={listing.neighborhoodAmenities.schools}
                      />
                    )}
                    {listing.neighborhoodAmenities?.parksAndCommunityCenters && (
                      <Description
                        term={t("listings.amenities.parksAndCommunityCenters")}
                        description={listing.neighborhoodAmenities.parksAndCommunityCenters}
                      />
                    )}
                    {listing.neighborhoodAmenities?.pharmacies && (
                      <Description
                        term={t("listings.amenities.pharmacies")}
                        description={listing.neighborhoodAmenities.pharmacies}
                      />
                    )}
                    {listing.neighborhoodAmenities?.healthCareResources && (
                      <Description
                        term={t("listings.amenities.healthCareResources")}
                        description={listing.neighborhoodAmenities.healthCareResources}
                      />
                    )}
                  </dl>
                </div>
              </>
            )}
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
