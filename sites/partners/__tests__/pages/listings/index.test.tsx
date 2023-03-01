import { AuthProvider, ConfigProvider } from "@bloom-housing/shared-helpers"
import { render } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import ListingsList from "../../../src/pages/index"
import React from "react"

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("listings", () => {
  it("should render the error text when listings csv api call fails", async () => {
    server.use(
      rest.get("http://localhost:3100/", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json(""))
      })
    )
    const { findByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ListingsList />
        </AuthProvider>
      </ConfigProvider>
    )

    const error = await findByText(
      "Export failed. Please try again later. If the problem persists, please email supportbloom@exygy.com"
    )
    expect(error).toBeInTheDocument()
  })

  it("should render Export to CSV when user is admin", async () => {
    server.use(
      // set logged in user as admin
      rest.get("http://localhost:3100/", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      })
    )
    const { findByText, getByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ListingsList />
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await findByText("Detroit Partner Portal")
    expect(header).toBeInTheDocument()
    expect(getByText("Add Listing")).toBeInTheDocument()
    expect(getByText("Export to CSV")).toBeInTheDocument()
  })
})
