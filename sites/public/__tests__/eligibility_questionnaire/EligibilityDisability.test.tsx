import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import EligibilityDisability from "../../pages/eligibility/disability"
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

describe("<EligibilityDisability>", () => {
  it("Renders Disability page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityDisability />)
    })
    expect(
      screen.getByRole("heading", { name: "Do you have a disability?" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("Displays an error message if no selection has been made", async () => {
    act(() => {
      render(<EligibilityDisability />)
    })

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please select one of the options above.")).not.toBeInTheDocument()

    await act(async () => {
      // Click "Next" with no selection made --> error message
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
      await waitFor(() => screen.getByText("Please select one of the options above."))

      // Select a valid input, wait for error message to go away
      const errorMessage = screen.getByText("Please select one of the options above.")
      fireEvent.click(screen.getByRole("radio", { name: "No" }))
      await waitFor(() =>
        expect(errorMessage).not.toBeInTheDocument()
      )
    })
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityDisability />)
      fireEvent.click(screen.getByRole("radio", { name: "No" }))
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/income")
  })
})
