/* eslint-env node */

module.exports = {
  important: true,
  plugins: [require("tailwindcss-rtl")],
  purge: false,
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1200px",
      xl: "1280px",
      print: { raw: "print" },
    },
    fontSize: {
      "2xs": "var(--bloom-font-size-2xs)",
      xs: "var(--bloom-font-size-xs)",
      sm: "var(--bloom-font-size-sm)",
      tiny: "var(--bloom-font-size-tiny)",
      base: "var(--bloom-font-size-base)",
      lg: "var(--bloom-font-size-lg)",
      xl: "var(--bloom-font-size-xl)",
      "2xl": "var(--bloom-font-size-2xl)",
      "3xl": "var(--bloom-font-size-3xl)",
      "4xl": "var(--bloom-font-size-4xl)",
      "5xl": "var(--bloom-font-size-5xl)",
      "6xl": "var(--bloom-font-size-6xl)",
      "6.5xl": "var(--bloom-font-size-6_5xl)",
      "7xl": "var(--bloom-font-size-7xl)",
    },
    fontFamily: {
      sans: "var(--bloom-font-sans)",
      serif: "var(--bloom-font-serif)",
      "alt-sans": "var(--bloom-font-alt-sans)",
    },
    colors: {
      // primary: "#279989",
      // "primary-dark": "#004445",
      // "primary-darker": "#004445",
      // "primary-light": "#F2F2F2",
      // "primary-lighter": "#F2F2F2",
      // secondary: "#0067be",
      // alert: "#E41D3D",
      // "alert-light": "#F9D2D8",
      // "alert-dark": "#B21D38",
      // success: "#2E8540",
      // "success-light": "#B4E5BE",
      // "success-dark": "#216E1F",
      // warn: "#FDB81E",
      // "warn-light": "#FEE8B6",
      // "warn-dark": "#E5A000",
      // "accent-cool": "#00BED5",
      // "accent-cool-light": "#C8F1FF",
      // "accent-cool-dark": "#009DB0",
      // "accent-warm": "#ff6627",
      // "accent-warm-dark": "#D54309",
      // "accent-warm-light": "#FFD2C0",
      // "accent-warm-lighter": "#FFF7F3",
      // royal: "#B85ED5",
      // "royal-light": "#EED7F5",
      // "royal-dark": "#A131C6",
      // lush: "#99CD00",
      // "lush-light": "#F2FFCD",
      // "lush-dark": "#7CA700",
      // white: "#FFFFFF",
      // black: "#000000",
      primary: "var(--bloom-color-primary)",
      "primary-dark": "var(--bloom-color-primary-dark)",
      "primary-darker": "var(--bloom-color-primary-darker)",
      "primary-light": "var(--bloom-color-primary-light)",
      "primary-lighter": "var(--bloom-color-primary-lighter)",
      secondary: "var(--bloom-color-secondary)",
      alert: "var(--bloom-color-alert)",
      "alert-light": "var(--bloom-color-alert-light)",
      "alert-dark": "var(--bloom-color-alert-dark)",
      success: "var(--bloom-color-success)",
      "success-light": "var(--bloom-color-success-light)",
      "success-dark": "var(--bloom-color-success-dark)",
      warn: "var(--bloom-color-warn)",
      "warn-light": "var(--bloom-color-warn-light)",
      "warn-dark": "var(--bloom-color-warn-dark)",
      "accent-cool": "var(--bloom-color-accent-cool)",
      "accent-cool-light": "var(--bloom-color-accent-cool-light)",
      "accent-cool-dark": "var(--bloom-color-accent-cool-dark)",
      "accent-warm": "var(--bloom-color-accent-warm)",
      "accent-warm-dark": "var(--bloom-color-accent-warm-dark)",
      "accent-warm-light": "var(--bloom-color-accent-warm-light)",
      "accent-warm-lighter": "var(--bloom-color-accent-warm-lighter)",
      royal: "#B85ED5",
      "royal-light": "#EED7F5",
      "royal-dark": "#A131C6",
      lush: "var(--bloom-color-lush)",
      "lush-light": "#F2FFCD",
      "lush-dark": "#7CA700",
      white: "var(--bloom-color-white)",
      black: "var(--bloom-color-black)",
      blue: {
        800: "var(--bloom-color-blue-800)",
        700: "var(--bloom-color-blue-700)",
        600: "var(--bloom-color-blue-600)",
        300: "var(--bloom-color-blue-300)",
        200: "var(--bloom-color-blue-200)",
      },
      red: {
        700: "var(--bloom-color-red-700)",
        300: "var(--bloom-color-red-300)",
      },
      yellow: {
        700: "var(--bloom-color-yellow-700)",
        300: "var(--bloom-color-yellow-300)",
      },
      green: {
        900: "var(--bloom-color-green-900)",
        700: "var(--bloom-color-green-700)",
        500: "var(--bloom-color-green-500)",
        300: "var(--bloom-color-green-300)",
        100: "var(--bloom-color-green-100)",
      },
      teal: {
        700: "var(--bloom-color-green-700)",
        300: "var(--bloom-color-green-300)",
      },
      gray: {
        950: "var(--bloom-color-gray-950)",
        900: "var(--bloom-color-gray-900)",
        850: "var(--bloom-color-gray-850)",
        800: "var(--bloom-color-gray-800)",
        750: "var(--bloom-color-gray-750)",
        700: "var(--bloom-color-gray-700)",
        600: "var(--bloom-color-gray-600)",
        550: "var(--bloom-color-gray-550)",
        500: "var(--bloom-color-gray-500)",
        450: "var(--bloom-color-gray-450)",
        400: "var(--bloom-color-gray-400)",
        300: "var(--bloom-color-gray-300)",
        200: "var(--bloom-color-gray-200)",
        100: "var(--bloom-color-gray-100)",
      },
    },
    letterSpacing: {
      tightest: "var(--bloom-letter-spacing-tightest)",
      tighter: "var(--bloom-letter-spacing-tighter)",
      tight: "var(--bloom-letter-spacing-tight)",
      normal: "0",
      wide: "var(--bloom-letter-spacing-wide)",
      wider: "var(--bloom-letter-spacing-wider)",
      widest: "var(--bloom-letter-spacing-widest)",
      ultrawide: "var(--bloom-letter-spacing-ultrawide)",
    },
    extend: {
      borderColor: (theme) => ({
        DEFAULT: theme("colors.gray.450", "currentColor"),
      }),
      inset: {
        4: "1rem",
        "-10": "-2.5rem",
      },
    },
  },
}
