import React from "react"
import { AppStatusItem } from "./AppStatusItem"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import moment from "moment"
import { Application, Listing } from "@bloom-housing/backend-core/types"
import Archer from "../../__tests__/fixtures/archer.json"
const listing = Object.assign({}, ArcherListing) as Listing

export default {
  title: "Blocks/Application Status Item",
}

const application = {} as Application
let days = 10
listing.applicationDueDate = new Date(moment().add(days, "days").format())
application.listing = listing
application.updatedAt = new Date()

export const AppStatusItemPending = () => (
  <AppStatusItem
    status="inProgress"
    application={application}
    listing={listing}
    setDeletingApplication={() => {
      //
    }}
  ></AppStatusItem>
)

export const AppStatusItemSubmitted = () => (
  <AppStatusItem
    status="submitted"
    application={application}
    listing={listing}
    lotteryNumber="#98AU18"
    setDeletingApplication={() => {
      //
    }}
  ></AppStatusItem>
)

const application2 = {} as Application
const listing2 = Object.assign({}, Archer) as any
application2.listing = listing2

export const AppStatusItemPastDue = () => (
  <AppStatusItem
    status="inProgress"
    application={application2}
    listing={listing}
    setDeletingApplication={() => {
      //
    }}
  ></AppStatusItem>
)
