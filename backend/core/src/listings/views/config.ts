import { Views } from "./types"
import { getBaseAddressSelect } from "../../views/base.view"

const views: Views = {
  base: {
    select: [
      "listings.id",
      "listings.name",
      "listings.applicationDueDate",
      "listings.applicationOpenDate",
      "listings.marketingType",
      "listings.marketingDate",
      "listings.marketingSeason",
      "listings.reviewOrderType",
      "listings.status",
      "listings.assets",
      "listings.isVerified",
      "listings.closedAt",
      "listings.publishedAt",
      "jurisdiction.id",
      "jurisdiction.name",
      "reservedCommunityType.id",
      "reservedCommunityType.name",
      "property.id",
      ...getBaseAddressSelect(["buildingAddress"]),
      "units.id",
      "units.floor",
      "units.minOccupancy",
      "units.maxOccupancy",
      "units.monthlyIncomeMin",
      "units.monthlyRent",
      "units.monthlyRentAsPercentOfIncome",
      "units.sqFeet",
      "units.status",
      "amiChartOverride.id",
      "amiChartOverride.items",
      "unitType.id",
      "unitType.name",
      "listingPreferences.ordinal",
      "listingPreferencesPreference.id",
      "listingPrograms.ordinal",
      "listingProgramsProgram.id",
      "listingImages.ordinal",
      "listingImagesImage.id",
      "listingImagesImage.fileId",
      "listingImagesImage.label",
      "features.id",
      "features.elevator",
      "features.wheelchairRamp",
      "features.serviceAnimalsAllowed",
      "features.accessibleParking",
      "features.parkingOnSite",
      "features.inUnitWasherDryer",
      "features.barrierFreeEntrance",
      "features.rollInShower",
      "features.grabBars",
      "features.heatingInUnit",
      "features.acInUnit",
      "features.laundryInBuilding",
      "listingPrograms.ordinal",
      "listingsProgramsProgram.id",
      "listingsProgramsProgram.title",
      "summaryUnitType.numBedrooms",
      "listingPreferencesPreference.id",
    ],
    leftJoins: [
      { join: "listings.jurisdiction", alias: "jurisdiction" },
      { join: "listings.property", alias: "property" },
      { join: "property.buildingAddress", alias: "buildingAddress" },
      { join: "listings.reservedCommunityType", alias: "reservedCommunityType" },
      { join: "listings.images", alias: "listingImages" },
      { join: "listingImages.image", alias: "listingImagesImage" },
      { join: "listings.features", alias: "features" },
      { join: "listings.listingPrograms", alias: "listingPrograms" },
      { join: "listingPrograms.program", alias: "listingsProgramsProgram" },
      { join: "listings.unitGroups", alias: "unitGroups" },
      { join: "unitGroups.unitType", alias: "summaryUnitType" },
    ],
  },
}

views.partnerList = {
  select: [
    "listings.id",
    "listings.name",
    "listings.applicationDueDate",
    "listings.status",
    "listings.waitlistMaxSize",
    "listings.waitlistCurrentSize",
    "property.unitsAvailable",
  ],
  leftJoins: [{ join: "listings.property", alias: "property" }],
}

