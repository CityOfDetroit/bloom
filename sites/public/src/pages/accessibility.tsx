import React, { useEffect, useContext } from "react"
import { MarkdownSection, t, PageHeader } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../md_content/accessibility.md"
import RenderIf from "../RenderIf"

const Accessibility = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Accessibility",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.accessibilityStatement")}</>

  return (
    <Layout>
      <PageHeader inverse={true} title={pageTitle} />
      <MarkdownSection>
        <Markdown
          options={{
            overrides: {
              RenderIf,
            },
          }}
        >
          {pageContent}
        </Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default Accessibility
