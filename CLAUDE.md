# CLAUDE.md

Guidance for working in this repository. This is an [Astro](https://astro.build)
static site for the Samana Sevana monastery, edited through
[Pages CMS](https://pagescms.org).

## Commands

- `pnpm dev` / `pnpm start` — local dev server
- `pnpm build` — generate PDFs, run `astro check`, then build (`scripts/generate-pdfs.js`)
- `pnpm preview` — preview the production build
- `pnpm format` / `pnpm format:check` — Prettier

## Internationalisation (i18n)

The site ships in **five languages**: `en` (English, default), `es` (Español),
`pt` (Português), `zh` (中文), `vi` (Tiếng Việt). English is the source of truth;
**anything not yet translated falls back to English automatically**.

### Where things live

| Concern | Location | Notes |
| --- | --- | --- |
| Language list | `src/i18n/config.ts` | `languages` map + `defaultLang`/`locales`. **Single source of truth** — adding one line here registers a new language. |
| URL / path helpers | `src/i18n/utils.ts` | `getLangFromUrl`, `localizedPath`, `stripLangPrefix`, `i18nStaticPaths`. |
| Content fallback logic | `src/i18n/content.ts` | `getLocalizedCollection`, `getLocalizedDoc`, `getLocalizedData`, `getLocalizedPostPaths`. |
| UI chrome strings | `src/i18n/ui.ts` | Headings, buttons, labels — in **code, not CMS**. English keys are the source of truth; missing keys fall back to English. |
| Page content | `src/content/` | Edited via Pages CMS (see below). |
| Pages | `src/pages/[...lang]/` | One authored page per route, rendered once per language. |

### Routing

URLs use a single `[...lang]` rest-param tree (`src/pages/[...lang]/`). English
is served at the **root** (`/faq`); every other language is **prefixed**
(`/es/faq`, `/zh/faq`). Simple pages share `i18nStaticPaths()`; post routes like
`[...lang]/teachings/writings/[slug].astro` use `getLocalizedPostPaths()`.

The default-locale param is `undefined` (root) — i.e. `{ lang: lang === defaultLang ? undefined : lang }`.

### Content layout

Content is organised **folder-per-language** because Pages CMS has no native i18n yet:

- **Content collections** (markdown): per-language subfolders, e.g.
  `src/content/faq/en/`, `src/content/faq/es/`. An entry's slug is prefixed with
  its language (`en/01-foo`); `baseSlug()` strips the prefix to get the stable
  cross-language identity.
- **Data collections** (YAML): one file per language, named `<lang>.yml`, e.g.
  `src/content/navigation/en.yml`, `src/content/events/es.yml`.

Fallback is **per-document**: list pages fall back silently; single-doc pages and
posts show an amber "not translated yet" notice when serving the English fallback.

### Language switcher

`src/components/LanguageSwitcher.astro` renders the dropdown shown in the header
(English / Español / Português / 中文 / Tiếng Việt). It:

- iterates `locales` from `config.ts` and labels each with `languages[code]`,
- builds each link with `localizedPath(currentPath, code)` so switching language
  **stays on the current page**,
- marks the active language with `aria-current`.

The navbar itself (`src/components/Header.astro`) is language-aware: it reads
`navigation/<lang>.yml`. Translated labels are fine, but **hrefs must stay
identical to `en.yml`** so links resolve.

### Pages CMS (`.pages.yml`)

`.pages.yml` is the Pages CMS config. Since the CMS has no i18n feature, **each
collection is exposed once per language** as a separate entry labelled
`"<Name> — <Language>"` (e.g. `FAQ — Español`). YAML anchors (`&nav_fields` /
`*nav_fields`) share field definitions across the five language entries so they
don't repeat. When adding a new content type, add all five language entries and
reuse an anchor for the shared `fields`.

### Adding a language

1. Add one line to `languages` in `src/i18n/config.ts`.
2. Translate the strings in `src/i18n/ui.ts`.
3. Create the content folders (`src/content/<collection>/<code>/`) and/or
   `<code>.yml` data files.
4. Add the matching `"<Name> — <Language>"` entries in `.pages.yml`.

> The `es`/`pt`/`zh`/`vi` strings in `src/i18n/ui.ts` are first-pass translations
> flagged for native-speaker review, especially Dhamma-specific terms.

### PDFs and CJK fonts

PDFs generate per-language into `public/pdfs/<lang>/` via `scripts/generate-pdfs.js`
(renderer: **md-to-pdf**, Chromium/Puppeteer). A Linux build host **must have a CJK
font installed** (e.g. `fonts-noto-cjk`) or `zh` PDFs render blank. macOS works via
"Heiti SC"/"Songti SC" ("PingFang SC" is a `.ttc` Chromium can't load). `pnpm` needs
`puppeteer` in `onlyBuiltDependencies` to download Chromium.
