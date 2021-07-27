import { cleanup } from "@testing-library/react"
import { encodeToBackendFilterString, getFiltersFromFrontendUrl } from "../../src/helpers/filters"
import { parse } from "querystring"
import { ListingFilterParams } from "@bloom-housing/backend-core/types"

afterEach(cleanup)

describe("encode filter string", () => {
  it("should handle single filter", () => {
    const filter: ListingFilterParams = {
      neighborhood: "Neighborhood",
    }
    expect(encodeToBackendFilterString(filter)).toBe(
      "&filter[$comparison]==&filter[neighborhood]=Neighborhood"
    )
  })
  it("should handle multiple filters", () => {
    const filter: ListingFilterParams = {
      name: "Name",
      neighborhood: "Neighborhood",
    }
    expect(encodeToBackendFilterString(filter)).toBe(
      "&filter[$comparison]==&filter[name]=Name&filter[$comparison]==&filter[neighborhood]=Neighborhood"
    )
  })
})

describe("get filter from parsed url", () => {
  it("should handle single filter", () => {
    const filterString = parse("localhost:3000/listings?page=1&neighborhood=Neighborhood")
    const expected: ListingFilterParams = {
      neighborhood: "Neighborhood",
    }
    expect(getFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })
  it("should handle multiple filters", () => {
    const filterString = parse("localhost:3000/listings?page=1&neighborhood=Neighborhood&name=Name")
    const expected: ListingFilterParams = {
      neighborhood: "Neighborhood",
      name: "Name",
    }
    expect(getFiltersFromFrontendUrl(filterString)).toStrictEqual(expected)
  })
  it("should handle no filters", () => {
    const filterString = parse("localhost:3000/listings?page=1")
    expect(getFiltersFromFrontendUrl(filterString)).toBe(undefined)
  })
  it("should handle no known filter keys", () => {
    const filterString = parse("localhost:3000/listings?page=1&unknown=blah")
    expect(getFiltersFromFrontendUrl(filterString)).toBe(undefined)
  })
})
