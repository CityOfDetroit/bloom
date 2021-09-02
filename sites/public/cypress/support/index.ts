import { Listing } from "@bloom-housing/backend-core/types"

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
    // In order to add a new listing, we have to authenticate as an admin. This relies on the database being seeded with a user account with email "admin@example.com" and password "abcdef"
    cy.request({
      url: `${apiBase}/auth/login`,
      method: "POST",
      body: { email: "admin@example.com", password: "abcdef" },
    })
      .its("body")
      .then(({ accessToken }) => {
        cy.window().then((window) => window.sessionStorage.setItem("@bht", accessToken))
      })

    return cy.request({
      url: `${apiBase}/listing`,
      method: "POST",
      body: listing,
    })
  }
)
