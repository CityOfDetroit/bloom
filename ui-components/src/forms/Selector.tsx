import React from "react"
import Select, { OptionsType } from "react-select"

export interface SelectorProps {
  options?: { value: string; label: string }[]
  closeMenuOnSelect?: boolean
  defaultValue?: { value: string; label: string }[]
  isMultiSelect?: boolean
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
        isMulti={props.isMultiSelect}
        closeMenuOnSelect={props.closeMenuOnSelect}
        defaultValue={props.defaultValue}
        onChange={(onClick) => handleFilterChange(onClick)}
      />
    </div>
  )
}

export { Selector as default, Selector }
