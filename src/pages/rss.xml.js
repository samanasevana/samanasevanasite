import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function GET(context) {
  const reflections = await getCollection("reflection");
  const translations = await getCollection("translation");

  const items = [
    ...reflections.map((post) => ({
      title: post.data.title,
      link: `/dhamma/${post.slug}/`,
    })),
    ...translations.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `/translations/${post.slug}/`,
    })),
  ];

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
