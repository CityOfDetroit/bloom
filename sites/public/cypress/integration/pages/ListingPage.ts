describe("Individual listing page", () => {
  it("renders the page correctly, with the name of the listing", () => {
    cy.visit("/listing/06436559-e84c-4f75-881a-13765f480b39")
    cy.contains("Archer Studios")
  })
})
