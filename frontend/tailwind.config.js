/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F2EDDF",
        "parchment-dark": "#E8E0CC",
        ink: "#1A1410",
        "ink-soft": "#3D3530",
        "ink-pale": "#6B6057",
        "brush-red": "#8B1A0F",
        "aged-gold": "#B8960C",
        "aged-gold-light": "#D4AF37",
        mist: "#C8C0B0",
        surface: "#F8F4EA",
      },
      fontFamily: {
        display: ["'Noto Serif JP'", "Georgia", "serif"],
        serif: ["'Noto Serif JP'", "Georgia", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'Noto Sans Mono'", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "ink-drop": "inkDrop 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        inkDrop: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      borderRadius: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
};
