import React from "react"
import ReactDOMServer from "react-dom/server"
import Markdown from "markdown-to-jsx"
import moment from "moment"
import {
  Listing,
  ListingEvent,
  ListingEventType,
  ListingApplicationAddressType,
  ApplicationMethod,
  ApplicationMethodType,
} from "@bloom-housing/backend-core/types"
import {
  AdditionalFees,
  Description,
  GroupedTable,
  ImageCard,
  GetApplication,
  LeasingAgent,
  ListingDetailItem,
  ListingDetails,
  ListingMap,
  OneLineAddress,
  OpenHouseEvent,
  ReferralApplication,
  SubmitApplication,
  UnitTables,
  Waitlist,
  ListingUpdated,
  ListSection,
  StandardTable,
  t,
  InfoCard,
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
  getImageTagIconFromListing,
  getImageTagLabelFromListing,
  getUnitGroupSummary,
  openInFuture,
} from "../lib/helpers"

interface ListingProps {
  listing: Listing
  preview?: boolean
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

  const occpancyData = occupancyTable(listing)

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
    if (hasMethod(listing.applicationMethods, ApplicationMethodType.Internal)) {
      onlineApplicationURL = `/applications/start/choose-language?listingId=${listing.id}`
    } else if (hasMethod(listing.applicationMethods, ApplicationMethodType.ExternalLink)) {
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

  return (
    <article className="flex flex-wrap relative max-w-5xl m-auto">
      <header className="image-card--leader">
        <ImageCard
          title={listing.name}
          imageUrl={imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))}
          tagLabel={getImageTagLabelFromListing(listing)}
          tagIcon={getImageTagIconFromListing(listing)}
        />
        <div className="p-3">
          <p className="font-alt-sans uppercase tracking-widest text-sm font-semibold">
            {oneLineAddress}
          </p>
          <p className="text-gray-700 text-base">{listing.developer}</p>
          <p className="text-xl">
            <a href={googleMapsHref} target="_blank" aria-label="Opens in new window">
              {t("t.viewOnMap")}
            </a>
          </p>
        </div>
      </header>

      <div className="w-full md:w-2/3 md:mt-6 md:mb-6 md:px-3 md:pr-8">
        {groupedUnitData?.length > 0 && (
          <>
            <GroupedTable
              headers={groupedUnitHeaders}
              data={[{ data: groupedUnitData }]}
              responsiveCollapse={true}
            />
            <div className="text-sm leading-5 mt-4">
              {t("listings.unitSummaryGroupMessage")}{" "}
              <a className="underline" href="#household_maximum_income_summary">
                {t("listings.unitSummaryGroupLinkText")}
              </a>
            </div>
          </>
        )}
      </div>
      <ListingDetails>
        {/* TODO: update when other items go in this section */}
        {listing.listingPrograms?.length ? (
          <ListingDetailItem
            imageAlt={t("listings.eligibilityNotebook")}
            imageSrc="/images/listing-eligibility.svg"
            title={t("listings.sections.eligibilityTitle")}
            subtitle={t("listings.sections.eligibilitySubtitle")}
            desktopClass="bg-primary-lighter"
          >
            <ul>
              {listing.listingPrograms?.length && (
                <ListSection
                  title={t("listings.communityPrograms")}
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
          imageAlt={t("listings.processInfo")}
          imageSrc="/images/listing-process.svg"
          title={t("listings.sections.processTitle")}
          subtitle={t("listings.sections.processSubtitle")}
          hideHeader={true}
          desktopClass="header-hidden"
        >
          <aside className="w-full static md:absolute md:right-0 md:w-1/3 md:top-0 sm:w-2/3 md:ml-2 md:border border-gray-400 bg-white">
            <div className="hidden md:block">
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
            </div>
            {openHouseEvents && (
              <div className="mb-2 md:hidden">
                <OpenHouseEvent events={openHouseEvents} />
              </div>
            )}
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
        </ListingDetailItem>

        {hmiData?.length || occpancyData?.length ? (
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
              {occpancyData?.length && (
                <ListSection
                  title={t("t.occupancy")}
                  subtitle={t("listings.occupancyDescriptionNoSro")}
                >
                  <StandardTable
                    headers={{
                      unitType: "t.unitType",
                      occupancy: "t.occupancy",
                    }}
                    data={occupancyTable(listing)}
                    responsiveCollapse={false}
                  />
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
                <Description
                  term={t("t.accessibility")}
                  description={listing.accessibility || t("t.contactPropertyManagement")}
                />
                <Description
                  term={t("t.unitFeatures")}
                  description={
                    <UnitTables
                      units={listing.units}
                      unitSummaries={listing?.unitSummaries?.unitTypeSummary}
                      disableAccordion={listing.disableUnitsAccordion}
                    />
                  }
                />
              </dl>
              <AdditionalFees
                depositMin={listing.depositMin}
                depositMax={listing.depositMax}
                applicationFee={listing.applicationFee}
                costsNotIncluded={listing.costsNotIncluded}
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
              {listing.requiredDocuments && (
                <div className="info-card">
                  <h3 className="text-serif-lg">{t("listings.requiredDocuments")}</h3>
                  <p className="text-sm text-gray-700">
                    <Markdown
                      children={listing.requiredDocuments}
                      options={{ disableParsingRawHTML: true }}
                    />
                  </p>
                </div>
              )}
              {listing.programRules && (
                <div className="info-card">
                  <h3 className="text-serif-lg">{t("listings.importantProgramRules")}</h3>
                  <p className="text-sm text-gray-700">
                    <Markdown
                      children={listing.programRules}
                      options={{ disableParsingRawHTML: true }}
                    />
                  </p>
                </div>
              )}
              {listing.specialNotes && (
                <div className="info-card">
                  <h3 className="text-serif-lg">{t("listings.specialNotes")}</h3>
                  <p className="text-sm text-gray-700">
                    <Markdown
                      children={listing.specialNotes}
                      options={{ disableParsingRawHTML: true }}
                    />
                  </p>
                </div>
              )}
            </div>
          </ListingDetailItem>
        )}
      </ListingDetails>
    </article>
  )
}
