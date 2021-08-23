/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BaseView, FullView, getView } from "./view"
import { views } from "./config"
import { UnitStatus } from "../..//units/types/unit-status-enum"

const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
}

const mockListingsRepo = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
}

const mockUnitTypes = [
  { id: "unit-1", name: "oneBdrm" },
  { id: "unit-2", name: "twoBdrm" },
  { id: "unit-3", name: "threeBdrm" },
]

const mockListings = [
  {
    id: "listing-1",
    property: {
      units: [
        {
          unitType: mockUnitTypes[0],
          monthlyIncomeMin: "0",
          monthlyRent: "100",
          status: UnitStatus.available,
        },
        {
          unitType: mockUnitTypes[0],
          monthlyIncomeMin: "1",
          monthlyRent: "101",
          status: UnitStatus.occupied,
        },
        {
          unitType: mockUnitTypes[1],
          monthlyIncomeMin: "0",
          monthlyRent: "100",
          status: UnitStatus.occupied,
        },
      ],
    },
    unitsSummary: [
      {
        unitType: mockUnitTypes[0],
        monthlyIncomeMin: "0",
        monthlyRent: 100,
        totalAvailable: 1,
        totalCount: 1,
      },
      {
        unitType: mockUnitTypes[0],
        monthlyIncomeMin: "1",
        monthlyRent: 101,
        totalAvailable: 0,
        totalCount: 1,
      },
      {
        unitType: mockUnitTypes[1],
        monthlyIncomeMin: "0",
        monthlyRent: 100,
        totalAvailable: 0,
        totalCount: 1,
      },
    ],
  },
  {
    id: "listing-2",
    property: {
      units: [
        { unitType: mockUnitTypes[0], monthlyIncomeMin: "0", monthlyRent: "100" },
        { unitType: mockUnitTypes[1], monthlyIncomeMin: "1", monthlyRent: "101" },
        { unitType: mockUnitTypes[2], monthlyIncomeMin: "2", monthlyRent: "102" },
      ],
    },
    unitsSummary: [
      { unitType: mockUnitTypes[0], monthlyIncomeMin: "0", monthlyRent: 100, totalCount: 1 },
      { unitType: mockUnitTypes[1], monthlyIncomeMin: "1", monthlyRent: 101, totalCount: 1 },
      { unitType: mockUnitTypes[2], monthlyIncomeMin: "2", monthlyRent: 102, totalCount: 1 },
    ],
  },
]

describe("listing views", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("BaseView", () => {
    it("should create a new BaseView with qb view properties", () => {
      const view = new BaseView(mockListingsRepo.createQueryBuilder())

      expect(view.qb).toEqual(mockQueryBuilder)
      expect(view.view).toEqual(views.base)
    })

    it("should call getView qb select and leftJoin", () => {
      const view = new BaseView(mockListingsRepo.createQueryBuilder())

      view.getViewQb()

      expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledTimes(10)
    })

    // Run this test twice with UnitsSummary enabled/disabled.
    it.each([{ enableUnitsSummary: "true" }, { enableUnitsSummary: "false" }])(
      "should map unitSummary to listings",
      ({ enableUnitsSummary }) => {
        process.env.USE_UNITS_SUMMARY = enableUnitsSummary
        const view = new BaseView(mockListingsRepo.createQueryBuilder())

        const listings = view.mapUnitSummary(mockListings)

        listings.forEach((listing) => {
          if (listing.id === mockListings[0].id) {
            const byUnitTypeAndRent = listing.unitsSummarized.byUnitTypeAndRent
            expect(byUnitTypeAndRent[0].rentRange).toEqual({ max: "$101", min: "$100" })
            expect(byUnitTypeAndRent[0].minIncomeRange).toEqual({ max: "$1", min: "$0" })
            expect(byUnitTypeAndRent[0].totalAvailable).toEqual(1)
            expect(byUnitTypeAndRent[0].totalCount).toEqual(2)
            expect(byUnitTypeAndRent[1].rentRange).toEqual({ max: "$100", min: "$100" })
            expect(byUnitTypeAndRent[1].minIncomeRange).toEqual({ max: "$0", min: "$0" })
            expect(byUnitTypeAndRent[1].totalAvailable).toEqual(0)
            expect(byUnitTypeAndRent[1].totalCount).toEqual(1)
          }
        })
      }
    )
  })

  describe("FullView", () => {
    it("should call getView qb leftJoinAndSelect", () => {
      const view = new FullView(mockListingsRepo.createQueryBuilder())

      view.getViewQb()

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(26)
    })
  })

  describe("view function", () => {
    it("should create a new BaseView with view param", () => {
      const listingView = getView(mockListingsRepo.createQueryBuilder(), "base")

      expect(listingView.qb).toEqual(mockQueryBuilder)
      expect(listingView.view).toEqual(views.base)
    })

    it("should create a new FullView without view param", () => {
      const listingView = getView(mockListingsRepo.createQueryBuilder())

      expect(listingView.qb).toEqual(mockQueryBuilder)
      expect(listingView.view).toEqual(views.full)
    })

    it("should create a new FullView with view param", () => {
      const listingView = getView(mockListingsRepo.createQueryBuilder(), "full")

      expect(listingView.qb).toEqual(mockQueryBuilder)
      expect(listingView.view).toEqual(views.full)
    })

    it("should create a new DetailView with view param", () => {
      const view = getView(mockListingsRepo.createQueryBuilder(), "detail")

      expect(view.qb).toEqual(mockQueryBuilder)
      expect(view.view).toEqual(views.detail)
    })
  })
})
