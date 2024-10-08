import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { HttpException, HttpStatus } from "@nestjs/common"
import { ListingStatus } from "../types/listing-status-enum"
import { ListingsService } from "../listings.service"
import { Listing } from "../entities/listing.entity"
import { TranslationsService } from "../../translations/services/translations.service"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { ListingsQueryParams } from "../dto/listings-query-params"
import { Compare } from "../../shared/dto/filter.dto"
import { ListingFilterParams } from "../dto/listing-filter-params"
import { OrderByFieldsEnum } from "../types/listing-orderby-enum"
import { ContextIdFactory } from "@nestjs/core"
import { UnitGroup } from "../../units-summary/entities/unit-group.entity"
import { UnitType } from "../../unit-types/entities/unit-type.entity"
import { Program } from "../../program/entities/program.entity"
import { User } from "../../../src/auth/entities/user.entity"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

let service: ListingsService
const mockListings = [
  {
    id: "asdf1",
    property: { id: "test-property1", units: [] },
    preferences: [],
    status: "closed",
    unitSummaries: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf2",
    property: { id: "test-property2", units: [] },
    preferences: [],
    status: "closed",
    unitSummaries: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf3",
    property: { id: "test-property3", units: [] },
    preferences: [],
    status: "closed",
    unitSummaries: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf4",
    property: { id: "test-property4", units: [] },
    preferences: [],
    status: "closed",
    unitSummaries: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf5",
    property: { id: "test-property5", units: [] },
    preferences: [],
    status: "closed",
    unitSummaries: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf6",
    property: { id: "test-property6", units: [] },
    preferences: [],
    status: "closed",
    unitSummaries: { byUnitTypeAndRent: [] },
  },
  {
    id: "asdf7",
    property: { id: "test-property7", units: [] },
    preferences: [],
    status: "closed",
    unitSummaries: { byUnitTypeAndRent: [] },
  },
]
const mockFilteredListings = mockListings.slice(0, 2)
const mockInnerQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  addGroupBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  getParameters: jest.fn().mockReturnValue({ param1: "param1value" }),
  getQuery: jest.fn().mockReturnValue("innerQuery"),
  getCount: jest.fn().mockReturnValue(7),
}
const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockReturnValue(mockListings),
  getOne: jest.fn(),
}
const mockListingsRepo = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  count: jest.fn().mockReturnValue(100),
  create: jest.fn(),
  save: jest.fn(),
}

