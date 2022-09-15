import {
  Field,
  FormCard,
  PageHeader,
  ProgressNav,
  StepHeader,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../layouts/forms"

import React from "react"
import Layout from "../layouts/application"

export default function Finder() {
  const ProgressHeader = () => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <div className="text-xl font-bold">Find Listings For You</div>
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
          labels={["Housing Needs", "Accessibility", "Building Types"]}
          mounted={true}
          style="bar"
        ></ProgressNav>
      </div>
    )
  }
  const rentalTypes = ["one", "two", "three", "four"]
  return (
    <Layout>
      <section className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-20 md:mt-12 mx-auto max-w-5xl">
          {ProgressHeader()}
          <FormCard>
            <div>What types of rentals are you interested in?</div>
            <div>
              We host a variety of listings from active vacancies to properties that are currently
              occupied and have no active vacancies, but do have open waitlists.
            </div>
            {rentalTypes.map((type) => (
              <Field name={type} label={type} type="checkbox"></Field>
            ))}
          </FormCard>
        </div>
      </section>
    </Layout>
  )
}
