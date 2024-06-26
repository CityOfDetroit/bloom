describe("Navigating around the site", () => {
  it("Loads the homepage directly", () => {
    cy.visit("/")

    // Check that the homepage banner text is present on the page
    cy.contains("Find affordable rental housing")
  })

  it("Loads the listings page directly", () => {
    cy.visit("/listings")

    // Check that the listings page banner text is present on the page
    cy.contains("Rent affordable housing")
  })

  it("Loads a non-listing-related page directly", () => {
    cy.visit("/terms")

    // Check that the Terms page banner text is present on the page
    cy.contains("Terms and Conditions")
  })

  it("Can navigate to all page types after initial site load", () => {
    cy.visit("/")

    // Click on the Terms page link in the footer
    cy.get("footer a").contains("Terms and Conditions").click()

    // Should be on the terms page
    cy.location("pathname").should("equal", "/terms")
    cy.contains("Terms and Conditions")

    // Click on the listings page link in the header nav
    cy.get(".site-header__base").contains("Sign in").click()

    // Should be on the listings page
    cy.location("pathname").should("equal", "/sign-in")
    cy.contains("Sign in")

    // Click on the navbar logo to go to the homepage
    cy.get(".site-header__base")
      .first()
      .within(() => {
        cy.get(".site-header__logo").click()
      })

    // Check that the homepage banner text is present on the page
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`)
    cy.contains("Find affordable rental housing")
  })
})
