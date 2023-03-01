import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { CsvBuilder } from "../applications/services/csv-builder.service"
@Injectable({ scope: Scope.REQUEST })
export class ListingsCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  exportListingsFromObject(listings: any[], users: any[]): string {
    // restructure user information to listingId->user rather than user->listingId
    const partnerAccessHelper = {}
    const adminList = []
    users.forEach((user) => {
      const userName = `${user.firstName} ${user.lastName}`
      if (!user.roles?.isAdmin) {
        user.leasingAgentInListings.forEach((listing) => {
          partnerAccessHelper[listing.id]
            ? partnerAccessHelper[listing.id].push(userName)
            : (partnerAccessHelper[listing.id] = [userName])
        })
      } else {
        adminList.push(userName)
      }
    })

    const listingObj = listings.map((listing) => {
      return {
        ID: listing.id,
        Created_At_Date: listing.createdAt.toString(),
        Listing_Status: listing.status,
        Publish_Date: listing.publishedAt?.toString(),
        Verified: listing.isVerified,
        Verified_Date: listing.verifiedAt?.toString(),
        Last_Updated: listing.updatedAt?.toString(),
        Listing_Name: listing.name,
        Developer_Property_Owner: listing.property.developer,
        Street_Address: listing.property.buildingAddress?.street,
        City: listing.property.buildingAddress?.city,
        State: listing.property.buildingAddress?.state,
        Zip: listing.property.buildingAddress?.zipCode,
        Year_Built: listing.property.yearBuilt,
        Neighborhood: listing.property.neighborhood,
        Region: listing.property.region,
        Latitude: listing.property.buildingAddress?.latitude,
        Longitude: listing.property.buildingAddress?.longitude,
        Home_Type: listing.homeType,
        Accept_Section_8: listing.section8Acceptance,
        Number_Of_Unit_Groups: listing.unitGroups?.length,
        Community_Types: listing.listingPrograms
          ?.map((listingProgram) => listingProgram.program.title)
          .join(", "),
        Application_Fee: listing.applicationFee,
        Deposit_Min: listing.depositMin,
        Deposit_Max: listing.depositMax,
        Deposit_Helper: listing.depositHelperText,
        Costs_Not_Included: listing.costsNotIncluded,
        Utilities_Included: Object.entries(listing.utilities ?? {})
          .filter((entry) => entry[1] === true)
          .map((entry) => entry[0])
          .join(", "),
        Property_Amenities: listing.property.amenities,
        Additional_Accessibility_Details: listing.property.accessibility,
        Unit_Amenities: listing.property.unitAmenities,
        Smoking_Policy: listing.property.smokingPolicy,
        Pets_Policy: listing.property.petPolicy,
        Services_Offered: listing.property.servicesOffered,
        Accessibility_Features: Object.entries(listing.features ?? {})
          ?.filter((entry) => entry[1] === true)
          .map((entry) => entry[0])
          .join(", "),
        Grocery_Stores: listing.neighborhoodAmenities?.groceryStores,
        Public_Transportation: listing.neighborhoodAmenities?.publicTransportation,
        Schools: listing.neighborhoodAmenities?.schools,
        Parks_and_Community_Centers: listing.neighborhoodAmenities?.parksAndCommunityCenters,
        Pharmacies: listing.neighborhoodAmenities?.pharmacies,
        Health_Care_Resources: listing.neighborhoodAmenities?.healthCareResources,
        Credit_History: listing.creditHistory,
        Rental_History: listing.rentalHistory,
        Criminal_Background: listing.criminalBackground,
        Building_Selection_Critera: listing.buildingSelectionCriteria,
        Required_Documents: listing.requiredDocuments,
        Important_Program_Rules: listing.programRules,
        Special_Notes: listing.specialNotes,
        Review_Order: listing.reviewOrderType,
        Lottery_Date: dayjs(listing.events?.startTime).format("MM-DD-YYYY"),
        Lottery_Start: dayjs(listing.events?.startTime).format("MM-DD-YYYY h:mm:ssA"),
        Lottery_End: dayjs(listing.events?.endTime).format("MM-DD-YYYY h:mm:ssA"),
        Lottery_Notes: listing.events[0]?.note,
        Application_Due_Date: listing.applicationDueDate,
        Waitlist: listing.isWaitlistOpen,
        Max_Waitlist_Size: listing.waitlistMaxSize,
        How_many_people_on_the_current_list: listing.waitlistCurrentSize,
        How_many_open_spots_on_the_waitlist: listing.waitlistOpenSpots,
        Marketing_Status: listing.marketingType,
        Marketing_Season: listing.marketingSeason,
        Marketing_Date: dayjs(listing.marketingDate).format("YYYY"),
        Leasing_Company: listing.managementCompany,
        Leasing_Email: listing.leasingAgentEmail,
        Leasing_Phone: listing.leasingAgentPhone,
        Leasing_Agent_Title: listing.leasingAgentTitle,
        Leasing_Agent_Company_Hours: listing.leasingAgentOfficeHours,
        Leasing_Agency_Website: listing.managementWebsite,
        Leasing_Agency_Street_Address: listing.leasingAgentAddress?.street,
        Leasing_Agency_Street_2: listing.leasingAgentAddress?.street2,
        Leasing_Agency_City: listing.leasingAgentAddress?.city,
        Leasing_Agency_Zip: listing.leasingAgentAddress?.zipCode,
        Leasing_Agency_Mailing_Address: listing.applicationMailingAddress?.street,
        Leasing_Agency_Mailing_Address_Street_2: listing.applicationMailingAddress?.street2,
        Leasing_Agency_Mailing_Address_City: listing.applicationMailingAddress?.city,
        Leasing_Agency_Mailing_Address_Zip: listing.applicationMailingAddress?.zipCode,
        Leasing_Agency_Pickup_Address: listing.applicationPickupAddress?.street,
        Leasing_Agency_Pickup_Address_Street_2: listing.applicationPickUpAddress?.street2,
        Leasing_Agency_Pickup_Address_City: listing.applicationPickUpAddress?.city,
        Leasing_Agency_Pickup_Address_Zip: listing.applicationPickUpAddress?.zipCode,
        Leasing_Pick_Up_Office_Hours: listing.applicationPickUpAddressOfficeHours,
        Postmark: listing.postmarkedApplicationsReceivedByDate
          ? dayjs(listing.postmarkedApplicationsReceivedByDate).format("MM-DD-YYYY h:mm:ssA")
          : "",
        Digital_Application: listing.digitalApplication,
        Digital_Application_URL: listing.applicationMethods[1]?.externalReference,
        Paper_Application: listing.paperApplication,
        Paper_Application_Filename:
          listing.applicationMethods[0]?.paperApplications[0]?.file?.fileId,
        Users_Who_Have_Access: adminList.concat(partnerAccessHelper[listing.id]).join(", "),
      }
    })

