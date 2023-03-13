import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { CsvBuilder } from "../applications/services/csv-builder.service"

@Injectable({ scope: Scope.REQUEST })
export class ListingsCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  cloudinaryPdfFromId = (publicId: string) => {
    const cloudName = process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.pdf`
  }

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
      listing.name === "MLK Homes" && console.log(listing)
      return {
        ID: listing.id,
        "Created At Date": listing.createdAt.toString(),
        "Listing Status": listing.status,
        "Publish Date": listing.publishedAt?.toString(),
        Verified: listing.isVerified,
        "Verified Date": listing.verifiedAt?.toString(),
        "Last Updated": listing.updatedAt?.toString(),
        "Listing Name": listing.name,
        "Developer Property Owner": listing.property.developer,
        "Street Address": listing.property.buildingAddress?.street,
        City: listing.property.buildingAddress?.city,
        State: listing.property.buildingAddress?.state,
        Zip: listing.property.buildingAddress?.zipCode,
        "Year Built": listing.property.yearBuilt,
        Neighborhood: listing.property.neighborhood,
        Region: listing.property.region,
        Latitude: listing.property.buildingAddress?.latitude,
        Longitude: listing.property.buildingAddress?.longitude,
        "Home Type": listing.homeType,
        "Accept Section 8": listing.section8Acceptance,
        "Number Of Unit Groups": listing.unitGroups?.length,
        "Community Types": listing.listingPrograms
          ?.map((listingProgram) => listingProgram.program.title)
          .join(", "),
        "Application Fee": listing.applicationFee,
        "Deposit Min": listing.depositMin,
        "Deposit Max": listing.depositMax,
        "Deposit Helper": listing.depositHelperText,
        "Costs Not Included": listing.costsNotIncluded,
        "Utilities Included": Object.entries(listing.utilities ?? {})
          .filter((entry) => entry[1] === true)
          .map((entry) => entry[0])
          .join(", "),
        "Property Amenities": listing.property.amenities,
        "Additional Accessibility Details": listing.property.accessibility,
        "Unit Amenities": listing.property.unitAmenities,
        "Smoking Policy": listing.property.smokingPolicy,
        "Pets Policy": listing.property.petPolicy,
        "Services Offered": listing.property.servicesOffered,
        "Accessibility Features": Object.entries(listing.features ?? {})
          ?.filter((entry) => entry[1] === true)
          .map((entry) => entry[0])
          .join(", "),
        "Grocery Stores": listing.neighborhoodAmenities?.groceryStores,
        "Public Transportation": listing.neighborhoodAmenities?.publicTransportation,
        Schools: listing.neighborhoodAmenities?.schools,
        "Parks and Community Centers": listing.neighborhoodAmenities?.parksAndCommunityCenters,
        Pharmacies: listing.neighborhoodAmenities?.pharmacies,
        "Health Care Resources": listing.neighborhoodAmenities?.healthCareResources,
        "Credit History": listing.creditHistory,
        "Rental History": listing.rentalHistory,
        "Criminal Background": listing.criminalBackground,
        "Building Selection Criteria": listing.buildingSelectionCriteriaFile
          ? this.cloudinaryPdfFromId(listing.buildingSelectionCriteriaFile.fileId)
          : listing.buildingSelectionCriteria,
        "Required Documents": listing.requiredDocuments,
        "Important Program Rules": listing.programRules,
        "Special Notes": listing.specialNotes,
        "Review Order": listing.reviewOrderType,
        "Lottery Date": listing.events[0]?.startTime
          ? dayjs(listing.events[0]?.startTime).format("MM-DD-YYYY")
          : "",
        "Lottery Start": listing.events[0]?.startTime
          ? dayjs(listing.events[0]?.startTime).format("hh:mmA")
          : "",
        "Lottery End": listing.events[0]?.endTime
          ? dayjs(listing.events[0]?.endTime).format("hh:mmA")
          : "",
        "Lottery Notes": listing.events[0]?.note,
        "Application Due Date": listing.applicationDueDate,
        Waitlist: listing.isWaitlistOpen,
        "Max Waitlist Size": listing.waitlistMaxSize,
        "How many people on the current list": listing.waitlistCurrentSize,
        "How many open spots on the waitlist": listing.waitlistOpenSpots,
        "Marketing Status": listing.marketingType,
        "Marketing Season": listing.marketingSeason,
        "Marketing Date": listing.marketingDate ? dayjs(listing.marketingDate).format("YYYY") : "",
        "Leasing Company": listing.managementCompany,
        "Leasing Email": listing.leasingAgentEmail,
        "Leasing Phone": listing.leasingAgentPhone,
        "Leasing Agent Title": listing.leasingAgentTitle,
        "Leasing Agent Company Hours": listing.leasingAgentOfficeHours,
        "Leasing Agency Website": listing.managementWebsite,
        "Leasing Agency Street Address": listing.leasingAgentAddress?.street,
        "Leasing Agency Street 2": listing.leasingAgentAddress?.street2,
        "Leasing Agency City": listing.leasingAgentAddress?.city,
        "Leasing Agency Zip": listing.leasingAgentAddress?.zipCode,
        "Leasing Agency Mailing Address": listing.applicationMailingAddress?.street,
        "Leasing Agency Mailing Address Street 2": listing.applicationMailingAddress?.street2,
        "Leasing Agency Mailing Address City": listing.applicationMailingAddress?.city,
        "Leasing Agency Mailing Address Zip": listing.applicationMailingAddress?.zipCode,
        "Leasing Agency Pickup Address": listing.applicationPickupAddress?.street,
        "Leasing Agency Pickup Address Street 2": listing.applicationPickUpAddress?.street2,
        "Leasing Agency Pickup Address City": listing.applicationPickUpAddress?.city,
        "Leasing Agency Pickup Address Zip": listing.applicationPickUpAddress?.zipCode,
        "Leasing Pick Up Office Hours": listing.applicationPickUpAddressOfficeHours,
        Postmark: listing.postmarkedApplicationsReceivedByDate
          ? dayjs(listing.postmarkedApplicationsReceivedByDate).format("MM-DD-YYYY hh:mm:ssA")
          : "",
        "Digital Application": listing.digitalApplication,
        "Digital Application URL": listing.applicationMethods[1]?.externalReference,
        "Paper Application": listing.paperApplication,
        "Paper Application URL": listing.applicationMethods[0]?.paperApplications[0]?.file?.fileId
          ? this.cloudinaryPdfFromId(
              listing.applicationMethods[0]?.paperApplications[0]?.file?.fileId
            )
          : "",
        "Users Who Have Access": adminList.concat(partnerAccessHelper[listing.id]).join(", "),
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
        "Listing ID": listing.id,
        "Listing Name": listing.name,
        "Unit Group ID": listing.unitGroup?.id,
        "Unit Types": listing.unitGroup?.unitType.map((type) => type.name).join(", "),
        "AMI Chart": listing.unitGroup?.amiLevels[0]?.amiChart?.name,
        "AMI Level": listing.unitGroup?.amiLevels[0]?.amiPercentage,
        "Rent Type": listing.unitGroup?.amiLevels[0]?.monthlyRentDeterminationType,
        "Monthly Rent": listing.unitGroup?.amiLevels[0]?.flatRentValue,
        "Affordable Unit Group Quantity": listing.unitGroup?.totalCount,
        "Unit Group Vacancies": listing.unitGroup?.totalAvailable,
        "Waitlist Status": listing.unitGroup?.openWaitlist,
        "Minimum Occupancy": listing.unitGroup?.minOccupancy,
        "Maximum Occupancy": listing.unitGroup?.maxOccupancy,
        "Minimum Sq ft": listing.unitGroup?.sqFeetMin,
        "Maximum Sq ft": listing.unitGroup?.sqFeetMax,
        "Minimum Floor": listing.unitGroup?.floorMin,
        "Maximum Floor": listing.unitGroup?.floorMax,
        "Minimum Bathrooms": listing.unitGroup?.bathroomMin,
        "Maximum Bathrooms": listing.unitGroup?.bathroomMax,
      }
    })

    return this.csvBuilder.buildFromIdIndex(unitsObj)
  }
}
