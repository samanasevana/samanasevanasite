import { defaultLang, isLang, locales, type Lang } from "./config";
import { ui, type UIKey } from "./ui";

// Pull the active language out of a URL pathname.
//   /faq        -> "en"   (default locale lives at the root)
//   /es/faq     -> "es"
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split("/");
  return isLang(first) ? first : defaultLang;
}

// Normalise a route param (the [...lang] segment) into a real language.
export function toLang(param: string | undefined): Lang {
  return isLang(param) ? param : defaultLang;
}

// Returns a translation function for a language. Missing keys fall back to
// English so a partial dictionary never breaks the page.
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

// Remove a leading language prefix from a pathname, returning the path as it
// would appear for the default (English) locale.
export function stripLangPrefix(pathname: string): string {
  const segments = pathname.split("/");
  if (isLang(segments[1])) {
    segments.splice(1, 1);
    const rest = segments.join("/");
    return rest === "" ? "/" : rest;
  }
  return pathname;
}

// Build the equivalent URL for `pathname` in `targetLang`. English has no
// prefix; every other language is prefixed with its code.
export function localizedPath(pathname: string, targetLang: Lang): string {
  const base = stripLangPrefix(pathname);
  if (targetLang === defaultLang) return base;
  return base === "/" ? `/${targetLang}` : `/${targetLang}${base}`;
}

// getStaticPaths value shared by every simple [...lang] page: one entry per
// language, with the default locale rendered at the root (lang === undefined).
export function i18nStaticPaths() {
  return locales.map((lang) => ({
    params: { lang: lang === defaultLang ? undefined : lang },
    props: { lang },
  }));
}
