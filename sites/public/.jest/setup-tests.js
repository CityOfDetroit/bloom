// Future home of additional Jest config
import { configure } from "@testing-library/dom"
import { serviceOptions } from "@bloom-housing/backend-core"
import axios from "axios"
import "@testing-library/jest-dom/extend-expect"
import { addTranslation } from "../../../ui-components/src/helpers/translator"
import general from "../../../ui-components/src/locales/general.json"
import general_overrides from "../src/page_content/locale_overrides/general.json"

addTranslation(general)
addTranslation(general_overrides)

process.env.backendApiBase = "http://localhost:3100"

global.beforeEach(() => {
  serviceOptions.axios = axios.create({
    baseURL: "http://localhost:3000",
  })
})

configure({ testIdAttribute: "data-test-id" })

// Need to set __next on base div to handle the overlay
const portalRoot = document.createElement("div")
portalRoot.setAttribute("id", "__next")
document.body.appendChild(portalRoot)
