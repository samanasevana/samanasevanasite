import { defineCollection, z } from "astro:content";

const archived = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
  }),
});

const events = defineCollection({
  type: "data",
  schema: z.object({
    events: z.array(
      z.object({
        dayOfWeek: z.string(),
        date: z.string(),
        event: z.string(),
        time: z.string(),
        location: z.string(),
      }),
    ),
  }),
});

const homeSections = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    badge: z.string(),
    meta: z.string().optional(),
    tone: z.enum(["emerald", "amber", "indigo", "zinc"]),
    order: z.number(),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
  }),
});

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

const thequality = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

const navigation = defineCollection({
  type: "data",
  schema: z.object({
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      }),
    ),
  }),
});

const readings = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  archived,
  events,
  homeSections,
  navigation,
  pages,
  translation,
  reflection,
  support,
  faq,
  thequality,
  readings,
};
