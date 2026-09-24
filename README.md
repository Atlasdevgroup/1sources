# 1sources.com

The website for **1Sources**, a wholesale distributor based in Jersey City, New Jersey.

The site is built with [Astro](https://astro.build) as a fully static site: plain HTML with almost no JavaScript. It deploys to Vercel.

| | |
|---|---|
| Research, strategy and decisions | [`docs/`](docs/) |
| Business facts (name, address, phone, terms) | [`src/data/company.json`](src/data/company.json) |
| Categories, articles, brands, FAQ, legal pages | [`src/content/`](src/content/) |
| Design tokens | [`src/styles/tokens.css`](src/styles/tokens.css) · documented in [`docs/design-system.md`](docs/design-system.md) |

## Develop

Requires Node 22.12+.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # builds to dist/ and runs the SEO checks (fails on problems)
npm run preview    # serve the built site
npm run check      # TypeScript / Astro diagnostics
```

`npm run build` runs `scripts/check-meta.mjs` after the build. It fails if any of these are true:

- Two indexable pages share a title or description.
- A page doesn't have exactly one `<h1>`.
- A canonical URL is wrong.
- A JSON-LD block is invalid.
- An internal link or anchor is broken, or points at a redirected URL.
- The sitemap and `noindex` pages disagree.

## Deploy (Vercel)

Import the repository in Vercel. `vercel.json` already sets the framework (Astro), build command, output directory, trailing slashes, redirects, caching and security headers.

**Environment variables** (Project → Settings → Environment Variables):

| Variable | Purpose |
|---|---|
| `PUBLIC_FORM_ENDPOINT` | URL that receives form submissions as JSON: a CRM webhook, HubSpot/Zapier/Make webhook, Formspree or Basin. **Until this is set, forms do not send.** Instead they tell the visitor so and offer a pre-filled email. |
| `PUBLIC_GTM_ID` | Google Tag Manager container ID (`GTM-XXXXXXX`). Without it, no tracking scripts load. |

**Before pointing the domain at Vercel:**
1. Work through the launch checklist in [`docs/redirect-map.md`](docs/redirect-map.md). It covers crawling the old site and diffing its URLs.
2. Run `npm run check:redirects -- https://<preview-url>`. Every legacy URL must return one 301 followed by a 200.
3. After DNS moves, submit `https://1sources.com/sitemap-index.xml` in Google Search Console and Bing Webmaster Tools.

`public/_redirects` (Netlify/Cloudflare) and `public/.htaccess` (Apache) mirror the Vercel redirects, in case the site is ever hosted elsewhere.

## Editing content

### In the browser (CMS)

`https://1sources.com/admin/` runs [Sveltia CMS](https://github.com/sveltia/sveltia-cms), a git-based editor. Editors sign in with a GitHub account that has write access to this repository. Every save becomes a commit to `main`, which Vercel deploys in about a minute.

The CMS can edit:

- **Company information:** legal name, address, phone, WhatsApp, hours, response time, social profiles, D-U-N-S, account terms.
- **Categories**, **Insights** (articles), **Brands**, **FAQ** and the **legal pages**.

The CMS configuration lives in [`public/admin/config.yml`](public/admin/config.yml).

### In the code

| To change… | Edit |
|---|---|
| Company facts | `src/data/company.json`. Leave a value `null` until it's confirmed; the site hides empty values and never shows placeholders. |
| A category | `src/content/categories/<slug>.md`. `confirmed: false` keeps the page out of search engines and the sitemap. |
| Brands | `src/content/brands/brands.yaml`. Only `publicDisplay: true` brands appear. |
| FAQ | `src/content/faqs/faqs.yaml` |
| An article | `src/content/insights/<slug>.md` |
| Navigation | `primaryNav` in `src/config/site.ts` |

### Content rules

These come from the fact-verification process in `docs/fact-verification.md`:

- Publish only facts that are confirmed. Don't publish invented statistics, testimonials, certifications or "authorized distributor" claims.
- Name a brand only once the company has confirmed it may.
- Articles are credited to "1Sources Editorial Team" unless a named person has agreed to be the author. Cite sources for external facts.

## Forms and leads

The account application (`/open-account/`) and contact form (`/contact-us/`) post a typed `Lead` object (`src/lib/leads.ts`) as JSON to `PUBLIC_FORM_ENDPOINT`. The same shape is intended to map to a CRM contact and company, and later to a QuickBooks customer once an account is approved. The website itself never talks to QuickBooks.

Forms work without JavaScript through a `mailto:` fallback. With JavaScript they also get:

- Accessible validation with an error summary
- UTM capture
- A honeypot field against spam bots
- Analytics events

## Analytics

`src/scripts/analytics.ts` is a single delegated listener. Elements declare events in markup:

```html
<a href="/open-account/" data-event="open_account_click" data-event-location="hero">
```

Events are pushed to `window.dataLayer`. In GTM, create GA4 event tags triggered by custom events. The full event list is in `docs/site-strategy.md` §12.

**Key conversions:** `account_form_success` and `contact_form_success`. These fire only after a successful submission to the endpoint.

## Brand assets

`npm run assets:brand` regenerates the Open Graph image, favicons and app icons from the logo geometry, using Playwright/Chromium.

## Project structure

```
src/
  config/site.ts        entity config (reads src/data/company.json) + navigation
  content.config.ts     content collection schemas
  content/              categories, insights, brands, faqs, pages
  components/           layout (header, footer), ui primitives, home sections, forms
  layouts/Base.astro    <head>, metadata, JSON-LD, header/footer
  lib/                  seo (metadata + schema), leads (form data model), format
  pages/                routes (file-based)
  scripts/              analytics, forms (client-side, progressive enhancement)
  styles/               tokens, global, forms
scripts/                build checks, redirect checker, brand asset generator
docs/                   audit, competitive analysis, strategy, design system, facts, redirects
```
