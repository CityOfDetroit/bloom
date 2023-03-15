import * as React from "react"
import Markdown from "markdown-to-jsx"
import { ExpandableContent, Order, t } from "@bloom-housing/ui-components"

interface WhatToExpectProps {
  content: string
  expandableContent: string
}

const WhatToExpect = ({ content, expandableContent }: WhatToExpectProps) => {
  if (!content) return null
  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("whatToExpect.label")}</h4>
      <div className="text-tiny text-gray-750">
        <Markdown options={{ disableParsingRawHTML: false }}>{content}</Markdown>
        {expandableContent && (
          <div className={"mt-2"}>
            <ExpandableContent
              strings={{ readLess: t("t.readLess"), readMore: t("t.readMore") }}
              order={Order.below}
            >
              <Markdown options={{ disableParsingRawHTML: false }}>{expandableContent}</Markdown>
            </ExpandableContent>
          </div>
        )}
      </div>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
