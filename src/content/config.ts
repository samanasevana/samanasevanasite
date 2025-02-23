import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().default("/static/blog-placeholder.png"),
  }),
});

const support = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

const faq = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

export const collections = { posts, support, faq };
