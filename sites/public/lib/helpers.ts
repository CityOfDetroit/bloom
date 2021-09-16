import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "./constants"
import { Address } from "@bloom-housing/backend-core/types"
import { AmiChartDto } from "@bloom-housing/backend-core/dist/src/ami-charts/dto/ami-chart.dto"

export const eligibilityRoute = (page: number) =>
  `/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[page]}`

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const getGenericAddress = (bloomAddress: Address) => {
  return {
    city: bloomAddress.city,
    street: bloomAddress.street,
    street2: bloomAddress.street2,
    state: bloomAddress.state,
    zipCode: bloomAddress.zipCode,
    latitude: bloomAddress.latitude,
    longitude: bloomAddress.longitude,
    placeName: bloomAddress.placeName,
  }
}

export function getMinAmi(amiChart, householdSize: number, income: number) {
  return Math.min(
    ...amiChart.items
      .filter((item) => item.householdSize === householdSize && item.income >= income)
      .map((item) => item.percentOfAmi)
  )
}
