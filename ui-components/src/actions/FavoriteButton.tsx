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
  const { profile, userProfileService } = useContext(AuthContext)
  const preferences = profile?.preferences || {
    sendEmailNotifications: false,
    sendSmsNotifications: false,
    favoriteIDs: [],
  }

  const [listingFavorited, setListingFavorited] = useState(preferences.favoriteIDs?.includes(id))

  useEffect(() => {
    setListingFavorited(preferences.favoriteIDs?.includes(id))
  }, [preferences.favoriteIDs, id])

  if (!allowFavoriting || !profile) {
    return null
  }

  const addFavorite = async () => {
    if (!profile || listingFavorited) {
      return
    }
    preferences.favoriteIDs?.push(id)

    try {
      await userProfileService?.update({
        body: { ...profile, preferences },
      })
      setListingFavorited(true)
      addFavoriteOnSuccess && addFavoriteOnSuccess()
    } catch (err) {
      console.warn(err)
    }
  }

  const removeFavorite = async () => {
    if (!profile || !preferences.favoriteIDs || preferences?.favoriteIDs?.length === 0) {
      return
    }

    const index: number = preferences.favoriteIDs?.indexOf(id)
    preferences?.favoriteIDs?.splice(index, 1)

    try {
      await userProfileService?.update({
        body: { ...profile, preferences },
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
        className="mx-2 mt-6 p-3 rounded-full bg-primary-dark border-none"
        size={AppearanceSizeType.small}
        onClick={() => removeFavorite()}
        ariaLabel={t("t.favorite")}
      >
        <Icon
          symbol={"likeFill"}
          size={"large"}
          fill={IconFillColors.white}
          iconClass={"favorited-fill"}
        />
      </Button>
      <a onClick={removeFavorite} className={"cursor-pointer font-bold"}>
        {t("t.favorite")}
      </a>
    </>
  ) : (
    <>
      <Button
        className="mx-2 mt-6 p-3 rounded-full"
        size={AppearanceSizeType.small}
        onClick={() => addFavorite()}
        ariaLabel={t("t.favorite")}
      >
        <Icon symbol={"like"} size={"large"} />
      </Button>
      <a onClick={addFavorite} className={"cursor-pointer font-bold"}>
        {t("t.favorite")}
      </a>
    </>
  )
}

export { FavoriteButton as default, FavoriteButton }
