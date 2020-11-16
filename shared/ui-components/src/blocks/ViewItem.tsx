import * as React from "react"
import "./ViewItem.scss"

export interface ViewItemProps {
  id?: string
  label?: string
  children?: React.ReactNode
  helper?: string
  flagged?: boolean
  className?: string
}

const ViewItem = (props: ViewItemProps) => {
  const viewItemClasses = ["view-item"]
  if (props.flagged) viewItemClasses.push("is-flagged")
  if (props.className) viewItemClasses.push(props.className)

  let valueClassName = "view-item__value"
  if (!props.label) valueClassName += " pt-0"

  return (
    <p id={props.id} className={viewItemClasses.join(" ")}>
      {props.label && <span className="view-item__label">{props.label}</span>}
      {props.children && <span className={valueClassName}>{props.children}</span>}
      {props.helper && <span className="view-item__helper">{props.helper}</span>}
    </p>
  )
}

export { ViewItem as default, ViewItem }
