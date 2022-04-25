import * as React from "react"
import { Listing, ListingEvent } from "@bloom-housing/backend-core/types"
import {
  LeasingAgent,
  OpenHouseEvent,
  ReferralApplication,
  Waitlist,
  ListingUpdated,
  t,
} from "@bloom-housing/ui-components"

interface ListingProcessProps {
  listing: Listing
  openHouseEvents: ListingEvent[]
  applicationsClosed: boolean
  hasNonReferralMethods: boolean
  applySidebar: () => JSX.Element
}

export const ListingProcess = (props: ListingProcessProps) => {
  const {
    listing,
    openHouseEvents,
    applicationsClosed,
    hasNonReferralMethods,
    applySidebar,
  } = props

  // TODO: Need help understanding why isWaitlistOpen, name and website are unhappy here

  return (
    <aside className="w-full static md:mr-8 md:ml-2 md:border border-gray-400 bg-white">
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
