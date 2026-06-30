/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral palette for neobrutalism
        "nb-neutral": {
          "primary-soft": "#ffffff",
          "secondary-soft": "#f5f5f5",
          "tertiary-soft": "#e8e8e8",
          dark: "#1a1a1a",
          text: "#000000",
          "text-light": "#333333",
        },
        // Brand colors - punchy saturated
        "nb-brand": {
          primary: "#0052cc",
          secondary: "#ff6b6b",
          accent: "#ffd700",
          success: "#00d084",
          warning: "#ff9800",
          error: "#ff4444",
        },
        // Border color - pure black
        "nb-border": "#000000",
      },
      borderWidth: {
        nb: "2px",
        "nb-thick": "3px",
      },
      borderRadius: {
        nb: "0px",
      },
      boxShadow: {
        // Hard offset shadows - no blur
        "nb-sm": "2px 2px 0px rgba(0, 0, 0, 0.15)",
        nb: "4px 4px 0px rgba(0, 0, 0, 0.2)",
        "nb-md": "6px 6px 0px rgba(0, 0, 0, 0.25)",
        "nb-lg": "8px 8px 0px rgba(0, 0, 0, 0.3)",
        "nb-xl": "10px 10px 0px rgba(0, 0, 0, 0.35)",
        // Pressed state (negative offset)
        "nb-pressed": "inset 2px 2px 0px rgba(0, 0, 0, 0.1)",
      },
      fontWeight: {
        nb: "700",
      },
      spacing: {
        "nb-xs": "0.5rem",
        "nb-sm": "1rem",
        "nb-md": "1.5rem",
        "nb-lg": "2rem",
        "nb-xl": "3rem",
      },
      transitionDuration: {
        nb: "100ms",
        "nb-fast": "150ms",
      },
      animation: {
        "nb-press": "nbPress 100ms ease-out",
        "nb-lift": "nbLift 100ms ease-out",
      },
      keyframes: {
        nbPress: {
          "0%": {
            transform: "translateY(0px)",
            boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
          },
          "100%": {
            transform: "translateY(2px)",
            boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.15)",
          },
        },
        nbLift: {
          "0%": {
            transform: "translateY(0px)",
            boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
          },
          "100%": {
            transform: "translateY(-2px)",
            boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.25)",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
