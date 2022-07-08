import React from "react"
import { MarkdownSection, t, PageHeader, GridSection, GridCell } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"

export default function GetAssistance() {
  return (
    <Layout>
      {/* TODO: Create title in general.json */}
      <PageHeader title="Get Assistance" inverse />
      <div className="max-w-5xl m-auto px-5">Get Assistance Page</div>
    </Layout>
  )
}
