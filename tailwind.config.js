/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7a5af8",
          dark: "#4a1fb8",
          darker: "#0c0c0c",
        },
        shade: {
          DEFAULT: "#140832",
          light: "#28116",
          dark: "#361786",
          darker: "#4a1fb8",
          darkest: "#5825da",
        },
        tint: {
          lightest: "#f2eefc",
          lighter: "#cbbbf4",
          light: "#a489eb",
          DEFAULT: "#7e56e3",
          dark: "#6435dd",
        },
        gray: {
          200: "#cccccc",
          300: "#c2c2c2",
          400: "#999999",
          500: "#8f8f8f",
          600: "#858585",
          DEFAULT: "#d6d6d6",
          lightest: "#ffffff",
          lighter: "#f5f5f5",
          light: "#ebebeb",
          normal: "#e0e0e0",
          dark: "#b8b8b8",
          darker: "#adadad",
          darkest: "#a3a3a3",
        },
        black: {
          DEFAULT: "#667085",
          dark: "#475467",
          darker: "#344054",
          darkest: "#1d2939",
          "extra-dark": "#101828",
          light: "#fcfcfd",
          lighter: "#f2f4f7",
          lightest: "#f9fafb",
          "extra-light": "#e4e7ec",
          muted: "#d0d5dd",
          dim: "#98a2b3",
        },
        state: {
          error: "#b81f40",
          success: "#8db81f",
          info: "#004ab9",
          warning: "#ffc000",
        },
      },
      fontSize: {
        "display-1": "74px",
        "display-2": "64px",
        "display-3": "56px",
        h1: "40px",
        h2: "32px",
        h3: "24px",
        h4: "20px",
        h5: "18px",
        h6: "16px",
        "subtitle-1": "20px",
        "subtitle-2": "18px",
        "subtitle-3": "16px",
        "body-1": "18px",
        "body-2": "16px",
        "body-3": "14px",
        "button-1": "16px",
        "button-2": "14px",
        "caption-1": "14px",
        "caption-2": "12px",
        "overline-1": "14px",
        "overline-2": "12px",
      },
      fontFamily: {
        "times-new-roman": ["Times New Roman", "serif"],
        "plus-jakarta-display": ["Plus Jakarta Display", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          marginInline: "auto",
          paddingInline: "1rem",
          "@screen sm": {
            paddingInline: "2rem",
          },
          "@screen lg": {
            paddingInline: "4rem",
          },
          "@screen xl": {
            paddingInline: "5rem",
          },
          "@screen 2xl": {
            paddingInline: "6rem",
          },
        },
        h1: {
          "@apply text-h1 font-bold font-times-new-roman": {},
        },
        h2: {
          "@apply text-h2 font-bold font-times-new-roman": {},
        },
        h3: {
          "@apply text-h3 font-bold font-times-new-roman": {},
        },
        h4: {
          "@apply text-h4 font-bold font-times-new-roman": {},
        },
        h5: {
          "@apply text-h5 font-bold font-times-new-roman": {},
        },
        h6: {
          "@apply text-h6 font-bold font-times-new-roman": {},
        },
      });
    },
  ],
};
