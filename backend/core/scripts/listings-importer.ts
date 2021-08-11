import * as client from "../types/src/backend-swagger"
import axios from "axios"
import { ListingCreate, serviceOptions } from "../types/src/backend-swagger"
import { ListingStatus } from "../src/listings/types/listing-status-enum"
import { UnitStatus } from "../src/units/types/unit-status-enum"

// NOTE: This script relies on any logged-in users having permission to create
// listings and properties (defined in backend/core/src/auth/authz_policy.csv)

export function createUnitsArray(type: string, number: number) {
  const units = []
  for (let unit_index = 0; unit_index < number; unit_index++) {
    units.push({
      unitType: type,

      status: UnitStatus.unknown,
    })
  }
  return units
}

function uploadPreferences(listing) {
  const preferencesService = new client.PreferencesService()
  listing.preferences.map(async (preference) => {
    try {
      return await preferencesService.create({
        body: preference,
      })
    } catch (e) {
      console.log(preference)
      console.log(e.response.data.message)
      process.exit(1)
    }
  })
}

async function uploadListing(listing: ListingCreate) {
  try {
    const listingsService = new client.ListingsService()
    return await listingsService.create({
      body: listing,
    })
  } catch (e) {
    throw new Error(e.response.data.message)
  }
}

async function uploadAmiCharts(units) {
  const amiChartService = new client.AmiChartsService()
  const charts = await amiChartService.list()

  for (const unit of units) {
    const chartFromUnit = unit.amiChart
    if (!chartFromUnit) {
      continue
    }

    // Look for the chart by name.
    let chart = charts.filter((chart) => chart.name == chartFromUnit.name)[0]

    // If it doesn't exist, create it.
    if (!chart) {
      chart = await amiChartService.create({ body: chartFromUnit })
    }
    unit.amiChart = chart
  }
}

async function uploadUnitTypes(units) {
  const unitTypesService = new client.UnitTypesService()
  const unitTypes = await unitTypesService.list()

  for (const unit of units) {
    const unitTypeStr = unit.unitType
    if (!unitTypeStr) {
      console.log(unit)
      console.log("Error: each unit must have a unitType.")
      process.exit(1)
    }

    // Look for the unitType by name.
    let unitType = unitTypes.filter((unitType) => unitType.name == unitTypeStr)[0]

    // If it doesn't exist, create it.
    if (!unitType) {
      unitType = await unitTypesService.create({ body: { name: unitTypeStr } })
    }
    unit.unitType = unitType
  }
}

async function uploadProperty(property) {
  try {
    const propertyService = new client.PropertiesService()
    return await propertyService.create({
      body: property,
    })
  } catch (e) {
    console.log(e.response)
    process.exit(1)
  }
}

export async function importListing(apiUrl, email, password, listing) {
  serviceOptions.axios = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
  })
  // Log in to retrieve an access token.
  const authService = new client.AuthService()
  const { accessToken } = await authService.login({
    body: {
      email: email,
      password: password,
    },
  })

  // Update the axios config so future requests include the access token in the header.
  serviceOptions.axios = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // Tidy a few of the listing's fields.
  if (!("status" in listing)) {
    listing.status = ListingStatus.active
  }
  delete listing["id"]

  // Create corresponding preferences (if any).
  if (listing.preferences) {
    uploadPreferences(listing)
  }

  // Extract the associated property, to be uploaded first.
  if (!listing.property) {
    throw new Error("Listing must include a non-null Property.")
  }

  let property = listing.property
  delete listing.property

  await uploadAmiCharts(property.units)
  await uploadUnitTypes(property.units)

  property.listings = [listing]
  property = await uploadProperty(property)

  // Link the uploaded property to the listing by id.
  listing.property = property

  // The ListingCreateDto expects to include units and buildingAddress
  listing.units = property.units
  listing.buildingAddress = property.buildingAddress

  // Upload the listing, and then return it.
  return await uploadListing(listing)
}
