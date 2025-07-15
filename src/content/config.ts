import { defineCollection, z } from "astro:content";

const translation = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
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

const thequality = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

const readings = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { translation, reflection, support, faq, thequality, readings };
