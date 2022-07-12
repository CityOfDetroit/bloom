import React from "react"
import { MarkdownSection, Icon } from "@bloom-housing/ui-components"
import { IconTypes } from "../../../ui-components/src/icons/Icon"

interface ResourceLinkCardProps {
  iconSymbol: IconTypes
  title: string
  subtitle: string
  linkUrl: string
  linkLabel: string
}

const ResourceLinkCard = (props: ResourceLinkCardProps) => {
  const { iconSymbol, title, subtitle, linkUrl, linkLabel } = props
  // TODO: Swap <a> tag with LinkButton
  return (
    <div className="border-b">
      <MarkdownSection>
        <Icon
          fill="black"
          size="large"
          symbol={iconSymbol}
          className="ml-2 px-2 info-cards__title"
        />
        <h3 className="font-semibold mt-0">{title}</h3>
        <div className="mb-4">{subtitle}</div>
        <a className="underline" href={linkUrl}>
          {linkLabel}
        </a>
      </MarkdownSection>
    </div>
  )
}

export default ResourceLinkCard
