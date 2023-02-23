import { View } from "../../views/base.view"

export enum ListingViewEnum {
  base = "base",
  detail = "detail",
  full = "full",
  partnerList = "partnerList",
  publicListings = "publicListings",
  listingsExport = "listingsExport",
  unitsExport = "unitsExport",
}

export type Views = {
  [key in ListingViewEnum]?: View
}
