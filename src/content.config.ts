import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string(), a: z.string() });

/**
 * Categories — one Markdown file per wholesale category.
 * `confirmed: false` renders the page with noindex and keeps it out of the
 * sitemap until the client confirms the category (docs/fact-verification.md).
 */
const categories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string().max(165),
    order: z.number(),
    confirmed: z.boolean(),
    /** Short line used in the category ledger and mega-menu. */
    summary: z.string(),
    /** Two-sentence plain definition — the answer-engine lead. */
    definition: z.string(),
    subcategories: z.array(z.object({ name: z.string(), note: z.string().optional() })),
    buyers: z.array(z.string()),
    considerations: z.array(z.object({ title: z.string(), body: z.string() })),
    leadTime: z.string().nullable().default(null),
    faqs: z.array(faq),
    related: z.array(reference('categories')),
    insights: z.array(reference('insights')).default([]),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string().max(165),
    deck: z.string(),
    topic: z.enum([
      'Wholesale Buying',
      'Supplier Evaluation',
      'Distribution',
      'Ecommerce',
      'Category Guides',
      'Inventory Strategy',
      'Retail Operations',
    ]),
    author: z.string().default('1Sources Editorial Team'),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    relatedCategories: z.array(reference('categories')).default([]),
    cta: z.enum(['account', 'brand', 'contact']).default('account'),
    sources: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

const brands = defineCollection({
  loader: file('./src/content/brands/brands.yaml'),
  schema: z.object({
    name: z.string(),
    categories: z.array(reference('categories')),
    featured: z.boolean().default(false),
    /** Only brands the client has approved for public display are rendered. */
    publicDisplay: z.boolean().default(false),
  }),
});

const faqs = defineCollection({
  loader: file('./src/content/faqs/faqs.yaml'),
  schema: z.object({
    group: z.enum(['Accounts', 'Ordering', 'Shipping', 'Brands & manufacturers', 'About 1Sources']),
    q: z.string(),
    a: z.string(),
    order: z.number(),
  }),
});

/** Standard content pages (legal, accessibility) — Markdown with a shared template. */
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string().max(165),
    updated: z.coerce.date(),
  }),
});

export const collections = { categories, insights, brands, faqs, pages };
