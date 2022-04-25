import React, { useState, useRef } from "react"
import useKeyPress from "../helpers/useKeyPress"
import "./Tooltip.scss"

export interface TooltipProps {
  className?: string
  id: string
  text: string
}

export interface TooltipPosition {
  top: number
  left: number
}

const Tooltip: React.FC<TooltipProps> = ({ className, id, text, children }) => {
  const [position, setPosition] = useState<TooltipPosition | null>(null)
  const childrenWrapperRef = useRef<HTMLDivElement>(null)

  const show = () => {
    const { x, y } = childrenWrapperRef.current?.getBoundingClientRect() || {}

    if (x && y) {
      setPosition({ top: y, left: x })
    }
  }

  const hide = () => setPosition(null)

  useKeyPress("Escape", () => hide())

  return (
    <div
      className={`tooltip ${className || ""}`}
      onFocus={show}
      onMouseEnter={show}
      onBlur={hide}
      onMouseLeave={hide}
    >
      <div
        className={`tooltip__element ${position ? "tooltip__element--visible" : ""}`}
        style={position || {}}
        role="tooltip"
        id={id}
        data-testid="tooltip-element"
      >
        {text}
      </div>

      <div className="tooltip__children" data-testid="tooltip-children" ref={childrenWrapperRef}>
        {children}
      </div>
    </div>
  )
}

export { Tooltip as default, Tooltip }
