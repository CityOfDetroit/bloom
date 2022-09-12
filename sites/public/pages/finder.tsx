import { FormCard, PageHeader, t } from "@bloom-housing/ui-components"
import React from "react"
import Layout from "../layouts/application"

export default function Finder() {
  return (
    <Layout>
      <PageHeader
        title={t("pageTitle.housingBasics")}
        subtitle={t("pageDescription.housingBasics")}
        // inverse
      >
        <FormCard children={""}></FormCard>
      </PageHeader>
    </Layout>
  )
}
