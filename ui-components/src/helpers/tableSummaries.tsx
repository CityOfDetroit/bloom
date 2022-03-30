/* import * as React from "react"
import { t } from "./translator"
import { MinMax, UnitGroupSummary } from "@bloom-housing/backend-core/types"

const getSummaryRow = (
  totalAvailable: number,
  rentRangeMin?: string,
  rentRangeMax?: string,
  rentAsPercentIncomeRangeMin?: string | MinMax,
  rentAsPercentIncomeRangeMax?: string,
  unitTypeName?: string
) => {
  const getRent = (rentMin?: string | MinMax, rentMax?: string, percent = false) => {
    const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
    if (rentMin == undefined && rentMax == undefined) {
      //TODO(#345): figure out what to display when there's no data
      return <strong>{t("t.call")}</strong>
    } else if (rentMin == rentMax || rentMax == undefined) {
      return (
        <>
          <strong>{`$${rentMin}`}</strong>
          {unit}
        </>
      )
    } else if (rentMin == undefined) {
      return (
        <>
          <strong>{`$${rentMax}`}</strong>
          {unit}
        </>
      )
    } else {
      return (
        <>
          <strong>{`$${rentMin}`}</strong> {t("t.to")} <strong>{`$${rentMax}`}</strong>
          {unit}
        </>
      )
    }
  }

  // Use rent as percent income if available, otherwise use exact rent
  const rent = rentAsPercentIncomeRangeMin
    ? getRent(rentAsPercentIncomeRangeMin, rentAsPercentIncomeRangeMax, true)
    : getRent(rentRangeMin, rentRangeMax)

  return {
    unitType: <strong>{t(`listings.unitTypes.${unitTypeName}`)}</strong>,
    rent: <>{rent}</>,
    availability: (
      <>
        {totalAvailable > 0 ? (
          <>
            <strong>{totalAvailable}</strong> {totalAvailable == 1 ? t("t.unit") : t("t.units")}
          </>
        ) : (
          <span className="uppercase">{t("listings.waitlist.label")}</span>
        )}
      </>
    ),
  }
}

export const getSummariesTableFromUnitSummary = (summaries: UnitGroupSummary[]) => {
  let unitSummaries = [] as Record<string, React.ReactNode>[]

  if (summaries?.length > 0) {
    unitSummaries = summaries.map((unitSummary) => {
      return getSummaryRow(
        unitSummary.unitVacancies ? unitSummary.unitVacancies : 0,
        unitSummary.rentRange.min,
        unitSummary.rentRange.max,
        unitSummary.rentAsPercentIncomeRange.min
          ? unitSummary.rentAsPercentIncomeRange.min.toString()
          : "",
        unitSummary.rentAsPercentIncomeRange.max
          ? unitSummary.rentAsPercentIncomeRange.max.toString()
          : "",
        ""
      )
    })
  }
  return unitSummaries
}

export const getSummariesTableFromUnitsSummary = (summaries: UnitGroupSummary[]) => {
  let unitSummaries = [] as Record<string, React.ReactNode>[]

  if (summaries?.length > 0) {
    unitSummaries = summaries.map((unitSummary) => {
      return getSummaryRow(
        unitSummary.unitVacancies ? unitSummary.unitVacancies : 0,
        unitSummary.rentRange?.toString(),
        "",
        unitSummary.rentAsPercentIncomeRange,
        "",
        ""
      )
    })
  }
  return unitSummaries
}
 */

export {}
