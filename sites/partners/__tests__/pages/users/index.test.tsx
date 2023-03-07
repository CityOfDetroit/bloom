import {
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  AuthProvider,
  ConfigProvider,
} from "@bloom-housing/shared-helpers"
import { render } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import React from "react"
import Users from "../../../src/pages/users"
import { user } from "../../testHelpers"

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("users", () => {
  it("should render the error text when api call fails", async () => {
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json(""))
      })
    )
    const { findByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <Users />
        </AuthProvider>
      </ConfigProvider>
    )

    const error = await findByText("An error has occurred.")
    expect(error).toBeInTheDocument()
  })

  it("should render user table when data is returned", async () => {
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [user], meta: { totalItems: 1, totalPages: 1 } }))
      })
    )
    const { findByText, getByText, queryAllByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <Users />
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await findByText("Detroit Partner Portal")
    expect(header).toBeInTheDocument()
    expect(getByText("Users")).toBeInTheDocument()
    expect(getByText("Filter")).toBeInTheDocument()
    expect(getByText("Add User")).toBeInTheDocument()
    expect(queryAllByText("Export")).toHaveLength(0)

    const name = await findByText("First Last")
    expect(name).toBeInTheDocument()
    expect(getByText("first.last@bloom.com")).toBeInTheDocument()
    expect(getByText("Administrator")).toBeInTheDocument()
    expect(getByText("09/04/2022")).toBeInTheDocument()
    expect(getByText("Confirmed")).toBeInTheDocument()
  })

  it("should render Export when user is admin", async () => {
    // set a logged in token
    jest.useFakeTimers()
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZTMxODNhOC0yMGFiLTRiMDYtYTg4MC0xMmE5NjYwNmYwOWMiLCJpYXQiOjE2Nzc2MDAxNDIsImV4cCI6MjM5NzkwMDc0Mn0.ve1U5tAardpFjNyJ_b85QZLtu12MoMTa2aM25E8D1BQ"
    window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, fakeToken)
    server.use(
      rest.get("http://localhost:3100/listings", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/user/list", (_req, res, ctx) => {
        return res(ctx.json({ items: [user], meta: { totalItems: 1, totalPages: 1 } }))
      }),
      // set logged in user as admin
      rest.get("http://localhost:3100/user", (_req, res, ctx) => {
        return res(ctx.json({ id: "user1", roles: { id: "user1", isAdmin: true } }))
      })
    )
    const { findByText, getByText } = render(
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <Users />
        </AuthProvider>
      </ConfigProvider>
    )

    const header = await findByText("Detroit Partner Portal")
    expect(header).toBeInTheDocument()
    expect(getByText("Add User")).toBeInTheDocument()
    expect(getByText("Export")).toBeInTheDocument()
  })
})
