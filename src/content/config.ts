import { defineCollection, z } from "astro:content";

const translation = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

const reflection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
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

export const collections = { translation, reflection, support, faq };
