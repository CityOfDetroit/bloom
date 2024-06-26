import React, { useState } from "react"
import {
  Address,
  AppearanceStyleType,
  Button,
  ContactAddress,
  Heading,
  LinkButton,
  OrDivider,
  t,
} from "@bloom-housing/ui-components"
import { ListingStatus } from "@bloom-housing/backend-core"
import Markdown from "markdown-to-jsx"

export interface PaperApplication {
  fileURL: string
  languageString: string
}

export interface ApplicationsProps {
  /** The pickup address for the application */
  applicationPickUpAddress?: Address
  /** Office hours for the agent at the pickup address */
  applicationPickUpAddressOfficeHours?: string
  /** Whether or not applications are currently open */
  applicationsOpen: boolean
  /** The date applications open */
  applicationsOpenDate?: string
  /** The URL for an online applications */
  onlineApplicationURL?: string
  /** Any number of paper application objects, including their URL and language */
  paperApplications?: PaperApplication[]
  /** Whether or not there is a paper application method */
  paperMethod?: boolean
  /** The date mailed applications must be received by */
  postmarkedApplicationsReceivedByDate?: string
  /** Whether or not to hide actionable application buttons */
  preview?: boolean
  listingStatus?: ListingStatus
}
/** Displays information regarding how to apply, including an online application link button, paper application downloads, and a paper application pickup address */
const GetApplication = (props: ApplicationsProps) => {
  const [showDownload, setShowDownload] = useState(false)
  const toggleDownload = () => setShowDownload(!showDownload)

  if (
    props.listingStatus === ListingStatus.closed ||
    !(props.paperMethod || props.onlineApplicationURL || props.applicationPickUpAddress)
  ) {
    return null
  }

  return (
    <section className="aside-block">
      <Heading priority={2} styleType={"underlineWeighted"}>
        {t("listings.apply.howToApply")}
      </Heading>
      {!props.applicationsOpen && (
        <p className="mb-5 text-gray-700">
          {t("listings.apply.applicationWillBeAvailableOn", {
            openDate: props.applicationsOpenDate,
          })}
        </p>
      )}
      {props.applicationsOpen && props.onlineApplicationURL && (
        <>
          {props.preview ? (
            <Button disabled className="w-full mb-2" data-testid={"listing-view-apply-button"}>
              {t("listings.apply.applyOnline")}
            </Button>
          ) : (
            <LinkButton
              styleType={AppearanceStyleType.primary}
              className="w-full mb-2"
              href={props.onlineApplicationURL}
              dataTestId={"listing-view-apply-button"}
              newTab={true}
            >
              {t("listings.apply.applyOnline")}
            </LinkButton>
          )}
        </>
      )}
      {props.applicationsOpen && props.paperMethod && (
        <>
          {props.onlineApplicationURL && <OrDivider bgColor="white" />}
          <div className="text-xl mb-4">{t("listings.apply.getAPaperApplication")}</div>
          <Button
            styleType={
              !props.preview && props.onlineApplicationURL ? AppearanceStyleType.primary : undefined
            }
            className="w-full mb-2"
            onClick={toggleDownload}
            disabled={props.preview}
          >
            {t("listings.apply.downloadApplication")}
          </Button>
        </>
      )}
      {showDownload &&
        props.paperApplications?.map((paperApplication: PaperApplication, index: number) => (
          <p key={index} className="text-center mt-2 mb-4 text-sm">
            <a
              href={paperApplication.fileURL}
              title={t("listings.apply.downloadApplication")}
              target="_blank"
            >
              {paperApplication.languageString}
            </a>
          </p>
        ))}
      {props.applicationPickUpAddress && (
        <>
          {props.applicationsOpen && (props.onlineApplicationURL || props.paperMethod) && (
            <OrDivider bgColor="white" />
          )}
          <Heading priority={3} styleType={"capsWeighted"}>
            {t("listings.apply.pickUpAnApplication")}
          </Heading>
          <ContactAddress
            address={props.applicationPickUpAddress}
            mapString={t("t.getDirections")}
          />
          {props.applicationPickUpAddressOfficeHours && (
            <>
              <Heading priority={3} styleType={"capsWeighted"}>
                {t("leasingAgent.officeHours")}
              </Heading>
              <p className="text-gray-800 text-tiny markdown">
                <Markdown
                  children={props.applicationPickUpAddressOfficeHours}
                  options={{ disableParsingRawHTML: true }}
                />
              </p>
            </>
          )}
        </>
      )}
    </section>
  )
}

export { GetApplication as default, GetApplication }
