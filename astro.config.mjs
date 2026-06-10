// @ts-check
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";
import { SITE_URL } from "./src/consts";

// Unique base slugs (language folder stripped) for a content collection, read
// from disk so legacy redirects stay in sync as documents are added/removed.
/** @param {string} collection */
function baseSlugs(collection) {
  const dir = path.resolve("src/content", collection);
  const slugs = new Set();
  for (const lang of fs.readdirSync(dir)) {
    const langDir = path.join(dir, lang);
    if (!fs.statSync(langDir).isDirectory()) continue;
    for (const file of fs.readdirSync(langDir)) {
      if (/\.mdx?$/.test(file)) slugs.add(file.replace(/\.mdx?$/, ""));
    }
  }
  return [...slugs];
}

// The old Reflections / Dhamma / Translations pages were merged into a single
// Teachings section. Redirect the legacy URLs (and their language-prefixed
// variants) so existing links and bookmarks keep working. Translation docs
// moved to /teachings/translations/* and reflection ("writings") docs to
// /teachings/writings/*.
/** @type {Record<string, string>} */
const redirects = {};
const translationSlugs = baseSlugs("translation");
const writingSlugs = baseSlugs("reflection");
for (const prefix of ["", "/es", "/pt", "/zh", "/vi"]) {
  redirects[`${prefix}/reflections`] = `${prefix}/teachings/talks`;
  redirects[`${prefix}/dhamma`] = `${prefix}/teachings`;
  redirects[`${prefix}/translations`] = `${prefix}/teachings/translations`;
  for (const slug of translationSlugs) {
    redirects[`${prefix}/translations/${slug}`] =
      `${prefix}/teachings/translations/${slug}`;
  }
  for (const slug of writingSlugs) {
    redirects[`${prefix}/dhamma/${slug}`] =
      `${prefix}/teachings/writings/${slug}`;
  }
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  redirects,
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
