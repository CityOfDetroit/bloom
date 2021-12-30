import * as React from "react"
import { ImageCard, ImageCardProps } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"

import { t } from "../../helpers/translator"
import "./ListingCard.scss"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"

import { AppearanceSizeType, AuthContext, Button, Icon } from "@bloom-housing/ui-components"
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
  const [favoriteState, updateFavoriteState] = useState("favored")

  useEffect(() => {
    if (preferences.favoriteIDs?.includes(props.listingID)) {
      updateFavoriteState("favored")
    } else {
      updateFavoriteState("notFavored")
    }
  }, [preferences.favoriteIDs, props.listingID])

  const addToFavorite = async () => {
    if (!profile) {
      return
    }
    updateFavoriteState("favored")
    const preferences: UserPreferences = profile.preferences || {
      sendEmailNotifications: false,
      sendSmsNotifications: false,
      favoriteIDs: [],
    }

    if (preferences.favoriteIDs?.includes(props.listingID)) {
      return
    } else {
      preferences.favoriteIDs?.push(props.listingID)
      console.log("Adding Listing")
    }

    try {
      await userProfileService?.update({
        body: { ...profile, preferences },
      })
    } catch (err) {
      console.warn(err)
    }
  }

  const removeFavorite = async () => {
    if (!profile) {
      return
    }
    updateFavoriteState("notFavored")
    const preferences: UserPreferences = profile.preferences || {
      sendEmailNotifications: false,
      sendSmsNotifications: false,
      favoriteIDs: [],
    }
    if (!preferences.favoriteIDs || preferences?.favoriteIDs?.length === 0) {
      return
    }

    const index: number = preferences.favoriteIDs?.indexOf(props.listingID) || 0
    preferences?.favoriteIDs?.splice(index, 1)
    console.log("Removing Listing")

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
        <>
          {profile &&
            (favoriteState === "favored" ? (
              //TODO: Update Button UI to match mocks
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
