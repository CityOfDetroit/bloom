import React, { useEffect, useContext } from "react"
import Head from "next/head"
import Markdown from "markdown-to-jsx"
import Layout from "../layouts/application"
import {
  t,
  InfoCardGrid,
  InfoCard,
  PageHeader,
  MarkdownSection,
  AuthContext,
} from "@bloom-housing/ui-components"
import { UserStatus } from "../lib/constants"
import { PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import RenderIf from "../src/RenderIf"

import pageContent from "../page_content/AdditionalResources.md"
import sidebarContent from "../page_content/AdditionalResourcesSidebar.md"

const AdditionalResources = () => {
  const pageTitle = t("pageTitle.additionalResources")
  const subTitle = t("pageDescription.additionalResources")

  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Additional Resources",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>

      <PageHeader title={<>{pageTitle}</>} subtitle={subTitle} inverse={true}></PageHeader>

      <section className="md:px-5">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    InfoCard,
                    InfoCardGrid,
                    RenderIf,
                  },
                }}
              >
                {pageContent}
              </Markdown>
            </MarkdownSection>
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

export default AdditionalResources
