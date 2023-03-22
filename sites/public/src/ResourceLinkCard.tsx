import React from "react"
import { Icon, UniversalIconType, LinkButton } from "@bloom-housing/ui-components"

interface ResourceLinkCardProps {
  iconSymbol: UniversalIconType
  title: string
  subtitle: string
  linkUrl: string
  linkLabel: string
}

const ResourceLinkCard = (props: ResourceLinkCardProps) => {
  const { iconSymbol, title, subtitle, linkUrl, linkLabel } = props

  return (
    <div className="border-b">
      <div className="py-6 px-5 md:py-8">
        <Icon
          fill="black"
          size="xlarge"
          symbol={iconSymbol}
          className="ml-2 px-2 pb-5 info-cards__title border-b-4 border-primary"
        />
        <h2 className="font-semibold mt-8">{title}</h2>
        <div className="mb-4">{subtitle}</div>
        <LinkButton unstyled className="bg-opacity-0 ms-0" href={linkUrl}>
          {linkLabel}
        </LinkButton>
      </div>
    </div>
  )
}

export default ResourceLinkCard
