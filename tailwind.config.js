/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
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
