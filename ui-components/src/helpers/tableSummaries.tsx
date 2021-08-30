import * as React from "react"
import { t } from "./translator"
import { UnitSummary, UnitsSummary } from "@bloom-housing/backend-core/types"
import { GroupedTableGroup } from "../tables/GroupedTable"

export const getSummaryRow = (
  minIncomeRangeMin: string,
  minIncomeRangeMax: string,
  rentRangeMin: string,
  rentRangeMax: string,
  rentAsPercentIncomeRangeMin: string,
  rentAsPercentIncomeRangeMax: string,
  totalAvailable: number | undefined,
  totalCount: number | undefined,
  unitTypeName: string
) => {
  const minIncome =
    minIncomeRangeMin == minIncomeRangeMax ? (
      <strong>{minIncomeRangeMin}</strong>
    ) : (
      <>
        <strong>{minIncomeRangeMin}</strong> {t("t.to")} <strong>{minIncomeRangeMax}</strong>
      </>
    )

  const getRent = (rentMin: string, rentMax: string, percent = false) => {
    const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
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
    minimumIncome:
      minIncome.toString() !== "" ? (
        <>
          {minIncome} {t("t.perMonth")}
        </>
      ) : (
        <strong>Data not available</strong>
      ),
    rent: <>{rent.toString() !== "" ? rent : <strong>Data not available</strong>}</>,
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

export const unitSummariesTable = (summaries: UnitSummary[]) => {
  const unitSummaries = summaries.map((unitSummary) => {
    return getSummaryRow(
      unitSummary.minIncomeRange.min,
      unitSummary.minIncomeRange.max,
      unitSummary.rentRange.min,
      unitSummary.rentRange.max,
      "",
      "",
      unitSummary.totalAvailable,
      unitSummary.totalCount,
      unitSummary.unitType.name
    )
  })

  return unitSummaries
}

export const getSummariesTable = (summaries: UnitSummary[]) => {
  let groupedUnits = [] as Array<GroupedTableGroup>

  if (summaries?.length > 0) {
    const unitSummaries = unitSummariesTable(summaries)
    groupedUnits = [
      {
        data: unitSummaries,
      },
    ]
  }
  return groupedUnits
}

export const unitSummariesTable2 = (summaries: UnitsSummary[]) => {
  const unitSummaries = summaries.map((unitSummary) => {
    return getSummaryRow(
      unitSummary.minimumIncomeMin || "",
      unitSummary.minimumIncomeMax || "",
      unitSummary.monthlyRentMin || "",
      unitSummary.monthlyRentMax || "",
      unitSummary.monthlyRentAsPercentOfIncome || "",
      unitSummary.monthlyRentAsPercentOfIncome || "",
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
