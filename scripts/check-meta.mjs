// Post-build SEO validation. Fails the build on:
// duplicate titles/descriptions, missing/extra H1, bad canonicals,
// invalid JSON-LD, noindex pages in the sitemap, and broken internal links/anchors.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const SITE = 'https://1sources.com';
const redirects = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects;

const walk = (dir) => readdirSync(dir).filter((f) => f !== 'admin').flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

const pages = walk(DIST).map((file) => {
  const html = readFileSync(file, 'utf8');
  const path = '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '').replace(/\.html$/, '/');
  const m = (re) => (html.match(re) || [])[1];
  return {
    file, path, html,
    title: m(/<title>([^<]*)<\/title>/)?.replace(/&amp;/g, '&'),
    description: m(/<meta name="description" content="([^"]*)"/),
    canonical: m(/<link rel="canonical" href="([^"]*)"/),
    robots: m(/<meta name="robots" content="([^"]*)"/) || '',
    h1s: (html.match(/<h1[\s>]/g) || []).length,
    ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1])),
    links: [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((x) => x[1].replace(/&amp;/g, '&')),
    ld: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((x) => x[1]),
  };
});

const errors = [];
const err = (p, msg) => errors.push(`${p.path}: ${msg}`);
const byPath = new Map(pages.map((p) => [p.path, p]));
const indexable = pages.filter((p) => !p.robots.includes('noindex'));

for (const key of ['title', 'description']) {
  const seen = new Map();
  for (const p of indexable) {
    if (!p[key]) { err(p, `missing ${key}`); continue; }
    if (seen.has(p[key])) err(p, `duplicate ${key} (also on ${seen.get(p[key])})`);
    seen.set(p[key], p.path);
  }
}

for (const p of pages) {
  if (p.h1s !== 1) err(p, `expected 1 <h1>, found ${p.h1s}`);
  if (!p.robots.includes('noindex') && p.canonical !== SITE + p.path) err(p, `canonical ${p.canonical} ≠ ${SITE + p.path}`);
  if (p.description && p.description.length > 170) err(p, `description is ${p.description.length} chars`);
  if (p.title && p.title.length > 65) err(p, `title is ${p.title.length} chars: "${p.title}"`);
  for (const block of p.ld) {
    try { JSON.parse(block); } catch (e) { err(p, `invalid JSON-LD: ${e.message}`); }
  }

  for (const href of p.links) {
    if (href.startsWith('#')) { if (href.length > 1 && !p.ids.has(href.slice(1))) err(p, `missing anchor ${href}`); continue; }
    if (/^(mailto:|tel:|https?:)/.test(href) && !href.startsWith(SITE)) continue;
    const url = new URL(href, SITE + p.path);
    if (url.origin !== SITE) continue;
    const target = url.pathname;
    const isRedirect = redirects.some((r) => r.source === target || r.source === target.replace(/\/$/, ''));
    if (isRedirect) { err(p, `links to redirected URL ${target}`); continue; }
    const file = join(DIST, target, target.endsWith('/') ? 'index.html' : '');
    if (!existsSync(file) && !existsSync(join(DIST, target))) { err(p, `broken link ${href}`); continue; }
    if (url.hash && url.hash.length > 1) {
      const dest = byPath.get(target);
      if (dest && !dest.ids.has(decodeURIComponent(url.hash.slice(1)))) err(p, `missing anchor ${href}`);
    }
    if (!target.endsWith('/') && !/\.[a-z0-9]+$/i.test(target)) err(p, `link without trailing slash ${href}`);
  }
}

// Sitemap must contain every indexable page and nothing else.
const sitemapFiles = readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f));
const inSitemap = new Set(sitemapFiles.flatMap((f) => [...readFileSync(join(DIST, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1].replace(SITE, ''))));
for (const p of pages) {
  const noindex = p.robots.includes('noindex');
  if (noindex && inSitemap.has(p.path)) err(p, 'noindex page is in the sitemap');
  if (!noindex && !inSitemap.has(p.path)) err(p, 'indexable page missing from sitemap');
}

if (errors.length) {
  console.error(`\n✗ SEO check failed (${errors.length}):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`✓ SEO check passed — ${pages.length} pages, ${indexable.length} indexable, ${inSitemap.size} in sitemap`);
