import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

// The feed lists the English (default-locale) posts. Slugs are stored under a
// language folder ("en/<slug>"), so we keep only English entries and strip the
// prefix to build the public URL.
const isEnglish = (post) => post.slug.startsWith("en/");
const baseSlug = (post) => post.slug.replace(/^[a-z]{2}\//, "");

export async function GET(context) {
  const reflections = (await getCollection("reflection")).filter(isEnglish);
  const translations = (await getCollection("translation")).filter(isEnglish);

  const items = [
    ...reflections.map((post) => ({
      title: post.data.title,
      link: `/teachings/writings/${baseSlug(post)}/`,
    })),
    ...translations.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `/teachings/translations/${baseSlug(post)}/`,
    })),
  ];

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
