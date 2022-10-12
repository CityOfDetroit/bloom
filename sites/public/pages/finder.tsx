import {
  encodeToFrontendFilterString,
  FrontendListingFilterStateKeys,
  Region,
} from "@bloom-housing/shared-helpers"
import {
  AppearanceStyleType,
  Button,
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
import FinderDisclaimer from "../src/forms/finder/FinderDisclaimer"
import FinderMultiselect from "../src/forms/finder/FinderMultiselect"
import FinderRentalCosts from "../src/forms/finder/FinderRentalCosts"

interface FinderField {
  label: string
  translation?: string
  value: boolean | string
  type?: string
}

export interface FinderQuestion {
  formSection: string
  fieldGroupName: string
  fields: FinderField[]
}

const Finder = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, trigger, errors, watch } = useForm()
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [formData, setFormData] = useState<FinderQuestion[]>([])
  const [isDisclaimer, setIsDisclaimer] = useState<boolean>(false)
  const minRent = watch("minRent")
  const maxRent = watch("maxRent")

  const activeQuestion = formData?.[questionIndex]

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
    t("finder.progress.buildingLabel"),
  ]

  const sectionNumber = !isDisclaimer
    ? stepLabels.indexOf(formData[questionIndex]?.formSection) + 1
    : stepLabels.length + 1

  const onSubmit = () => {
    const formSelections = {}
    formData?.forEach((question) => {
      if (question.fieldGroupName !== "rentalCosts") {
        formSelections[question.fieldGroupName] = question?.fields
          ?.filter((field) => field.value)
          ?.map((field) => field.label)
          ?.join()
      } else {
        question.fields.forEach((field) => {
          if (field.value) formSelections[field.label] = field.value
          console.log(field)
        })
      }
    })
    console.log(formSelections)
    void router.push(
      `/listings/filtered?page=${1}&limit=${8}${encodeToFrontendFilterString(formSelections)}`
    )
  }
  useEffect(() => {
    const getAndSetOptions = async () => {
      try {
        const response = await axios.get(`${process.env.backendApiBase}/listings/meta`)
        const formQuestions: FinderQuestion[] = []
        if (response?.data?.unitTypes) {
          const bedroomFields = response.data.unitTypes.map((elem) => ({
            label: FrontendListingFilterStateKeys[elem.name],
            translation: `bedroomsOptions.${translationStringMap[elem.name]}`,
            value: false,
          }))
          formQuestions.push({
            formSection: t("finder.progress.housingLabel"),
            fieldGroupName: "bedRoomSize",
            fields: bedroomFields,
          })
        }
        const neighborhoodFields = Object.keys(Region).map((key) => ({
          label: FrontendListingFilterStateKeys[key],
          value: false,
        }))
        formQuestions.push({
          formSection: t("finder.progress.housingLabel"),
          fieldGroupName: "region",
          fields: neighborhoodFields,
        })
        const costFields = [
          { label: "minRent", type: "number", value: "" },
          { label: "maxRent", type: "number", value: "" },
          { label: "section8Acceptance", type: "checkbox", value: false },
        ]

        formQuestions.push({
          formSection: t("finder.progress.housingLabel"),
          fieldGroupName: "rentalCosts",
          fields: costFields,
        })
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
      <div className="flex flex-col w-full px-2 md:px-0">
        <div className="flex flex-row flex-wrap justify-between gap-y-4 gap-x-0.5">
          <div className="md:text-xl capitalize font-bold">
            {t("listingFilters.buttonTitleExtended")}
          </div>
          {!isDisclaimer && (
            <StepHeader
              currentStep={sectionNumber}
              totalSteps={3}
              stepPreposition={t("finder.progress.stepPreposition")}
              stepLabeling={stepLabels}
            ></StepHeader>
          )}
        </div>
        <ProgressNav
          currentPageSection={sectionNumber}
          completedSections={sectionNumber - 1}
          labels={stepLabels}
          mounted={true}
          style="bar"
        ></ProgressNav>
      </div>
    )
  }

  const nextQuestion = () => {
    const formCopy = [...formData]
    if (activeQuestion.fieldGroupName !== "rentalCosts") {
      const userSelections = watch()?.[formData[questionIndex]["fieldGroupName"]]
      formCopy[questionIndex]["fields"].forEach((field) => {
        field["value"] = userSelections.includes(field.label)
      })
    } else {
      const userInputs = watch()
      console.log(userInputs)
      formCopy[questionIndex]["fields"].forEach((field) => {
        field["value"] = userInputs[field.label]
      })
    }
    setFormData(formCopy)
    if (questionIndex >= formData.length - 1) setIsDisclaimer(true)
    setQuestionIndex(questionIndex + 1)
  }
  const previousQuestion = () => {
    setIsDisclaimer(false)
    setQuestionIndex(questionIndex - 1)
  }

  const skipToListings = () => {
    setIsDisclaimer(true)
    setQuestionIndex(formData.length)
  }

  return (
    <Layout>
      <Form onSubmit={handleSubmit(onSubmit)} className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-8 mt-8 mx-auto max-w-5xl">
          <ProgressHeader />
          <FormCard>
            {formData?.length > 0 && (
              <>
                <div className="px-10 md:px-20 pt-6 md:pt-12 ">
                  <div className="">
                    <div className="text-3xl pb-4">
                      {!isDisclaimer
                        ? t(`finder.${activeQuestion?.fieldGroupName}.question`)
                        : t("finder.disclaimer.header")}
                    </div>
                    <div className="pb-8 border-b border-gray-450">
                      {!isDisclaimer
                        ? t("finder.question.subtitle")
                        : t("finder.disclaimer.subtitle")}
                    </div>
                  </div>
                  {!isDisclaimer ? (
                    <div className="py-8">
                      <p className="pb-4">{t("finder.multiselectHelper")}</p>
                      {activeQuestion.fieldGroupName !== "rentalCosts" ? (
                        <FinderMultiselect activeQuestion={activeQuestion} register={register} />
                      ) : (
                        <FinderRentalCosts
                          activeQuestion={activeQuestion}
                          register={register}
                          errors={errors}
                          trigger={trigger}
                          minRent={minRent}
                          maxRent={maxRent}
                        />
                      )}
                    </div>
                  ) : (
                    <FinderDisclaimer />
                  )}
                </div>

                <div className="bg-gray-300 flex flex-row-reverse justify-between py-8 px-10 md:px-20 ">
                  {!isDisclaimer ? (
                    <Button
                      type="button"
                      onClick={nextQuestion}
                      styleType={AppearanceStyleType.primary}
                    >
                      {t("t.next")}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      key="finderSubmit"
                      styleType={AppearanceStyleType.primary}
                    >
                      {t("t.finish")}
                    </Button>
                  )}
                  {questionIndex > 0 && (
                    <Button
                      type="button"
                      onClick={previousQuestion}
                      styleType={AppearanceStyleType.accentLight}
                    >
                      {t("t.previous")}
                    </Button>
                  )}
                </div>
                {!isDisclaimer && (
                  <div className="flex justify-center align-center bg-white py-8">
                    <Button className="text-base underline" unstyled onClick={skipToListings}>
                      {t("finder.skip")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </FormCard>
        </div>
      </Form>
    </Layout>
  )
}

export default Finder
