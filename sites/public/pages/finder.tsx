import {
  encodeToFrontendFilterString,
  FrontendListingFilterStateKeys,
  Region,
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
  translation?: string
  selected: boolean
}

interface finderQuestion {
  formSection: string
  fieldGroupName: string
  fields: finderField[]
}

const Finder = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, getValues } = useForm()
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [formData, setFormData] = useState<finderQuestion[]>([])
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
    t("finder.progress.builingLabel"),
  ]

  const sectionNumber = stepLabels.indexOf(formData[questionIndex]?.formSection) + 1

  const onSubmit = () => {
    const formSelections = {}
    formData?.forEach((question) => {
      formSelections[question.fieldGroupName] = question?.fields
        ?.filter((field) => field.selected)
        ?.map((field) => field.label)
        ?.join()
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
        const formQuestions: finderQuestion[] = []
        if (response?.data?.unitTypes) {
          const bedroomFields = response.data.unitTypes.map((elem) => ({
            label: elem.name,
            translation: `bedroomsOptions.${translationStringMap[elem.name]}`,
            selected: false,
          }))
          formQuestions.push({
            formSection: t("finder.progress.housingLabel"),
            fieldGroupName: "bedRoomSize",
            fields: bedroomFields,
          })
        }
        console.log(Region)
        const neihborhoodFields = Object.keys(Region).map((key) => ({
          label: key,
          selected: false,
        }))
        formQuestions.push({
          formSection: t("finder.progress.housingLabel"),
          fieldGroupName: "region",
          fields: neihborhoodFields,
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
          <StepHeader
            currentStep={sectionNumber}
            totalSteps={3}
            stepPreposition={t("finder.progress.stepPreposition")}
            stepLabeling={stepLabels}
          ></StepHeader>
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
    const userSelections = getValues()?.[formData[questionIndex]["fieldGroupName"]]
    const formCopy = [...formData]
    formCopy[questionIndex]["fields"].forEach((field) => {
      field["selected"] = userSelections.includes(field.label)
    })
    setFormData(formCopy)
    setQuestionIndex(questionIndex + 1)
  }
  const previousQuestion = () => {
    const userSelections = getValues()?.[formData[questionIndex]["fieldGroupName"]]
    const formCopy = [...formData]
    formCopy[questionIndex]["fields"].forEach(
      (field) => (field["selected"] = userSelections?.includes(field.label))
    )
    setFormData(formCopy)
    setQuestionIndex(questionIndex - 1)
  }

  return (
    <Layout>
      <Form onSubmit={handleSubmit(onSubmit)} className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-8 mt-8 mx-auto max-w-5xl">
          {ProgressHeader()}
          <FormCard>
            {formData && (
              <>
                <div className="px-10 md:px-20 pt-6 md:pt-12 ">
                  <div className="">
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
                              name={activeQuestion.fieldGroupName}
                              register={register}
                              id={FrontendListingFilterStateKeys[field.label]}
                              label={
                                field.translation
                                  ? t(`listingFilters.${field.translation}`)
                                  : FrontendListingFilterStateKeys[field.label]
                              }
                              key={FrontendListingFilterStateKeys[field.label]}
                              type="checkbox"
                              inputProps={{
                                value:
                                  activeQuestion.fieldGroupName === "region"
                                    ? field.label
                                    : FrontendListingFilterStateKeys[field.label],
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
                  {questionIndex === formData.length ? (
                    <>
                      <Button type="submit" styleType={AppearanceStyleType.primary}>
                        {t("t.submit")}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextQuestion}
                      styleType={AppearanceStyleType.primary}
                    >
                      {t("t.next")}
                    </Button>
                  )}
                  {questionIndex > 0 && (
                    <Button
                      type="button"
                      onClick={previousQuestion}
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
