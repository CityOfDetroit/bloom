import { UnitGroupSummary } from "../units/types/unit-group-summary"
import { UnitTypeSummary } from "../units/types/unit-type-summary"

import { HouseholdMaxIncomeSummary } from "../units/types/household-max-income-summary"
import { UnitSummaries } from "../units/types/unit-summaries"

import { AmiChart } from "../ami-charts/entities/ami-chart.entity"

import { UnitGroup } from "../units-summary/entities/unit-group.entity"
import { MinMax } from "../units/types/min-max"
import { MonthlyRentDeterminationType } from "../units-summary/types/monthly-rent-determination.enum"

// One row for every unit group with occupancy / sq ft / floor range averaged across all unit types
// Used to display the occupancy table, unit type accordions
export const getUnitTypeSummary = (unitGroups: UnitGroup[]): UnitTypeSummary[] => {
  return []
}

// One row for every unit group, with rent and ami ranges across all ami levels
// Used to display the main pricing table
export const getUnitGroupSummary = (unitGroups: UnitGroup[]): UnitGroupSummary[] => {
  const summary = []

  unitGroups.forEach((group) => {
    let rentAsPercentIncomeRange: MinMax, rentRange: MinMax, amiPercentageRange: MinMax
    group.amiLevels.forEach((level) => {
      if (level.monthlyRentDeterminationType === MonthlyRentDeterminationType.flatRent) {
        if (rentRange === undefined) {
          rentRange = {
            min: Number(level.flatRentValue),
            max: Number(level.flatRentValue),
          }
        } else {
          rentRange.min = Math.min(rentRange.min, Number(level.flatRentValue))
          rentRange.max = Math.max(rentRange.max, Number(level.flatRentValue))
        }
      } else {
        if (rentAsPercentIncomeRange === undefined) {
          rentAsPercentIncomeRange = {
            min: level.percentageOfIncomeValue,
            max: level.percentageOfIncomeValue,
          }
        } else {
          rentAsPercentIncomeRange.min = Math.min(
            rentAsPercentIncomeRange.min,
            level.percentageOfIncomeValue
          )
          rentAsPercentIncomeRange.max = Math.max(
            rentAsPercentIncomeRange.max,
            level.percentageOfIncomeValue
          )
        }
      }

      if (amiPercentageRange === undefined) {
        amiPercentageRange = {
          min: level.amiPercentage,
          max: level.amiPercentage,
        }
      } else {
        amiPercentageRange.min = Math.min(amiPercentageRange.min, level.amiPercentage)
        amiPercentageRange.max = Math.max(amiPercentageRange.max, level.amiPercentage)
      }
    })
    const groupSummary: UnitGroupSummary = {
      unitTypes: group.unitType.map((type) => type.name),
      rentAsPercentIncomeRange,
      rentRange: rentRange && {
        min: `$${rentRange.min}`,
        max: `$${rentRange.max}`,
      },
      amiPercentageRange,
      openWaitlist: group.openWaitlist,
      unitVacancies: group.totalAvailable,
    }
    summary.push(groupSummary)
  })

  return summary
}

// One row for every household size, with max income ranged pulled from all ami charts
// Used to display the maximum income table
export const getHouseholdMaxIncomeSummary = (): HouseholdMaxIncomeSummary => {
  return {} as HouseholdMaxIncomeSummary
}

export const summarizeUnits = (units: UnitGroup[], amiCharts: AmiChart[]): UnitSummaries => {
  const data = {} as UnitSummaries

  if (!units || (units && units.length === 0)) {
    return data
  }

  data.unitTypeSummary = getUnitTypeSummary(units)
  data.unitGroupSummary = getUnitGroupSummary(units)
  data.householdMaxIncomeSummary = getHouseholdMaxIncomeSummary()
  return data
}
