import {
  encodeToFrontendFilterString,
  FrontendListingFilterStateKeys,
  listingFeatures,
  Region,
} from "@bloom-housing/shared-helpers"
import {
  AppearanceStyleType,
  Button,
  ButtonGroup,
  Card,
  Form,
  Heading,
  ProgressNav,
  StepHeader,
  t,
} from "@bloom-housing/ui-components"
import axios from "axios"
import router from "next/router"

import React, { forwardRef, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import FinderDisclaimer from "../components/finder/FinderDisclaimer"
import FinderMultiselect from "../components/finder/FinderMultiselect"
import FinderRentalCosts from "../components/finder/FinderRentalCosts"
import { removeCommas } from "../lib/helpers"

interface FinderField {
  label: string
  translation?: string
  value: boolean | string
  type?: string
}

interface ProgressHeaderProps {
  isDisclaimer: boolean
  sectionNumber: number
  stepLabels: string[]
}

export interface FinderQuestion {
  formSection: string
  fieldGroupName: string
  fields: FinderField[]
  legendText: string
  question: string
  subtitle: string
}

const ProgressHeader = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: ProgressHeaderProps, ref: React.MutableRefObject<any>) => {
    return (
      <div className="flex flex-col w-full pb-8 px-2 lg:px-0 sm:pb-0">
        <div className="flex flex-row flex-wrap justify-between gap-y-4 gap-x-0.5">
          <Heading priority={1} className="text-base md:text-xl capitalize font-bold">
            {t("listingFilters.buttonTitleExtended")}
          </Heading>
          <div tabIndex={-1} ref={ref}>
            {!props.isDisclaimer && (
              <StepHeader
                currentStep={props.sectionNumber}
                totalSteps={3}
                stepPreposition={t("finder.progress.stepPreposition")}
                stepLabeling={props.stepLabels}
                priority={2}
              />
            )}
          </div>
        </div>
        <div className="hidden sm:block">
          <ProgressNav
            currentPageSection={props.sectionNumber}
            completedSections={props.sectionNumber - 1}
            labels={props.stepLabels}
            mounted={true}
            style="bar"
            removeSrHeader
          />
        </div>
      </div>
    )
  }
)

