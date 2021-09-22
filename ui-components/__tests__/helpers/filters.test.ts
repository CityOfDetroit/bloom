import {cleanup} from "@testing-library/react"
import {FrontendFilterKey, FrontendFilterState,} from "../../src/helpers/filters"
import {parse} from "querystring"
import {EnumListingFilterParamsComparison, EnumListingFilterParamsStatus, ListingFilterParams,} from "@bloom-housing/backend-core/types"

afterEach(cleanup)

describe("encode backend filter array", () => {
  it("should handle single filter", () => {
    const filterState = new FrontendFilterState()
    filterState.setValue(FrontendFilterKey.status, EnumListingFilterParamsStatus.active)

    expect(filterState.getBackendFilterArray()).toEqual([
      {
        $comparison: EnumListingFilterParamsComparison["="],
        status: EnumListingFilterParamsStatus.active,
      },
    ])
  })
  it("should handle multiple filters", () => {
    const filterState = new FrontendFilterState()
    filterState.setValue(FrontendFilterKey.status, EnumListingFilterParamsStatus.active)
    filterState.setValue(FrontendFilterKey.name, "Name")

    expect(filterState.getBackendFilterArray()).toEqual([
      {
        $comparison: EnumListingFilterParamsComparison["="],
        name: "Name",
      },
      {
        $comparison: EnumListingFilterParamsComparison["="],
        status: EnumListingFilterParamsStatus.active,
      },
    ])
  })
})

describe("encode frontend filter string", () => {
  it("should handle single filter", () => {
    const filterState = new FrontendFilterState()
    filterState.setValue(FrontendFilterKey.status, EnumListingFilterParamsStatus.active)

    expect(filterState.getFrontendFilterString()).toBe("&status=active")
  })
  it("should handle multiple filters", () => {
    const filterState = new FrontendFilterState()
    filterState.setValue(FrontendFilterKey.status, EnumListingFilterParamsStatus.active)
    filterState.setValue(FrontendFilterKey.name, "Name")

    expect(filterState.getFrontendFilterString()).toBe("&name=Name&status=active")
  })
  it("should exclude empty filters", () => {
    const filterState = new FrontendFilterState()
    filterState.setValue(FrontendFilterKey.status, undefined)
    filterState.setValue(FrontendFilterKey.name, "Name")
    filterState.setValue(FrontendFilterKey.zipcode, "")

    expect(filterState.getFrontendFilterString()).toBe("&name=Name")
  })
})

describe("get filter from parsed url", () => {
  it("should handle single filter", () => {
    const filterString = parse("localhost:3000/listings?page=1&status=active")
    const actualFilterState = new FrontendFilterState()
    const expectedFilterState = new FrontendFilterState()
    expectedFilterState.setValue(FrontendFilterKey.status, EnumListingFilterParamsStatus.active)

    expect(actualFilterState.getFiltersFromFrontendUrl(filterString)).toStrictEqual(expectedFilterState)
  })
  it("should handle multiple filters", () => {
    const filterString = parse("localhost:3000/listings?page=1&status=active&name=Name")
    const actualFilterState = new FrontendFilterState()
    const expectedFilterState = new FrontendFilterState()
    expectedFilterState.setValue(FrontendFilterKey.status, EnumListingFilterParamsStatus.active)
    expectedFilterState.setValue(FrontendFilterKey.name, "Name")

    expect(actualFilterState.getFiltersFromFrontendUrl(filterString)).toStrictEqual(expectedFilterState)
  })
  it("should handle no filters", () => {
    const filterString = parse("localhost:3000/listings?page=1")
    const actualFilterState = new FrontendFilterState()
    const expectedFilterState = new FrontendFilterState()

    expect(actualFilterState.getFiltersFromFrontendUrl(filterString)).toStrictEqual(expectedFilterState)
  })
  it("should handle no known filter keys", () => {
    const filterString = parse("localhost:3000/listings?page=1&unknown=blah")
    const actualFilterState = new FrontendFilterState()
    const expectedFilterState = new FrontendFilterState()

    expect(actualFilterState.getFiltersFromFrontendUrl(filterString)).toStrictEqual(expectedFilterState)
  })
  it("should handle some known filters", () => {
    const filterString = parse("localhost:3000/listings?page=1&unknown=blah&name=Name")
    const actualFilterState = new FrontendFilterState()
    const expectedFilterState = new FrontendFilterState()
    expectedFilterState.setValue(FrontendFilterKey.name, "Name")

    expect(actualFilterState.getFiltersFromFrontendUrl(filterString)).toStrictEqual(expectedFilterState)
  })
})
