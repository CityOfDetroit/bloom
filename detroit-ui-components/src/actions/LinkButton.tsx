import React, { useContext } from "react"
import "./Button.scss"
import { buttonClassesForProps, buttonInner, ButtonProps } from "./Button"
import { NavigationContext } from "@bloom-housing/shared-helpers"
import { isExternalLink } from "@bloom-housing/ui-components"

export interface LinkButtonProps extends Omit<ButtonProps, "onClick"> {
  href: string
  dataTestId?: string
  linkProps?: Record<string, unknown>
}

const LinkButton = (props: LinkButtonProps) => {
  const { LinkComponent } = useContext(NavigationContext)
  const buttonClasses = buttonClassesForProps(props)

  if (isExternalLink(props.href)) {
    return (
      <a
        href={props.href}
        className={buttonClasses.join(" ")}
        data-test-id={props.dataTestId}
        {...props.linkProps}
      >
        {buttonInner(props)}
      </a>
    )
  } else {
    return (
      <LinkComponent
        href={props.href}
        className={buttonClasses.join(" ")}
        data-test-id={props.dataTestId}
      >
        {buttonInner(props)}
      </LinkComponent>
    )
  }
}

export { LinkButton as default, LinkButton }
