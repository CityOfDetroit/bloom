import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { CsvBuilder, KeyNumber } from "../applications/services/csv-builder.service"
import { getBirthday } from "../shared/utils/get-birthday"
import { formatBoolean } from "../shared/utils/format-boolean"
import { capitalizeFirstLetter } from "../shared/utils/capitalize-first-letter"
import { capAndSplit } from "../shared/utils/cap-and-split"
import { AddressCreateDto } from "../shared/dto/address.dto"
import Listing from "./entities/listing.entity"

@Injectable({ scope: Scope.REQUEST })
export class ListingsCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  exportFromObject(listings: any[]): string {
    const listingsObj = listings.map((listing) => {
      return {
        ID: listing.id,
        Created_At_Date: listing.createdAt,
        Listing_Status: listing.status,
        Publish_Date: listing.publishedAt,
        Close_Date: listing.closedAt,
        Verified: listing.isVerified,
        Verified_Date: listing.verifiedAt,
        Last_Updated: listing.updatedAt,
        Listing_Name: listing.name,
        Developer_Property_Owner: listing.ownerCompany,
        Street_Address: listing.street,
        City: listing.city,
        State: listing.state,
        Zip: listing.Zip,
        Year_Built: listing.yearBuilt,
        Neighborhood: listing.neighborhood,
        Region: listing.region,
        Latitude: listing.latitude,
        Longitude: listing.longitude,
        Home_Type: listing.homeType,
        Accept_Section_8: listing.section8Acceptance,
        // Unit Group
        // Number of Unit Groups
        Community_Types: listing.communityTypes,
        Application_Fee: listing.applicationFee,
        Deposit_Min: listing.depositMin,
        Deposit_Max: listing.depositMax,
        Deposit_Helper: listing.depositHelper,
        Costs_Not_Included: listing.costsNotIncluded,
        Utilities_Included: listing.utilitiesIncluded,
        Property_Amenities: listing.propertyAmenities,
        Additional_Accessibility_Details: listing.additionalAccessibilityDetails,
        Unit_Amenities: listing.unitAmenities,
        // Smoking Policy
        // Pets Policy
        // Services Offered
        // Accessibility Features
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
