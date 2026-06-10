import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { defaultLang, isLang, locales, type Lang } from "./config";

// Content lives in per-language folders, so an entry's slug is prefixed with
// its language, e.g. "en/01-the-burning-discourse". These helpers split that
// apart.
export function entryLang(slug: string): Lang {
  const first = slug.split("/")[0];
  return isLang(first) ? first : defaultLang;
}

// The slug without its language prefix — the stable identity shared across
// every translation of the same document ("01-the-burning-discourse").
export function baseSlug(slug: string): string {
  const parts = slug.split("/");
  return isLang(parts[0]) ? parts.slice(1).join("/") : slug;
}

// Read the `slug` of a content-collection entry. The helpers below are generic
// over CollectionKey (which also includes data collections, whose entries have
// no `slug`), so we narrow through this accessor — they are only ever called
// with content collections.
function slugOf(entry: { id: string; slug?: string }): string {
  return entry.slug ?? "";
}

// All entries of a content collection for one language, falling back to the
// English version of any document that has not been translated yet. Order
// (sorting) is left to the caller.
export async function getLocalizedCollection<C extends CollectionKey>(
  name: C,
  lang: Lang,
): Promise<CollectionEntry<C>[]> {
  const all = await getCollection(name);
  const byBase = new Map<string, CollectionEntry<C>>();
  for (const entry of all) {
    if (entryLang(slugOf(entry)) === defaultLang)
      byBase.set(baseSlug(slugOf(entry)), entry);
  }
  if (lang !== defaultLang) {
    for (const entry of all) {
      if (entryLang(slugOf(entry)) === lang)
        byBase.set(baseSlug(slugOf(entry)), entry);
    }
  }
  return [...byBase.values()];
}

// A single content document (e.g. the "index" page body) in a language, with
// English fallback.
export async function getLocalizedDoc<C extends CollectionKey>(
  name: C,
  slug: string,
  lang: Lang,
): Promise<CollectionEntry<C> | undefined> {
  const all = await getCollection(name);
  const wanted = `${lang}/${slug}`;
  const fallback = `${defaultLang}/${slug}`;
  return (
    all.find((entry) => slugOf(entry) === wanted) ??
    all.find((entry) => slugOf(entry) === fallback)
  );
}

// A single data-collection entry (one file per language, named <lang>.yml) in
// a language, with English fallback. Data entries are keyed by id (the
// filename without extension, e.g. "en").
export async function getLocalizedData<C extends CollectionKey>(
  name: C,
  lang: Lang,
): Promise<CollectionEntry<C> | undefined> {
  const all = await getCollection(name);
  return (
    all.find((entry) => entry.id === lang) ??
    all.find((entry) => entry.id === defaultLang)
  );
}

// getStaticPaths value for a localized [slug] post route: every language ×
// every document, each resolved to its translation or the English fallback.
export async function getLocalizedPostPaths<C extends CollectionKey>(name: C) {
  const all = await getCollection(name);

  const baseEntries = new Map<string, CollectionEntry<C>>();
  for (const entry of all) {
    if (entryLang(slugOf(entry)) === defaultLang)
      baseEntries.set(baseSlug(slugOf(entry)), entry);
  }

  const byLangBase = new Map<string, CollectionEntry<C>>();
  for (const entry of all) {
    byLangBase.set(`${entryLang(slugOf(entry))}:${baseSlug(slugOf(entry))}`, entry);
  }

  const paths = [];
  for (const lang of locales) {
    for (const [base, fallback] of baseEntries) {
      const entry = byLangBase.get(`${lang}:${base}`) ?? fallback;
      paths.push({
        params: { lang: lang === defaultLang ? undefined : lang, slug: base },
        props: { entry, lang, base },
      });
    }
  }
  return paths;
}
