import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { CsvBuilder, KeyNumber } from "../applications/services/csv-builder.service"
import { getBirthday } from "../shared/utils/get-birthday"
import { formatBoolean } from "../shared/utils/format-boolean"
import { capitalizeFirstLetter } from "../shared/utils/capitalize-first-letter"
import { capAndSplit } from "../shared/utils/cap-and-split"
import { AddressCreateDto } from "../shared/dto/address.dto"
import Listing from "./entities/listing.entity"
import { mapTo } from "../shared/mapTo"
import { PaperApplicationDto } from "../../src/paper-applications/dto/paper-application.dto"
// import { UnitType } from "src/unit-types/entities/unit-type.entity"
@Injectable({ scope: Scope.REQUEST })
export class ListingsCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  exportFromObject(listings: any[]): string {
    const listingsObj = listings.map((listing) => {
      return {
        ID: listing.id,
        Created_At_Date: listing.createdAt.toString(),
        Listing_Status: listing.status,
        //need to add to seed
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
          .filter((entry) => entry[1] === true)
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
        Lotter_End: dayjs(listing.events?.endTime).format("MM-DD-YYYY h:mm:ssA"),
        Lottery_Notes: listing.events?.note,
        Application_Due_Date: listing.applicationDueDate,
        Waitlist: listing.isWaitlistOpen,
        Max_Waitlist_Size: listing.waitlistMaxSize,
        How_many_people_on_the_current_list: listing.waitlistCurrentSize,
        How_many_open_spots_on_the_waitlist: listing.waitlistOpenSpots,
        Marketing_Status: listing.marketingStatus,
        Marketing_Season: listing.marketingSeason,
        Marketing_Date: listing.marketingDate,
        Leasing_Company: listing.managementCompany,
        Leasing_Email: listing.leasingAgentEmail,
        Leasing_Phone: listing.leasingAgentPhone,
        Leasing_Agent_Title: listing.leasingAgentTitle,
        Leasing_Agent_Company_Hours: listing.leasingAgentOfficeHours,
        Leasing_Agency_Website: listing.managementWebsite,
        Leasing_Agency_Street_Address: listing.property.leasingAgentAddress?.street,
        Leasing_Agency_Street_2: listing.property.leasingAgentAddress?.street2,
        Leasing_Agency_City: listing.property.leasingAgentAddress?.city,
        Leasing_Agency_Zip: listing.property.leasingAgentAddress?.zipCode,
        Leasing_Agency_Mailing_Address: listing.property?.applicationMailingAddress?.street,
        Leasing_Agency_Mailing_Address_Street_2:
          listing.property?.applicationMailingAddress?.street2,
        Leasing_Agency_Mailing_Address_City: listing.property?.applicationMailingAddress?.city,
        Leasing_Agency_Mailing_Address_Zip: listing.property?.applicationMailingAddress?.zipCode,
        Leasing_Agency_Pickup_Address: listing.property?.applicationPickupAddress?.street,
        Leasing_Agency_Pickup_Address_Street_2: listing.property?.applicationPickUpAddress?.street2,
        Leasing_Agency_Pickup_Address_City: listing.property?.applicationPickUpAddress?.city,
        Leasing_Agency_Pickup_Address_Zip: listing.property?.applicationPickUpAddress?.zipCode,
        Leasing_Pick_Up_Office_Hours: listing.applicationPickUpAddressOfficeHours,
        Postmark: listing.postmarkedApplicationsReceivedByDate,
        Digital_Application: listing.digitalApplication,
        Digital_Application_URL: listing.applicationMethods[1]?.externalReference,
        Paper_Application: listing.paperApplication,
        //fix this!
        Paper_Application_URL: mapTo(
          PaperApplicationDto,
          listing.applicationMethods[0]?.paperApplications ?? {}
        ),
        //                  	Users who have access
      }
    })

    return this.csvBuilder.buildFromIdIndex(listingsObj)
  }

  exportUnitsFromObject(listings: any[]): string {
    const reformattedListings = []
    listings.forEach((listing) => {
      listing.unitGroups.forEach((unitGroup) => {
        reformattedListings.push({ id: listing.id, name: listing.name, unitGroup })
      })
    })
    const listingsObj = reformattedListings.map((listing) => {
      if (listing.name === "MLK Homes" && listing.unitGroup?.maxOccupancy === 4) {
        console.log(listing.unitGroup)
      }
      console.log("-----------------------")
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

    return this.csvBuilder.buildFromIdIndex(listingsObj)
  }
}
