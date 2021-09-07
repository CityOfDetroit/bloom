import { Listing } from "@bloom-housing/backend-core/types"
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "../../../../ui-components/src/authentication/token"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      /**
       * Create a new listing with the specified options.
       */
      createListing(listing: Listing, options?: { apiBase: string }): Chainable
    }
  }
}

Cypress.Commands.add(
  "createListing",
  (listing: Listing, { apiBase = "http://localhost:3100" } = {}) => {
    console.error("\n\nWILL THIS LOG ANYTHING\n\n")
    // In order to add a new listing, we have to authenticate as an admin. This relies on the database being seeded with a user account with email "admin@example.com" and password "abcdef"
    const accessToken = cy.request({
      url: `${apiBase}/auth/login`,
      method: "POST",
      body: { email: "admin@example.com", password: "abcdef" },
    })
      .its("body.accessToken")

    return cy
      .request({
        url: `${apiBase}/listings`,
        method: "POST",
        body: listing,
        headers: { "bearer": accessToken }
      })
      .its("body")
      .then(({ accessToken }) => accessToken)
  }
)
