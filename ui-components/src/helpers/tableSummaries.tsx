import * as React from "react"
import { t } from "./translator"
import { UnitsSummary } from "@bloom-housing/backend-core/types"
import { GroupedTableGroup } from "../tables/GroupedTable"

export const unitSummariesTable = (summaries: UnitsSummary[]) => {
  const unitsSummaries = summaries.map((unitSummary) => {
    const minIncome =
      unitSummary.minimumIncomeMin == unitSummary.minimumIncomeMax ? (
        <strong>{unitSummary.minimumIncomeMin}</strong>
      ) : (
        <>
          <strong>{unitSummary.minimumIncomeMin}</strong> {t("t.to")}{" "}
          <strong>{unitSummary.minimumIncomeMax}</strong>
        </>
      )

    const getRent = (rent: string, percent = false) => {
      const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
      return (
        <>
          <strong>{rent}</strong>
          {unit}
        </>
      )
    }

    // Use rent as percent income if available, otherwise use exact rent
    const rent = unitSummary.monthlyRentAsPercentOfIncome
      ? getRent(unitSummary.monthlyRentAsPercentOfIncome.toString(), true)
      : getRent(unitSummary.monthlyRent)

    return {
      unitType: <strong>{t(`listings.unitTypes.${unitSummary.unitType.name}`)}</strong>,
      minimumIncome: (
        <>
          {minIncome} {t("t.perMonth")}
        </>
      ),
      rent: <>{rent}</>,
      availability: (
        <>
          {unitSummary.totalAvailable && unitSummary.totalAvailable > 0 ? (
            <>
              <strong>{unitSummary.totalAvailable}</strong>{" "}
              {unitSummary.totalAvailable == 1 ? t("t.unit") : t("t.units")}
            </>
          ) : (
            <span className="uppercase">{t("listings.waitlist.label")}</span>
          )}
        </>
      ),
      totalCount: (
        <>
          <strong>{unitSummary.totalCount}</strong>{" "}
          {unitSummary.totalCount == 1 ? t("t.unit") : t("t.units")}
        </>
      ),
    }
  })

  return unitsSummaries
}

export const getSummariesTable = (summaries: UnitsSummary[]) => {
  let groupedUnits = [] as Array<GroupedTableGroup>

  if (summaries?.length > 0) {
    const unitsSummaries = unitSummariesTable(summaries)
    groupedUnits = [
      {
        data: unitsSummaries,
      },
    ]
  }
  return groupedUnits
}
