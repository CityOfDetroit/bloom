import React from "react"
import Markdown from "markdown-to-jsx"
import { MarkdownSection, t, PageHeader, Icon } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import RenderIf from "../src/RenderIf"
import sidebarContent from "../page_content/resources/sidebar.md"
import { IconTypes } from "../../../ui-components/src/icons/Icon"

interface LinkCardProps {
  iconSymbol: IconTypes
  title: string
  subtitle: string
  linkUrl: string
  linkLabel: string
}

const LinkCard = (props: LinkCardProps) => {
  const { iconSymbol, title, subtitle, linkUrl, linkLabel } = props

  return (
    <div className="border-b">
      <MarkdownSection>
        <Icon fill="black" size="large" symbol={iconSymbol} className="ml-2 info-cards__title" />
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
  // TODO: Create pageTitle and pageDescription in general.json
  // const pageTitle = t("pageTitle.additionalResources")
  // const subTitle = t("pageDescription.additionalResources")

  const pageTitle = "Get Assistance"
  const subTitle = t("pageDescription.additionalResources")
  return (
    <Layout>
      <PageHeader title={pageTitle} subtitle={subTitle} inverse />
      <section className="md:px-5 mt-8">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <div className="md:me-8">
              <LinkCard
                iconSymbol="questionThin"
                title="Affordable Housing Basics"
                subtitle="Learn how you can find and apply for affordable rentals"
                linkLabel="Read about how it works"
                linkUrl="/housing-basics"
              />

              <LinkCard
                iconSymbol="house"
                title="Housing Resources"
                subtitle="We encourage you to browse additional resources in your search for housing"
                linkLabel="View opportunities and resources"
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