    return this.csvBuilder.buildFromIdIndex(listingObj)
  }

  exportUnitsFromObject(listings: any[]): string {
    const reformattedListings = []
    listings.forEach((listing) => {
      listing.unitGroups.forEach((unitGroup) => {
        reformattedListings.push({ id: listing.id, name: listing.name, unitGroup })
      })
    })
    const unitsObj = reformattedListings.map((listing) => {
      return {
        Listing_ID: listing.id,
        Listing_Name: listing.name,
        Unit_Group_ID: listing.unitGroup?.id,
        Unit_Types: listing.unitGroup?.unitType.map((type) => type.name).join(", "),
        AMI_Chart: listing.unitGroup?.amiLevels[0]?.amiChart?.name,
        AMI_Level: listing.unitGroup?.amiLevels[0]?.amiPercentage,
        Rent_Type: listing.unitGroup?.amiLevels[0]?.monthlyRentDeterminationType,
        Monthly_Rent: listing.unitGroup?.amiLevels[0]?.flatRentValue,
        Affordable_Unit_Group_Quantity: listing.unitGroup?.totalCount,
        Unit_Group_Vacancies: listing.unitGroup?.totalAvailable,
        Waitlist_Status: listing.unitGroup?.openWaitlist,
        Minimum_Occupancy: listing.unitGroup?.minOccupancy,
        Maximum_Occupancy: listing.unitGroup?.maxOccupancy,
        Minimum_Sq_ft: listing.unitGroup?.sqFeetMin,
        Maximum_Sq_ft: listing.unitGroup?.sqFeetMax,
        Minimum_Floor: listing.unitGroup?.floorMin,
        Maximum_Floor: listing.unitGroup?.floorMax,
        Minimum_Bathrooms: listing.unitGroup?.bathroomMin,
        Maximum_Bathrooms: listing.unitGroup?.bathroomMax,
      }
    })

    return this.csvBuilder.buildFromIdIndex(unitsObj)
  }
}
