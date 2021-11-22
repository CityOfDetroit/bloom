import * as React from "react"
import { ImageCard, ImageCardProps } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"

import { t } from "../../helpers/translator"
import "./ListingCard.scss"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"
import { AuthContext, Icon } from "../../.."
import { useContext, useState } from "react"

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
  listingID?: string
}

const ListingCard = (props: ListingCardProps) => {
  const { imageCardProps, tableProps, detailsLinkClass, tableHeaderProps } = props

  const [favorite, setFavorite] = useState([])

  const addToFavorite = (listingID) => {
    if (!favorite.includes(listingID)) setFavorite(favorite.concat(listingID))
    console.log(listingID)
    console.log("Fav " + favorite.concat(listingID).length.toString())
  }

  const { profile } = useContext(AuthContext)

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
        {profile ? (
          !profile.preferences ? (
            <button>
              <Icon symbol={"favorite"} size={"large"} />
              {" Remove from Favorites"}
              {console.log("Remove from Favorites Array")}
            </button>
          ) : (
            <button onClick={() => addToFavorite(props.listingID)}>
              <Icon symbol={"plus"} size={"large"} />
              {" Add to Favorites"}
              {console.log("Add to Favorites Array")}
            </button>
          )
        ) : (
          <LinkButton className={detailsLinkClass} href={"/sign-in"}>
            {"Sign in For Favs"}
          </LinkButton>
        )}
        {props.seeDetailsLink && (
          <LinkButton className={detailsLinkClass} href={props.seeDetailsLink}>
            {t("t.seeDetails")}
          </LinkButton>
        )}
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
