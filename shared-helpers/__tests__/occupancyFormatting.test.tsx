import React from "react"
import { cleanup } from "@testing-library/react"
import { occupancyTable, getOccupancyDescription } from "../src/occupancyFormatting"
import { t } from "@bloom-housing/ui-components"
import { Listing, UnitType, UnitGroup } from "@bloom-housing/backend-core/types"

const unitTypeSRO = { name: "SRO", numBedrooms: 0 } as UnitType
const unitTypeStudio = { name: "studio", numBedrooms: 0 } as UnitType
const unitTypeOneBdrm = { name: "oneBdrm", numBedrooms: 1 } as UnitType
const unitTypeTwoBdrm = { name: "twoBdrm", numBedrooms: 1 } as UnitType
const unitTypeThreeBdrm = { name: "threeBdrm", numBedrooms: 1 } as UnitType
const unitTypeFourBdrm = { name: "fourBdrm", numBedrooms: 1 } as UnitType

const unitGroups: Omit<UnitGroup, "id" | "listing" | "openWaitlist" | "amiLevels">[] = [
  {
    unitType: [unitTypeStudio, unitTypeOneBdrm],
    minOccupancy: 1,
    maxOccupancy: 2,
  },
  {
    unitType: [unitTypeOneBdrm],
    minOccupancy: 1,
    maxOccupancy: 3,
  },
  {
    unitType: [unitTypeTwoBdrm],
    minOccupancy: 2,
    maxOccupancy: 6,
  },
  {
    unitType: [unitTypeTwoBdrm],
    minOccupancy: 2,
    maxOccupancy: undefined,
  },
  {
    unitType: [unitTypeTwoBdrm],
    minOccupancy: undefined,
    maxOccupancy: 2,
  },
  {
    unitType: [unitTypeTwoBdrm],
    minOccupancy: 1,
    maxOccupancy: 1,
  },
  {
    unitType: [unitTypeThreeBdrm],
    minOccupancy: 3,
    maxOccupancy: 3,
  },
  {
    unitType: [unitTypeFourBdrm],
    minOccupancy: undefined,
    maxOccupancy: undefined,
  },
  {
    unitType: [unitTypeTwoBdrm, unitTypeOneBdrm],
    minOccupancy: 1,
    maxOccupancy: 7,
  },
]

const testListing: Listing = {} as Listing
testListing.unitGroups = unitGroups as UnitGroup[]
afterEach(cleanup)

describe("occupancy formatting helpers", () => {
  describe("occupancyTable", () => {
    it("properly creates occupancy table", () => {
      expect(occupancyTable(testListing)).toStrictEqual([
        {
          occupancy: "1-2 people",
          unitType: <strong>Studio, 1 BR</strong>,
        },
        {
          occupancy: "1-3 people",
          unitType: <strong>1 BR</strong>,
        },
        {
          occupancy: "1-7 people",
          unitType: <strong>1BR, 2BR</strong>,
        },
        {
          occupancy: "2-6 people",
          unitType: <strong>2 BR</strong>,
        },
        {
          occupancy: "at least 2 people",
          unitType: <strong>2 BR</strong>,
        },
        {
          occupancy: "1 person",
          unitType: <strong>2 BR</strong>,
        },
        {
          occupancy: "at most 2 people",
          unitType: <strong>2 BR</strong>,
        },
        {
          occupancy: "3 people",
          unitType: <strong>3 BR</strong>,
        },
      ])
    })
  })

  describe("getOccupancyDescription", () => {
    it("description for no SRO", () => {
      expect(getOccupancyDescription(testListing)).toBe(t("listings.occupancyDescriptionSomeSro"))
    })
    it("description for some SRO", () => {
      const testListing2 = testListing
      testListing2.unitGroups = [
        {
          unitType: [unitTypeSRO, unitTypeOneBdrm],
          minOccupancy: undefined,
          maxOccupancy: 2,
        },
        {
          unitType: [unitTypeTwoBdrm],
          minOccupancy: 1,
          maxOccupancy: 1,
        },
      ] as UnitGroup[]
      expect(getOccupancyDescription(testListing2)).toBe(t("listings.occupancyDescriptionNoSro"))
    })
    it("description for all SRO", () => {
      const testListing3 = testListing
      testListing3.unitGroups = [
        {
          unitType: [unitTypeSRO],
          minOccupancy: undefined,
          maxOccupancy: 1,
        },
        {
          unitType: [unitTypeSRO],
          minOccupancy: 1,
          maxOccupancy: 1,
        },
      ] as UnitGroup[]
      expect(getOccupancyDescription(testListing3)).toBe(t("listings.occupancyDescriptionAllSro"))
    })
  })
})
