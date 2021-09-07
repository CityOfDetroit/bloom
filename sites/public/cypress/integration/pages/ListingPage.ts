describe("Individual listing page", () => {
  before(() => {
    cy.fixture("listing").then((listing) => cy.createListing(listing))
  })

  it("clicks into an individual listing page", () => {
    cy.visit("/listings")
    cy.contains("Cypress Test Listing").click()

    // Verify that the listing page has some data/headings that we expect it to have
    cy.contains("Cypress Test Listing")
    cy.contains("Features")
    cy.contains("Neighborhood")
  })
})
