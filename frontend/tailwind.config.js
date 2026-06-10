/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parch:       "#C8B99A",
        "parch-light": "#E2D5BE",
        "parch-dark":  "#B8A88A",
        sand:        "#D4C5A9",
        ink:         "#1C1510",
        "ink-mid":   "#3A2E26",
        "ink-pale":  "#6B5C4E",
        red:         "#7A1A0E",
        "red-light": "#9B2314",
        gold:        "#C4952A",
      },
      fontFamily: {
        cinzel: ["'Cinzel'", "Georgia", "serif"],
        fell:   ["'IM Fell English'", "Georgia", "serif"],
        jp:     ["'Noto Serif JP'", "serif"],
        body:   ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
