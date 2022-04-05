describe("Application Management Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("Application grid should display correct number of results", () => {
    cy.visit("/")
    cy.get(`[col-id="status"]`).eq(1).contains("Public").click()
    cy.get(".applications-table")
      .first()
      .find(".ag-center-cols-container")
      .first()
      .find(".ag-row")
      .should((elems) => {
        expect(elems).to.have.length(0)
      })
  })
})
