import { SetStateAction } from "react"
import {
  t,
  cloudinaryUrlFromId,
  CloudinaryUpload,
  TimeFieldPeriod,
} from "@bloom-housing/ui-components"
import moment from "moment"
import {
  AmiChart,
  ApplicationSubmissionType,
  AssetsService,
  ListingEventType,
  ListingEvent,
  IncomePeriod,
} from "@bloom-housing/backend-core/types"
import { TempUnit, FormListing, TempUnitsSummary } from "../src/listings/PaperListingForm"
import { FieldError } from "react-hook-form"

type DateTimePST = {
  hour: string
  minute: string
  second: string
  dayPeriod: string
  year: string
  day: string
  month: string
}

interface FormOption {
  label: string
  value: string
}

export interface FormOptions {
  [key: string]: FormOption[]
}

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const convertDataToPst = (dateObj: Date, type: ApplicationSubmissionType) => {
  if (!dateObj) {
    return {
      date: t("t.n/a"),
      time: t("t.n/a"),
    }
  }

  if (type === ApplicationSubmissionType.electronical) {
    // convert date and time to PST (electronical applications)
    const ptFormat = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      year: "numeric",
      day: "numeric",
      month: "numeric",
    })

    const originalDate = new Date(dateObj)
    const ptDateParts = ptFormat.formatToParts(originalDate)
    const timeValues = ptDateParts.reduce((acc, curr) => {
      Object.assign(acc, {
        [curr.type]: curr.value,
      })
      return acc
    }, {} as DateTimePST)

    const { month, day, year, hour, minute, second, dayPeriod } = timeValues

    const date = `${month}/${day}/${year}`
    const time = `${hour}:${minute}:${second} ${dayPeriod} PT`

    return {
      date,
      time,
    }
  }

  if (type === ApplicationSubmissionType.paper) {
    const momentDate = moment(dateObj)

    const date = momentDate.utc().format("MM/DD/YYYY")
    const time = momentDate.utc().format("hh:mm:ss A")

    return {
      date,
      time,
    }
  }
}

export const toNumberOrNull = (obj: string | number | undefined): number => {
  return obj ? Number(obj) : null
}

export const stringToNumberOrOne = (str: string | number | undefined): number => {
  return str ? Number(str) : 1
}

export const stringToBoolean = (str: string | boolean | undefined): boolean => {
  return str === true || str === "true" || str === "yes"
}

export const booleanToString = (bool: boolean): string => {
  return bool === true ? "true" : "false"
}

export const getRentType = (unit: TempUnit): string | null => {
  return unit?.monthlyIncomeMin && unit?.monthlyRent
    ? "fixed"
    : unit?.monthlyRentAsPercentOfIncome
    ? "percentage"
    : null
}

export const getRentTypeFromUnitsSummary = (summary: TempUnitsSummary): string | null => {
  if (summary?.monthlyRentMin || summary?.monthlyRentMax) {
    return "fixed"
  } else if (summary?.monthlyRentAsPercentOfIncome) {
    return "percentage"
  }
  return null
}

export const getAmiChartId = (chart: AmiChart | string | undefined): string | null => {
  if (chart === undefined) {
    return null
  }
  return chart instanceof Object ? chart.id : chart
}

export const isNullOrUndefined = (value: unknown): boolean => {
  return value === null || value === undefined
}

export const getLotteryEvent = (listing: FormListing): ListingEvent | undefined => {
  const lotteryEvents = listing?.events.filter(
    (event) => event.type === ListingEventType.publicLottery
  )
  return lotteryEvents && lotteryEvents.length && lotteryEvents[0].startTime
    ? lotteryEvents[0]
    : null
}

export function arrayToFormOptions<T>(
  arr: T[],
  label: string,
  value: string,
  translateLabel?: string
): FormOption[] {
  return arr.map((val: T) => ({
    label: translateLabel ? t(`${translateLabel}.${val[label]}`) : val[label],
    value: val[value],
  }))
}

/**
 * Create Date object with date and time which comes from the TimeField component
 */
