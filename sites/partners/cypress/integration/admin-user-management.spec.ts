describe("Admin User Mangement Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("as admin user, should be able to download listings export", () => {
    cy.visit("/")
    cy.getByTestId("export-listings").click()
    const now = new Date()
    const month = now.getMonth() + 1
    const dayString = now.getDate()
    const timeString = `${now.getUTCHours()}-${now.getUTCMinutes()}-${now.getSeconds()}`
    const monthString = month < 10 ? `0${month}` : `${month}`
    cy.readFile(
      `cypress/downloads/${now.getFullYear()}-${monthString}-${dayString}_${timeString}-complete-listing-data.csv`
    )
  })
})