describe("ListingsService", () => {
  beforeEach(async () => {
    process.env.APP_SECRET = "SECRET"
    process.env.EMAIL_API_KEY = "SG.KEY"
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingsRepo,
        },
        {
          provide: getRepositoryToken(AmiChart),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(UnitGroup),
          useValue: {
            find: jest.fn(() => {
              return []
            }),
          },
        },
        {
          provide: getRepositoryToken(UnitType),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Program),
          useValue: jest.fn(),
        },
        {
          provide: TranslationsService,
          useValue: { translateListing: jest.fn() },
        },
        { provide: getRepositoryToken(User), useValue: jest.fn() },
      ],
    }).compile()

    const contextId = ContextIdFactory.create()
    jest.spyOn(ContextIdFactory, "getByRequest").mockImplementation(() => contextId)

    service = await module.resolve(ListingsService, contextId)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("getListingsList", () => {
    it("should not add a WHERE clause if no filters are applied", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      const listings = await service.list({})

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledTimes(0)
    })

    it("should add a WHERE clause if the status filter is applied", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
      const expectedStatus = ListingStatus.active

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["="],
            status: expectedStatus,
          },
        ],
      }

      const listings = await service.list(queryParams)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledWith(
        "(LOWER(CAST(listings.status as text)) = LOWER(:status_0))",
        {
          status_0: expectedStatus,
        }
      )
    })

    it("should support filters with comma-separated arrays", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
      const expectedRegionString = "Greater Downtown,Eastside," // intentional extra and trailing commas for test
      // lowercased, trimmed spaces, filtered empty
      const expectedRegionArray = ["Greater Downtown", "Eastside"]

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["IN"],
            region: expectedRegionString,
          },
        ],
      }

      const listings = await service.list(queryParams)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledWith(
        "property.region IN (:...region) ",
        {
          region: expectedRegionArray,
        }
      )
    })

    it("should support filtering on neighborhoods", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
      const neighborhoodString = "Greater Downtown,Eastside," // intentional extra and trailing commas for test
      // lowercased, trimmed spaces, filtered empty
      const expectedNeighborhoodArray = ["Greater Downtown", "Eastside"]

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["IN"],
            region: neighborhoodString,
          },
        ],
      }

      const listings = await service.list(queryParams)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledWith(
        "property.region IN (:...region) ",
        {
          region: expectedNeighborhoodArray,
        }
      )
    })

    it("should support filtering on features", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["IN"],
            elevator: true,
          },
        ],
      }

      const listings = await service.list(queryParams)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledWith(
        "(LOWER(CAST(listing_features.elevator as text)) IN (:...elevator_0))",
        {
          elevator_0: ["true"],
        }
      )
    })

    it("should include listings with missing data if $include_nulls is true", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["="],
            name: "minRent",
            $include_nulls: true,
          },
        ],
      }

      const listings = await service.list(queryParams)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledWith(
        "(LOWER(CAST(listings.name as text)) = LOWER(:name_0) OR listings.name IS NULL)",
        {
          name_0: "minRent",
        }
      )
    })

    it("should filter by availability", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["="],
            availability: "openWaitlist",
          },
        ],
      }

      const listings = await service.list(queryParams)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.andWhere).toHaveBeenCalledWith(
        "(coalesce(unitgroups.open_waitlist, false) = :openWaitlist)",
        {
          openWaitlist: true,
        }
      )
    })

    it("should throw an exception if an unsupported filter is used", async () => {
      mockListingsRepo.createQueryBuilder.mockReturnValueOnce(mockInnerQueryBuilder)

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            $comparison: Compare["="],
            otherField: "otherField",
            // The querystring can contain unknown fields that aren't on the
            // ListingFilterParams type, so we force it to the type for testing.
          } as ListingFilterParams,
        ],
      }

      await expect(service.list(queryParams)).rejects.toThrow(
        new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
      )
    })

    //TODO(avaleske): A lot of these tests should be moved to a spec file specific to the filters code.
    it("should throw an exception if an unsupported comparison is used", async () => {
      mockListingsRepo.createQueryBuilder.mockReturnValueOnce(mockInnerQueryBuilder)

      const queryParams: ListingsQueryParams = {
        filter: [
          {
            // The value of the filter[$comparison] query param is not validated,
            // and the type system trusts that whatever is provided is correct,
            // so we force it to an invalid type for testing.
            $comparison: "); DROP TABLE Students;" as Compare,
            name: "test name",
          } as ListingFilterParams,
        ],
      }

      await expect(service.list(queryParams)).rejects.toThrow(
        new HttpException("Comparison Not Implemented", HttpStatus.NOT_IMPLEMENTED)
      )
    })

    it("should not call limit() and offset() if pagination params are not specified", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      // Empty params (no pagination) -> no limit/offset
      const params = {}
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledTimes(0)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledTimes(0)
    })

    it("should not call limit() and offset() if incomplete pagination params are specified", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      // Invalid pagination params (page specified, but not limit) -> no limit/offset
      const params = { page: 3 }
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledTimes(0)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledTimes(0)
      expect(listings.meta).toEqual({
        currentPage: 1,
        itemCount: mockListings.length,
        itemsPerPage: mockListings.length,
        totalItems: mockListings.length,
        totalPages: 1,
      })
    })

    it("should not call limit() and offset() if invalid pagination params are specified", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      // Invalid pagination params (page specified, but not limit) -> no limit/offset
      const params = { page: ("hello" as unknown) as number } // force the type for testing
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledTimes(0)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledTimes(0)
      expect(listings.meta).toEqual({
        currentPage: 1,
        itemCount: mockListings.length,
        itemsPerPage: mockListings.length,
        totalItems: mockListings.length,
        totalPages: 1,
      })
    })

    it("should call limit() and offset() if pagination params are specified", async () => {
      mockQueryBuilder.getMany.mockReturnValueOnce(mockFilteredListings)
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      // Valid pagination params -> offset and limit called appropriately
      const params = { page: 3, limit: 2 }
      const listings = await service.list(params)

      expect(listings.items).toEqual(mockFilteredListings)
      expect(mockInnerQueryBuilder.limit).toHaveBeenCalledWith(2)
      expect(mockInnerQueryBuilder.offset).toHaveBeenCalledWith(4)
      expect(mockInnerQueryBuilder.getCount).toHaveBeenCalledTimes(1)
      expect(listings.meta).toEqual({
        currentPage: 3,
        itemCount: 2,
        itemsPerPage: 2,
        totalItems: mockListings.length,
        totalPages: 4,
      })
    })
  })

  describe("ListingsService.list sorting", () => {
    it("defaults to ordering by name when no orderBy param is set", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      await service.list({})

      const expectedOrderByArgument = {
        "listings.name": "ASC",
      }

      // The inner query must be ordered so that the ordering applies across all pages (if pagination is requested)
      expect(mockInnerQueryBuilder.orderBy).toHaveBeenCalledTimes(1)
      expect(mockInnerQueryBuilder.orderBy).toHaveBeenCalledWith(expectedOrderByArgument)

      // The full query must be ordered so that the ordering is applied within a page (if pagination is requested)
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(expectedOrderByArgument)
    })

    it("orders by the orderBy param (when set)", async () => {
      mockListingsRepo.createQueryBuilder
        .mockReturnValueOnce(mockInnerQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)

      await service.list({ orderBy: OrderByFieldsEnum.mostRecentlyUpdated })

      const expectedOrderByArgument = { "listings.updated_at": "DESC" }

      expect(mockInnerQueryBuilder.orderBy).toHaveBeenCalledTimes(1)
      expect(mockInnerQueryBuilder.orderBy).toHaveBeenCalledWith(expectedOrderByArgument)

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1)
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(expectedOrderByArgument)
    })
  })
})
