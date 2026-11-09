import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "http://localhost:4321",
  integrations: [
    mdx(),
    react(),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      include: ["gsap", "gsap/ScrollTrigger"],
    },
  },
});
