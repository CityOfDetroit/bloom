import * as React from "react"
import { t } from "../../helpers/translator"

export interface AdditionalFeesProps {
  depositMin?: string
  depositMax?: string
  applicationFee?: string
  depositHelperText?: string
  footerContent?: (string | React.ReactNode)[]
  containerClass?: string
}

const AdditionalFees = (props: AdditionalFeesProps) => {
  if (
    !props.depositMin &&
    !props.depositMax &&
    !props.applicationFee &&
    props.footerContent?.length === 0
  ) {
    return <></>
  }

  const getDeposit = () => {
    const min = props.depositMin
    const max = props.depositMax
    if (min && max && min !== max) {
      return `$${min} – $${max}`
    } else if (min) return `$${min}`
    else return `$${max}`
  }
  return (
    <div className={`info-card bg-gray-100 border-0 ${props.containerClass}`}>
      <p className="info-card__title">{t("listings.sections.additionalFees")}</p>
      <div className="info-card__columns text-sm">
        {props.applicationFee && (
          <div className="info-card__column-2">
            <div className="text-base">{t("listings.applicationFee")}</div>
            <div className="text-xl font-bold">${props.applicationFee}</div>
            <div>{t("listings.applicationPerApplicantAgeDescription")}</div>
            <div>{t("listings.applicationFeeDueAt")}</div>
          </div>
        )}
        {(props.depositMin || props.depositMax) && (
          <div className="info-card__column-2">
            <div className="text-base">{t("t.deposit")}</div>
            <div className="text-xl font-bold">{getDeposit()}</div>
            {props.depositHelperText && <div>{props.depositHelperText}</div>}
          </div>
        )}
      </div>
      <div className="info-card__columns text-sm">
        {props?.footerContent?.map((elem, idx) => (
          <div key={`footer_info_${idx}`} className=" info-card__column-2">
            {elem}
          </div>
        ))}
      </div>
    </div>
  )
}
export { AdditionalFees as default, AdditionalFees }
