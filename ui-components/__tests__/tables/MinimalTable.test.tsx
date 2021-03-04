import React from "react"
import { render, cleanup } from "@testing-library/react"
import { MinimalTable } from "../../src/tables/MinimalTable"

afterEach(cleanup)

const headers = {
  name: "Name",
  relationship: "Relationship",
  dob: "Date of Birth",
}

const data = [
  {
    name: "Virginia Kirch",
    relationship: "Colleague",
    dob: "12/01/1994",
  },
  {
    name: "Trixie Fabian",
    relationship: "Partner",
    dob: "06/01/1955",
  },
]

describe("<MinimalTable>", () => {
  it("renders without error", () => {
    const { getByText } = render(<MinimalTable headers={headers} data={data} />)
    expect(getByText(data[0].name))
    expect(getByText(data[0].relationship))
    expect(getByText(data[0].dob))
    expect(getByText(data[1].name))
    expect(getByText(data[1].relationship))
    expect(getByText(data[1].dob))
  })
})
