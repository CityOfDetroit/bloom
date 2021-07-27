import { ListingFilterParams, ListingFilterKeys } from "@bloom-housing/backend-core/types"

export function backendFilterParamsFromFilters(filters: ListingFilterParams) {
    if (!filters) return ""
    let filterString = ""
    for (const filterKey in ListingFilterKeys) {
      const value = filters[filterKey]
      if (value && value != "") {
        filterString += `&filter[$comparison]==&filter[${filterKey}]=${value}`
      }
    }
    return filterString
  }

export function encodeFilterString(filterParams: ListingFilterParams) {
    let queryString = ""
    let comparisons: string[]
    for (const filterType in filterParams) {
        const value = filterParams[filterType]
        if (filterType === "$comparison") {
          if (Array.isArray(value)) {
            comparisons = value
          } else if (typeof value == "string") {
            comparisons = [value]
          }
        } else {
          if (value !== undefined) {
            let values: string[]
            // handle multiple values for the same key
            if (Array.isArray(value)) {
              values = value
            } else if (typeof value == "string") {
              values = [value]
            }
    
            const comparisonsForCurrentFilter = comparisons.slice(
              comparisonCount,
              comparisonCount + values.length
            )
            comparisonCount += values.length
    
            // Throw if this is not a supported filter type
            if (!(filterType.toLowerCase() in filterTypeToFieldMap)) {
              throw new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
            }
    
            values.forEach((val: string, i: number) => {
              // Each WHERE param must be unique across the entire QueryBuilder
              const whereParameterName = `${filterType}_${i}`
              
            })
          }
        }
      }
}

export function decodeFilterString(filterString: String) {
    
}