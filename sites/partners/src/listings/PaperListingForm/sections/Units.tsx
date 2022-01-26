import React, { useState, useMemo, useCallback, useEffect } from "react"
import {
  t,
  GridSection,
  MinimalTable,
  Button,
  AppearanceSizeType,
  Drawer,
  Modal,
  AppearanceStyleType,
  AppearanceBorderType,
} from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"
import { TempUnitsSummary } from "../"
import UnitsSummaryForm from "../UnitsSummaryForm"
import { UnitsSummary } from "@bloom-housing/backend-core/types"
import { fieldHasError } from "../../../../lib/helpers"

type UnitProps = {
  unitsSummaries: TempUnitsSummary[]
  setSummaries: (summaries: TempUnitsSummary[]) => void
}

function isDefined(item: number | string) {
  return item !== null && item !== undefined && item !== ""
}

function formatRange(min: string | number, max: string | number, prefix: string) {
  if (!isDefined(min) && !isDefined(max)) return ""
  if (min == max || !isDefined(max)) return `${prefix}${min}`
  if (!isDefined(min)) return `${prefix}${max}`
  return `${prefix}${min} - ${prefix}${max}`
}

const FormUnits = ({ unitsSummaries, setSummaries }: UnitProps) => {
  const [summaryDrawer, setSummaryDrawer] = useState<number | null>(null)
  const [summaryDeleteModal, setSummaryDeleteModal] = useState<number | null>(null)

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, clearErrors } = formMethods

  const unitSummariesHeaders = {
    unitType: "listings.unit.type",
    amiPercentage: "listings.unit.ami",
    monthlyRent: "listings.unit.rent",
    sqFeet: "listings.unit.sqft",
    priorityType: "listings.unit.priorityType",
    occupancy: "listings.unitsSummary.occupancy",
    totalAvailable: "listings.unitsSummary.available",
    totalCount: "listings.unitsSummary.count",
    action: "",
  }

  const editSummary = useCallback(
    (tempId: number) => {
      setSummaryDrawer(tempId)
    },
    [setSummaryDrawer]
  )

  const deleteSummary = useCallback(
    (tempId: number) => {
      const updatedSummaries = unitsSummaries
        .filter((summary) => summary.tempId !== tempId)
        .map((updatedUnit, index) => ({
          ...updatedUnit,
          tempId: index + 1,
        }))

      setSummaries(updatedSummaries)
      setSummaryDeleteModal(null)
    },
    [setSummaryDeleteModal, setSummaries, unitsSummaries]
  )

  const getRentFromSummary = (summary: UnitsSummary) => {
    if (summary.monthlyRentMin || summary.monthlyRentMax) {
      return formatRange(summary.monthlyRentMin, summary.monthlyRentMax, "$")
    }
    if (summary.monthlyRentAsPercentOfIncome) {
      return `${summary.monthlyRentAsPercentOfIncome}%`
    }
  }

  function saveUnitsSummary(newSummary: TempUnitsSummary) {
    const exists = unitsSummaries.some((summary) => summary.tempId === newSummary.tempId)
    if (exists) {
      const updateSummaries = unitsSummaries.map((summary) =>
        summary.tempId === newSummary.tempId ? newSummary : summary
      )
      setSummaries(updateSummaries)
    } else {
      setSummaries([...unitsSummaries, newSummary])
    }
  }
  const unitsSummaryTableData = useMemo(
    () =>
      unitsSummaries?.map((summary) => ({
        unitType: summary.unitType && t(`listings.unitTypes.${summary.unitType.name}`),
        amiPercentage: isDefined(summary.amiPercentage) ? `${summary.amiPercentage}%` : "",
        monthlyRent: getRentFromSummary(summary),
        sqFeet: formatRange(summary.sqFeetMin, summary.sqFeetMax, ""),
        priorityType: summary.priorityType?.name,
        occupancy: formatRange(summary.minOccupancy, summary.maxOccupancy, ""),
        totalAvailable: summary.totalAvailable,
        totalCount: summary.totalCount,
        action: (
          <div className="flex">
            <Button
              type="button"
              className="front-semibold uppercase"
              onClick={() => editSummary(summary.tempId)}
              unstyled
            >
              {t("t.edit")}
            </Button>
            <Button
              type="button"
              className="front-semibold uppercase text-red-700"
              onClick={() => setSummaryDeleteModal(summary.tempId)}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      })),
    [unitsSummaries, editSummary]
  )

  return (
    <>
      <GridSection
        title={t("listings.units")}
        description={t("listings.unitsDescription")}
        grid={false}
        separator
      >
        <span className={"text-tiny text-gray-800 block mb-2"}>{t("listings.units")}</span>
        <div className="bg-gray-300 px-4 py-5">
          <div className="mb-5">
            <MinimalTable
              headers={unitSummariesHeaders}
              data={unitsSummaryTableData}
              responsiveCollapse={true}
            />
          </div>
          <Button
            type="button"
            size={AppearanceSizeType.normal}
            styleType={fieldHasError(errors?.unitsSummaries) ? AppearanceStyleType.alert : null}
            onClick={() => {
              editSummary(unitsSummaries.length + 1)
              clearErrors("unitsSummaries")
            }}
          >
            {t("listings.unitsSummary.add")}
          </Button>
        </div>
      </GridSection>

      <p className="field-sub-note">{t("listings.requiredToPublish")}</p>
      {fieldHasError(errors?.units) && (
        <span className={"text-sm text-alert"}>{t("errors.requiredFieldError")}</span>
      )}
      {fieldHasError(errors?.unitsSummaries) && (
        <span className={"text-sm text-alert"}>{t("errors.requiredFieldError")}</span>
      )}

      <Drawer
        open={!!summaryDrawer}
        title={t("listings.unitsSummary.add")}
        ariaDescription={t("listings.unitsSummary.add")}
        onClose={() => setSummaryDrawer(null)}
      >
        <UnitsSummaryForm
          onSubmit={(summary) => saveUnitsSummary(summary)}
          onClose={() => setSummaryDrawer(null)}
          summaries={unitsSummaries}
          currentTempId={summaryDrawer}
        />
      </Drawer>

      <Modal
        open={!!summaryDeleteModal}
        title={t("listings.unitsSummary.delete")}
        ariaDescription={t("listings.unitsSummary.deleteConf")}
        actions={[
          <Button
            styleType={AppearanceStyleType.alert}
            onClick={() => deleteSummary(summaryDeleteModal)}
          >
            {t("t.delete")}
          </Button>,
          <Button
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setSummaryDeleteModal(null)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("listings.unitsSummary.deleteConf")}
      </Modal>
    </>
  )
}

export default FormUnits
