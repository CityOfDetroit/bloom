import csv from "csv-parser"
import fs from "fs"
import { importListing, createUnitsArray } from "./listings-importer"

function main() {
  if (process.argv.length < 5) {
    console.log(
      "usage: yarn ts-node scripts/import-listings-from-csv.ts import_api_url email:password csv_file_path"
    )
    process.exit(1)
  }

  const [importApiUrl, userAndPassword, csvFilePath] = process.argv.slice(2)
  const [email, password] = userAndPassword.split(":")

  const amiRangeRegex = /(\d+)-(\d+)% AMI/ // e.g. 30-60% AMI
  const amiValueRegex = /^(\d+)% AMI/ // e.g. 40% AMI
  const amiUpperLimitRegex = /^Up to (\d+)% AMI/ // e.g. Up to 80% AMI

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (listingFields) => {
      // Exclude any listings that aren't "regulated" affordable housing
      const affordabilityStatus: string = listingFields["Affordability status [Regulated Only]"]
      if (affordabilityStatus.toLowerCase() !== "regulated") return

      // Start the whole shebang here
      const listing = new Listing()
      const property = new Property()
      const address = new Address()

      // Add property location information
      address.street = listingFields["Project Address"]
      address.zipCode = listingFields["Zip Code"]
      address.city = "Detroit"
      address.state = "MI"
      address.longitude = listingFields["Longitude"]
      address.latitude = listingFields["Latitude"]

      property.buildingAddress = address
      property.neighborhood = listingFields["Neighborhood"]
      property.region = listingFields["Region"]

      // Other property-level details
      property.phone = listingFields["Property Phone"]

      // Add data about units
      property.units = []
      if (listingFields["Number 0BR"]) {
        property.units = property.units.concat(
          createUnitsArray("studio", listingFields["Number 0BR"])
        )
      }
      if (listingFields["Number 1BR"]) {
        property.units = property.units.concat(
          createUnitsArray("oneBdrm", parseInt(listingFields["Number 1BR"]))
        )
      }
      if (listingFields["Number 2BR"]) {
        property.units = property.units.concat(
          createUnitsArray("twoBdrm", parseInt(listingFields["Number 2BR"]))
        )
      }
      if (listingFields["Number 3BR"]) {
        property.units = property.units.concat(
          createUnitsArray("threeBdrm", parseInt(listingFields["Number 3BR"]))
        )
      }
      if (listingFields["Number 4BR"]) {
        property.units = property.units.concat(
          createUnitsArray("fourBdrm", parseInt(listingFields["Number 4BR"]))
        )
      }
      if (listingFields["Number 5BR"]) {
        property.units = property.units.concat(
          createUnitsArray("fiveBdrm", parseInt(listingFields["Number 5BR"]))
        )
      }

      if (property.units.length == 0 && listingFields["Affordable Units"]) {
        createUnitsArray("unknown", parseInt(listingFields["Affordable Units"]))
      }

      // Listing-level details
      listing.property = property
      listing.name = listingFields["Project Name"]

      listing.ownerCompany = listingFields["Owner Company"]
      listing.managementCompany = listingFields["Management Company"]
      listing.leasingAgentName = listingFields["Manager Contact"]
      listing.leasingAgentPhone = listingFields["Manager Phone"]
      listing.leasingAgentEmail = listingFields["Manager Email"]
      listing.managementWebsite = listingFields["Management Website"]

      // Listing affordability details
      const affordabilityMix: string = listingFields["Affordability Mix"]
      const amiRange: string[] = amiRangeRegex.exec(affordabilityMix)
      const amiValue: string[] = amiValueRegex.exec(affordabilityMix)
      const amiUpperLimit: string[] = amiUpperLimitRegex.exec(affordabilityMix)
      if (amiRange) {
        listing.amiPercentageMin = amiRange[1]
        listing.amiPercentageMax = amiRange[2]
      }
      if (amiValue) {
        listing.amiPercentageMin = amiValue[1]
        listing.amiPercentageMax = amiValue[1]
      }
      if (amiUpperLimit) {
        listing.amiPercentageMax = amiUpperLimit[1]
      }

      /*

      listing.property = property
      listing.name = listingAttributes.Project_Name
      listing.leasingAgentName = listingAttributes.Manager_Contact

      if (listingAttributes.Manager_Phone) {
        listing.leasingAgentPhone = listingAttributes.Manager_Phone
      } else if (listingAttributes.Property_Phone) {
        listing.leasingAgentPhone = listingAttributes.Property_Phone
      } else {
        listing.leasingAgentPhone = "(555) 555-5555"
      }

      listing.leasingAgentAddress = {
        city: "Fake City",
        state: "XX",
        street: "123 Fake St",
        zipCode: "12345",

        // Add null id, createdAt, etc. to avoid compilation errors.
        // (These will be replaced by real values when the script uploads this address.)
        id: null,
        createdAt: null,
        updatedAt: null,
      }

      listing.preferences = []
      listing.assets = []
      listing.applicationMethods = []
      listing.events = []
      listing.CSVFormattingType = CSVFormattingType.basic
      listing.countyCode = CountyCode.alameda
      listing.displayWaitlistSize = false
      */

      try {
        const newListing = await importListing(importApiUrl, email, password, listing)
        console.log("New listing (" + newListing.name + ") created successfully.")
      } catch (e) {
        console.log(e)
        process.exit(1)
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed")
    })
}

void main()
