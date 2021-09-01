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
  (listing: Listing, { apiBase = "http://localhost:3100" } = {}) =>
    cy.request({
      url: `${apiBase}/listing`,
      method: "POST",
      body: listing,
    })
)
