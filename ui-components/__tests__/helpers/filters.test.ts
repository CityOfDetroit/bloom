import { cleanup } from "@testing-library/react"
import { encodeFilterString, getFiltersFromUrl } from "../../src/helpers/filters"
import { parse } from "querystring"
import {
  EnumListingFilterParamsComparison,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"

afterEach(cleanup)

describe("encode filter string", () => {
  it("should handle single comparison", () => {
    const filter: ListingFilterParams = {
      $comparison: EnumListingFilterParamsComparison["="],
      neighborhood: "Neighborhood",
    }
    expect(encodeFilterString(filter)).toBe(
      "&filter[$comparison]==&filter[neighborhood]=Neighborhood"
    )
  })
  it("should handle multiple comparisons", () => {
    const filter: ListingFilterParams = {
      $comparison: [
        EnumListingFilterParamsComparison["="],
        EnumListingFilterParamsComparison["<>"],
      ],
      name: "Name",
      neighborhood: "Neighborhood",
    }
    expect(encodeFilterString(filter)).toBe(
      "&filter[$comparison]==&filter[name]=Name&filter[$comparison]=<>&filter[neighborhood]=Neighborhood"
    )
  })
})

describe("get filter from parsed url", () => {
  it("should handle single filter", () => {
    const filterString = parse(
      "localhost:3000/listings?page=1&comparisons==&neighborhood=Neighborhood"
    )
    const expected: ListingFilterParams = {
      $comparison: [EnumListingFilterParamsComparison["="]],
      neighborhood: "Neighborhood",
    }
    expect(getFiltersFromUrl(filterString)).toStrictEqual(expected)
  })
  it("should handle multiple filters", () => {
    const filterString = parse(
      "localhost:3000/listings?page=1&comparisons==,<>&neighborhood=Neighborhood&name=Name"
    )
    const expected: ListingFilterParams = {
      $comparison: [
        EnumListingFilterParamsComparison["="],
        EnumListingFilterParamsComparison["<>"],
      ],
      neighborhood: "Neighborhood",
      name: "Name",
    }
    expect(getFiltersFromUrl(filterString)).toStrictEqual(expected)
  })
  it("should handle no comparisons", () => {
    const filterString = parse("localhost:3000/listings?page=1&neighborhood=Neighborhood")
    expect(getFiltersFromUrl(filterString)).toBe(undefined)
  })
  it("should handle no known filter keys", () => {
    const filterString = parse("localhost:3000/listings?page=1&comparisons==&unknown=blah")
    expect(getFiltersFromUrl(filterString)).toBe(undefined)
  })
})
