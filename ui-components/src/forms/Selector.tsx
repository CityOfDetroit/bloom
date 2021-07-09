import React from "react"
import Select from "react-select"

export interface SelectorProps {
  options?: { value: string; label: string }[]
  closeMenu?: boolean
  defaultValue?: { value: string; label: string }[]
  multiSelect?: boolean
}

const Selector = (props: SelectorProps) => {
  return (
    <div style={{ width: 500 }}>
      <Select
        options={props.options}
        isMulti={props.multiSelect}
        closeMenuOnSelect={props.closeMenu}
        defaultValue={props.defaultValue}
      />
    </div>
  )
}

export { Selector as default, Selector }
