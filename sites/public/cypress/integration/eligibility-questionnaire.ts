describe("Verifying the eligibility questionnaire flow", () => {
  it("Clicks the button on the homepage to launch the eligibility questionnaire", () => {
    cy.visit("/")

    // Find and click the button that says "Check My Eligibility"
    const checkEligibilityButton = cy.contains("Check My Eligibility")

    // Click the eligibility button and verify it takes us to the questionnaire welcome page
    checkEligibilityButton.click()
    cy.url().should("include", "/eligibility/welcome")
  })

  it("Navigates through the eligibility questionnaire flow", () => {
    cy.visit("/eligibility/welcome")

    // Verify that the page welcomes us :)
    cy.contains("Welcome")

    // Find and click the "Next" button.
    cy.contains("Next").click()

    cy.url().should("include", "/eligibility/bedrooms")

    // Verify that we're asked next about how many bedrooms
    cy.contains("How many bedrooms do you need?")

    // Find and click to indicate both 2BR and 3BR
    cy.get("#twoBdrm").click()
    cy.get("#threeBdrm").click()

    cy.contains("Next").click()

    cy.url().should("include", "/eligibility/age")
  })

  /*
  it("Loads the listings page directly", () => {
    cy.visit("/listings")

    // Check that the listings page banner text is present on the page
    cy.contains("Rent affordable housing")
  })

  it("Loads the listings page directly", () => {
    cy.visit("/listings")

    // Check that the listings page banner text is present on the page
    cy.contains("Rent affordable housing")
  })

  it("Loads a non-listing-related page directly", () => {
    cy.visit("/disclaimer")

    // Check that the Disclaimer page banner text is present on the page
    cy.contains("Endorsement Disclaimers")
  })

  it("Can navigate to all page types after initial site load", () => {
    cy.visit("/")

    // Click on the Disclaimer page link in the footer
    cy.get("footer a").contains("Disclaimer").click()

    // Should be on the disclaimer page
    cy.location("pathname").should("equal", "/disclaimer")
    cy.contains("Endorsement Disclaimers")

    // Click on the listings page link in the header nav
    cy.get(".navbar").contains("Listings").click()

    // Should be on the listings page
    cy.location("pathname").should("equal", "/listings")
    cy.contains("Rent affordable housing")

    // Click on the navbar logo to go to the homepage
    cy.get(".navbar")
      .first()
      .within(() => {
        cy.get(".logo").click()
      })

    // Check that the homepage banner text is present on the page
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`)
    cy.contains("Apply for affordable housing")
  })
  */
})
