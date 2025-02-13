/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

module.exports = {
  content: [
    // "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    // "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          darker: "var(--color-primary-darker)",
        },
        shade: {
          DEFAULT: "var(--color-shade)",
          light: "var(--color-shade-light)",
          dark: "var(--color-shade-dark)",
          darker: "var(--color-shade-darker)",
          darkest: "var(--color-shade-darkest)",
        },
        tint: {
          lightest: "var(--color-tint-lightest)",
          lighter: "var(--color-tint-lighter)",
          light: "var(--color-tint-light)",
          DEFAULT: "var(--color-tint)",
          dark: "var(--color-tint-dark)",
        },
        gray: {
          DEFAULT: "var(--color-gray)",
          lightest: "var(--color-gray-lightest)",
          lighter: "var(--color-gray-lighter)",
          light: "var(--color-gray-light)",
          normal: "var(--color-gray-normal)",
          dark: "var(--color-gray-dark)",
          darker: "var(--color-gray-darker)",
          darkest: "var(--color-gray-darkest)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
          600: "var(--color-gray-600)",
        },
        black: {
          DEFAULT: "var(--color-black)",
          dark: "var(--color-black-dark)",
          darker: "var(--color-black-darker)",
          darkest: "var(--color-black-darkest)",
          extraDark: "var(--color-black-extra-dark)",
          light: "var(--color-black-light)",
          lighter: "var(--color-black-lighter)",
          lightest: "var(--color-black-lightest)",
          extraLight: "var(--color-black-extra-light)",
          muted: "var(--color-black-muted)",
          dim: "var(--color-black-dim)",
        },
        state: {
          error: "var(--color-state-error)",
          success: "var(--color-state-success)",
          info: "var(--color-state-info)",
          warning: "var(--color-state-warning)",
        },
      },
      fontSize: {
        "display-1": "var(--text-display-1)",
        "display-2": "var(--text-display-2)",
        "display-3": "var(--text-display-3)",
        h1: "var(--text-h1)",
        h2: "var(--text-h2)",
        h3: "var(--text-h3)",
        h4: "var(--text-h4)",
        h5: "var(--text-h5)",
        h6: "var(--text-h6)",
        "subtitle-1": "var(--text-subtitle-1)",
        "subtitle-2": "var(--text-subtitle-2)",
        "subtitle-3": "var(--text-subtitle-3)",
        "body-1": "var(--text-body-1)",
        "body-2": "var(--text-body-2)",
        "body-3": "var(--text-body-3)",
        "button-1": "var(--text-button-1)",
        "button-2": "var(--text-button-2)",
        "caption-1": "var(--text-caption-1)",
        "caption-2": "var(--text-caption-2)",
        "overline-1": "var(--text-overline-1)",
        "overline-2": "var(--text-overline-2)",
      },
      fontFamily: {
        "times-new-roman": "var(--font-times-new-roman)",
        "plus-jakarta-display": "var(--font-plus-jakarta-display)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
