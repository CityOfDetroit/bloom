import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  queryByText,
} from "@testing-library/react"
import EligibilityBedrooms from "../../pages/eligibility/bedrooms"
import React from "react"
import { act } from "react-dom/test-utils"

describe("<EligibilityBedrooms>", () => {
  it("Renders bedrooms page of eligibility questionnaire", () => {
    const { getAllByText } = render(<EligibilityBedrooms />)
    expect(getAllByText("How many bedrooms do you need?")).toBeTruthy()
    expect(getAllByText("Next")).toBeTruthy()
  })

  it("Displays an error message if no bedroom counts have been selected", async () => {
    render(<EligibilityBedrooms />)

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please select at least one option.")).not.toBeInTheDocument()

    // Click "Next" --> error message
    fireEvent.click(screen.getByText("Next"))
    await waitFor(() => screen.getByText("Please select at least one option."))

    // Click one of the bedroom options, wait for error message to go away
    fireEvent.click(screen.getByDisplayValue("threeBdrm"))
    await waitForElementToBeRemoved(() => screen.queryByText("Please select at least one option."))

    fireEvent.click(screen.getByText("Next"))
  })
})
