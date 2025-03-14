import { defineCollection, z } from "astro:content";

const translation = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

const dhamma = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

const support = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

const faq = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { translation, dhamma, support, faq };
