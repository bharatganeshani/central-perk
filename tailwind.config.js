/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f1e",
        surface: "#111827",
        border: "#1f2937",
        primary: "#06b6d4",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        navy: {
          950: "#030712",
          900: "#0a0f1e",
          800: "#111827",
          700: "#1e293b",
          600: "#334155",
        }
      },
      fontFamily: {
        mono: ["Space Mono", "JetBrains Mono", "SFMono-Regular", "monospace"],
        sans: ["DM Sans", "Geist Sans", "system-ui", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
