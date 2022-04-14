import * as React from "react"
import { Listing } from "@bloom-housing/backend-core/types"
import Markdown from "markdown-to-jsx"
import { t } from "../../../helpers/translator"
import { ExpandableContent } from "../../../actions/ExpandableContent"

interface WhatToExpectProps {
  listing: Listing
}

const WhatToExpect = (props: WhatToExpectProps) => {
  const listing = props.listing
  if (!listing.whatToExpect || listing.whatToExpect === "") return null
  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("whatToExpect.label")}</h4>
      <div className="text-tiny text-gray-750">
        <Markdown options={{ disableParsingRawHTML: false }}>{listing.whatToExpect ?? ""}</Markdown>
        {listing.whatToExpectAdditionalText && (
          <div className={"mt-2"}>
            <ExpandableContent>
              <Markdown options={{ disableParsingRawHTML: false }}>
                {listing.whatToExpectAdditionalText}
              </Markdown>
            </ExpandableContent>
          </div>
        )}
      </div>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
