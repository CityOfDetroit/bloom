import { useEffect, useMemo, useState } from "react"
import type { AppProps } from "next/app"
import {
  addTranslation,
  GenericRouter,
  NavigationContext,
  AuthProvider,
  ConfigProvider,
  LoggedInUserIdleTimeout,
} from "@bloom-housing/ui-components"
import { blankApplication } from "@bloom-housing/shared-helpers"
import { pageChangeHandler, gaLoadScript, gaCaptureScript, uaScript } from "../src/customScripts"
import { AppSubmissionContext } from "../lib/AppSubmissionContext"
import ApplicationConductor, {
  loadApplicationFromAutosave,
  loadSavedListing,
} from "../lib/ApplicationConductor"
import { translations, overrideTranslations } from "../src/translations"
import LinkComponent from "../src/LinkComponent"
import { blankEligibilityRequirements, EligibilityContext } from "../lib/EligibilityContext"
import "../../../detroit-ui-components/src/global/css-imports.scss"
import "../../../detroit-ui-components/src/global/app-css.scss"
// Note: import overrides.scss last so that it overrides styles defined in imports above
import "../styles/overrides.scss"

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router
  //  const initialized = useState(true)
  const [application, setApplication] = useState(() => {
    return loadApplicationFromAutosave() || { ...blankApplication }
  })
  const [savedListing, setSavedListing] = useState(() => {
    return loadSavedListing()
  })

  const [eligibilityRequirements] = useState(() => {
    return blankEligibilityRequirements()
  })

  const conductor = useMemo(() => {
    return new ApplicationConductor(application, savedListing)
  }, [application, savedListing])

  useMemo(() => {
    addTranslation(translations.general, true)
    if (locale && locale !== "en" && translations[locale]) {
      addTranslation(translations[locale])
    }
    addTranslation(overrideTranslations.en)
    if (overrideTranslations[locale]) {
      addTranslation(overrideTranslations[locale])
    }
  }, [locale])

  useEffect(() => {
    if (!document.body.dataset.customScriptsLoaded) {
      router.events.on("routeChangeComplete", pageChangeHandler)

      // GA 4 Tracking
      const gaLoadNode = gaLoadScript()
      const gaCaptureNode = gaCaptureScript()
      if (gaLoadNode && gaCaptureNode) {
        document.head.append(gaLoadNode)
        document.head.append(gaCaptureNode)
      }
      // UA Tracking
      const uaScriptTag = document.createElement("script")
      uaScriptTag.textContent = uaScript()
      if (uaScriptTag.textContent !== "") {
        document.head.append(uaScriptTag)
      }

      document.body.dataset.customScriptsLoaded = "true"
    }

    if (locale && locale === "ar") {
      if (document.body.getAttribute("dir") !== "rtl") {
        document.body.setAttribute("dir", "rtl")
      }
    } else {
      document.body.setAttribute("dir", "ltr")
    }
  }, [locale, router.events])

  return (
    <NavigationContext.Provider
      value={{
        LinkComponent,
        router: router as GenericRouter,
      }}
    >
      <AppSubmissionContext.Provider
        value={{
          conductor: conductor,
          application: application,
          listing: savedListing,
          syncApplication: setApplication,
          syncListing: setSavedListing,
        }}
      >
        <EligibilityContext.Provider value={{ eligibilityRequirements: eligibilityRequirements }}>
          <ConfigProvider apiUrl={process.env.backendApiBase}>
            <AuthProvider>
              <LoggedInUserIdleTimeout onTimeout={() => conductor.reset()} />
              <Component {...pageProps} />
            </AuthProvider>
          </ConfigProvider>
        </EligibilityContext.Provider>
      </AppSubmissionContext.Provider>
    </NavigationContext.Provider>
  )
}

export default BloomApp
