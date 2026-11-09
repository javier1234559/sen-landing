/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Maison Neue Medium", "Be Vietnam Pro", "sans-serif"],
        display: ["Maison Neue Black", "Be Vietnam Pro", "sans-serif"],
        extended: ["Maison Neue Extended", "Be Vietnam Pro", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
      },
      typography: ({ theme }) => ({
        sen: {
          css: {
            "--tw-prose-body": "#101b45",
            "--tw-prose-headings": "#182ba0",
            "--tw-prose-links": "#182ba0",
            "--tw-prose-bold": "#182ba0",
            "--tw-prose-bullets": "#182ba0",
            "--tw-prose-counters": "#182ba0",
            maxWidth: "none",
            fontFamily: theme("fontFamily.sans").join(", "),
            fontSize: "1.05rem",
            lineHeight: "1.55",
            a: {
              textUnderlineOffset: "3px",
            },
            h2: {
              fontFamily: theme("fontFamily.display").join(", "),
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              marginTop: "1.75rem",
              marginBottom: "0.55rem",
              fontSize: "clamp(1.15rem, 1.5vw, 1.45rem)",
              lineHeight: "1.3",
            },
            h3: {
              fontFamily: theme("fontFamily.display").join(", "),
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              marginTop: "1.2rem",
              marginBottom: "0.4rem",
              fontSize: "1.05rem",
              lineHeight: "1.35",
            },
            "h2:first-child, h3:first-child, p:first-child, ul:first-child": {
              marginTop: "0",
            },
            img: {
              marginTop: "1rem",
              marginBottom: "1rem",
              borderRadius: "0",
              width: "100px",
              height: "100px",
              objectFit: "contain",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
