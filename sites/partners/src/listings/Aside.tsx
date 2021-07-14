import React, { useContext, useMemo } from "react"
import moment from "moment"
import {
  t,
  StatusAside,
  Button,
  GridCell,
  AppearanceStyleType,
  StatusMessages,
  LocalizedLink,
  LinkButton,
  AuthContext,
} from "@bloom-housing/ui-components"
import { ListingContext } from "./ListingContext"
import { ListingStatus, UserRole } from "@bloom-housing/backend-core/types"

type AsideProps = {
  type: AsideType
  setStatusAndSubmit?: (status: ListingStatus) => Promise<void>
}

type AsideType = "add" | "edit" | "details"

const Aside = ({ type, setStatusAndSubmit }: AsideProps) => {
  const listing = useContext(ListingContext)
  const { profile } = useContext(AuthContext)

  const listingId = listing?.id

  const recordUpdated = useMemo(() => {
    if (!listing) return null

    const momentDate = moment(listing.updatedAt)

    return momentDate.format("MMMM DD, YYYY")
  }, [listing])

  const actions = useMemo(() => {
    const elements = []

    const cancel = (
      <GridCell className="flex" key="btn-cancel">
        <LinkButton
          unstyled
          fullWidth
          className="bg-opacity-0"
          href={type === "add" ? "/" : `/listings/${listingId}`}
        >
          {t("t.cancel")}
        </LinkButton>
      </GridCell>
    )

    if (type === "details") {
      elements.push(
        <GridCell key="btn-submitNew">
          <LocalizedLink href={`/listings/${listingId}/edit`}>
            {profile.roles.includes(UserRole.admin) && process.env.showLMLinks && (
              <Button styleType={AppearanceStyleType.secondary} fullWidth onClick={() => false}>
                {t("t.edit")}
              </Button>
            )}
          </LocalizedLink>
          <LocalizedLink href={`/`}>
            {!profile.roles.includes(UserRole.admin) && process.env.showLMLinks && (
              <Button styleType={AppearanceStyleType.secondary} fullWidth onClick={() => false}>
                {t("Request Edit")}
              </Button>
            )}
          </LocalizedLink>
        </GridCell>
      )
    }

    if (type === "add" || type === "edit") {
      elements.push(
        <GridCell key="btn-publish">
          <Button
            styleType={AppearanceStyleType.primary}
            fullWidth
            onClick={() => setStatusAndSubmit(ListingStatus.active)}
          >
            {t("listings.actions.publish")}
          </Button>
        </GridCell>,
        <GridCell key="btn-draft">
          <Button
            styleType={AppearanceStyleType.secondary}
            fullWidth
            onClick={() => setStatusAndSubmit(ListingStatus.pending)}
          >
            {t("listings.actions.draft")}
          </Button>
        </GridCell>
      )
    }

    if (type === "details") {
      elements.push(
        <GridCell key="btn-preview">
          <a target="_blank" href={`${process.env.publicBaseUrl}/preview/listings/${listingId}`}>
            <Button styleType={AppearanceStyleType.secondary} fullWidth onClick={() => false}>
              {t("listings.actions.preview")}
            </Button>
          </a>
        </GridCell>
      )
    }

    if (type === "add" || type === "edit") {
      elements.push(cancel)
    }

    return elements
  }, [listingId, profile.roles, setStatusAndSubmit, type])

  return (
    <>
      <StatusAside columns={1} actions={actions}>
        {type === "edit" && <StatusMessages lastTimestamp={recordUpdated} />}
      </StatusAside>
    </>
  )
}

export default Aside
