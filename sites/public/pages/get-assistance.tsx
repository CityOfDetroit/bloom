import React from "react"
import Markdown from "markdown-to-jsx"
import { MarkdownSection, t, InfoCardGrid, PageHeader, Icon } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import RenderIf from "../src/RenderIf"
import sidebarContent from "../page_content/resources/sidebar.md"

export default function GetAssistance() {
  // TODO: Create pageTitle and pageDescription in general.json
  // const pageTitle = t("pageTitle.additionalResources")
  // const subTitle = t("pageDescription.additionalResources")

  const pageTitle = "Get Assistance"
  const subTitle = t("pageDescription.additionalResources")
  return (
    <Layout>
      <PageHeader title={pageTitle} subtitle={subTitle} inverse />
      <section className="md:px-5">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <div>
              <div className="border-b">
                <MarkdownSection>
                  <Icon
                    fill="black"
                    size="large"
                    symbol="question"
                    className="ml-2 info-cards__title"
                  />
                  <h3 className="font-semibold">Affordable Housing Basics</h3>
                  <div>Learn how you can find and apply for affordable rentals</div>
                  <a href="/">Read about how it works</a>
                </MarkdownSection>
              </div>

              <div className="border-b">
                <MarkdownSection>
                  <Icon
                    fill="black"
                    size="large"
                    symbol="house"
                    className="ml-2 info-cards__title"
                  />
                  <h3 className="font-semibold">Housing Resources</h3>
                  <div>
                    We encourage you to browse additional resources in your search for housing
                  </div>
                  <a href="/">View opportunities and resources</a>
                </MarkdownSection>
              </div>
            </div>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:shadow-left">
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
