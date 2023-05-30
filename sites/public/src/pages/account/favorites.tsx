import {
  AG_PER_PAGE_OPTIONS,
  LinkButton,
  LoadingOverlay,
  PageHeader,
  t,
} from "@bloom-housing/ui-components"
import { ListingFilterState, AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import React, { useEffect, useState, useContext, useMemo } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../../lib/hooks"
import { OrderByFieldsEnum } from "@bloom-housing/backend-core/types"
import { getListings } from "../../lib/helpers"
import { ListingPagination } from "../../components/listing/ListingPagination"

const FavoritedListingsPage = () => {
  const router = useRouter()
  const { profile } = useContext(AuthContext)

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const filterState = useMemo(() => {
    const filterState: ListingFilterState = {
      favorited: profile?.preferences?.favoriteIds?.toString(),
    }
    return filterState
  }, [profile])

  // Checks for changes in url params.
  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page))
    }
  }, [router.query])

  const { listingsData, listingsLoading } = useListingsData(
    currentPage,
    itemsPerPage,
    filterState,
    OrderByFieldsEnum.comingSoon,
    "publicListings"
  )

  const content = useMemo(() => {
    if (!profile || listingsLoading) {
      return null
    } else if (!filterState.favorited) {
      return (
        <div className="p-8">
          <h2 className="pb-4">{t("account.noFavorites")}</h2>
          <LinkButton href="/listings">{t("listings.browseListings")}</LinkButton>
        </div>
      )
    }

    return (
      <div>
        {listingsData?.meta.totalItems > 0 && getListings(listingsData?.items)}
        <ListingPagination
          totalItems={listingsData?.meta.totalItems}
          totalPages={listingsData?.meta.totalPages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          quantityLabel={t("listings.totalListings")}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          onPerPageChange={() => setCurrentPage(1)}
        />
      </div>
    )
  }, [
    profile,
    listingsLoading,
    filterState.favorited,
    listingsData?.meta.totalItems,
    listingsData?.meta.totalPages,
    listingsData?.items,
    currentPage,
    itemsPerPage,
  ])

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout className={"favorites-layout"}>
        <PageHeader className="listings-title" title={t("account.myFavorites")} inverse={true} />
        <LoadingOverlay isLoading={listingsLoading || !profile}>{content}</LoadingOverlay>
      </Layout>
    </RequireLogin>
  )
}

export default FavoritedListingsPage
