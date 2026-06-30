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
          50: "#ECF7F3",
          100: "#D0EBE2",
          200: "#A3D8C7",
          300: "#6CC2A9",
          400: "#3FA98C",
          500: "#1F8A70",
          600: "#176B5A",
          700: "#145948",
          800: "#11463A",
          900: "#0D372D"
        },
        warm: {
          50: "#FAFBFC",
          100: "#F5F7F8",
          200: "#EEF1F3",
          300: "#E5E7EB",
          400: "#D1D5DB",
          500: "#9CA3AF",
          600: "#6B7280",
          700: "#4B5563",
          800: "#374151",
          900: "#1F2937"
        },
        cream: {
          DEFAULT: "#F5F7F8",
          light: "#FAFBFC",
          dark: "#E5E7EB"
        },
        pebble: {
          100: "#F5F7F8",
          200: "#E5E7EB",
          300: "#D1D5DB"
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
          "radial-gradient(circle at top, rgba(31,138,112,0.14), transparent 30%), linear-gradient(to bottom, rgba(255,255,255,1), rgba(245,247,248,1))"
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        serif: ["var(--font-poppins)", "system-ui", "sans-serif"]
      },
      maxWidth: {
        "8xl": "1200px"
      }
    }
  },
  plugins: []
};

export default config;
