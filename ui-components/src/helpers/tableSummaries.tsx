import * as React from "react"
import { t } from "./translator"
import { UnitSummary, UnitsSummary } from "@bloom-housing/backend-core/types"
import { GroupedTableGroup } from "../tables/GroupedTable"

export const getSummaryRow = (
  minIncomeRangeMin?: string,
  minIncomeRangeMax?: string,
  rentRangeMin?: string,
  rentRangeMax?: string,
  rentAsPercentIncomeRangeMin?: string,
  rentAsPercentIncomeRangeMax?: string,
  totalAvailable?: number,
  totalCount?: number,
  unitTypeName?: string
) => {
  let minIncome = <></>
  if (minIncomeRangeMin == undefined) {
    //TODO(#354): figure out what to display when there's no data
    minIncome = <strong>???</strong>
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

  const getRent = (rentMin?: string, rentMax?: string, percent = false) => {
    const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
    if (rentMin == undefined && rentMax == undefined) {
      //TODO(#354): figure out what to display when there's no data
      return <strong>???</strong>
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
    ? getRent(rentAsPercentIncomeRangeMin, rentAsPercentIncomeRangeMax, true)
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

export const getSummariesTableFromUnitSummary = (summaries: UnitSummary[]) => {
  let groupedUnits = [] as Array<GroupedTableGroup>

  if (summaries?.length > 0) {
    const unitSummaries = summaries.map((unitSummary) => {
      return getSummaryRow(
        unitSummary.minIncomeRange.min,
        unitSummary.minIncomeRange.max,
        unitSummary.rentRange.min,
        unitSummary.rentRange.max,
        unitSummary.rentAsPercentIncomeRange.min
          ? unitSummary.rentAsPercentIncomeRange.min.toString()
          : "",
        unitSummary.rentAsPercentIncomeRange.max
          ? unitSummary.rentAsPercentIncomeRange.max.toString()
          : "",
        unitSummary.totalAvailable,
        unitSummary.totalCount,
        unitSummary.unitType.name
      )
    })
    groupedUnits = [
      {
        data: unitSummaries,
      },
    ]
  }
  return groupedUnits
}

export const getSummariesTableFromUnitsSummary = (summaries: UnitsSummary[]) => {
  let groupedUnits = [] as Array<GroupedTableGroup>

  if (summaries?.length > 0) {
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
    groupedUnits = [
      {
        data: unitSummaries,
      },
    ]
  }
  return groupedUnits
}
