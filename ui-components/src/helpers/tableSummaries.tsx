import * as React from "react"
import { t } from "./translator"
import { UnitSummary, UnitsSummary } from "@bloom-housing/backend-core/types"
import { GroupedTableGroup } from "../tables/GroupedTable"

export const getSummaryRow = (
  minIncomeRangeMin?: string,
  minIncomeRangeMax?: string,
  rentRangeMin?: string,
  rentRangeMax?: string,
  rentAsPercentIncomeRangeMin?: string | number,
  rentAsPercentIncomeRangeMax?: string | number,
  totalAvailable?: number,
  totalCount?: number,
  unitTypeName?: string
) => {
  let minIncome = <></>
  if (minIncomeRangeMin == undefined) {
    minIncome = <strong>Data Not Avail</strong>
  } else if (minIncomeRangeMin == minIncomeRangeMax) {
    minIncome = (
      <strong>
        {minIncomeRangeMin}
        {t("t.perMonth")}
      </strong>
    )
  } else {
    minIncome = (
      <>
        <strong>{minIncomeRangeMin}</strong> {t("t.to")}{" "}
        <strong>
          {minIncomeRangeMax} {t("t.perMonth")}
        </strong>
      </>
    )
  }

  const getRent = (rentMin: string, rentMax: string, percent = false) => {
    const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
    if (rentMin == undefined && rentMax == undefined) {
      return <strong>Data Not Here</strong>
    }
    return rentMin == rentMax ? (
      <>
        <strong>{rentMin}</strong>
        {unit}
      </>
    ) : (
      <>
        <strong>{rentMin}</strong> {t("t.to")} <strong>{rentMax}</strong>
        {unit}
      </>
    )
  }

  // Use rent as percent income if available, otherwise use exact rent
  const rent = rentAsPercentIncomeRangeMin
    ? getRent(rentAsPercentIncomeRangeMin.toString(), rentAsPercentIncomeRangeMax.toString(), true)
    : getRent(rentRangeMin, rentRangeMax)

  return {
    unitType: <strong>{t(`listings.unitTypes.${unitTypeName}`)}</strong>,
    minimumIncome: <>{minIncome}</>,
    rent: <>{rent}</>,
    availability: (
      <>
        {totalAvailable && totalAvailable > 0 ? (
          <>
            <strong>{totalAvailable}</strong> {totalAvailable == 1 ? t("t.unit") : t("t.units")}
          </>
        ) : (
          <span className="uppercase">{t("listings.waitlist.label")}</span>
        )}
      </>
    ),
    totalCount: (
      <>
        <strong>{totalCount}</strong> {totalCount == 1 ? t("t.unit") : t("t.units")}
      </>
    ),
  }
}

export const getSummariesTable = (summaries: UnitSummary[] | UnitsSummary[]) => {
  let groupedUnits = [] as Array<GroupedTableGroup>

  if (summaries?.length > 0) {
    const unitSummaries = summaries.map((unitSummary) => {
      if (unitSummary.minIncomeRange) {
        return getSummaryRow(
          unitSummary.minIncomeRange.min,
          unitSummary.minIncomeRange.max,
          unitSummary.rentRange.min,
          unitSummary.rentRange.max,
          unitSummary.rentAsPercentIncomeRange.min,
          unitSummary.rentAsPercentIncomeRange.max,
          unitSummary.totalAvailable,
          unitSummary.totalCount,
          unitSummary.unitType.name
        )
      } else {
        return getSummaryRow(
          unitSummary.minimumIncomeMin,
          unitSummary.minimumIncomeMax,
          unitSummary.monthlyRentMin,
          unitSummary.monthlyRentMax,
          unitSummary.monthlyRentAsPercentOfIncome,
          unitSummary.monthlyRentAsPercentOfIncome,
          unitSummary.totalAvailable,
          unitSummary.totalCount,
          unitSummary.unitType.name
        )
      }
    })
    groupedUnits = [
      {
        data: unitSummaries,
      },
    ]
  }
  return groupedUnits
}
/*
export const unitSummariesTable2 = (summaries: UnitsSummary[]) => {
  const unitSummaries = summaries.map((unitSummary) => {
    return getSummaryRow(
      unitSummary.minimumIncomeMin,
      unitSummary.minimumIncomeMax,
      unitSummary.monthlyRentMin,
      unitSummary.monthlyRentMax,
      unitSummary.monthlyRentAsPercentOfIncome,
      unitSummary.monthlyRentAsPercentOfIncome,
      unitSummary.totalAvailable,
      unitSummary.totalCount,
      unitSummary.unitType.name
    )
  })

  return unitSummaries
}

export const getSummariesTable2 = (summaries: UnitsSummary[]) => {
  let groupedUnits = [] as Array<GroupedTableGroup>

  if (summaries?.length > 0) {
    const unitSummaries = unitSummariesTable2(summaries)
    groupedUnits = [
      {
        data: unitSummaries,
      },
    ]
  }
  return groupedUnits
}
*/
