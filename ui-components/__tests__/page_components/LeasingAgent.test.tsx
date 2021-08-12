import React from "react"
import { render, cleanup, queryByText } from "@testing-library/react"
import { LeasingAgent } from "../../src/page_components/listing/listing_sidebar/LeasingAgent"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import { Listing } from "@bloom-housing/backend-core/types"
import moment from "moment"

afterEach(cleanup)

describe("<LeasingAgent>", () => {
  it("renders data if application is open", () => {
    const listing = Object.assign({}, ArcherListing) as Listing
    const { getByText } = render(<LeasingAgent listing={listing} />)
    expect(listing.leasingAgentName && getByText(listing.leasingAgentName)).toBeTruthy()
    expect(
      listing.leasingAgentPhone && getByText(listing.leasingAgentPhone, { exact: false })
    ).toBeTruthy()
    expect(
      listing.leasingAgentOfficeHours && getByText(listing.leasingAgentOfficeHours)
    ).toBeTruthy()
  })
  it("renders nothing if application is not open", () => {
    const listing = Object.assign({}, ArcherListing) as Listing
    listing.applicationOpenDate = new Date(moment().add(10, "days").format())
    const { queryByText } = render(<LeasingAgent listing={listing} />)
    expect(listing.leasingAgentName && queryByText(listing.leasingAgentName)).toBeNull()
    expect(
      listing.leasingAgentPhone && queryByText(listing.leasingAgentPhone, { exact: false })
    ).toBeNull()
    expect(
      listing.leasingAgentOfficeHours && queryByText(listing.leasingAgentOfficeHours)
    ).toBeNull()
  })
  it("shows management company details if showManagementCompany is set", () => {
    const listing = Object.assign({}, ArcherListing) as Listing
    const managementCompany = "Some Management Company"
    const managementWebsite = "a fake management website url"
    {
      const { queryByText } = render(
        <LeasingAgent listing={listing} />
      )
      expect(queryByText(managementCompany)).toBeNull()
      expect(queryByText("Website")).toBeNull()
    }
    {
      const { getByText } = render(<LeasingAgent listing={listing}
        managementCompany={{
          "name": managementCompany, "website": managementWebsite
        }} />)
      expect(getByText(managementCompany)).toBeTruthy()
      expect(getByText("Website")).toBeTruthy()
    }
  })
})
