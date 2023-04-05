const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "#4183C4",
        red: "#BD2C00",
        green: "#6CC644",
        gray: {
          light: "#999999",
          DEFAULT: "#666666",
          dark: "#333333",
        },
        github: {
          black: "#010409",
          gray: {
            light: "#7a8490",
            DEFAULT: "#161b22",
            dark: "#0d1117",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
