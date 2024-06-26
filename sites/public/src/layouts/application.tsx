import React, { useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import {
  FooterNav,
  FooterSection,
  MenuLink,
  setSiteAlertMessage,
  SiteFooter,
  SiteHeader,
  t,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import Markdown from "markdown-to-jsx"
import styles from "./application.module.scss"

const Layout = (props) => {
  const { profile, signOut } = useContext(AuthContext)
  const srAnnouncement = useRef(null)
  const [srAnnouncementMessage, setSRAnnouncementMessage] = useState<string>()
  const router = useRouter()

  const languages =
    router?.locales?.map((item) => ({
      prefix: item === "en" ? "" : item,
      label: t(`languages.${item}`),
    })) || []

  const menuLinks: MenuLink[] = [
    {
      title: t("nav.rentals"),
      href: "/listings",
    },
    {
      title: t("pageTitle.getAssistance"),
      href: "/get-assistance",
    },
    {
      title: t("pageTitle.about"),
      href: "/about",
    },
  ]
  if (profile) {
    menuLinks.push({
      title: t("nav.myAccount"),
      subMenuLinks: [
        {
          title: t("nav.myDashboard"),
          href: "/account/dashboard",
        },
        {
          title: t("account.accountSettings"),
          href: "/account/edit",
        },
        {
          title: t("account.myFavorites"),
          href: "/account/favorites",
        },
        {
          title: t("nav.signOut"),
          onClick: async () => {
            setSiteAlertMessage(t(`authentication.signOut.success`), "notice")
            await router.push("/sign-in")
            signOut()
          },
        },
      ],
    })
  } else {
    menuLinks.push({
      title: t("nav.signIn"),
      href: "/sign-in",
      className: "navbar-link__sign-in",
    })
    menuLinks.push({
      title: t("nav.signUp"),
      href: "/create-account",
      className: "navbar-link__sign-up",
    })
  }
  useEffect(() => {
    const pageName = document?.querySelector("h1")?.innerText
    pageName
      ? setSRAnnouncementMessage(`${t("sr.pageTitle")} ${pageName}`)
      : setSRAnnouncementMessage(t("t.newPage"))
    srAnnouncement.current.focus()
  }, [router.asPath, router.locale])

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <div ref={srAnnouncement} tabIndex={-1} className={"sr-only"}>
          {srAnnouncementMessage}
        </div>
        <SiteHeader
          logoSrc="/images/detroit-logo.png"
          homeURL="/"
          title={t("nav.siteTitle")}
          subtitle={t("footer.headerLink")}
          logoWidth={"medium"}
          languages={languages.map((lang) => {
            return {
              label: lang.label,
              onClick: () =>
                void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
              active: t("config.routePrefix") === lang.prefix,
            }
          })}
          menuLinks={menuLinks}
          desktopMinWidth={1024}
          strings={{
            skipToMainContent: t("nav.skip"),
            menu: t("t.menu"),
            close: t("t.close"),
            logoAriaLable: "City of Detroit logo",
          }}
          mainContentId={"main-content"}
        />
        <main id="main-content" className="md:overflow-x-hidden">
          {props.children}
        </main>
      </div>

      <SiteFooter>
        <div className="footer-sections">
          <div className="footer-logo text-white">
            <h2 className="sr-only">{t("footer.srHeading")}</h2>
            <FooterSection small={true}>
              <div className="flex pb-7">
                <img src="/images/detroit-logo-white.png" alt="City of Detroit logo" />
                <div className={styles["footer-jurisdiction"]}>
                  <p className="text-left text-base font-bold md:text-xl">{t("footer.header")}</p>
                  <a
                    className="text-left text-xs md:text-base"
                    href="https://detroitmi.gov/departments/housing-and-revitalization-department"
                    target="_blank"
                  >
                    {t("footer.headerLink")}
                  </a>
                </div>
              </div>

              <p className="text-left">{t("footer.description")}</p>
            </FooterSection>
          </div>
          <div className="footer-info text-white">
            <FooterSection small={true}>
              <p className="text-base font-bold text-left mb-3">
                {t("footer.forListingQuestions")}
              </p>
              <p className="text-left">{t("footer.pleaseContact")}</p>

              <p className="text-base font-bold text-left mb-3">
                {t("footer.forGeneralInquiries")}
              </p>
              <p className="text-left">
                <Markdown>{t("footer.contactInfo")}</Markdown>
              </p>
            </FooterSection>
          </div>
        </div>
        <FooterNav copyright={t("footer.copyright")}>
          <Link href="/feedback">{t("pageTitle.feedback")}</Link>
          <Link href="/privacy">{t("pageTitle.privacy")}</Link>
          <Link href="/terms">{t("pageTitle.terms")}</Link>
          <Link href="/accessibility">{t("pageTitle.accessibilityStatement")}</Link>
        </FooterNav>
      </SiteFooter>
    </div>
  )
}

export default Layout
