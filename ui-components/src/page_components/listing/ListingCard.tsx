import * as React from "react"
import { ImageCard, ImageCardProps } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"

import { t } from "../../helpers/translator"
import "./ListingCard.scss"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"
import { AppearanceSizeType, AuthContext, Button, Icon } from "@bloom-housing/ui-components"
import { useContext } from "react"
import { Listing, UserPreferences } from "@bloom-housing/backend-core/types/src/backend-swagger"

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
  listing: Listing
}

const ListingCard = (props: ListingCardProps) => {
  const { imageCardProps, tableProps, detailsLinkClass, tableHeaderProps } = props
  const { profile, userProfileService } = useContext(AuthContext)

  const addToFavorite = async () => {
    const localProfile = profile
    if (!localProfile) {
      return
    }
    const preferences: UserPreferences = profile?.preferences || { favorites: [] }
    if (!preferences.favorites) {
      preferences.favorites = []
    }

    if (!preferences.favorites.map((listing) => listing.id).includes(props.listing.id)) {
      preferences.favorites.push(props.listing)
      console.log("Adding Listing")
    }
    localProfile.preferences = preferences

    console.log(preferences.favorites)

    try {
      await userProfileService?.update({
        body: { ...profile, preferences },
      })
    } catch (err) {
      console.warn(err)
    }
  }

  const removeFavorite = async () => {
    const localProfile = profile
    if (!localProfile) {
      return
    }
    const preferences: UserPreferences = profile?.preferences || { favorites: [] }
    if (!preferences.favorites || preferences.favorites.length === 0) {
      return
    }

    const index = preferences.favorites.indexOf(props.listing)
    console.log(index)
    const temp = [
      ...preferences.favorites.slice(0, index),
      ...preferences.favorites.slice(index + 1),
    ]
    console.log("Removing Listing")
    preferences.favorites = temp
    console.log(preferences.favorites)

    try {
      await userProfileService?.update({
        body: { ...profile, preferences },
      })
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
        <Button
          className="mx-2 mt-6"
          size={AppearanceSizeType.small}
          onClick={() => addToFavorite()}
        >
          <Icon symbol={"plus"} size={"medium"} />
          {t("t.addFavorites")}
        </Button>
        <Button
          className="mx-2 mt-6"
          size={AppearanceSizeType.small}
          onClick={() => removeFavorite()}
        >
          <Icon symbol={"closeRound"} size={"medium"} />
          {t("t.removeFavorites")}
        </Button>
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
