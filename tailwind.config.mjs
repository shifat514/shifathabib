/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        jersey: ["jersey", "monospace"],
        spacemono: ["spacemono", "ui-monospace", "Menlo", "monospace"],
        spacemono_bold: ["spacemono_bold", "ui-monospace", "Menlo", "monospace"],
      },
      colors: {
        background: "#092537",
        surface: "#081f2d",
        accent: "#A6EC61",
        "accent-dim": "#6b9e3f",
        chrome: "#476272",
        chromeIcon: "#506d7f",
        ink: "#f8f8f8",
        muted: "#d2d2d2",
        faint: "#9aa8a0",
        string: "#67e8f9",
        path: "#c084fc",
      },
      fontSize: {
        display: ["clamp(2.5rem, 6vw, 4rem)", { lineHeight: "1.1" }],
        h1: ["clamp(1.9rem, 4vw, 2.6rem)", { lineHeight: "1.2" }],
        h2: ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.3" }],
        body: ["0.9375rem", { lineHeight: "1.7" }],
        small: ["0.8125rem", { lineHeight: "1.6" }],
      },
    },
  },
  plugins: [],
};
