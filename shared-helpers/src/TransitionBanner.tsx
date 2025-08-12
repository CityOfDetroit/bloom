import React from "react"
import Markdown from "markdown-to-jsx"
import { AlertBox, t } from "@bloom-housing/ui-components"

export const TransitionBanner = () => (
  <div className="site-banner-container">
    <AlertBox
      type="alert"
      boundToLayoutWidth={true}
      closeable={false}
      className="site-alert-banner-content"
    >
      <Markdown>{t("alert.unavailable")}</Markdown>
    </AlertBox>
  </div>
)

export { TransitionBanner as default }
