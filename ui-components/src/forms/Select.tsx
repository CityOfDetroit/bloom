import React from "react"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { FormOptions, SelectOption } from "../helpers/formOptions"
import { UseFormMethods } from "react-hook-form"

interface SelectProps {
  error?: boolean
  errorMessage?: string
  controlClassName?: string
  labelClassName?: string
  type?: string
  id?: string
  name: string
  label?: string
  defaultValue?: string
  placeholder?: string
  register?: UseFormMethods["register"]
  validation?: Record<string, unknown>
  disabled?: boolean
  options: (string | SelectOption)[]
  keyPrefix?: string
  describedBy?: string
  inputProps?: Record<string, unknown>
  noDefault?: boolean
}

export const Select = ({
  error,
  errorMessage,
  controlClassName,
  labelClassName,
  id,
  name,
  label,
  placeholder,
  register,
  validation,
  disabled,
  options,
  keyPrefix,
  describedBy,
  inputProps,
  defaultValue,
  noDefault = false,
}: SelectProps) => {
  // noDefault here means that the underlying form select does NOT want to have a defaultValue
  // By default, this will set a defaultValue on the form select.
  inputProps = inputProps ? { ...inputProps } : {}
  if (noDefault === false) {
    // The defaultValue will be set to (in order of precedence):
    // defaultValue, inputProps.defaultValue, ""
    if (defaultValue) {
      inputProps.defaultValue = defaultValue
    }
    if (!inputProps.defaultValue) {
      inputProps.defaultValue = ""
    }
  }

  return (
    <div className={"field " + (error ? "error" : "")}>
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <div className={controlClassName}>
        <select
          className="input"
          id={id || name}
          name={name}
          aria-describedby={describedBy ? describedBy : `${id}-error`}
          aria-invalid={!!error || false}
          ref={register && register(validation)}
          disabled={disabled}
          {...inputProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          <FormOptions options={options} keyPrefix={keyPrefix} />
        </select>
      </div>
      {error && errorMessage && (
        <ErrorMessage id={`${id}-error`} error={error}>
          {errorMessage}
        </ErrorMessage>
      )}
    </div>
  )
}
