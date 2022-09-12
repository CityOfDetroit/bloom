import { FormCard, PageHeader, ProgressNav, StepHeader, t } from "@bloom-housing/ui-components"
import React from "react"
import Layout from "../layouts/application"

export default function Finder() {
  const hm = () => {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="text-lg font-bold">Find Listings For You</div>
          <StepHeader
            currentStep={1}
            totalSteps={3}
            stepPreposition={"of"}
            stepLabeling={["steps"]}
          ></StepHeader>
        </div>
        <ProgressNav
          currentPageSection={1}
          completedSections={1}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
          mounted={true}
          style="bar"
        ></ProgressNav>
      </div>
    )
  }
  return (
    <Layout>
      <PageHeader>{hm()}</PageHeader>
    </Layout>
  )
}
