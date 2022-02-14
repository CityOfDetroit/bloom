import * as React from "react"
import { AppearanceSizeType, Button, Icon, IconFillColors } from "@bloom-housing/ui-components"
import { t } from "../helpers/translator"

export interface FavoriteButtonProps {
  removeFavorite: () => void
  addToFavorite: () => void
  currentlyFavorited: boolean
}

const FavoriteButton = (props: FavoriteButtonProps) => {
  return props.currentlyFavorited ? (
    <>
      <Button
        className="mx-2 mt-6 p-3 rounded-full bg-primary-dark border-none"
        size={AppearanceSizeType.small}
        onClick={() => props.removeFavorite()}
      >
        <Icon
          symbol={"likeFill"}
          size={"large"}
          fill={IconFillColors.white}
          iconClass={"favorited-fill"}
        />
      </Button>
      <a onClick={props.removeFavorite} className={"cursor-pointer"}>
        {t("t.favorite")}
      </a>
    </>
  ) : (
    <>
      <Button
        className="mx-2 mt-6 p-3 rounded-full"
        size={AppearanceSizeType.small}
        onClick={() => props.addToFavorite()}
        ariaLabel={t("t.favorite")}
      >
        <Icon symbol={"like"} size={"large"} />
      </Button>
      <a onClick={props.addToFavorite} className={"cursor-pointer"}>
        {t("t.favorite")}
      </a>
    </>
  )
}

export { FavoriteButton as default, FavoriteButton }
