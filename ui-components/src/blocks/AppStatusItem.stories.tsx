import React from "react"
import { AppStatusItem } from "./AppStatusItem"

export default {
  title: "Blocks/Application Status Item",
}

export const AppStatusItemSubmitted = () => (
  <AppStatusItem
    applicationDueDate={new Date()}
    applicationURL={"application/1234abcd"}
    applicationUpdatedAt={new Date()}
    confirmationNumber={"1234abcd"}
    listingId={"abcd1234"}
    listingName={"Listing Name"}
    listingURL={"/listing/abcd1234/listing-name"}
  />
)

export const AppStatusItemNoConfirmationNumber = () => (
  <AppStatusItem
    applicationDueDate={new Date()}
    applicationURL={"application/1234abcd"}
    applicationUpdatedAt={new Date()}
    listingId={"abcd1234"}
    listingName={"Listing Name"}
    listingURL={"/listing/abcd1234/listing-name"}
  />
)
