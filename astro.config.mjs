// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';

/**
 * Pages that must stay out of the sitemap:
 * - utility pages (success, 404)
 * - categories still awaiting client confirmation (`confirmed: false`)
 */
const unconfirmedCategories = readdirSync('./src/content/categories')
  .filter((f) => f.endsWith('.md'))
  .filter((f) => /^confirmed:\s*false\s*$/m.test(readFileSync(`./src/content/categories/${f}`, 'utf8')))
  .map((f) => `/categories/${f.replace(/\.md$/, '')}/`);

const excluded = ['/open-account/success/', '/404/', ...unconfirmedCategories];

export default defineConfig({
  site: 'https://1sources.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !excluded.some((path) => page.endsWith(path)),
    }),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
