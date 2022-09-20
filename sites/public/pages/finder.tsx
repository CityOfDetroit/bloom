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
interface optionInterface {
  value: string
  label: string
  translation?: string
}

const getTranslationString = (str: string) => {
  if (str === "studio") {
    return "studioPlus"
  } else if (str === "oneBdrm") {
    return "onePlus"
  } else if (str === "twoBdrm") {
    return "twoPlus"
  } else if (str === "threeBdrm") {
    return "threePlus"
  } else if (str === "fourBdrm") {
    return "fourPlus"
  }
}

const Finder = () => {
  const [bedroomOptions, setBedroomOptions] = useState<optionInterface[]>([])
  const onSubmit = (data: ListingFilterState) => {
    console.log(data)
    void router.push(`/listings/filtered?page=${1}&limit=${8}${encodeToFrontendFilterString(data)}`)
  }
  useEffect(() => {
    const getAndSetOptions = async () => {
      try {
        const response = await axios.get(`${process.env.backendApiBase}/listings/meta`)
        if (response.data) {
          if (response.data.unitTypes) {
            setBedroomOptions(
              response.data.unitTypes.map((elem) => ({
                label: elem.name,
                value: elem.id,
                translation: getTranslationString(elem.name),
              }))
            )
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    void getAndSetOptions()
  }, [])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit } = useForm()

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

  return (
    <Layout>
      <Form onSubmit={handleSubmit(onSubmit)} className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-20 md:mt-12 mx-auto max-w-5xl">
          {ProgressHeader()}
          <FormCard>
            <div className="px-20">
              <div className="pt-12">
                <div className="text-3xl pb-4">{t("finder.bedroomQuestions")}</div>
                <div className="pb-8 border-b border-gray-450">{t("finder.questionSubtitle")}</div>
              </div>
              <div className="py-8">
                <p className="pb-4">{t("finder.multiselectHelper")}</p>
                <div className="finder-grid">
                  {bedroomOptions.map((elem) => {
                    console.log(FrontendListingFilterStateKeys[elem.label])
                    return (
                      <div className="finder-grid__field">
                        <Field
                          name="bedRoomSize"
                          register={register}
                          id={FrontendListingFilterStateKeys[elem.label]}
                          label={t(`listingFilters.bedroomsOptions.${elem.translation}`)}
                          key={FrontendListingFilterStateKeys[elem.label]}
                          type="checkbox"
                          inputProps={{
                            value: FrontendListingFilterStateKeys[elem.label],
                          }}
                          bordered
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="bg-gray-300 flex flex-row-reverse py-8 pr-20">
              <Button type="submit" styleType={AppearanceStyleType.primary}>
                {t("t.next")}
              </Button>
            </div>
            <div className="flex justify-center align-center bg-white py-8">
              <a className="underline" href="/listings">
                {t("finder.skip")}
              </a>
            </div>
          </FormCard>
        </div>
      </Form>
    </Layout>
  )
}

export default Finder
