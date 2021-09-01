import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import EligibilityHouseholdSize from "../../pages/eligibility/householdSize"
import React from "react"
import { act } from "react-dom/test-utils"

const mockRouter = {
  push: jest.fn(),
}
jest.mock("next/router", () => ({
  useRouter() {
    return mockRouter
  },
}))

describe("<EligibilityHouseholdSize>", () => {
  it("Renders household size page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityHouseholdSize />)
    })
    expect(
      screen.getByRole("heading", { name: "How many people will be living in this property?" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("Displays an error message if no household size has been selected", async () => {
    act(() => {
      render(<EligibilityHouseholdSize />)
    })

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please select at least one option.")).not.toBeInTheDocument()

    await act(async () => {
      // Click "Next" --> error message
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
      await waitFor(() => screen.getByText("Please select at least one option."))

      // Click one of the household size options, wait for error message to go away
      fireEvent.click(screen.getByDisplayValue("two"))
      await waitForElementToBeRemoved(() =>
        screen.queryByText("Please select at least one option.")
      )
    })
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityHouseholdSize />)
      fireEvent.click(screen.getByDisplayValue("two"))
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/age")
  })
})
