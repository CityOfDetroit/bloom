import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { CsvBuilder, KeyNumber } from "../applications/services/csv-builder.service"
import { getBirthday } from "../shared/utils/get-birthday"
import { formatBoolean } from "../shared/utils/format-boolean"
import { capitalizeFirstLetter } from "../shared/utils/capitalize-first-letter"
import { capAndSplit } from "../shared/utils/cap-and-split"
import { AddressCreateDto } from "../shared/dto/address.dto"
import Listing from "./entities/listing.entity"
import { map } from "rxjs"

@Injectable({ scope: Scope.REQUEST })
export class ListingsCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  exportFromObject(listings: any[]): string {
    const listingsObj = listings.map((listing) => {
      if (listing.name === "MLK Homes") {
        console.log("-----------------------")
        console.log(listing)
        console.log(
          Object.entries(listing.utilities ?? {})
            .filter((entry) => entry[1] === true)
            .map((entry) => entry[0])
            .join(",")
        )
      }
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
        // 	Grocery Stores
        //   Public Transportation
        //   	Schools
        //     Parks and Community Centers
        //     Pharmacies
        //     Health Care Resources
        //     Credit History
        //     Rental History
        //     Criminal Background
        //     Building Selection Critera
        //     Required Documents
        //     Important Program Rules
        //     	Special Notes
        //       Review Order
        //       Lottery Date
        //       Lottery Start
        //       Lottery End
        //       Lottery Notes
        //       Application Due Date
        //       	Waitlist
        //         Max Waitlist Size
        //         How many people on the current list?
        //         How many open spots on the waitlist?
        //         Marketing Status
        //         Marketing Season
        //         Marketing Date
        //         Leasing Company
        //         Leasing Email
        //         Leasing Phone
        //         Leasing Agent Title
        //         Leasing Agent Company
        //         Hours
        //         Leasing Agency Website
        //         Leasing Agency Street Address
        //         Leasing Agency Street 2
        //         	Leasing Agency City
        //           Leasing Agency Zip
        //           Leasing Agency Mailing Address
        //           Leasing Agency Mailing Address Street 2
        //           Leasing Agency Mailing Address City
        //           Leasing Agency Mailing Address Zip
        //           Leasing Agency Pickup Address
        //           Leasing Agency Pickup Address Street 2
        //            	Leasing Agency Pickup Address City
        //             	Leasing Agency Pickup Address Zip
        //               	leasing pick up office hours
        //                 Postmark
        //                 Digital Application
        //                 Digital Application URL
        //                 Paper Application
        //                 Paper Application url
        //                  	Users who have access
      }
    })

    return this.csvBuilder.buildFromIdIndex(listingsObj)
  }
}

// 		Latitude	Longitude	Home Type	Accept Section 8? 	Unit Group	Number of Unit Groups		Community Types 	Application Fee	Deposit Min	Deposit Max	Deposit Helper	Costs Not Included	Utilities Included	Property Amenities	Additional Accessibility Details	Unit Amenities	Smoking Policy	Pets Policy	Services Offered	Accessibility Features 	Grocery Stores	Public Transportation	Schools	Parks and Community Centers	Pharmacies	Health Care Resources	Credit History	Rental History	Criminal Background	Building Selection Critera 	Required Documents	Imprtant Program Rules	Special Notes 	Review Order	Lottery Date	Lottery Start	Lottery End	Lottery Notes 	Application Due Date	Waitlist	Max Waitlist Size	How many people on the current list?	How many open spots on the waitlist?	Marketing Status	Marketing Season	Marketing Date	Leasing Company 	Leasing Email 	Leasing Phone	Leasing Agent Title	Leasing Agent Company Hours	Leasing Agency Website	Leasing Agency Street Address 	Leasing Agency Street 2 	Leasing Agency City	Leasing Agency Zip	Leasing Agency Mailing Address 	Leasing Agency Mailing Address Street 2 	Leasing Agency Mailing Address City	Leasing Agency Mailing Address Zip	Leasing Agency Pickup Address 	Leasing Agency Pickup Address Street 2 	Leasing Agency Pickup Address City	Leasing Agency Pickup Address Zip	leasing pick up office hours 	Postmark 	Digital Application	Digital Application URL	Paper Application 	Paper Application url 	Users who have access
