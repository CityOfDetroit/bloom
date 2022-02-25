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
  removeFavoriteOnSuccess?: () => void
  addFavoriteOnSuccess?: () => void
  id: string
  allowFavoriting?: boolean
}

const FavoriteButton = ({
  removeFavoriteOnSuccess,
  addFavoriteOnSuccess,
  id,
  allowFavoriting,
}: FavoriteButtonProps) => {
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

  if (!allowFavoriting || !profile) {
    return null
  }

  const addFavorite = async () => {
    if (!profile || listingFavorited) {
      return
    }
    preferences.favoriteIds?.push(id)

    try {
      await userPreferencesService?.update({
        body: preferences,
      })
      setListingFavorited(true)
      addFavoriteOnSuccess && addFavoriteOnSuccess()
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
        body: preferences,
      })
      setListingFavorited(false)
      removeFavoriteOnSuccess && removeFavoriteOnSuccess()
    } catch (err) {
      console.warn(err)
    }
  }

  return listingFavorited ? (
    <>
      <Button
        className="mx-2 p-3 rounded-full bg-primary-dark border-none"
        size={AppearanceSizeType.small}
        onClick={() => removeFavorite()}
        ariaLabel={t("t.favorite")}
      >
        <Icon
          symbol={"likeFill"}
          size={"extra-medium"}
          fill={IconFillColors.white}
          iconClass={"favorited-fill mt-0"}
        />
      </Button>
      <a onClick={removeFavorite} className={"cursor-pointer font-bold align-middle"}>
        {t("t.favorite")}
      </a>
    </>
  ) : (
    <>
      <Button
        className="mx-2 p-3 rounded-full"
        size={AppearanceSizeType.small}
        onClick={() => addFavorite()}
        ariaLabel={t("t.favorite")}
      >
        <Icon symbol={"like"} size={"extra-medium"} iconClass={"mt-0"} />
      </Button>
      <a onClick={addFavorite} className={"cursor-pointer font-bold align-middle"}>
        {t("t.favorite")}
      </a>
    </>
  )
}

export { FavoriteButton as default, FavoriteButton }
