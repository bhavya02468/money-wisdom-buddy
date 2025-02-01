import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0066CC",
          light: "#3389D9",
          dark: "#004C99",
        },
        secondary: {
          DEFAULT: "#00B8D4",
          light: "#33C9E0",
          dark: "#008AA0",
        },
        accent: {
          DEFAULT: "#FF9F1C",
          light: "#FFB549",
          dark: "#CC7E16",
        },
        background: "#FFFFFF",
        surface: "#F8FAFC",
        text: {
          DEFAULT: "#1E293B",
          light: "#64748B",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "floating": "floating 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        floating: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(0, -10px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;