export const createTime = (
  date: Date,
  formTime: { hours: string; minutes: string; period: TimeFieldPeriod }
) => {
  if (!formTime?.hours || !date) return null
  // date should be cloned, operations in the reference directly can occur unexpected changes
  const dateClone = new Date(date.getTime())
  if (!dateClone || (!formTime.hours && !formTime.minutes)) return null
  let formattedHours = parseInt(formTime.hours)
  if (formTime.period === "am" && formattedHours === 12) {
    formattedHours = 0
  }
  if (formTime.period === "pm" && formattedHours !== 12) {
    formattedHours = formattedHours + 12
  }
  dateClone.setHours(formattedHours, parseInt(formTime.minutes), 0)
  return dateClone
}

/**
 * Create Date object depending on DateField component
 */
export const createDate = (formDate: { year: string; month: string; day: string }) => {
  if (!formDate || !formDate?.year || !formDate?.month || !formDate?.day) return null
  return new Date(`${formDate.month}-${formDate.day}-${formDate.year}`)
}

interface FileUploaderParams {
  file: File
  setCloudinaryData: (data: SetStateAction<{ id: string; url: string }>) => void
  setProgressValue: (value: SetStateAction<number>) => void
}

/**
 * Accept a file from the Dropzone component along with data and progress state
 * setters. It will then handle obtaining a signature from the backend and
 * uploading the file to Cloudinary, setting progress along the way and the
 * id/url of the file when the upload is complete.
 */
export const cloudinaryFileUploader = async ({
  file,
  setCloudinaryData,
  setProgressValue,
}: FileUploaderParams) => {
  const cloudName = process.env.cloudinaryCloudName
  const uploadPreset = process.env.cloudinarySignedPreset

  setProgressValue(1)

  const timestamp = Math.round(new Date().getTime() / 1000)
  const tag = "browser_upload"

  const assetsService = new AssetsService()
  const params = {
    timestamp,
    tags: tag,
    upload_preset: uploadPreset,
  }

  const resp = await assetsService.createPresignedUploadMetadata({
    body: { parametersToSign: params },
  })
  const signature = resp.signature

  setProgressValue(3)

  void CloudinaryUpload({
    signature,
    apiKey: process.env.cloudinaryKey,
    timestamp,
    file,
    onUploadProgress: (progress) => {
      setProgressValue(progress)
    },
    cloudName,
    uploadPreset,
    tag,
  }).then((response) => {
    setProgressValue(100)
    setCloudinaryData({
      id: response.data.public_id,
      url: cloudinaryUrlFromId(response.data.public_id),
    })
  })
}

export function formatIncome(value: number, currentType: IncomePeriod, returnType: IncomePeriod) {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  if (returnType === "perMonth") {
    const monthIncomeNumber = currentType === "perYear" ? value / 12 : value
    return usd.format(monthIncomeNumber)
  } else {
    const yearIncomeNumber = currentType === "perMonth" ? value * 12 : value
    return usd.format(yearIncomeNumber)
  }
}

export const isObject = (obj: any, key: string) => {
  return (
    obj[key] &&
    typeof obj[key] === "object" &&
    !Array.isArray(obj[key]) &&
    !(Object.prototype.toString.call(obj[key]) === "[object Date]")
  )
}

/**
 *
 * @param obj - Any object
 *
 *  End result is an object with these rules for fields:
 *    No empty objects - removed
 *    No objects that only have fields with null / empty strings - removed
 *    No null/undefined fields - removed
 *    No empty strings - set to null but still included
 *    Arrays / non-empty strings / Date objects - no changes
 */
export const removeEmptyObjects = (obj: any, nested?: boolean) => {
  Object.keys(obj).forEach((key) => {
    if (isObject(obj, key)) {
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      } else {
        removeEmptyObjects(obj[key], true)
      }
    }
    if (isObject(obj, key) && Object.keys(obj[key]).length === 0) {
      delete obj[key]
    }
    if (obj[key] === null || obj[key] === undefined) {
      if (nested) {
        delete obj[key]
      }
    }

    if (obj[key] === "") {
      if (nested) {
        delete obj[key]
      } else {
        obj[key] = null
      }
    }
  })
}

export const fieldHasError = (errorObj: FieldError) => {
  return errorObj !== undefined
}

export const fieldMessage = (errorObj: FieldError) => {
  return errorObj?.message
}
