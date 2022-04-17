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
  ViewItem,
  FieldGroup,
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
            setCommunityProgramOptions(
              response.data.programs.map((elem) => ({
                label: elem.title,
                value: elem.id,
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
  const { handleSubmit, register, reset } = useForm()

  return (
    <Form onSubmit={handleSubmit(props.onSubmit)}>
      <GridSection columns={1}>
        <GridCell span={1}>
          <Field
            id="status"
            name={FrontendListingFilterStateKeys.status}
            type="hidden"
            register={register}
            defaultValue={EnumListingFilterParamsStatus.active}
          />
          <ViewItem
            className={"font-bold"}
            label={t("publicFilter.confirmedListings")}
            labelStyling={"text-gray-750"}
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
        <GridCell span={3}>
          <FieldGroup
            name="availability"
            type="checkbox"
            register={register}
            fields={availabilityOptions.map((elem) => ({
              id: elem.value,
              label: elem.label,
              value: elem.value,
              inputProps: {
                defaultChecked: Boolean(props.filterState?.availability?.includes(elem.value)),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flex items-center"
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} title={t("publicFilter.bedRoomSize")} separator={true}>
        <GridCell span={3}>
          <FieldGroup
            name="bedRoomSize"
            type="checkbox"
            register={register}
            fields={bedroomOptions.map((elem) => ({
              id: FrontendListingFilterStateKeys[elem.label],
              label: t(`listingFilters.bedroomsOptions.${elem.translation}`),
              value: FrontendListingFilterStateKeys[elem.label],
              inputProps: {
                defaultChecked: Boolean(
                  props.filterState?.bedRoomSize?.includes(
                    FrontendListingFilterStateKeys[elem.label]
                  )
                ),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flex items-center grid grid-cols-3"
          />
        </GridCell>
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
        <GridCell span={3}>
          <FieldGroup
            name="communityPrograms"
            type="checkbox"
            register={register}
            fields={communityProgramOptions.map((elem) => ({
              id: elem.value,
              label: elem.label,
              value: elem.value,
              inputProps: {
                defaultChecked: Boolean(props.filterState?.communityPrograms?.includes(elem.value)),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flex items-center grid grid-cols-3"
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} title={t("t.region")} separator={true}>
        <GridCell span={3}>
          <FieldGroup
            name="region"
            type="checkbox"
            register={register}
            fields={regionOptions.map((elem) => ({
              id: elem.value,
              label: elem.label,
              value: elem.value,
              inputProps: {
                defaultChecked: Boolean(props.filterState?.region?.includes(elem.value)),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flex items-center grid grid-cols-3"
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} title={t("eligibility.accessibility.title")} separator={true}>
        <GridCell span={3}>
          <FieldGroup
            name="accessibility"
            type="checkbox"
            register={register}
            fields={accessibilityFeatureOptions.map((elem) => ({
              id: elem.value,
              label: elem.label,
              value: elem.value,
              inputProps: {
                defaultChecked: Boolean(props.filterState?.accessibility?.includes(elem.value)),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flexitems-center grid grid-cols-3"
          />
        </GridCell>
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
            reset()
          }}
        >
          {t("listingFilters.clear")}
        </Button>
      </div>
    </Form>
  )
}

export default FilterForm
