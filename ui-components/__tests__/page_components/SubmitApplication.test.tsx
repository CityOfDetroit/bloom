import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AllFields } from "../../src/page_components/listing/listing_sidebar/SubmitApplication.stories"

afterEach(cleanup)

describe("<SubmitApplication>", () => {
  it("includes mailing address, includes drop off address, includes due date, includes postmarks, includes office hours", () => {
    const { getByText } = render(<AllFields />)
    expect(getByText("Paper App Header")).toBeTruthy()
    expect(getByText("Mail Header")).toBeTruthy()
    expect(getByText("Mailing Address Street", { exact: false })).toBeTruthy()
    expect(getByText("Postmark details string")).toBeTruthy()
    expect(getByText("or")).toBeTruthy()
    expect(getByText("Drop Off Header")).toBeTruthy()
    expect(getByText("Drop Off Address Street", { exact: false })).toBeTruthy()
    expect(getByText("Office Hours Header")).toBeTruthy()
  })
  it("includes mailing address, excludes dropoff address, includes postmarks, excludes due date", () => {
    const { getByText, queryByText } = render(<MailingYesPostmarksNoDueDate />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street", { exact: false })).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be received by mail no later than November 30th, 2021. Applications received after November 30th, 2021 via mail will not be accepted. Developer is not responsible for lost or delayed mail.",
        { exact: false }
      )
    ).toBeTruthy()
    expect(queryByText("or")).toBe(null)
    expect(queryByText("Drop Off Application")).toBe(null)
  })
  it("includes mailing address, excludes dropoff address, excludes postmarks, includes due date", () => {
    const { getByText, queryByText } = render(<MailingNoPostmarksYesDueDate />)
    expect(getByText("Submit a Paper Application")).toBeTruthy()
    expect(getByText("Send Application by US Mail")).toBeTruthy()
    expect(getByText("Mailing Address Street", { exact: false })).toBeTruthy()
    expect(
      getByText(
        "Applications must be received by the deadline. If sending by U.S. Mail, the application must be postmarked by November 29th, 2021. Developer is not responsible for lost or delayed mail.",
        { exact: false }
      )
    ).toBeTruthy()
    expect(queryByText("or")).toBe(null)
    expect(queryByText("Drop Off Application")).toBe(null)
  })
})