const Finder = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, trigger, errors, watch, setValue, getValues } = useForm()
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [formData, setFormData] = useState<FinderQuestion[]>([])
  const [isDisclaimer, setIsDisclaimer] = useState<boolean>(false)
  const finderSectionQuestion = useRef(null)
  const finderSectionHeader = useRef(null)
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
        })
      }
    })
    if (formSelections[FrontendListingFilterStateKeys.minRent]) {
      formSelections[FrontendListingFilterStateKeys.minRent] = removeCommas(
        formSelections[FrontendListingFilterStateKeys.minRent]
      )
    }
    if (formSelections[FrontendListingFilterStateKeys.maxRent]) {
      formSelections[FrontendListingFilterStateKeys.maxRent] = removeCommas(
        formSelections[FrontendListingFilterStateKeys.maxRent]
      )
    }
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
            translation: t(`listingFilters.bedroomsOptions.${translationStringMap[elem.name]}`),
            value: false,
          }))
          formQuestions.push({
            formSection: t("finder.progress.housingLabel"),
            fieldGroupName: "bedRoomSize",
            fields: bedroomFields,
            legendText: t("finder.bedRoomSize.legend"),
            question: t("finder.bedRoomSize.question"),
            subtitle: t("finder.default.subtitle"),
          })
        }
        const neighborhoodFields = Object.keys(Region).map((key) => ({
          label: FrontendListingFilterStateKeys[key],
          translation: t(`listingFilters.region.${key}`),
          value: false,
        }))
        formQuestions.push({
          formSection: t("finder.progress.housingLabel"),
          fieldGroupName: "region",
          fields: neighborhoodFields,
          legendText: t("finder.region.legend"),
          question: t("finder.region.question"),
          subtitle: t("finder.default.subtitle"),
        })
        const costFields = [
          {
            label: "minRent",
            translation: t("finder.rentalCosts.minRent"),
            type: "number",
            value: "",
          },
          {
            label: "maxRent",
            translation: t("finder.rentalCosts.maxRent"),
            type: "number",
            value: "",
          },
          {
            label: "section8Acceptance",
            translation: t("finder.rentalCosts.section8"),
            type: "checkbox",
            value: false,
          },
        ]

        formQuestions.push({
          formSection: t("finder.progress.housingLabel"),
          fieldGroupName: "rentalCosts",
          fields: costFields,
          legendText: t("finder.rentalCosts.legend"),
          question: t("finder.rentalCosts.question"),
          subtitle: t("finder.default.subtitle"),
        })

        const a11yFields = listingFeatures.map((elem) => ({
          label: elem,
          translation: t(`eligibility.accessibility.${elem}`),
          value: false,
        }))

        formQuestions.push({
          formSection: t("t.accessibility"),
          fieldGroupName: "accessibility",
          fields: a11yFields,
          legendText: t("finder.accessibility.legend"),
          question: t("finder.accessibility.question"),
          subtitle: t("finder.accessibility.subtitle"),
        })
        if (response?.data?.programs) {
          const programsFiltered = response.data.programs.filter(
            (program) => program.title !== "Families"
          )
          const programFields = programsFiltered.map((elem) => ({
            label: elem.id,
            translation: t(`finder.programs.${elem.title}`),
            value: false,
          }))
          formQuestions.push({
            formSection: t("finder.progress.buildingLabel"),
            fieldGroupName: "communityPrograms",
            fields: programFields,
            legendText: t("finder.programs.legend"),
            question: t("finder.programs.question"),
            subtitle: t("finder.programs.subtitle"),
          })
        }

        setFormData(formQuestions)
      } catch (e) {
        console.error(e)
      }
    }
    void getAndSetOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nextQuestion = () => {
    if (!Object.keys(errors).length) {
      const formCopy = [...formData]
      if (activeQuestion.fieldGroupName !== "rentalCosts") {
        const userSelections = watch()?.[activeQuestion["fieldGroupName"]]
        formCopy[questionIndex]["fields"].forEach((field) => {
          field["value"] = userSelections.includes(field.label)
        })
      } else {
        const userInputs = watch()
        formCopy[questionIndex]["fields"].forEach((field) => {
          field["value"] = userInputs[field.label]
        })
      }
      setFormData(formCopy)
      // check for disclaimer case
      if (questionIndex >= formData.length - 1) {
        setIsDisclaimer(true)
        setQuestionIndex(questionIndex + 1)
        finderSectionQuestion.current.focus()
      }
      // set focus on stepheader if section change
      else if (formData[questionIndex]?.formSection !== formData[questionIndex + 1]?.formSection) {
        setQuestionIndex(questionIndex + 1)
        finderSectionHeader.current.focus()
      }
      // otherwise set focus on question
      else {
        setQuestionIndex(questionIndex + 1)
        finderSectionQuestion.current.focus()
      }
    }
  }
  const previousQuestion = () => {
    setIsDisclaimer(false)
    // set focus on stepheader if section change
    if (formData[questionIndex]?.formSection !== formData[questionIndex - 1]?.formSection) {
      setQuestionIndex(questionIndex - 1)
      finderSectionHeader.current.focus()
    }
    // otherwise set focus on question
    else {
      setQuestionIndex(questionIndex - 1)
      finderSectionQuestion.current.focus()
    }
  }

  const skipToListings = () => {
    setIsDisclaimer(true)
    setQuestionIndex(formData.length)
    finderSectionQuestion.current.focus()
  }

  return (
    <Layout>
      <Form onSubmit={handleSubmit(onSubmit)} className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-8 mt-8 mx-auto max-w-5xl">
          <ProgressHeader
            isDisclaimer={isDisclaimer}
            sectionNumber={sectionNumber}
            stepLabels={stepLabels}
            ref={finderSectionHeader}
          />
          <Card className="finder-card">
            {formData?.length > 0 && (
              <div>
                <Card.Header>
                  {/* Deconstructed header group to support ref */}
                  <hgroup role="group">
                    <h3 tabIndex={-1} ref={finderSectionQuestion}>
                      {!isDisclaimer ? activeQuestion.question : t("finder.disclaimer.header")}
                    </h3>
                    <p aria-roledescription="subtitle">
                      {!isDisclaimer ? activeQuestion.subtitle : t("finder.disclaimer.subtitle")}
                    </p>
                  </hgroup>
                </Card.Header>
                <Card.Section className={!isDisclaimer ? "" : "finder-disclaimer"}>
                  {!isDisclaimer ? (
                    <>
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
                          setValue={setValue}
                          getValues={getValues}
                        />
                      )}
                    </>
                  ) : (
                    <FinderDisclaimer />
                  )}
                </Card.Section>
                <Card.Footer className="mx-0">
                  <div className={`bg-gray-300 px-4 sm:px-20 ${isDisclaimer && "rounded-lg"}`}>
                    <ButtonGroup
                      columns={[
                        questionIndex > 0 && (
                          <Button type="button" onClick={previousQuestion}>
                            {t("t.previous")}
                          </Button>
                        ),
                        !isDisclaimer ? (
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
                        ),
                      ]}
                    />
                  </div>
                  {!isDisclaimer && (
                    <Card.Section className="sm:text-center">
                      <Button className="text-base underline m-0" unstyled onClick={skipToListings}>
                        {t("finder.skip")}
                      </Button>
                    </Card.Section>
                  )}
                </Card.Footer>
              </div>
            )}
          </Card>
        </div>
      </Form>
    </Layout>
  )
}

export default Finder
