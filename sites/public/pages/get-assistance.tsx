import React from "react"
import Markdown from "markdown-to-jsx"
import { MarkdownSection, t, PageHeader, Icon } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import RenderIf from "../src/RenderIf"
import sidebarContent from "../page_content/resources/sidebar.md"
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

export default function GetAssistance() {
  const pageTitle = t("pageTitle.getAssistance")
  const subtitle = t("pageDescription.getAssistance")

  return (
    <Layout>
      <PageHeader title={pageTitle} subtitle={subtitle} inverse />
      <section className="md:px-5 mt-8">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <div className="md:me-8">
              <ResourceLinkCard
                iconSymbol="questionThin"
                title={t("resourceLinkCard.affordableHousingTitle")}
                subtitle={t("resourceLinkCard.affordableHousingSubtitle")}
                linkLabel={t("resourceLinkCard.affordableHousingLinkLabel")}
                linkUrl="/housing-basics"
              />

              <ResourceLinkCard
                iconSymbol="house"
                title={t("resourceLinkCard.housingResourcesTitle")}
                subtitle={t("resourceLinkCard.housingResourcesSubtitle")}
                linkLabel={t("resourceLinkCard.housingResourcesLinkLabel")}
                linkUrl="/additional-resources"
              />
            </div>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:border-s">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    h4: {
                      component: ({ children, ...props }) => (
                        <h4 {...props} className="text-caps-underline">
                          {children}
                        </h4>
                      ),
                    },
                    RenderIf,
                  },
                }}
              >
                {sidebarContent}
              </Markdown>
            </MarkdownSection>
          </aside>
        </article>
      </section>
    </Layout>
  )
}
