import * as React from "react"
import { ImageCard, ImageCardProps } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"

import { t } from "../../helpers/translator"
import "./ListingCard.scss"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"
import { AppearanceSizeType, AuthContext, Button, Icon } from "@bloom-housing/ui-components"
import { useContext, useEffect, useState } from "react"
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
  const [updatedFavorites, setUpdatedFavorites] = useState(profile?.preferences?.favoriteIDs)

  useEffect(() => {
    setFavoriteButtonState()
  })

  const setFavoriteButtonState = () => {
    const preferences: UserPreferences = profile?.preferences || { favoriteIDs: [] }
    setUpdatedFavorites(preferences?.favoriteIDs)
  }

  const addToFavorite = async () => {
    if (!profile) {
      return
    }
    const preferences: UserPreferences = profile.preferences || { favoriteIDs: [] }
    if (!preferences.favoriteIDs) {
      preferences.favoriteIDs = []
    }

    if (preferences.favoriteIDs.includes(props.listing.id)) {
      return
    } else {
      preferences.favoriteIDs.push(props.listing.id)
      console.log("Adding Listing")
    }

    try {
      await userProfileService?.update({
        body: { ...profile, preferences },
      })
      setUpdatedFavorites(updatedFavorites?.concat(props.listing.id))
    } catch (err) {
      console.warn(err)
    }
  }

  const removeFavorite = async () => {
    if (!profile) {
      return
    }
    const preferences: UserPreferences = profile.preferences || { favoriteIDs: [] }
    if (!preferences.favoriteIDs || preferences.favoriteIDs.length === 0) {
      return
    }

    const index: number = preferences.favoriteIDs.indexOf(props.listing.id)
    const temp = [
      ...preferences.favoriteIDs.slice(0, index),
      ...preferences.favoriteIDs.slice(index + 1),
    ]
    console.log("Removing Listing")
    preferences.favoriteIDs = temp

    try {
      setUpdatedFavorites(temp)
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
        <>
          {profile &&
            (updatedFavorites?.includes(props.listing.id) ? (
              <Button
                className="mx-2 mt-6"
                size={AppearanceSizeType.small}
                onClick={() => removeFavorite()}
              >
                <Icon symbol={"likeFill"} size={"large"} />
              </Button>
            ) : (
              <Button
                className="mx-2 mt-6"
                size={AppearanceSizeType.small}
                onClick={() => addToFavorite()}
              >
                <Icon symbol={"like"} size={"large"} />
              </Button>
            ))}
        </>
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
