import {
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  AuthProvider,
  ConfigProvider,
} from "@bloom-housing/shared-helpers"

import { render } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import ListingsList from "../../../src/pages/index"
import React from "react"
import { listing } from "../../testHelpers"
import { act, Simulate } from "react-dom/test-utils"

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
      rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json(""))
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

  // it("should note render Export to CSV when user is not Admin", async () => {
  //   jest.useFakeTimers()
  //   // const fakeToken =
  //   //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
  //   // window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)
  //   server.use(
  //     rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
  //       return res(ctx.json({ items: [listing], meta: { totalItems: 1, totalPages: 1 } }))
  //     }),
  //     rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
  //       return res(ctx.status(500), ctx.json(""))
  //     }),
  //     rest.get("http://localhost:3100/user", (_req, res, ctx) => {
  //       return res(ctx.json({ id: "user1", roles: { id: "user1", isPartner: true } }))
  //     })
  //   )

  //   const { findByText } = render(
  //     <ConfigProvider apiUrl={"http://localhost:3100"}>
  //       <AuthProvider>
  //         <ListingsList />
  //       </AuthProvider>
  //     </ConfigProvider>
  //   )
  //   const exportButton = await findByText("Export to CSV")
  //   expect(exportButton).not.toBeInTheDocument()
  // })

  // it("should render the error text when listings csv api call fails", async () => {
  //   jest.useFakeTimers()
  //   const fakeToken =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
  //   window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)

  //   server.use(
  //     rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
  //       return res(ctx.json({ items: [listing], meta: {} }))
  //     }),
  //     rest.get("http://localhost:3100/listings/csv", (_req, res, ctx) => {
  //       return res(ctx.json([]))
  //     }),
  //     rest.get("http://localhost:3100/user", (_req, res, ctx) => {
  //       return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
  //     })
  //   )

  //   const { findByText } = render(
  //     <ConfigProvider apiUrl={"http://localhost:3100"}>
  //       <AuthProvider>
  //         <ListingsList />
  //       </AuthProvider>
  //     </ConfigProvider>
  //   )
  //   const exportButton = await findByText("Export to CSV", { selector: "button" })
  //   exportButton.click()
  //   const error = await findByText(
  //     "Export failed. Please try again later. If the problem persists, please email supportbloom@exygy.com"
  //   )
  //   expect(exportButton).toBeInTheDocument()
  // })

  // it("should render Export to CSV when user is admin", async () => {
  //   server.use(
  //     // set logged in user as admin
  //     rest.get("http://localhost:3100/", (_req, res, ctx) => {
  //       return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
  //     })
  //   )
  //   const { findByText, getByText } = render(
  //     <ConfigProvider apiUrl={"http://localhost:3100"}>
  //       <AuthProvider>
  //         <ListingsList />
  //       </AuthProvider>
  //     </ConfigProvider>
  //   )

  //   const header = await findByText("Detroit Partner Portal")
  //   expect(header).toBeInTheDocument()
  //   expect(getByText("Add Listing")).toBeInTheDocument()
  //   expect(getByText("Export to CSV")).toBeInTheDocument()
  // })
})
