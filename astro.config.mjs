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

/**
 * Wrap Markdown tables in a focusable, labelled scroll region so wide tables
 * stay keyboard-accessible on small screens (WCAG 2.1.1).
 */
function rehypeTableWrap() {
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((/** @type {any} */ child) => {
      walk(child);
      if (child.type === 'element' && child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrap'], tabIndex: 0, role: 'region', ariaLabel: 'Table (scrolls horizontally)' },
          children: [child],
        };
      }
      return child;
    });
  };
  return (/** @type {any} */ tree) => walk(tree);
}

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
  markdown: { rehypePlugins: [rehypeTableWrap] },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
