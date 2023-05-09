/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const cloneDeep = require("clone-deep")
const bloomTheme = cloneDeep(require("@bloom-housing/ui-components/tailwind.config.js"))

bloomTheme.plugins.push(require("tailwindcss-rtl"))

module.exports = {
  ...bloomTheme,
  purge: {
    enabled: process.env.NODE_ENV !== "development",
    content: [
      "./pages/**/*.tsx",
      "./src/**/*.tsx",
      "./layouts/**/*.tsx",
      "../../shared-helpers/src/**/*.tsx",
      "../../node_modules/@bloom-housing/ui-components/src/**/*.tsx",
    ],
    safelist: [/grid-cols-/, /md:col-span-/],
  },
}
