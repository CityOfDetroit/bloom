import {
  encodeToFrontendFilterString,
  FrontendListingFilterStateKeys,
  ListingFilterState,
} from "@bloom-housing/shared-helpers"
import {
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  ProgressNav,
  StepHeader,
  t,
} from "@bloom-housing/ui-components"
import axios from "axios"
import router from "next/router"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"

interface finderField {
  label: string
  translation: string
  selected: boolean
}

interface finderQuestion {
  fieldGroupName: string
  fields: finderField[]
}

interface finderForm {
  [key: number]: finderQuestion
}

const Finder = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, getValues } = useForm()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<finderForm>(null)
  const activeQuestion = formData?.[currentStep]

  const translationStringMap = {
    studio: "studioPlus",
    oneBdrm: "onePlus",
    twoBdrm: "twoPlus",
    threeBdrm: "threePlus",
    fourBdrm: "fourPlus",
  }

  const stepLabels = [
    t("finder.progress.housingLabel"),
    t("t.accessibility"),
    t("finder.progress.builingLabel"),
  ]

  const onSubmit = (data: ListingFilterState) => {
    void router.push(`/listings/filtered?page=${1}&limit=${8}${encodeToFrontendFilterString(data)}`)
  }
  useEffect(() => {
    const getAndSetOptions = async () => {
      try {
        const response = await axios.get(`${process.env.backendApiBase}/listings/meta`)
        const formQuestions: finderForm = {}
        if (response?.data?.unitTypes) {
          const bedroomFields = response.data.unitTypes.map((elem) => ({
            label: elem.name,
            translation: translationStringMap[elem.name],
            selected: false,
          }))
          formQuestions[1] = { fieldGroupName: "bedRoomSize", fields: bedroomFields }
        }
        setFormData(formQuestions)
      } catch (e) {
        console.error(e)
      }
    }
    void getAndSetOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ProgressHeader = () => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <div className="md:text-xl capitalize font-bold">
            {t("listingFilters.buttonTitleExtended")}
          </div>
          <StepHeader
            currentStep={currentStep}
            totalSteps={3}
            stepPreposition={t("finder.progress.stepPreposition")}
            stepLabeling={stepLabels}
          ></StepHeader>
        </div>
        <ProgressNav
          currentPageSection={currentStep}
          completedSections={currentStep - 1}
          labels={stepLabels}
          mounted={true}
          style="bar"
        ></ProgressNav>
      </div>
    )
  }

  const nextQuestion = () => {
    const userSelections = getValues()[formData[currentStep]["fieldGroupName"]]
    const formCopy = { ...formData }
    formCopy[currentStep]["fields"].forEach(
      (field) => (field["selected"] = userSelections.includes(field))
    )
    setFormData(formCopy)
    setCurrentStep(currentStep + 1)
  }
  const previousQuestion = () => {
    const userSelections = getValues()[formData[currentStep]["fieldGroupName"]]
    const formCopy = { ...formData }
    formCopy[currentStep]["fields"].forEach(
      (field) => (field["selected"] = userSelections.includes(field))
    )
    setFormData(formCopy)
    setCurrentStep(currentStep - 1)
  }

  return (
    <Layout>
      <Form onSubmit={handleSubmit(onSubmit)} className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-8 mt-4 md:mt-8 mx-auto max-w-5xl">
          {ProgressHeader()}
          <FormCard>
            {formData && (
              <>
                <div className="px-20">
                  <div className="pt-12">
                    <div className="text-3xl pb-4">
                      {t(`finder.${activeQuestion?.fieldGroupName}.question`)}
                    </div>
                    <div className="pb-8 border-b border-gray-450">
                      {t("finder.questionSubtitle")}
                    </div>
                  </div>
                  <div className="py-8">
                    <p className="pb-4">{t("finder.multiselectHelper")}</p>
                    <div className="finder-grid">
                      {activeQuestion?.fields?.map((field) => {
                        return (
                          <div
                            className="finder-grid__field"
                            key={FrontendListingFilterStateKeys[field.label]}
                          >
                            <Field
                              name="bedRoomSize"
                              register={register}
                              id={FrontendListingFilterStateKeys[field.label]}
                              label={t(`listingFilters.bedroomsOptions.${field.translation}`)}
                              key={FrontendListingFilterStateKeys[field.label]}
                              type="checkbox"
                              inputProps={{
                                value: FrontendListingFilterStateKeys[field.label],
                                defaultChecked: field.selected,
                              }}
                              bordered
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-300 flex flex-row-reverse justify-between py-8 px-20">
                  {currentStep === Object.keys(formData).length ? (
                    <Button type="submit" styleType={AppearanceStyleType.primary}>
                      {t("t.submit")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => nextQuestion()}
                      styleType={AppearanceStyleType.primary}
                    >
                      {t("t.next")}
                    </Button>
                  )}
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={() => previousQuestion()}
                      styleType={AppearanceStyleType.primary}
                    >
                      {t("t.back")}
                    </Button>
                  )}
                </div>

                <div className="flex justify-center align-center bg-white py-8">
                  <a className="underline" href="/listings">
                    {t("finder.skip")}
                  </a>
                </div>
              </>
            )}
          </FormCard>
        </div>
      </Form>
    </Layout>
  )
}

export default Finder
