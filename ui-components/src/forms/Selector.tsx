import React from "react"
import Select, { OptionsType } from "react-select"

export interface SelectorProps {
  options?: { value: string; label: string }[]
  closeMenu?: boolean
  defaultValue?: { value: string; label: string }[]
  multiSelect?: boolean
  onClick?: boolean
}

const handleFilterChange = (
  onClick: { value: string; label: string } | OptionsType<{ value: string; label: string }> | null
) => {
  console.log(onClick)
}

const Selector = (props: SelectorProps) => {
  return (
    <div>
      <Select
        options={props.options}
        isMulti={props.multiSelect}
        closeMenuOnSelect={props.closeMenu}
        defaultValue={props.defaultValue}
        onChange={(onClick) => handleFilterChange(onClick)}
      />
    </div>
  )
}

export { Selector as default, Selector }
