import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import EligibilityWelcome from "../../pages/eligibility/welcome"
import React from "react"

describe("<EligibilityWelcome>", () => {
  it("Renders welcome page of eligibility questionnaire", () => {
    const { getAllByText } = render(<EligibilityWelcome />)
    expect(getAllByText("Welcome")).toBeTruthy()
    expect(getAllByText("Next")).toBeTruthy()
  })

  it("Clicks Next button", () => {
    render(<EligibilityWelcome />)
    fireEvent.click(screen.getByText("Next"))
  })
})
