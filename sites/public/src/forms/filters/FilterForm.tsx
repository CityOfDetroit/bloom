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
  const [localFilterState, setLocalFilterState] = useState<ListingFilterState>({})

  const availabilityOptions = [
    { value: "vacantUnits", label: t("listings.vacantUnits") },
    { value: "openWaitlist", label: t("publicFilter.waitlist.open") },
    { value: "closedWaitlist", label: t("publicFilter.waitlist.closed") },
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
        label: elem[0] === "midtownNewCenter" ? "Midtown" : elem[1],
      }))
    )

    setAccessibilityFeatureOptions(
      Object.keys(listingFeatures).map((elem) => ({
        value: elem,
        label: listingFeatures[elem],
      }))
    )
  }, [])

  useEffect(() => {
    setLocalFilterState({
      ...props.filterState,
    })
  }, [props.filterState])

  // This is causing a linting issue with unbound-method, see issue:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, reset } = useForm()

  return (
    <Form onSubmit={handleSubmit(props.onSubmit)}>
      <GridSection columns={1} className={"px-4"}>
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
              defaultChecked: localFilterState?.isVerified,
            }}
            labelClassName={"text-gray-750 font-semibold"}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} separator={true} className={"px-4"} wrapperClassName={"pt-4 mt-2"}>
        <GridCell span={3}>
          <ViewItem
            className={"font-bold"}
            label={t("t.availability")}
            labelStyling={"text-gray-750"}
          />
          <FieldGroup
            name="availability"
            type="checkbox"
            register={register}
            fields={availabilityOptions.map((elem) => ({
              id: elem.value,
              label: elem.label,
              value: elem.value,
              inputProps: {
                defaultChecked: localFilterState?.availability?.includes(elem.value),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flex items-center grid md:grid-cols-3 sm:grid-cols-1"
            fieldLabelClassName={"text-gray-750"}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} separator={true} className={"px-4"} wrapperClassName={"pt-4 mt-2"}>
        <GridCell span={3}>
          <ViewItem
            className={"font-bold"}
            label={t("publicFilter.bedRoomSize")}
            labelStyling={"text-gray-750"}
          />
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
                  localFilterState?.bedRoomSize?.includes(
                    FrontendListingFilterStateKeys[elem.label]
                  )
                ),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flex items-center grid md:grid-cols-3 sm:grid-cols-1"
            fieldLabelClassName={"text-gray-750"}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} separator={true} className={"px-4"} wrapperClassName={"pt-4 mt-2"}>
        <GridCell span={3}>
          <ViewItem
            className={"font-bold"}
            label={t("publicFilter.rentRange")}
            labelStyling={"text-gray-750"}
          />
        </GridCell>
        <GridCell span={1}>
          <Field
            id={"minRent"}
            name={FrontendListingFilterStateKeys.minRent}
            placeholder={t("publicFilter.rentRangeMin")}
            register={register}
            prepend={"$"}
            defaultValue={localFilterState?.minRent}
          />
        </GridCell>
        <GridCell span={1}>
          <Field
            id={"maxRent"}
            name={FrontendListingFilterStateKeys.maxRent}
            placeholder={t("publicFilter.rentRangeMax")}
            register={register}
            prepend={"$"}
            defaultValue={localFilterState?.maxRent}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} separator={true} className={"px-4"} wrapperClassName={"pt-4 mt-4"}>
        <GridCell span={3}>
          <ViewItem
            className={"font-bold"}
            label={t("publicFilter.communityPrograms")}
            labelStyling={"text-gray-750"}
          />
          <FieldGroup
            name="communityPrograms"
            type="checkbox"
            register={register}
            fields={communityProgramOptions.map((elem) => ({
              id: elem.value,
              label: elem.label,
              value: elem.value,
              inputProps: {
                defaultChecked: Boolean(localFilterState?.communityPrograms?.includes(elem.value)),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flex items-center grid md:grid-cols-3 sm:grid-cols-1"
            fieldLabelClassName={"text-gray-750"}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} separator={true} className={"px-4"} wrapperClassName={"pt-4 mt-2"}>
        <GridCell span={3}>
          <ViewItem className={"font-bold"} label={t("t.region")} labelStyling={"text-gray-750"} />
          <FieldGroup
            name="region"
            type="checkbox"
            register={register}
            fields={regionOptions.map((elem) => ({
              id: elem.value,
              label: elem.label,
              value: elem.value,
              inputProps: {
                defaultChecked: Boolean(localFilterState?.region?.includes(elem.value)),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flex items-center grid md:grid-cols-3 sm:grid-cols-1"
            fieldLabelClassName={"text-gray-750"}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3} separator={true} className={"px-4"} wrapperClassName={"pt-4 mt-2"}>
        <GridCell span={3}>
          <ViewItem
            className={"font-bold"}
            label={t("eligibility.accessibility.title")}
            labelStyling={"text-gray-750"}
          />
          <FieldGroup
            name="accessibility"
            type="checkbox"
            register={register}
            fields={accessibilityFeatureOptions.map((elem) => ({
              id: elem.value,
              label: elem.label,
              value: elem.value,
              inputProps: {
                defaultChecked: Boolean(localFilterState?.accessibility?.includes(elem.value)),
              },
            }))}
            fieldClassName="m-0"
            fieldGroupClassName="flexitems-center grid md:grid-cols-3 sm:grid-cols-1"
            fieldLabelClassName={"text-gray-750"}
          />
        </GridCell>
      </GridSection>
      <div className="text-left mt-28 bg-white border-t border-gray-450 pt-4">
        <div className={"p-4 flex gap-4"}>
          <Button
            type="submit"
            styleType={AppearanceStyleType.primary}
            className={"border-primary bg-primary-darker mr-3 hover:text-white"}
          >
            {t("t.done")}
          </Button>
          <Button
            type="button"
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
            className={"border-primary text-primary hover:text-white"}
            onClick={() => {
              setLocalFilterState({})
              reset()
            }}
          >
            {t("listingFilters.clear")}
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default FilterForm
