import { Views } from "./types"
import { getBaseAddressSelect } from "../../views/base.view"

const views: Views = {
  base: {
    select: [
      "listings.id",
      "listings.name",
      "listings.applicationDueDate",
      "listings.applicationOpenDate",
      "listings.reviewOrderType",
      "listings.status",
      "listings.waitlistMaxSize",
      "listings.waitlistCurrentSize",
      "listings.amiPercentageMax",
      "listings.assets",
      "image.id",
      "image.fileId",
      "image.label",
      "jurisdiction.id",
      "jurisdiction.name",
      "reservedCommunityType.id",
      "reservedCommunityType.name",
      "property.id",
      "property.unitsAvailable",
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
      "unitsSummary.id",
      "summaryUnitType.name",
      "unitsSummary.monthlyRentMin",
      "unitsSummary.monthlyRentMax",
      "unitsSummary.monthlyRentAsPercentOfIncome",
      "unitsSummary.amiPercentage",
      "unitsSummary.minimumIncomeMin",
      "unitsSummary.minimumIncomeMax",
      "unitsSummary.maxOccupancy",
      "unitsSummary.minOccupancy",
      "unitsSummary.floorMin",
      "unitsSummary.floorMax",
      "unitsSummary.sqFeetMin",
      "unitsSummary.sqFeetMax",
      "priorityType.id",
      "unitsSummary.totalCount",
      "unitsSummary.totalAvailable",
      "listingPreferences.ordinal",
      "listingPreferencesPreference.id",
      "listingPrograms.ordinal",
      "listingProgramsProgram.id",
    ],
    leftJoins: [
      { join: "listings.jurisdiction", alias: "jurisdiction" },
      { join: "listings.image", alias: "image" },
      { join: "listings.property", alias: "property" },
      { join: "property.buildingAddress", alias: "buildingAddress" },
      { join: "property.units", alias: "units" },
      { join: "units.unitType", alias: "unitType" },
      { join: "units.amiChartOverride", alias: "amiChartOverride" },
      { join: "listings.reservedCommunityType", alias: "reservedCommunityType" },
      { join: "listings.unitsSummary", alias: "unitsSummary" },
      { join: "unitsSummary.unitType", alias: "summaryUnitType" },
      { join: "unitsSummary.priorityType", alias: "priorityType" },
      { join: "listings.listingPreferences", alias: "listingPreferences" },
      { join: "listingPreferences.preference", alias: "listingPreferencesPreference" },
      { join: "listings.listingPrograms", alias: "listingPrograms" },
      { join: "listingPrograms.program", alias: "listingProgramsProgram" },
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
    ["listings.image", "image"],
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
    ["listings.unitsSummary", "unitsSummary"],
    ["unitsSummary.unitType", "summaryUnitType"],
    ["unitsSummary.priorityType", "summaryPriorityType"],
    ["listings.features", "listing_features"],
    ["listings.listingPrograms", "listingPrograms"],
    ["listingPrograms.program", "listingProgramsProgram"],
  ],
}

export { views }
