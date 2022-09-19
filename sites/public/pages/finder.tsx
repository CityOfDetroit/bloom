import {
  AppearanceStyleType,
  Button,
  Field,
  FieldGroup,
  FieldSingle,
  FormCard,
  ProgressNav,
  StepHeader,
  t,
} from "@bloom-housing/ui-components"

import React from "react"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"

export default function Finder() {
  const { handleSubmit, errors, register, reset, trigger, watch: formWatch } = useForm()
  const ProgressHeader = () => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <div className="text-xl capitalize font-bold">
            {t("listingFilters.buttonTitleExtended")}
          </div>
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
  // const rentalFields = rentalTypes.map((type) => {
  //   return {
  //     id: type,
  //     label: type,
  //     value: type,
  //     bordered: true,
  //   }
  // })
  return (
    <Layout>
      <section className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-20 md:mt-12 mx-auto max-w-5xl">
          {ProgressHeader()}
          <FormCard>
            <div className="px-20">
              <div className="pt-12">
                <div className="text-3xl pb-4">What types of rentals are you interested in?</div>
                <div className="pb-8">
                  We'll use your selection to highlight possible rentals that match.
                </div>
              </div>
              <div className="flex flex-row flex-wrap">
                {rentalTypes.map((type) => (
                  <div className="w-2/5">
                    <Field
                      className="w-full"
                      name={type}
                      label={type}
                      type="checkbox"
                      bordered
                    ></Field>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-300 flex flex-row-reverse py-8 pr-20">
              <Button type="button" styleType={AppearanceStyleType.primary}>
                Next
              </Button>
            </div>
            <div className="flex justify-center align-center bg-white py-8">
              <a href="/listings">Skip this and show me listings</a>
            </div>
          </FormCard>
        </div>
      </section>
    </Layout>
  )
}
