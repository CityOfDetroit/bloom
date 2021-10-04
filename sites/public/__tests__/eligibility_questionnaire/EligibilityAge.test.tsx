import { render, fireEvent, screen } from "@testing-library/react"
import EligibilityAge from "../../pages/eligibility/age"
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

describe("<EligibilityAge>", () => {
  it("Renders Age page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityAge />)
    })
    expect(screen.getByRole("heading", { name: "How old are you?" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("Does not display error if no age selected", async () => {
    act(() => {
      render(<EligibilityAge />)
    })

    // No error message when we've just rendered the page
    expect(screen.queryByText("Please enter a valid age.")).not.toBeInTheDocument()

    await act(async () => {
      // Click "Next" with no age entered --> no error message
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/disability")
  })

  it("Clicks the Next button", async () => {
    await act(async () => {
      render(<EligibilityAge />)
      fireEvent.click(screen.getByRole("radio", { name: "55 - 61" }))
      fireEvent.click(screen.getByRole("button", { name: "Next" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toBe("/eligibility/disability")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
