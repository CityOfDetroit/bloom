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
      cy.get("#addBuildingSelectionCriteriaButton")
        .contains("Add Building Selection Criteria")
        .click()
      cy.get("#criteriaAttachTypeURL").check()
      cy.getByID("buildingSelectionCriteriaURL").type(listing["buildingSelectionCriteriaURL"])
      cy.get(".p-4 > .is-primary").contains("Save").click()
      cy.get(".text-right > .button").contains("Application Process").click()
      cy.get("#reviewOrderFCFS").check()
      cy.get("#dueDateQuestionNo").check()
      cy.get("#waitlistOpenNo").check()
      cy.getByID("leasingAgentName").type(listing["leasingAgentName"])
      cy.getByID("leasingAgentEmail").type(listing["leasingAgentEmail"])
      cy.getByID("leasingAgentPhone").type(listing["leasingAgentPhone"])
      cy.getByID("leasingAgentTitle").type(listing["leasingAgentTitle"])
      cy.getByID("leasingAgentOfficeHours").type(listing["leasingAgentOfficeHours"])
      cy.get("#digitalApplicationChoiceYes").check()
      cy.get("#commonDigitalApplicationChoiceYes").check()
      cy.get("#paperApplicationNo").check()
      cy.get("#referralOpportunityNo").check()

      cy.getByID("leasingAgentAddress.street").type(listing["leasingAgentAddress.street"])
      cy.getByID("leasingAgentAddress.street2").type(listing["leasingAgentAddress.street2"])
      cy.getByID("leasingAgentAddress.city").type(listing["leasingAgentAddress.city"])
      cy.getByID("leasingAgentAddress.zipCode").type(listing["leasingAgentAddress.zipCode"])
      cy.getByID("leasingAgentAddress.state").select(listing["leasingAgentAddress.state"])

      cy.get("#applicationsMailedInYes").check()
      cy.get("#mailInAnotherAddress").check()
      cy.getByTestId("mailing-address-street").type(listing["leasingAgentAddress.street"])
      cy.getByTestId("mailing-address-street2").type(listing["leasingAgentAddress.street2"])
      cy.getByTestId("mailing-address-city").type(listing["leasingAgentAddress.city"])
      cy.getByTestId("mailing-address-zip").type(listing["leasingAgentAddress.zipCode"])
      cy.getByTestId("mailing-address-state").select(listing["leasingAgentAddress.state"])

      cy.get("#applicationsPickedUpNo").check()
      cy.get("#applicationsDroppedOffNo").check()
      cy.get("#postmarksConsideredYes").check()
      cy.getByTestId("postmark-date-field-month").type("12")
      cy.getByTestId("postmark-date-field-day").type("17")
      cy.getByTestId("postmark-date-field-year").type("2022")
      cy.getByTestId("postmark-time-field-hours").type("5")
      cy.getByTestId("postmark-time-field-minutes").type("45")
      cy.getByTestId("postmark-time-field-period").select("PM")
      cy.getByID("additionalApplicationSubmissionNotes").type(
        listing["additionalApplicationSubmissionNotes"]
      )

      // start publishing
      cy.get("#publishButton").contains("Publish").click()
      cy.get("#publishButtonConfirm").contains("Publish").click()
      cy.fixture("listing").then((listing) => {
        cy.get(".page-header__title > .font-semibold").contains(listing["name"])
      })
    })

    //verify the details section is correct
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
      cy.get("#unitTable").contains("Unit Type")
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
      cy.get("#leasingAgentName").contains(listing["leasingAgentName"])
      cy.get("#leasingAgentEmail").contains(listing["leasingAgentEmail"].toLowerCase())
      cy.get("#leasingAgentPhone").contains("(520) 245-8811")
      cy.get("#leasingAgentOfficeHours").contains(listing["leasingAgentOfficeHours"])
      cy.get("#leasingAgentTitle").contains(listing["leasingAgentTitle"])
      cy.get("#digitalApplication").contains("Yes")
      cy.getByID("digitalMethod.type").contains("Yes")
      cy.get("#paperApplication").contains("No")
      cy.get("#referralOpportunity").contains("No")
      cy.getByID("leasingAgentAddress.street").contains(listing["leasingAgentAddress.street"])
      cy.getByID("leasingAgentAddress.street2").contains(listing["leasingAgentAddress.street2"])
      cy.getByID("leasingAgentAddress.city").contains(listing["leasingAgentAddress.city"])
      cy.getByID("leasingAgentAddress.state").contains("CA")
      cy.getByID("leasingAgentAddress.zipCode").contains(listing["leasingAgentAddress.zipCode"])
      cy.getByID("applicationPickupQuestion").contains("No")
      cy.getByID("applicationMailingSection").contains("Yes")
      cy.getByTestId("applicationMailingAddress.street").contains(
        listing["leasingAgentAddress.street"]
      )
      cy.getByTestId("applicationMailingAddress.street2").contains(
        listing["leasingAgentAddress.street2"]
      )
      cy.getByTestId("applicationMailingAddress.city").contains(listing["leasingAgentAddress.city"])
      cy.getByTestId("applicationMailingAddress.zipCode").contains(
        listing["leasingAgentAddress.zipCode"]
      )
      cy.getByTestId("applicationMailingAddress.state").contains("CA")
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

    // try editting the listing
    cy.fixture("listing").then((listing) => {
      cy.getByTestId("listingEditButton").contains("Edit").click()
      cy.getByTestId("nameField").type(" (Edited)")
      cy.getByTestId("saveAndExitButton").contains("Save & Exit").click()
      cy.getByTestId("listingIsAlreadyLiveButton").contains("Save").click()
      cy.getByTestId("page-header-text").should("have.text", `${listing["name"]} (Edited)`)
    })
  })
})
