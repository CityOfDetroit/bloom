import { useCallback, useContext, useState } from "react"
import useSWR, { mutate } from "swr"
import qs from "qs"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  EnumApplicationsApiExtraModelOrder,
  EnumApplicationsApiExtraModelOrderBy,
  EnumListingFilterParamsComparison,
  EnumPreferencesFilterParamsComparison,
  EnumProgramsFilterParamsComparison,
  EnumUserFilterParamsComparison,
  OrderByFieldsEnum,
  OrderDirEnum,
} from "@bloom-housing/backend-core/types"
import dayjs from "dayjs"
import JSZip from "jszip"
import { setSiteAlertMessage, t } from "@bloom-housing/ui-components"

interface PaginationProps {
  page?: number
  limit: number | "all"
  orderBy?: OrderByFieldsEnum
  orderDir?: OrderDirEnum
}

interface UseSingleApplicationDataProps extends PaginationProps {
  listingId: string
}

type UseUserListProps = PaginationProps & {
  search?: string
}
export interface ColumnOrder {
  orderBy: string
  orderDir: string
}

type UseListingsDataProps = PaginationProps & {
  search?: string
  sort?: ColumnOrder[]
  listingIds?: string[]
  view?: string
}

export function useSingleListingData(listingId: string) {
  const { listingsService } = useContext(AuthContext)
  const fetcher = () => listingsService.retrieve({ id: listingId })

  const { data, error } = useSWR(`${process.env.backendApiBase}/listings/${listingId}`, fetcher)

  return {
    listingDto: data,
    listingLoading: !error && !data,
    listingError: error,
  }
}

