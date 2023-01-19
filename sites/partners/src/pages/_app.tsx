import "@bloom-housing/ui-components/src/global/css-imports.scss"
import "@bloom-housing/ui-components/src/global/app-css.scss"
import React, { useMemo } from "react"
import type { AppProps } from "next/app"
import {
  addTranslation,
  ConfigProvider,
  AuthProvider,
  RequireLogin,
  NavigationContext,
  GenericRouter,
} from "@bloom-housing/ui-components"

// TODO: Make these not-global
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import LinkComponent from "../components/core/LinkComponent"
import { translations, overrideTranslations } from "../lib/translations"
import { SWRConfig } from "swr"

// Note: import overrides.scss last so that it overrides styles defined in imports above
import "../../styles/overrides.scss"

const signInMessage = "Login is required to view this page."

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router
  const skipLoginRoutes = ["/forgot-password", "/reset-password", "/users/confirm", "/users/terms"]

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

  return (
    <SWRConfig
      value={{
        onError: (error) => {
          const { status } = error.response || {}
          if (status === 403) {
            window.location.href = "/unauthorized"
          }
        },
      }}
    >
      <NavigationContext.Provider
        value={{
          LinkComponent: LinkComponent,
          router: router as GenericRouter,
        }}
      >
        <ConfigProvider apiUrl={process.env.backendApiBase}>
          <AuthProvider>
            <RequireLogin
              signInPath="/sign-in"
              termsPath="/users/terms"
              signInMessage={signInMessage}
              skipForRoutes={skipLoginRoutes}
            >
              <div suppressHydrationWarning>
                {typeof window === "undefined" ? null : <Component {...pageProps} />}
              </div>
            </RequireLogin>
          </AuthProvider>
        </ConfigProvider>
      </NavigationContext.Provider>
    </SWRConfig>
  )
}

export default BloomApp
