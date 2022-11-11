const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        main: colors.blue[500],
        allowed: colors.green[400],
      },
      backgroundColor: {
        flagged: colors.amber[100],
        hidden: colors.red[100],
      },
      textColor: {
        secondary: colors.gray[400],
      },
      borderColor: {
        main: colors.gray[200],
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
