import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    slug: z.string().optional(),
    draft: z.boolean().default(false),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const policies = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/policies" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lead: z.string().optional(),
    slug: z.string(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { blog, policies };