export function useListingsData({
  page,
  limit,
  search,
  listingIds,
  sort,
  view = "base",
}: UseListingsDataProps) {
  const params = {
    page,
    limit,
    search,
    view,
  }

  // filter if logged user is an agent
  if (listingIds !== undefined) {
    Object.assign(params, {
      filter: [
        {
          $comparison: EnumListingFilterParamsComparison["IN"],
          id: listingIds.join(","),
        },
      ],
    })
  }

  if (search?.length < 3) {
    delete params.search
  } else {
    Object.assign(params, { search })
  }

  if (sort) {
    Object.assign(params, {
      orderBy: sort?.filter((item) => item.orderBy).map((item) => item.orderBy)[0],
    })
    Object.assign(params, {
      orderDir: sort?.filter((item) => item.orderDir).map((item) => item.orderDir)[0],
    })
  }
  const { listingsService } = useContext(AuthContext)
  const fetcher = () => listingsService.list(params)

  const paramsString = qs.stringify(params)
  const { data, error } = useSWR(`${process.env.backendApiBase}/listings?${paramsString}`, fetcher)

  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export function useApplicationsData(
  currentPage: number,
  delayedFilterValue: string,
  limit: number,
  listingId: string,
  orderBy?: EnumApplicationsApiExtraModelOrderBy,
  order?: EnumApplicationsApiExtraModelOrder
) {
  const { applicationsService } = useContext(AuthContext)

  const params = {
    listingId,
    page: currentPage,
    limit,
  }

  if (delayedFilterValue) {
    Object.assign(params, { search: delayedFilterValue })
  }

  if (orderBy) {
    Object.assign(params, { orderBy, order: order || EnumApplicationsApiExtraModelOrder.ASC })
  }

  const paramsString = qs.stringify(params)
  const endpoint = `${process.env.backendApiBase}/applications?${paramsString}`

  const fetcher = () => applicationsService.list(params)
  const { data, error } = useSWR(endpoint, fetcher)

  const applications = data?.items
  const appsMeta = data?.meta

  return {
    applications: applications ?? [],
    appsMeta,
    appsLoading: !error && !data,
    appsError: error,
  }
}

export function useSingleApplicationData(applicationId: string) {
  const { applicationsService } = useContext(AuthContext)
  const backendSingleApplicationsEndpointUrl = `${process.env.backendApiBase}/applications/${applicationId}`

  const fetcher = () => applicationsService.retrieve({ id: applicationId })
  const { data, error } = useSWR(backendSingleApplicationsEndpointUrl, fetcher)

  return {
    application: data,
    applicationLoading: !error && !data,
    applicationError: error,
  }
}

export function useFlaggedApplicationsList({
  listingId,
  page,
  limit,
}: UseSingleApplicationDataProps) {
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const params = {
    listingId,
    page,
  }

  const queryParams = new URLSearchParams()
  queryParams.append("listingId", listingId)
  queryParams.append("page", page.toString())

  if (typeof limit === "number") {
    queryParams.append("limit", limit.toString())
    Object.assign(params, limit)
  }

  const endpoint = `${process.env.backendApiBase}/applicationFlaggedSets?${queryParams.toString()}`

  const fetcher = () => applicationFlaggedSetsService.list(params)

  const { data, error } = useSWR(endpoint, fetcher)

  return {
    data,
    error,
  }
}

export function useSingleFlaggedApplication(afsId: string) {
  const { applicationFlaggedSetsService } = useContext(AuthContext)

  const endpoint = `${process.env.backendApiBase}/applicationFlaggedSets/${afsId}`
  const fetcher = () =>
    applicationFlaggedSetsService.retrieve({
      afsId,
    })

  const { data, error } = useSWR(endpoint, fetcher)

  const revalidate = () => mutate(endpoint)

  return {
    revalidate,
    data,
    error,
  }
}

export function useSingleAmiChartData(amiChartId: string) {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.retrieve({ amiChartId })

  const { data, error } = useSWR(`${process.env.backendApiBase}/amiCharts/${amiChartId}`, fetcher)

  return {
    data,
    error,
  }
}

export function useAmiChartList(jurisdiction: string) {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.list({ jurisdictionId: jurisdiction })

  const { data, error } = useSWR(`${process.env.backendApiBase}/amiCharts/${jurisdiction}`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useSingleAmiChart(amiChartId: string) {
  const { amiChartsService } = useContext(AuthContext)
  const fetcher = () => amiChartsService.retrieve({ amiChartId })

  const { data, error } = useSWR(`${process.env.backendApiBase}/amiCharts/${amiChartId}`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useUnitPriorityList() {
  const { unitPriorityService } = useContext(AuthContext)
  const fetcher = () => unitPriorityService.list()

  const { data, error } = useSWR(
    `${process.env.backendApiBase}/unitAccessibilityPriorityTypes`,
    fetcher
  )

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useUnitTypeList() {
  const { unitTypesService } = useContext(AuthContext)
  const fetcher = () => unitTypesService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/unitTypes`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function usePreferenceList() {
  const { preferencesService } = useContext(AuthContext)
  const fetcher = () => preferencesService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/preferences`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useJurisdictionalPreferenceList(jurisdictionId: string) {
  const { preferencesService } = useContext(AuthContext)
  const fetcher = () =>
    preferencesService.list({
      filter: [
        {
          $comparison: EnumPreferencesFilterParamsComparison["="],
          jurisdiction: jurisdictionId,
        },
      ],
    })

  const { data, error } = useSWR(
    `${process.env.backendApiBase}/preferences/${jurisdictionId}`,
    fetcher
  )

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useProgramList() {
  const { programsService } = useContext(AuthContext)
  const fetcher = () => programsService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/programs`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useJurisdictionalProgramList(jurisdictionId: string) {
  const { programsService } = useContext(AuthContext)
  const fetcher = () =>
    programsService.list({
      filter: [
        {
          $comparison: EnumProgramsFilterParamsComparison["="],
          jurisdiction: jurisdictionId,
        },
      ],
    })

  const { data, error } = useSWR(
    `${process.env.backendApiBase}/programs/${jurisdictionId}`,
    fetcher
  )

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useReservedCommunityTypeList() {
  const { reservedCommunityTypeService } = useContext(AuthContext)
  const fetcher = () => reservedCommunityTypeService.list()

  const { data, error } = useSWR(`${process.env.backendApiBase}/reservedCommunityTypes`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export function useUserList({ page, limit, search = "" }: UseUserListProps) {
  const params = {
    page,
    limit,
    filter: [
      {
        isPortalUser: true,
        $comparison: EnumUserFilterParamsComparison["="],
      },
    ],
    search,
  }

  if (search?.length < 3) {
    delete params.search
  } else {
    Object.assign(params, { search })
  }

  const paramsString = qs.stringify(params)

  const { userService } = useContext(AuthContext)

  const fetcher = () => userService.list(params)

  const { data, error } = useSWR(`${process.env.backendApiBase}/user/list?${paramsString}`, fetcher)

  return {
    data,
    loading: !error && !data,
    error,
  }
}

export const createDateStringFromNow = (format = "YYYY-MM-DD_HH:mm:ss"): string => {
  const now = new Date()
  return dayjs(now).format(format)
}

export const useUsersExport = () => {
  const { userService } = useContext(AuthContext)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("/", "-")

  return useCsvExport(
    () => userService.listAsCsv({ timeZone }),
    `users-${createDateStringFromNow("YYYY-MM-DD_HH:mm")}.csv`
  )
}

const useCsvExport = (endpoint: () => Promise<string>, fileName: string) => {
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [csvExportError, setCsvExportError] = useState(false)
  const [csvExportSuccess, setCsvExportSuccess] = useState(false)

  const onExport = useCallback(async () => {
    setCsvExportError(false)
    setCsvExportSuccess(false)
    setCsvExportLoading(true)

    try {
      const content = await endpoint()

      const blob = new Blob([content], { type: "text/csv" })
      const fileLink = document.createElement("a")
      fileLink.setAttribute("download", fileName)
      fileLink.href = URL.createObjectURL(blob)
      fileLink.click()
      setCsvExportSuccess(true)
      setSiteAlertMessage(t("t.exportSuccess"), "success")
    } catch (err) {
      setCsvExportError(true)
    }

    setCsvExportLoading(false)
  }, [endpoint, fileName])

  return {
    onExport,
    csvExportLoading,
    csvExportError,
    csvExportSuccess,
  }
}

export const useListingZip = () => {
  const { listingsService } = useContext(AuthContext)

  const [zipExportLoading, setZipExportLoading] = useState(false)
  const [zipExportError, setZipExportError] = useState(false)
  const [zipCompleted, setZipCompleted] = useState(false)

  const onExport = useCallback(async () => {
    setZipExportError(false)
    setZipCompleted(false)
    setZipExportLoading(true)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("/", "-")

    try {
      const content = await listingsService.listAsCsv({ timeZone })
      const now = new Date()
      const dateString = dayjs(now).format("YYYY-MM-DD_HH-mm")
      const zip = new JSZip()
      zip.file(dateString + "_listing_data.csv", content?.listingCsv)
      zip.file(dateString + "_unit_data.csv", content?.unitCsv)
      await zip.generateAsync({ type: "blob" }).then(function (blob) {
        const fileLink = document.createElement("a")
        fileLink.setAttribute("download", `${dateString}-complete-listing-data.zip`)
        fileLink.href = URL.createObjectURL(blob)
        fileLink.click()
      })
      setZipCompleted(true)
      setSiteAlertMessage(t("t.exportSuccess"), "success")
    } catch (err) {
      setZipExportError(true)
    }
    setZipExportLoading(false)
  }, [listingsService])

  return {
    onExport,
    zipCompleted,
    zipExportLoading,
    zipExportError,
  }
}
