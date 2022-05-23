import React, { useState, useEffect } from "react"
import "./Overlay.scss"
import useKeyPress from "../helpers/useKeyPress"
import { createPortal } from "react-dom"
import FocusLock from "react-focus-lock"
import { CSSTransition } from "react-transition-group"
import { RemoveScroll } from "react-remove-scroll"

export type OverlayProps = {
  open?: boolean
  ariaLabel?: string
  ariaDescription?: string
  className?: string
  backdrop?: boolean
  onClose?: () => void
  children: React.ReactNode
  slim?: boolean
}

const OverlayInner = (props: OverlayProps) => {
  const closeHandler = () => {
    if (props.onClose) props.onClose()
  }

  useKeyPress("Escape", () => closeHandler())

  const classNames = ["fixed-overlay"]
  if (typeof props.backdrop === "undefined" || props.backdrop) classNames.push("is-backdrop")
  if (props.className) classNames.push(props.className)

  return (
    <div
      className={classNames.join(" ")}
      role="dialog"
      aria-labelledby={props.ariaLabel}
      aria-describedby={props.ariaDescription}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeHandler()
      }}
    >
      <div className={`fixed-overlay__inner ${props.slim ? "fixed-overlay__inner-slim" : ""}`}>
        <FocusLock>{props.children}</FocusLock>
      </div>
    </div>
  )
}

export const Overlay = (props: OverlayProps) => {
  const documentAvailable = typeof document !== "undefined"
  const overlayRoot = useState<Element | null>(
    documentAvailable ? document.querySelector("#__next") : null
  )[0]
  const elForPortal = useState<Element | null>(
    documentAvailable ? document.createElement("div") : null
  )[0]

  // append overlay to the root of app
  useEffect(() => {
    if (!(overlayRoot && elForPortal)) return

    overlayRoot.appendChild(elForPortal)

    return () => {
      overlayRoot.removeChild(elForPortal)
    }
  }, [elForPortal, overlayRoot])

  return (
    elForPortal &&
    createPortal(
      <CSSTransition
        in={props.open}
        timeout={250}
        classNames="overlay-effect"
        mountOnEnter
        unmountOnExit
      >
        <RemoveScroll>
          <OverlayInner {...props}>{props.children}</OverlayInner>
        </RemoveScroll>
      </CSSTransition>,
      elForPortal
    )
  )
}

export default Overlay
