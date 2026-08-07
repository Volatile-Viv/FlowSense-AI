/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#070A12",
        surface: "#0E1424",
        "surface-elevated": "#141C33",
        "surface-border": "rgba(255, 255, 255, 0.12)",
        glass: {
          bg: "rgba(14, 20, 36, 0.7)",
          border: "rgba(255, 255, 255, 0.12)",
          glow: "rgba(6, 182, 212, 0.2)"
        }
      },
      fontFamily: {
        sans: ["Outfit", "-apple-system", "BlinkMacSystemFont", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
