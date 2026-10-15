import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Hybrid blog scaffold for Fala 2+ — not populated yet.
 * Pages still live under src/pages; migrate to collections later.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    lang: z.enum(['pl', 'en']).default('pl'),
  }),
});

export const collections = { blog };
