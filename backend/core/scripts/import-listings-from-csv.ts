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

      // This code parses affordability mix

      const affordabilityMix: string = listingFields["Affordability Mix"]
      const amiRangeFound: string[] = amiRangeRegex.exec(affordabilityMix)
      const amiValueFound: string[] = amiValueRegex.exec(affordabilityMix)
      const amiUpperLimitFound: string[] = amiUpperLimitRegex.exec(affordabilityMix)
      if (amiRangeFound) {
        console.log(`AMI range % low: ${amiRangeFound[1]}, high: ${amiRangeFound[2]}`)
      }
      if (amiValueFound) {
        console.log(`AMI range % low: ${amiValueFound[1]}, high: ${amiValueFound[1]}`)
      }
      if (amiUpperLimitFound) {
        console.log(`AMI range % low: ???, high: ${amiUpperLimitFound[1]}`)
      }

      /*
      const listingAttributes = response.data.features[i].attributes

      const listing = new Listing()
      const property = new Property()
      const address = new Address()

      address.street = listingAttributes.Project_Address
      address.latitude = listingAttributes.Latitude
      address.longitude = listingAttributes.Longitude
      address.zipCode = listingAttributes.Zip
      address.city = "Detroit"
      address.state = "MI"

      property.buildingAddress = address
      property.neighborhood = listingAttributes.Neighborhood
      property.unitsAvailable = parseInt(listingAttributes.Affordable_Units)

      property.units = []
      if (listingAttributes.Number_0BR) {
        property.units = property.units.concat(
          createUnitsArray("studio", listingAttributes.Number_0BR)
        )
      }
      if (listingAttributes.Number_1BR) {
        property.units = property.units.concat(
          createUnitsArray("oneBdrm", parseInt(listingAttributes.Number_1BR))
        )
      }
      if (listingAttributes.Number_2BR) {
        property.units = property.units.concat(
          createUnitsArray("twoBdrm", parseInt(listingAttributes.Number_2BR))
        )
      }
      if (listingAttributes.Number_3BR) {
        property.units = property.units.concat(
          createUnitsArray("threeBdrm", parseInt(listingAttributes.Number_3BR))
        )
      }
      if (listingAttributes.Number_4BR) {
        property.units = property.units.concat(
          createUnitsArray("fourBdrm", parseInt(listingAttributes.Number_4BR))
        )
      }
      if (listingAttributes.Number_5BR) {
        property.units = property.units.concat(
          createUnitsArray("fiveBdrm", parseInt(listingAttributes.Number_5BR))
        )
      }

      // The /listings/id view won't render if there isn't at least one unit; add a dummy "studio"
      if (property.units.length == 0) {
        property.units = createUnitsArray("studio", 1)
      }

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

      try {
        const newListing = await importListing(importApiUrl, email, password, listing)
        console.log("New listing (" + newListing.name + ") created successfully.")
      } catch (e) {
        console.log(e)
        process.exit(1)
      }
      */
    })
    .on("end", () => {
      console.log("CSV file successfully processed")
    })
}

void main()
