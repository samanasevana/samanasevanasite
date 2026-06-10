// Central list of every language the site supports.
// To add a language later: add one line here, create the matching content
// folders (e.g. src/content/faq/<code>/) and translate src/i18n/ui.ts.
export const languages = {
  en: "English",
  es: "Español",
  pt: "Português",
  zh: "中文",
  vi: "Tiếng Việt",
} as const;

export type Lang = keyof typeof languages;

// English is the default. It is served at the site root (e.g. /faq), while
// every other language is served under a prefix (e.g. /es/faq). Anything not
// yet translated falls back to the English version automatically.
export const defaultLang: Lang = "en";

export const locales = Object.keys(languages) as Lang[];

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && value in languages;
}
