// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";
import { SITE_URL } from "./src/consts";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  i18n: {
    locales: ["en", "es", "pt", "zh", "vi"],
    defaultLocale: "en",
    routing: {
      // English is served at the root (/faq); other languages are prefixed
      // (/es/faq). The [...lang] pages emit the actual routes.
      prefixDefaultLocale: false,
    },
  },
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
  },
});
