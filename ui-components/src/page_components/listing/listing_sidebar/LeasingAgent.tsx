import * as React from "react"
import { SidebarAddress } from "./SidebarAddress"
import { t } from "../../../helpers/translator"
import { Icon, IconFillColors } from "../../../icons/Icon"
import { Listing } from "@bloom-housing/backend-core/types"
import { openDateState } from "../../../helpers/state"

interface LeasingAgentProps {
  listing: Listing
}

const LeasingAgent = (props: LeasingAgentProps) => {
  const listing = props.listing

  if (openDateState(listing)) {
    return null
  }

  const phoneNumber = listing.leasingAgentPhone
    ? `tel:${listing.leasingAgentPhone.replace(/[-()]/g, "")}`
    : ""

  const managementWebsite = listing.managementWebsite ? `http://${listing.managementWebsite}` : ""

  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("leasingAgent.contact")}</h4>

      {listing.leasingAgentName && <p className="text-xl">{listing.leasingAgentName}</p>}
      {listing.leasingAgentTitle && <p className="text-gray-700">{listing.leasingAgentTitle}</p>}

      {listing.leasingAgentPhone && (
        <>
          <p className="mt-5">
            <a href={phoneNumber}>
              <Icon symbol="phone" size="medium" fill={IconFillColors.primary} /> {t("t.call")}{" "}
              {listing.leasingAgentPhone}
            </a>
          </p>
        </>
      )}

      {listing.leasingAgentEmail && (
        <p className="my-5">
          <a href={`mailto:${listing.leasingAgentEmail}`}>
            <Icon symbol="mail" size="medium" fill={IconFillColors.primary} /> {t("t.email")}
          </a>
        </p>
      )}

      {listing.leasingAgentAddress && (
        <SidebarAddress
          address={listing.leasingAgentAddress}
          officeHours={listing.leasingAgentOfficeHours}
        />
      )}

      {listing.managementCompany && (
        <>
          <p className="mt-5">
            <p>{listing.managementCompany}</p>
            {listing.managementWebsite && (
              <a href={managementWebsite}>
                <p>{listing.managementWebsite}</p>
              </a>
            )}
          </p>
        </>
      )}
    </section>
  )
}

export { LeasingAgent as default, LeasingAgent }
