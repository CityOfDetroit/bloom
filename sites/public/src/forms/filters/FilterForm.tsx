import { EnumListingFilterParamsStatus } from "@bloom-housing/backend-core/types"
import {
  t,
  Form,
  Field,
  Button,
  AppearanceStyleType,
  FrontendListingFilterStateKeys,
  ListingFilterState,
  GridSection,
  GridCell,
  AppearanceBorderType,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { Region } from "@bloom-housing/ui-components/src/helpers/regionNeighborhoodMap"
import { useEffect, useState } from "react"
import axios from "axios"
import { listingFeatures } from "@bloom-housing/shared-helpers"

interface FilterFormProps {
  onSubmit: (data: ListingFilterState) => void
  onClose: (isOpen: boolean) => void
  filterState?: ListingFilterState
}

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
  } else if (str === "SRO") {
    return "SROPlus"
  }
}

const FilterForm = (props: FilterFormProps) => {
  // TODO: Select options should come from the database
  const [bedroomOptions, setBedroomOptions] = useState<optionInterface[]>([])
  const [communityProgramOptions, setCommunityProgramOptions] = useState<optionInterface[]>([])
  const [regionOptions, setRegionOptions] = useState<optionInterface[]>([])
  const [accessibilityFeatureOptions, setAccessibilityFeatureOptions] = useState<optionInterface[]>(
    []
  )

  const availabilityOptions = [
    { value: "vacantUnits", label: t("listings.vacantUnits") },
    { value: "openWaitlist", label: t("listings.waitlist.open") },
    { value: "closedWaitlist", label: t("listings.waitlist.closed") },
  ]

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

          if (response.data.programs) {
            const regex = new RegExp(/ |\+/, "g")
            setCommunityProgramOptions(
              response.data.programs.map((elem) => ({
                label: elem.title,
                value: elem.title.replaceAll(regex, ""),
              }))
            )
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    getAndSetOptions()

    setRegionOptions(
      Object.entries(Region).map((elem) => ({
        value: elem[0],
        label: elem[1],
      }))
    )

    setAccessibilityFeatureOptions(
      Object.keys(listingFeatures).map((elem) => ({
        value: elem,
        label: listingFeatures[elem],
      }))
    )
  }, [])

  // This is causing a linting issue with unbound-method, see issue:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm()

  return (
    <Form onSubmit={handleSubmit(props.onSubmit)}>
      <GridSection columns={1} title={t("publicFilter.confirmedListings")}>
        <GridCell span={1}>
          <Field
            id="status"
            name={FrontendListingFilterStateKeys.status}
            type="hidden"
            register={register}
            defaultValue={EnumListingFilterParamsStatus.active}
          />
          <Field
            id="isVerified"
            name={FrontendListingFilterStateKeys.isVerified}
            type="checkbox"
            label={t("publicFilter.confirmedListingsFieldLabel")}
            register={register}
            inputProps={{
              defaultChecked: Boolean(props.filterState?.isVerified),
            }}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} title={t("t.availability")} separator={true}>
        {availabilityOptions.map((elem, index) => (
          <GridCell span={1} key={`availability${index}`}>
            <Field
              id={elem.value}
              name={elem.value}
              type="checkbox"
              label={elem.label}
              register={register}
              inputProps={{
                defaultChecked: Boolean(
                  props.filterState ? props.filterState[elem.value] : undefined
                ),
              }}
            />
          </GridCell>
        ))}
      </GridSection>
      <GridSection columns={3} title={t("publicFilter.bedRoomSize")} separator={true}>
        {bedroomOptions.map((option) => (
          <GridCell span={1}>
            <Field
              id={option.label}
              name={FrontendListingFilterStateKeys[option.label]}
              type="checkbox"
              label={t(`listingFilters.bedroomsOptions.${option.translation}`)}
              register={register}
              inputProps={{
                defaultChecked: Boolean(
                  props.filterState ? props.filterState[option.label] : undefined
                ),
              }}
            />
          </GridCell>
        ))}
      </GridSection>
      <GridSection columns={3} title={t("publicFilter.rentRange")} separator={true}>
        <GridCell span={1}>
          <Field
            id={"minRent"}
            name={FrontendListingFilterStateKeys.minRent}
            placeholder={t("publicFilter.rentRangeMin")}
            register={register}
            prepend={"$"}
            defaultValue={props.filterState?.minRent}
          />
        </GridCell>
        <GridCell span={1}>
          <Field
            id={"maxRent"}
            name={FrontendListingFilterStateKeys.maxRent}
            placeholder={t("publicFilter.rentRangeMax")}
            register={register}
            prepend={"$"}
            defaultValue={props.filterState?.maxRent}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} title={t("publicFilter.communityPrograms")} separator={true}>
        {communityProgramOptions.map((elem, index) => (
          <GridCell span={1} key={`communityPrograms_${index}`}>
            <Field
              id={elem.value}
              name={elem.value}
              type="checkbox"
              label={elem.label}
              register={register}
              inputProps={{
                defaultChecked: Boolean(
                  props.filterState ? props.filterState[elem.value] : undefined
                ),
              }}
            />
          </GridCell>
        ))}
      </GridSection>
      <GridSection columns={3} title={t("t.region")} separator={true}>
        {regionOptions.map((elem, index) => (
          <GridCell span={1} key={`region_${index}`}>
            <Field
              id={elem.value}
              name={elem.value}
              type="checkbox"
              label={elem.label}
              register={register}
              inputProps={{
                defaultChecked: Boolean(
                  props.filterState ? props.filterState[elem.value] : undefined
                ),
              }}
            />
          </GridCell>
        ))}
      </GridSection>
      <GridSection columns={3} title={t("eligibility.accessibility.title")} separator={true}>
        {accessibilityFeatureOptions.map((elem, index) => (
          <GridCell span={1} key={`accessibility_${index}`}>
            <Field
              id={elem.value}
              name={elem.value}
              type="checkbox"
              label={elem.label}
              register={register}
              inputProps={{
                defaultChecked: Boolean(
                  props.filterState ? props.filterState[elem.value] : undefined
                ),
              }}
            />
          </GridCell>
        ))}
      </GridSection>
      <div className="text-left mt-8 mb-5 bg-white border-t border-gray-450 pt-8">
        <Button
          type="submit"
          styleType={AppearanceStyleType.primary}
          className={"border-primary-darker bg-primary-darker mr-3"}
        >
          {t("t.done")}
        </Button>
        <Button
          type="button"
          styleType={AppearanceStyleType.secondary}
          border={AppearanceBorderType.borderless}
          onClick={() => {
            props.onClose(false)
          }}
        >
          {t("listingFilters.clear")}
        </Button>
      </div>
    </Form>
  )
}

export default FilterForm
