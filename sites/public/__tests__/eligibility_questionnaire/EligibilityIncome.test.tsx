import {render, fireEvent, screen } from "@testing-library/react"
import EligibilityIncome from "../../pages/eligibility/income"
import React from "react"
import { act } from "react-dom/test-utils"
import userEvent from "@testing-library/user-event"
import {AmiChartCreateDto } from '@bloom-housing/backend-core/dist/src/ami-charts/dto/ami-chart.dto';

const mockRouter = {
  push: jest.fn(),
}
jest.mock("next/router", () => ({
  useRouter() {
    return mockRouter
  },
}))

jest.mock("../../lib/hooks", () => {
  const originalModule = jest.requireActual("../../lib/hooks");
  const amiChart: AmiChartCreateDto = {
    name: "Test AMI chart",
    items: [
      {
        percentOfAmi: 20,
        householdSize: 1,
        income: 10000,
      },
      {
        percentOfAmi: 30,
        householdSize: 1,
        income: 15000
      } ]
  }

  return {
    __esModule: true,
    ...originalModule,
    useAmiChartList: jest.fn(()=> ({data: amiChart}))
  };
})

describe("<EligibilityIncome>", () => {

  it("Renders Income page of eligibility questionnaire", () => {
    act(() => {
      render(<EligibilityIncome />)
    })

    expect(
      screen.getByRole("heading", { name: "What is your total household annual income?" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument()
  })

  it("Clicks the Done button", async () => {
    debugger;

    await act(async () => {
      render(<EligibilityIncome />)

      userEvent.type(screen.getByRole("spinbutton", { name: "Income" }), "2")
      fireEvent.click(screen.getByRole("button", { name: "Done" }))
    })

    expect(mockRouter.push.mock.calls.length).toBe(1)
    expect(mockRouter.push.mock.calls[0][0]).toContain("/listings")
  })
})
