import * as React from "react"
import { ImageCard, ImageCardProps } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"

import { t } from "../../helpers/translator"
import "./ListingCard.scss"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"

import { AuthContext, FavoriteButton } from "@bloom-housing/ui-components"
import { useContext, useEffect, useState } from "react"
import { UserPreferences } from "@bloom-housing/backend-core/types/src/backend-swagger"

interface ListingCardTableProps extends StandardTableProps, StackedTableProps {}

export interface ListingCardHeaderProps {
  tableHeader?: string
  tableHeaderClass?: string
  tableSubHeader?: string
  tableSubHeaderClass?: string
  stackedTable?: boolean
}
export interface ListingCardProps {
  imageCardProps: ImageCardProps
  seeDetailsLink?: string
  tableHeaderProps?: ListingCardHeaderProps
  tableProps: ListingCardTableProps
  detailsLinkClass?: string
  listingID: string
}

const ListingCard = (props: ListingCardProps) => {
  const { imageCardProps, tableProps, detailsLinkClass, tableHeaderProps } = props
  const { profile, userProfileService } = useContext(AuthContext)
  const preferences: UserPreferences = profile?.preferences || {
    sendEmailNotifications: false,
    sendSmsNotifications: false,
    favoriteIDs: [],
  }

  const [listingFavorited, setListingFavorited] = useState(
    preferences.favoriteIDs?.includes(props.listingID)
  )

  useEffect(() => {
    setListingFavorited(preferences.favoriteIDs?.includes(props.listingID))
  }, [preferences.favoriteIDs, props.listingID])

  const addToFavorite = async () => {
    if (!profile || listingFavorited) {
      return
    }
    preferences.favoriteIDs?.push(props.listingID)

    try {
      await userProfileService?.update({
        body: { ...profile, preferences },
      })
      setListingFavorited(true)
    } catch (err) {
      console.warn(err)
    }
  }

  const removeFavorite = async () => {
    if (!profile || !preferences.favoriteIDs || preferences?.favoriteIDs?.length === 0) {
      return
    }

    const index: number = preferences.favoriteIDs?.indexOf(props.listingID)
    preferences?.favoriteIDs?.splice(index, 1)

    try {
      await userProfileService?.update({
        body: { ...profile, preferences },
      })
      setListingFavorited(false)
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <article className="listings-row">
      <div className="listings-row_figure">
        <ImageCard {...imageCardProps} />
      </div>
      <div className="listings-row_content">
        {tableHeaderProps?.tableHeader && (
          <h3
            className={`listings-row_title ${
              tableHeaderProps.tableHeaderClass && tableHeaderProps.tableHeaderClass
            }`}
          >
            {tableHeaderProps?.tableHeader}
          </h3>
        )}
        {tableHeaderProps?.tableSubHeader && (
          <h4
            className={`listings-row_subtitle ${
              tableHeaderProps.tableSubHeaderClass && tableHeaderProps.tableSubHeaderClass
            }`}
          >
            {tableHeaderProps?.tableSubHeader}
          </h4>
        )}
        <div className="listings-row_table">
          {(tableProps.data || tableProps.stackedData) && (
            <>
              {tableHeaderProps?.stackedTable ? (
                <StackedTable {...(tableProps as StackedTableProps)} />
              ) : (
                <StandardTable {...(tableProps as StandardTableProps)} />
              )}
            </>
          )}
        </div>
        {props.seeDetailsLink && (
          <LinkButton className={detailsLinkClass} href={props.seeDetailsLink}>
            {t("t.seeDetails")}
          </LinkButton>
        )}
        {profile && (
          <FavoriteButton
            removeFavorite={removeFavorite}
            addToFavorite={addToFavorite}
            currentlyFavorited={!!listingFavorited}
          />
        )}
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
