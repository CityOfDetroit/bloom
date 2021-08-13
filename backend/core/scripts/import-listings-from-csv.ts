import csv from "csv-parser"
import fs from "fs"
import { importListing, createUnitsArray } from "./listings-importer"
import { Listing } from "../src/listings/entities/listing.entity"
import { Property } from "../src/property/entities/property.entity"
import { Address } from "../src/shared/entities/address.entity"
import { CountyCode } from "../src/shared/types/county-code"
import { CSVFormattingType } from "../src/csv/types/csv-formatting-type-enum"

// Sample usage:
// $ yarn ts-node scripts/import-listings-from-csv.ts http://localhost:3100 test@example.com:abcdef path/to/file.csv

async function main() {
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

  const rawListingFields = []

  const promise = new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (listingFields) => {
        // Include only listings that are "regulated" affordable housing
        const affordabilityStatus: string = listingFields["Affordability status [Regulated Only]"]
        if (affordabilityStatus.toLowerCase() === "regulated") {
          rawListingFields.push(listingFields)
        }
      })
      .on("end", resolve)
      .on("error", reject)
  })

  await promise

  console.log(`CSV file successfully read in; ${rawListingFields.length} listings to upload`)

  const uploadFailureMessages = []
  let numListingsSuccessfullyUploaded = 0

  let count = 0

  for (const listingFields of rawListingFields) {
    if (count >= 30) {
      continue
    }
    count++
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
    property.phoneNumber = listingFields["Property Phone"]

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
    // Lump 4BR and 5BR together as "fourBdrm"
    const numberFourBdrm = listingFields["Number 4BR"] ? parseInt(listingFields["Number 4BR"]) : 0
    const numberFiveBdrm = listingFields["Number 5BR"] ? parseInt(listingFields["Number 5BR"]) : 0
    if (numberFourBdrm + numberFiveBdrm > 0) {
      property.units = property.units.concat(
        createUnitsArray("fourBdrm", numberFourBdrm + numberFiveBdrm)
      )
    }

    // If we don't have any data per unit type, but we do have an overall count, create that many
    // "unknown" units
    if (property.units.length == 0 && listingFields["Affordable Units"]) {
      createUnitsArray("unknown", parseInt(listingFields["Affordable Units"]))
    }

    // Listing-level details
    listing.property = property
    listing.name = listingFields["Project Name"]
    listing.hrdId = listingFields["HRDID"]

    listing.ownerCompany = listingFields["Owner Company"]
    listing.managementCompany = listingFields["Management Company"]
    listing.leasingAgentName = listingFields["Manager Contact"]
    listing.leasingAgentPhone = listingFields["Manager Phone"]
    listing.managementWebsite = listingFields["Management Website"]

    if (listingFields["Manager Email"]) {
      listing.leasingAgentEmail = listingFields["Manager Email"]
    }

    // Listing affordability details
    const affordabilityMix: string = listingFields["Affordability Mix"]
    const amiRange: string[] = amiRangeRegex.exec(affordabilityMix)
    const amiValue: string[] = amiValueRegex.exec(affordabilityMix)
    const amiUpperLimit: string[] = amiUpperLimitRegex.exec(affordabilityMix)
    if (amiRange) {
      listing.amiPercentageMin = parseInt(amiRange[1])
      listing.amiPercentageMax = parseInt(amiRange[2])
    }
    if (amiValue) {
      listing.amiPercentageMin = parseInt(amiValue[1])
      listing.amiPercentageMax = parseInt(amiValue[1])
    }
    if (amiUpperLimit) {
      listing.amiPercentageMax = parseInt(amiUpperLimit[1])
    }

    // Other listing fields
    listing.preferences = []
    listing.events = []
    listing.applicationMethods = []
    listing.assets = []
    listing.displayWaitlistSize = false
    listing.CSVFormattingType = CSVFormattingType.basic
    listing.countyCode = CountyCode.alameda

    try {
      const newListing = await importListing(importApiUrl, email, password, listing)
      console.log(`New listing uploaded successfully: ${newListing.name}`)
      numListingsSuccessfullyUploaded++
    } catch (e) {
      console.log(e)
      uploadFailureMessages.push(`Upload failed for ${listing.name}: ${e}`)
    }
  }

  console.log(`\nNumber of listings successfully uploaded: ${numListingsSuccessfullyUploaded}`)
  console.log(`Number of failed listing uploads: ${uploadFailureMessages.length}\n`)
  for (const failureMessage of uploadFailureMessages) {
    console.log(failureMessage)
  }
}

void main()
