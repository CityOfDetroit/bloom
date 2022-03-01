import * as React from "react"
import {
  AppearanceSizeType,
  AuthContext,
  Button,
  Icon,
  IconFillColors,
} from "@bloom-housing/ui-components"
import { t } from "../helpers/translator"
import { useContext, useEffect, useState } from "react"

export interface FavoriteButtonProps {
  id: string
}

const FavoriteButton = ({ id }: FavoriteButtonProps) => {
  const { profile, userPreferencesService } = useContext(AuthContext)
  const preferences = profile?.preferences || {
    sendEmailNotifications: false,
    sendSmsNotifications: false,
    favoriteIds: [],
  }

  const [listingFavorited, setListingFavorited] = useState(preferences.favoriteIds?.includes(id))

  useEffect(() => {
    setListingFavorited(preferences.favoriteIds?.includes(id))
  }, [preferences.favoriteIds, id])

  if (!profile) {
    return <span />
  }

  const addFavorite = async () => {
    if (!profile || listingFavorited) {
      return
    }
    preferences.favoriteIds?.push(id)

    try {
      await userPreferencesService?.update({
        id: profile.id,
        body: preferences,
      })
      setListingFavorited(true)
    } catch (err) {
      console.warn(err)
    }
  }

  const removeFavorite = async () => {
    if (!profile || !preferences.favoriteIds || preferences?.favoriteIds?.length === 0) {
      return
    }

    const index: number = preferences.favoriteIds?.indexOf(id)
    preferences?.favoriteIds?.splice(index, 1)

    try {
      await userPreferencesService?.update({
        id: profile.id,
        body: preferences,
      })
      setListingFavorited(false)
    } catch (err) {
      console.warn(err)
    }
  }

  return listingFavorited ? (
    <span>
      <Button
        className="mx-2 p-3 rounded-full bg-primary-dark border-primary-dark"
        size={AppearanceSizeType.small}
        onClick={() => removeFavorite()}
        ariaLabel={t("t.unfavorite")}
      >
        <Icon
          symbol={"likeFill"}
          size={"extra-medium"}
          fill={IconFillColors.white}
          iconClass={"favorited-fill mt-0"}
        />
      </Button>
      <a
        aria-label={t("t.unfavorite")}
        onClick={removeFavorite}
        className={"cursor-pointer font-bold align-middle"}
      >
        {t("t.favorite")}
      </a>
    </span>
  ) : (
    <span>
      <Button
        className="mx-2 p-3 rounded-full"
        size={AppearanceSizeType.small}
        onClick={() => addFavorite()}
        ariaLabel={t("t.favorite")}
      >
        <Icon symbol={"like"} size={"extra-medium"} iconClass={"mt-0"} />
      </Button>
      <a
        aria-label={t("t.favorite")}
        onClick={addFavorite}
        className={"cursor-pointer font-bold align-middle"}
      >
        {t("t.favorite")}
      </a>
    </span>
  )
}

export { FavoriteButton as default, FavoriteButton }