views.detail = {
  select: [
    ...views.base.select,
    "listings.additionalApplicationSubmissionNotes",
    "listings.applicationFee",
    "listings.applicationOrganization",
    "listings.applicationPickUpAddressOfficeHours",
    "listings.applicationPickUpAddressType",
    "listings.applicationDropOffAddressOfficeHours",
    "listings.applicationDropOffAddressType",
    "listings.applicationMailingAddressType",
    "listings.buildingSelectionCriteria",
    "listings.costsNotIncluded",
    "listings.creditHistory",
    "listings.criminalBackground",
    "listings.depositMin",
    "listings.depositMax",
    "listings.disableUnitsAccordion",
    "listings.jurisdiction",
    "listings.leasingAgentEmail",
    "listings.leasingAgentName",
    "listings.leasingAgentOfficeHours",
    "listings.leasingAgentPhone",
    "listings.leasingAgentTitle",
    "listings.postmarkedApplicationsReceivedByDate",
    "listings.programRules",
    "listings.rentalAssistance",
    "listings.rentalHistory",
    "listings.requiredDocuments",
    "listings.specialNotes",
    "listings.whatToExpect",
    "listings.displayWaitlistSize",
    "listings.reservedCommunityDescription",
    "listings.reservedCommunityMinAge",
    "listings.resultLink",
    "listings.isWaitlistOpen",
    "listings.waitlistOpenSpots",
    "listings.customMapPin",
    "listings.features",
    "buildingSelectionCriteriaFile.id",
    "buildingSelectionCriteriaFile.fileId",
    "buildingSelectionCriteriaFile.label",
    "applicationMethods.id",
    "applicationMethods.label",
    "applicationMethods.externalReference",
    "applicationMethods.acceptsPostmarkedApplications",
    "applicationMethods.phoneNumber",
    "applicationMethods.type",
    "paperApplications.id",
    "paperApplications.language",
    "paperApplicationFile.id",
    "paperApplicationFile.fileId",
    "paperApplicationFile.label",
    "listingEvents.id",
    "listingEvents.type",
    "listingEvents.startTime",
    "listingEvents.endTime",
    "listingEvents.url",
    "listingEvents.note",
    "listingEvents.label",
    "listingEventFile.id",
    "listingEventFile.fileId",
    "listingEventFile.label",
    "result.id",
    "result.fileId",
    "result.label",
    ...getBaseAddressSelect([
      "leasingAgentAddress",
      "applicationPickUpAddress",
      "applicationMailingAddress",
      "applicationDropOffAddress",
    ]),
    "leasingAgents.firstName",
    "leasingAgents.lastName",
    "leasingAgents.email",
    "listingPreferencesPreference.title",
    "listingPreferencesPreference.subtitle",
    "listingPreferencesPreference.description",
    "listingPreferencesPreference.ordinal",
    "listingPreferencesPreference.links",
    "listingPreferencesPreference.formMetadata",
  ],
  leftJoins: [
    ...views.base.leftJoins,
    { join: "listings.applicationMethods", alias: "applicationMethods" },
    { join: "applicationMethods.paperApplications", alias: "paperApplications" },
    { join: "paperApplications.file", alias: "paperApplicationFile" },
    { join: "listings.buildingSelectionCriteriaFile", alias: "buildingSelectionCriteriaFile" },
    { join: "listings.events", alias: "listingEvents" },
    { join: "listingEvents.file", alias: "listingEventFile" },
    { join: "listings.result", alias: "result" },
    { join: "listings.leasingAgentAddress", alias: "leasingAgentAddress" },
    { join: "listings.applicationPickUpAddress", alias: "applicationPickUpAddress" },
    { join: "listings.applicationMailingAddress", alias: "applicationMailingAddress" },
    { join: "listings.applicationDropOffAddress", alias: "applicationDropOffAddress" },
    { join: "listings.leasingAgents", alias: "leasingAgents" },
  ],
}

views.full = {
  leftJoinAndSelect: [
    ["listings.applicationMethods", "applicationMethods"],
    ["applicationMethods.paperApplications", "paperApplications"],
    ["paperApplications.file", "paperApplicationFile"],
    ["listings.buildingSelectionCriteriaFile", "buildingSelectionCriteriaFile"],
    ["listings.events", "listingEvents"],
    ["listingEvents.file", "listingEventFile"],
    ["listings.result", "result"],
    ["listings.leasingAgentAddress", "leasingAgentAddress"],
    ["listings.applicationPickUpAddress", "applicationPickUpAddress"],
    ["listings.applicationMailingAddress", "applicationMailingAddress"],
    ["listings.applicationDropOffAddress", "applicationDropOffAddress"],
    ["listings.leasingAgents", "leasingAgents"],
    ["listings.listingPreferences", "listingPreferences"],
    ["listingPreferences.preference", "listingPreferencesPreference"],
    ["listings.property", "property"],
    ["property.buildingAddress", "buildingAddress"],
    ["property.units", "units"],
    ["units.amiChartOverride", "amiChartOverride"],
    ["units.unitType", "unitTypeRef"],
    ["units.unitRentType", "unitRentType"],
    ["units.priorityType", "priorityType"],
    ["units.amiChart", "amiChart"],
    ["listings.jurisdiction", "jurisdiction"],
    ["listings.reservedCommunityType", "reservedCommunityType"],
    ["listings.unitGroups", "unitGroups"],
    ["unitGroups.unitType", "summaryUnitType"],
    ["unitGroups.priorityType", "summaryPriorityType"],
    ["unitGroups.amiLevels", "unitGroupsAmiLevels"],
    ["listings.features", "listing_features"],
    ["listings.listingPrograms", "listingPrograms"],
    ["listingPrograms.program", "listingProgramsProgram"],
    ["listings.images", "listingImages"],
    ["listingImages.image", "listingImagesImage"],
  ],
}

export { views }
