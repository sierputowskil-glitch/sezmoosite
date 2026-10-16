import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /** Publication date (UTC noon to avoid TZ off-by-one in listings). */
    date: z.coerce.date(),
    /** Filter key used on /blog/ topic chips. */
    topic: z.enum(['strategy', 'production', 'social']),
    /** Display label in meta row, e.g. STRATEGIA. */
    topicLabel: z.string().optional(),
    lang: z.enum(['pl', 'en']).default('pl'),
    draft: z.boolean().default(false),
    /** When false, page still builds at /slug/ but is omitted from /blog/ listings. */
    listed: z.boolean().default(true),
    featured: z.boolean().default(false),
    /** Deck under the H1 (was duplicated inside each MD `<article>`). */
    lead: z.string().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    heroCaption: z.string().optional(),
    /** Sidebar TOC — labels/ids for in-article anchors. */
    toc: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
    tocLabel: z.string().optional(),
    /** Override default end-of-article CTA (defaults live in BlogArticle). */
    ctaTitle: z.string().optional(),
    ctaHref: z.string().optional(),
    ctaLabel: z.string().optional(),
    showCta: z.boolean().default(true),
    readingTime: z.number().int().positive().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
  }),
});

export const collections = { blog };
