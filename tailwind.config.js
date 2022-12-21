const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        main: colors.blue[500],
        "main-hover": colors.blue[600],
        "main-dark": colors.blue[700],
        secondary: colors.gray[400],
        "secondary-hover": colors.gray[500],
        "secondary-dark": colors.gray[600],
        allowed: colors.green[400],
      },
      backgroundColor: {
        allowed: colors.green[500],
        "allowed-dark": colors.green[600],
        "flagged-light": colors.amber[100],
        flagged: colors.amber[500],
        "flagged-dark": colors.amber[600],
        "hidden-light": colors.red[100],
        hidden: colors.red[500],
        "hidden-dark": colors.red[600],
      },
      textColor: {
        secondary: colors.gray[400],
      },
      borderColor: {
        main: colors.gray[200],
        mantine: colors.gray[300],
      },
      keyframes: {
        "slide-from-top": {
          "0%": { transform: "translateY(100%)", opacity: "0%" },
          "100%": { transform: "translateY(0%)", opacity: "100%" },
        },
      },
      animation: {
        slide: "slide-from-top 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
