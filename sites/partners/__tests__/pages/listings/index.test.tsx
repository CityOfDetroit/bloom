import {
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  AuthProvider,
  ConfigProvider,
} from "@bloom-housing/shared-helpers"

import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import { setupServer } from "msw/node"
import ListingsList from "../../../src/pages/index"
import React from "react"
import { listing, user } from "../../testHelpers"

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("listings", () => {
  it("should render Export to CSV when user is Admin", async () => {
    jest.useFakeTimers()
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
    window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),

      rest.get("http://localhost:3100/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      })
    )

    const { findByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ListingsList />
        </AuthProvider>
      </ConfigProvider>
    )

    const exportButton = await findByText("Export to CSV")
    expect(exportButton).toBeInTheDocument()
  })

  it("should not render Export to CSV when user is not Admin", async () => {
    jest.useFakeTimers()
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
    window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost:3100/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", roles: { id: "user1", isAdmin: false, isPartner: true } })
        )
      })
    )

    const { queryByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ListingsList />
        </AuthProvider>
      </ConfigProvider>
    )
    const exportButton = queryByText("Export to CSV")
    expect(exportButton).not.toBeInTheDocument()
  })

  it("should render Export to CSV pt 2 when user is Admin", async () => {
    jest.useFakeTimers()
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
    window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
        return res(ctx.json({}))
      }),
      rest.get("http://localhost:3100/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      })
    )

    const { findByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ListingsList />
        </AuthProvider>
      </ConfigProvider>
    )
    const exportButton = await findByText("Export to CSV")
    expect(exportButton).toBeInTheDocument()
    await userEvent.click(exportButton)
    const error = await findByText(
      "Export failed. Please try again later. If the problem persists, please email supportbloom@exygy.com"
    )
    expect(error).toBeInTheDocument()
  })
})
