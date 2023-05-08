import React, { useEffect, useState, useCallback } from "react"
import {
  AppearanceBorderType,
  AppearanceStyleType,
  Button,
  Field,
  Form,
  GridCell,
  GridSection,
  Select,
  SelectOption,
  t,
  ViewItem,
} from "@bloom-housing/ui-components"
import { FieldGroup } from "../../../../../../detroit-ui-components/src/forms/FieldGroup"
import { useForm } from "react-hook-form"
import { TempAmiLevel } from "../../../lib/listings/formTypes"
import { AmiChart, MonthlyRentDeterminationType } from "@bloom-housing/backend-core/types"

type UnitsSummaryFormProps = {
  onSubmit: (amiLevel: TempAmiLevel) => void
  onClose: () => void
  amiLevels: TempAmiLevel[]
  currentTempId: number
  amiCharOptions: SelectOption[]
  amiInfo: AmiChart[]
}

const UnitsSummaryAmiForm = ({
  onSubmit,
  onClose,
  amiLevels,
  currentTempId,
  amiCharOptions,
  amiInfo,
}: UnitsSummaryFormProps) => {
  const [current, setCurrent] = useState<TempAmiLevel>(null)
  const [amiPercentageOptions, setAmiPercentageOptions] = useState<SelectOption[]>([])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, trigger, getValues, reset, watch } = useForm({
    defaultValues: {
      amiChartId: current?.amiChartId,
      amiPercentage: current?.amiPercentage,
      flatRentValue: current?.flatRentValue,
      id: current?.id,
      monthlyRentDeterminationType: current?.monthlyRentDeterminationType,
      percentageOfIncomeValue: current?.percentageOfIncomeValue,
      tempId: current?.tempId,
    },
  })
  const monthlyRentDeterminationType: MonthlyRentDeterminationType = watch(
    "monthlyRentDeterminationType"
  )
  const amiChartId: string = watch("amiChartId")

  const fetchAmiChart = useCallback(
    (chartId: string) => {
      const chart = amiInfo.find((ami) => ami.id === chartId)
      if (chart) {
        setAmiPercentageOptions(
          chart.items.reduce(
            (accum, item) => {
              if (!accum.some((percentage) => percentage.value === `${item.percentOfAmi}`)) {
                accum.push({ value: `${item.percentOfAmi}`, label: `${item.percentOfAmi}` })
              }
              return accum
            },
            [{ label: "", value: "" }] as SelectOption[]
          )
        )
      }
    },
    [amiInfo, setAmiPercentageOptions]
  )

  useEffect(() => {
    if (amiChartId) {
      void fetchAmiChart(amiChartId)
    }
  }, [amiChartId, fetchAmiChart])

  useEffect(() => {
    const amilevel = amiLevels.find((summary) => summary.tempId === currentTempId)
    if (!amilevel?.amiChartId) {
      setAmiPercentageOptions([])
    } else {
      fetchAmiChart(amilevel.amiChartId)
    }
    setCurrent(amilevel)
    reset({ ...amilevel })
  }, [amiLevels, currentTempId, setAmiPercentageOptions, setCurrent, reset, fetchAmiChart])

  async function onFormSubmit() {
    // Triggers validation across the form.
    const validation = await trigger()
    if (!validation) return

    const data = getValues()

    const formData = {
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
    }

    const current = amiLevels.find((summary) => summary.tempId === currentTempId)
    if (current) {
      onSubmit({ ...formData, id: current.id, tempId: current.tempId })
    } else {
      onSubmit({
        ...formData,
        id: undefined,
        tempId: amiLevels.length + 1,
      })
    }
    onClose()
  }

  const monthlyRentDeterminationOptions = [
    {
      id: MonthlyRentDeterminationType.flatRent,
      label: t("listings.unitsSummary.flatRent"),
      value: MonthlyRentDeterminationType.flatRent,
      defaultChecked: true,
    },
    {
      id: MonthlyRentDeterminationType.percentageOfIncome,
      label: t("listings.unitsSummary.percentIncome"),
      value: MonthlyRentDeterminationType.percentageOfIncome,
    },
  ]

  return (
    <Form onSubmit={() => false}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("listings.unitsSummary.amiLevel")} columns={4}>
          <GridCell>
            <ViewItem label={t("listings.unitsSummary.amiChart")}>
              <Select
                id="amiChartId"
                name="amiChartId"
                label={t("listings.unitsSummary.amiChart")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={amiCharOptions}
                dataTestId="amiChartId"
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unitsSummary.percentageOfAmi")}>
              <Select
                id="amiPercentage"
                name="amiPercentage"
                label={t("listings.unitsSummary.percentageOfAmi")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={amiPercentageOptions}
                dataTestId="amiPercentage"
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.unitsSummary.monthlyRentDeterminationType")}>
              <FieldGroup
                name="monthlyRentDeterminationType"
                type="radio"
                register={register}
                fields={monthlyRentDeterminationOptions}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
                error={errors?.monthlyRentDeterminationType !== undefined}
                errorMessage={t("errors.requiredFieldError")}
                dataTestId="monthlyRentDeterminationType"
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            {monthlyRentDeterminationType === MonthlyRentDeterminationType.percentageOfIncome ? (
              <ViewItem label={t("listings.unitsSummary.percentageOfIncomeValue")}>
                <Field
                  id="percentageOfIncomeValue"
                  name="percentageOfIncomeValue"
                  label={t("listings.unitsSummary.percentageOfIncomeValue")}
                  placeholder={t("listings.unitsSummary.percentageOfIncomeValue")}
                  register={register}
                  readerOnly
                  type="number"
                  error={errors?.percentageOfIncomeValue !== undefined}
                  errorMessage={t("errors.requiredFieldError")}
                  dataTestId="percentageOfIncomeValue"
                />
              </ViewItem>
            ) : (
              <ViewItem label={t("listings.unitsSummary.flatRentValue")}>
                <Field
                  id="flatRentValue"
                  name="flatRentValue"
                  label={t("listings.unitsSummary.flatRentValue")}
                  placeholder={t("listings.unitsSummary.flatRentValue")}
                  register={register}
                  readerOnly
                  type="number"
                  error={errors?.flatRentValue !== undefined}
                  errorMessage={t("errors.requiredFieldError")}
                  dataTestId="flatRentValue"
                />
              </ViewItem>
            )}
          </GridCell>
        </GridSection>
      </div>
      <div className="mt-6">
        <Button
          type="button"
          onClick={() => onFormSubmit()}
          styleType={AppearanceStyleType.primary}
          dataTestId="saveAmi"
        >
          {t("t.save")}
        </Button>

        <Button
          type="button"
          onClick={onClose}
          styleType={AppearanceStyleType.secondary}
          border={AppearanceBorderType.borderless}
        >
          {t("t.cancel")}
        </Button>
      </div>
    </Form>
  )
}

export default UnitsSummaryAmiForm
