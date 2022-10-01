import {
  encodeToFrontendFilterString,
  FrontendListingFilterStateKeys,
  Region,
} from "@bloom-housing/shared-helpers"
import {
  AlertBox,
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

interface FinderField {
  label: string
  translation?: string
  selected: boolean
}

interface FinderQuestion {
  formSection: string
  fieldGroupName: string
  fields: FinderField[]
}

const Finder = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, watch } = useForm()
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [formData, setFormData] = useState<FinderQuestion[]>([])
  const [isDisclaimer, setIsDisclaimer] = useState<boolean>(false)

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
      formSelections[question.fieldGroupName] = question?.fields
        ?.filter((field) => field.selected)
        ?.map((field) => field.label)
        ?.join()
    })
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
            selected: false,
          }))
          formQuestions.push({
            formSection: t("finder.progress.housingLabel"),
            fieldGroupName: "bedRoomSize",
            fields: bedroomFields,
          })
        }
        const neighborhoodFields = Object.keys(Region).map((key) => ({
          label: FrontendListingFilterStateKeys[key],
          selected: false,
        }))
        formQuestions.push({
          formSection: t("finder.progress.housingLabel"),
          fieldGroupName: "region",
          fields: neighborhoodFields,
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
    const userSelections = watch()?.[formData[questionIndex]["fieldGroupName"]]
    const formCopy = [...formData]
    formCopy[questionIndex]["fields"].forEach((field) => {
      field["selected"] = userSelections.includes(field.label)
    })
    setFormData(formCopy)
    questionIndex >= formData.length - 1 && setIsDisclaimer(true)
    setQuestionIndex(questionIndex + 1)
  }
  const previousQuestion = () => {
    setIsDisclaimer(false)
    setQuestionIndex(questionIndex - 1)
  }

  const skipToListings = () => {
    setQuestionIndex(formData.length - 1)
  }

  return (
    <Layout>
      <Form onSubmit={handleSubmit(onSubmit)} className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-8 mt-8 mx-auto max-w-5xl">
          {ProgressHeader()}
          <FormCard>
            {formData?.length > 0 && (
              <>
                <div className="px-10 md:px-20 pt-6 md:pt-12 ">
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
                  {!isDisclaimer ? (
                    <div className="py-8">
                      <p className="pb-4">{t("finder.multiselectHelper")}</p>
                      <div className="finder-grid">
                        {activeQuestion?.fields?.map((field) => {
                          return (
                            <div className="finder-grid__field" key={field.label}>
                              <Field
                                name={activeQuestion.fieldGroupName}
                                register={register}
                                id={field.label}
                                label={
                                  field.translation
                                    ? t(`listingFilters.${field.translation}`)
                                    : field.label
                                }
                                key={field.label}
                                type="checkbox"
                                inputProps={{
                                  value: field.label,
                                  defaultChecked: field.selected,
                                }}
                                bordered
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <AlertBox type="notice" closeable>
                        {t("finder.disclaimer.alert")}
                      </AlertBox>
                      <ul className="list-disc list-inside py-8 flex flex-col gap-y-4">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <li className="pl-2 text-gray-700">
                            {t(`finder.disclaimer.info${num}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
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
                      {t("t.submit")}
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
                    <a className="underline" onClick={skipToListings}>
                      {t("finder.skip")}
                    </a>
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
