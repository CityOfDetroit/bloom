import dayjs from "dayjs"
import { MinMax } from "@bloom-housing/backend-core/types"

export const cloudinaryPdfFromId = (publicId: string): string => {
  if (publicId) {
    const cloudName = process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.pdf`
  } else return ""
}

export const formatDate = (rawDate: any, format: string): string => {
  if (isDefined(rawDate)) {
    return dayjs(rawDate).format(format)
  } else return ""
}

export const getUniqueElements = (nestedArr: any[], objKey: string): string => {
  const uniqueArr = []
  nestedArr?.forEach((elem) => {
    if (!uniqueArr.includes(elem[objKey])) uniqueArr.push(elem[objKey])
  })
  return uniqueArr.join(", ")
}

export function formatRange(
  min: string | number,
  max: string | number,
  prefix: string,
  postfix: string
): string {
  if (!isDefined(min) && !isDefined(max)) return ""
  if (min == max || !isDefined(max)) return `${prefix}${min}${postfix}`
  if (!isDefined(min)) return `${prefix}${max}${postfix}`
  return `${prefix}${min}${postfix} - ${prefix}${max}${postfix}`
}

export function formatRentRange(rent: MinMax, percent: MinMax): string {
  let toReturn = ""
  if (rent) {
    toReturn += formatRange(rent.min, rent.max, "", "")
  }
  if (rent && percent) {
    toReturn += ", "
  }
  if (percent) {
    toReturn += formatRange(percent.min, percent.max, "", "%")
  }
  return toReturn
}

export function isDefined(item: number | string): boolean {
  return item !== null && item !== undefined && item !== ""
}
