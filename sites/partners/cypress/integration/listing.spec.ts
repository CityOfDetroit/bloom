describe("Listing Management Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("full listing publish", () => {
    cy.visit("/")
    cy.get("a > .button").contains("Add Listing").click()
    cy.contains("New Listing")

    const fieldsToType = [
      { fieldID: "name" },
      { fieldID: "developer" },
      { fieldID: "buildingAddress.street" },
      { fieldID: "buildingAddress.city" },
      { fieldID: "buildingAddress.zipCode" },
      { fieldID: "yearBuilt" },
      { fieldID: "applicationFee" },
      { fieldID: "depositMin" },
      { fieldID: "depositMax" },
      { fieldID: "costsNotIncluded" },
      { fieldID: "applicationFee" },
      { fieldID: "depositMin" },
      { fieldID: "depositMax" },
      { fieldID: "costsNotIncluded" },
      { fieldID: "amenities" },
      { fieldID: "accessibility" },
      { fieldID: "unitAmenities" },
      { fieldID: "smokingPolicy" },
      { fieldID: "petPolicy" },
      { fieldID: "servicesOffered" },
      { fieldID: "creditHistory" },
      { fieldID: "rentalHistory" },
      { fieldID: "criminalBackground" },
      { fieldID: "requiredDocuments" },
      { fieldID: "programRules" },
      { fieldID: "specialNotes" },
    ]

    const fieldsToSelect = [
      { fieldID: "jurisdiction.id" },
      { fieldID: "neighborhood" },
      { fieldID: "buildingAddress.state" },
    ]

    const fieldsToTypeUnits = [
      { fieldID: "totalCount", byTestID: true },
      { fieldID: "sqFeetMin", byTestID: true },
      { fieldID: "sqFeetMax", byTestID: true },
      { fieldID: "totalAvailable", byTestID: true },
    ]

    const fieldsToSelectUnits = [
      { fieldID: "minOccupancy", byTestID: true },
      { fieldID: "maxOccupancy", byTestID: true },
      { fieldID: "floorMin", byTestID: true },
      { fieldID: "floorMax", byTestID: true },
      { fieldID: "bathroomMin", byTestID: true },
      { fieldID: "bathroomMax", byTestID: true },
      { fieldID: "priorityType.id", byTestID: true },
    ]

    const fieldsToTypeAMI = [{ fieldID: "flatRentValue", byTestID: true }]

    const fieldsToSelectAMI = [
      { fieldID: "amiChartId", byTestID: true },
      { fieldID: "amiPercentage", byTestID: true },
    ]

    const fieldsToTypePart2 = [
      { fieldID: "leasingAgentName" },
      { fieldID: "leasingAgentEmail" },
      { fieldID: "leasingAgentPhone" },
      { fieldID: "leasingAgentTitle" },
      { fieldID: "leasingAgentOfficeHours" },
      { fieldID: "leasingAgentAddress.street" },
      { fieldID: "leasingAgentAddress.street2" },
      { fieldID: "leasingAgentAddress.city" },
      { fieldID: "leasingAgentAddress.zipCode" },
      {
        fieldID: "mailing-address-street",
        byTestID: true,
        fixtureID: "leasingAgentAddress.street",
      },
      {
        fieldID: "mailing-address-street2",
        byTestID: true,
        fixtureID: "leasingAgentAddress.street2",
      },
      { fieldID: "mailing-address-city", byTestID: true, fixtureID: "leasingAgentAddress.city" },
      { fieldID: "mailing-address-zip", byTestID: true, fixtureID: "leasingAgentAddress.zipCode" },
      { fieldID: "additionalApplicationSubmissionNotes" },
    ]

    const fieldsToSelectPart2 = [
      { fieldID: "leasingAgentAddress.state" },
      { fieldID: "mailing-address-state", byTestID: true, fixtureID: "leasingAgentAddress.state" },
    ]

    // start of part 1
    cy.getByID("addPhotoButton").contains("Add Photo").click()
    cy.get(`[data-test-id="dropzone-input"]`).attachFile(
      "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96.jpeg",
      {
        subjectType: "drag-n-drop",
      }
    )
    cy.get(`[data-test-id="listing-photo-uploaded"]`).contains("Save").click()
    cy.fillFormFields("listing", fieldsToType, fieldsToSelect)

    // start of unit group
    cy.getByTestId("addUnitsButton").contains("Add unit group").click()
    cy.getByTestId("unitTypeCheckBox").first().click()
    cy.getByTestId("openWaitListQuestion").last().click()
    cy.fillFormFields("listing", fieldsToTypeUnits, fieldsToSelectUnits)

    // start of ami
    cy.getByTestId("openAmiDrawer").contains("Add AMI level").click()
    cy.fillFormFields("listing", fieldsToTypeAMI, fieldsToSelectAMI)
    cy.getByTestId("saveAmi").click()
    cy.getByTestId("saveUnit").click()

    cy.fixture("listing").then((listing) => {
      cy.get(".addressPopup").contains(listing["buildingAddress.street"])
      // start of building selection
      cy.get("#addBuildingSelectionCriteriaButton")
        .contains("Add Building Selection Criteria")
        .click()
      cy.get("#criteriaAttachTypeURL").check()
      cy.getByID("buildingSelectionCriteriaURL").type(listing["buildingSelectionCriteriaURL"])
      cy.get(".p-4 > .is-primary").contains("Save").click()
    })

    // start of part 2
    cy.get(".text-right > .button").contains("Application Process").click()
    cy.get("#waitlistOpenNo").check()
    cy.get("#digitalApplicationChoiceYes").check()
    cy.get("#commonDigitalApplicationChoiceYes").check()
    cy.get("#paperApplicationNo").check()
    cy.get("#applicationsMailedInYes").check()
    cy.get("#mailInAnotherAddress").check()
    cy.get("#applicationsPickedUpNo").check()
    cy.get("#applicationsDroppedOffNo").check()
    cy.get("#postmarksConsideredYes").check()
    cy.getByTestId("postmark-date-field-month").type("12")
    cy.getByTestId("postmark-date-field-day").type("17")
    cy.getByTestId("postmark-date-field-year").type("2022")
    cy.getByTestId("postmark-time-field-hours").type("5")
    cy.getByTestId("postmark-time-field-minutes").type("45")
    cy.getByTestId("postmark-time-field-period").select("PM")
    cy.fillFormFields("listing", fieldsToTypePart2, fieldsToSelectPart2)

    // start publishing
    cy.get("#publishButton").contains("Publish").click()
    cy.get("#publishButtonConfirm").contains("Publish").click()
    cy.fixture("listing").then((listing) => {
      cy.get(".page-header__title > .font-semibold").contains(listing["name"])
    })
  })

  it("verify details page", () => {
    cy.fixture("listing").then((listing) => {
      cy.getByID("jurisdiction.name").contains(listing["jurisdiction.id"])
      cy.get("#name").contains(listing["name"])
      cy.get("#developer").contains(listing["developer"])
      cy.get('[data-label="File Name"]').contains(
        "cypress-automated-image-upload-071e2ab9-5a52-4f34-85f0-e41f696f4b96"
      )
      cy.getByID("buildingAddress.street").contains(listing["buildingAddress.street"])
      cy.get("#neighborhood").contains(listing.neighborhood)
      cy.getByID("buildingAddress.city").contains(listing["buildingAddress.city"])
      cy.getByID("buildingAddress.state").contains("CA")
      cy.getByID("buildingAddress.zipCode").contains(listing["buildingAddress.zipCode"])
      cy.get("#yearBuilt").contains(listing["yearBuilt"])
      cy.get("#longitude").contains("-122.40078")
      cy.get("#latitude").contains("37.79006")

      cy.get("#unitTable").contains(listing["totalCount"])
      cy.get("#unitTable").contains(`${listing["amiPercentage"]}%`)
      cy.get("#unitTable").contains(`$${listing["flatRentValue"]}`)
      cy.get("#unitTable").contains(`${listing["minOccupancy"]} - ${listing["maxOccupancy"]}`)
      cy.get("#unitTable").contains(`${listing["sqFeetMin"]} - ${listing["sqFeetMax"]}`)
      cy.get("#unitTable").contains(`${listing["bathroomMin"]} - ${listing["bathroomMax"]}`)

      cy.get("#applicationFee").contains(listing["applicationFee"])
      cy.get("#applicationFee").contains(listing["applicationFee"])
      cy.get("#applicationFee").contains(listing["applicationFee"])
      cy.get("#depositMin").contains(listing["depositMin"])
      cy.get("#depositMax").contains(listing["depositMax"])
      cy.get("#costsNotIncluded").contains(listing["costsNotIncluded"])
      cy.get("#amenities").contains(listing["amenities"])
      cy.get("#unitAmenities").contains(listing["unitAmenities"])
      cy.get("#accessibility").contains(listing["accessibility"])
      cy.get("#smokingPolicy").contains(listing["smokingPolicy"])
      cy.get("#petPolicy").contains(listing["petPolicy"])
      cy.get("#servicesOffered").contains(listing["servicesOffered"])
      cy.get("#creditHistory").contains(listing["creditHistory"])
      cy.get("#rentalHistory").contains(listing["rentalHistory"])
      cy.get("#criminalBackground").contains(listing["criminalBackground"])
      cy.get("#rentalAssistance").contains(
        "The property is subsidized by the Section 8 Project-Based Voucher Program. As a result, Housing Choice Vouchers, Section 8 and other valid rental assistance programs are not accepted by this property."
      )
      cy.get("#buildingSelectionCriteriaTable").contains(listing["buildingSelectionCriteriaURL"])
      cy.get("#requiredDocuments").contains(listing["requiredDocuments"])
      cy.get("#programRules").contains(listing["programRules"])
      cy.get("#specialNotes").contains(listing["specialNotes"])
      cy.getByID("waitlist.openQuestion").contains("No")
      cy.get("#whatToExpect").contains(
        "Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents."
      )
      cy.get("#leasingAgentName").contains(listing["leasingAgentName"])
      cy.get("#leasingAgentEmail").contains(listing["leasingAgentEmail"].toLowerCase())
      cy.get("#leasingAgentPhone").contains("(520) 245-8811")
      cy.get("#leasingAgentOfficeHours").contains(listing["leasingAgentOfficeHours"])
      cy.get("#leasingAgentTitle").contains(listing["leasingAgentTitle"])
      cy.get("#digitalApplication").contains("Yes")
      cy.getByID("digitalMethod.type").contains("Yes")
      cy.get("#paperApplication").contains("No")
      cy.getByID("leasingAgentAddress.street").contains(listing["leasingAgentAddress.street"])
      cy.getByID("leasingAgentAddress.street2").contains(listing["leasingAgentAddress.street2"])
      cy.getByID("leasingAgentAddress.city").contains(listing["leasingAgentAddress.city"])
      cy.getByID("leasingAgentAddress.state").contains("CA")
      cy.getByID("leasingAgentAddress.zipCode").contains(listing["leasingAgentAddress.zipCode"])
      cy.getByID("applicationPickupQuestion").contains("No")
      cy.getByID("applicationMailingSection").contains("Yes")
      cy.getByTestId("mailing-address-street").contains(listing["leasingAgentAddress.street"])
      cy.getByTestId("mailing-address-street2").contains(listing["leasingAgentAddress.street2"])
      cy.getByTestId("mailing-address-city").contains(listing["leasingAgentAddress.city"])
      cy.getByTestId("mailing-address-zip").contains(listing["leasingAgentAddress.zipCode"])
      cy.getByTestId("mailing-address-state").contains("CA")
      cy.get("#applicationDropOffQuestion").contains("No")
      cy.get("#postmarksConsideredQuestion").contains("Yes")
      cy.getByTestId("postmark-date").contains("12")
      cy.getByTestId("postmark-date").contains("17")
      cy.getByTestId("postmark-date").contains("2022")
      cy.getByTestId("postmark-time").contains("5")
      cy.getByTestId("postmark-time").contains("45")
      cy.getByTestId("postmark-time").contains("PM")
      cy.get("#additionalApplicationSubmissionNotes").contains(
        listing["additionalApplicationSubmissionNotes"]
      )
    })
  })

  // skipping for flakiness
  it.skip("verify open listing warning happens", () => {
    cy.getByTestId("listingEditButton").contains("Edit").click()
    cy.getByTestId("nameField").type(" (Edited)")
    cy.getByTestId("saveAndExitButton").contains("Save & Exit").click()
    cy.getByTestId("listingIsAlreadyLiveButton").contains("Save").click()
    cy.fixture("listing").then((listing) => {
      cy.get(".page-header__title").should("have.text", `${listing["name"]} (Edited)`)
    })
  })
})
