import "@bloom-housing/ui-components/src/global/index.scss"
// import "../../sites/public/styles/overrides.scss"

// Set up translation file
import { addTranslation } from "../src/helpers/translator"
import general from "../src/locales/general.json"
addTranslation(general)

export const parameters = {
  options: {
    storySort: {
      order: [
        "Actions",
        "Blocks",
        "Footers",
        "Forms",
        "Headers",
        "Icons",
        "Lists",
        "Navigation",
        "Notifications",
        "Overlays",
        "Sections",
        "Tables",
      ],
    },
  },
}
