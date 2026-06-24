import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf7",
          100: "#d5f5ea",
          200: "#abe9d5",
          300: "#74d7b8",
          400: "#42bb95",
          500: "#229978",
          600: "#1a7a62",
          700: "#175f4e",
          800: "#164d41",
          900: "#133f36"
        },
        warm: {
          50: "#FDFCFA",
          100: "#FAF8F5",
          200: "#F5F1EB",
          300: "#EDE8DF",
          400: "#D9D2C5",
          500: "#B8AFA2",
          600: "#8C8579",
          700: "#6B6560",
          800: "#3D3A36",
          900: "#1A1714"
        },
        cream: {
          DEFAULT: "#F7F4EF",
          light: "#FDFCFA",
          dark: "#EDE8DF"
        },
        pebble: {
          100: "#F0EDE8",
          200: "#E0DBD3",
          300: "#C8C2B9"
        }
      },
      boxShadow: {
        soft: "0 2px 8px rgba(15, 20, 25, 0.06)",
        card: "0 1px 4px rgba(15, 20, 25, 0.05), 0 4px 16px rgba(15, 20, 25, 0.05)",
        "card-hover": "0 4px 12px rgba(15, 20, 25, 0.08), 0 12px 32px rgba(15, 20, 25, 0.08)",
        float: "0 8px 32px rgba(15, 20, 25, 0.12)",
        nav: "0 1px 0 rgba(15, 20, 25, 0.07)"
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(34,153,120,0.14), transparent 30%), linear-gradient(to bottom, rgba(248,250,252,1), rgba(236,253,245,1))"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"]
      },
      maxWidth: {
        "8xl": "1200px"
      }
    }
  },
  plugins: []
};

export default config;
