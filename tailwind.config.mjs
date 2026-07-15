/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    colors: {
      ink: "#101413",
      raised: "#161B1A",
      line: "#2B3230",
      paper: "#EAE7DE",
      muted: "#98A29C",
      amber: "#E5A33F",
      transparent: "transparent",
      current: "currentColor",
    },
    fontFamily: {
      display: ["'Fraunces Variable'", "Georgia", "serif"],
      body: ["'Newsreader Variable'", "Georgia", "serif"],
      mono: ["'JetBrains Mono Variable'", "ui-monospace", "monospace"],
    },
    extend: {
      maxWidth: {
        site: "76rem",
      },
    },
  },
  plugins: [],
};
