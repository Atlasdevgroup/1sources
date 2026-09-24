# Redirect Map

**Status:** Ready for launch review. Every redirect is a **301 (permanent)**, points straight at its final destination, and never passes through a second hop.
**Implementation:** `vercel.json → redirects`, which is the source of truth. `public/_redirects` (Netlify/Cloudflare) and `public/.htaccess` (Apache) carry the same map for portability.

## Principles

1. **Keep URLs that already have equity and that we can still use as they are:** `/`, `/about-us/`, `/contact-us/`, `/privacy-policy/` and `/terms-conditions/`. Renaming them to `/about/` or `/contact/` gains nothing and costs a redirect hop, so the short forms redirect *to* the existing URLs instead.
2. **Retire URLs whose page no longer exists,** and send each one to the page that answers the same intent. Never send them all to the homepage.
3. **No chains.** The old legacy redirects (`/product-sourcing/ → /services/product-sourcing/`) have been re-pointed at their final targets.
4. **Trailing slashes throughout** (`trailingSlash: "always"`), matching the current indexed URLs.
5. **Fragments** (`#product-sourcing`) aren't sent to the server, so redirects target the page. The anchor ids are kept inside the pages for internal links.

## Current site URLs → new site

| # | Old URL | New URL | Type | Reason |
|---|---|---|---|---|
| 1 | `/` | `/` | Keep | Homepage |
| 2 | `/about-us/` | `/about-us/` | Keep | Indexed; slug still correct |
| 3 | `/contact-us/` | `/contact-us/` | Keep | Indexed; slug still correct |
| 4 | `/privacy-policy/` | `/privacy-policy/` | Keep | Legal |
| 5 | `/terms-conditions/` | `/terms-conditions/` | Keep | Legal |
| 6 | `/services/` | `/capabilities/` | 301 | Services reframed as distributor capabilities |
| 7 | `/services/product-sourcing/` | `/capabilities/` | 301 | Section `#product-sourcing` |
| 8 | `/services/distribution-services/` | `/capabilities/` | 301 | Section `#fulfillment` |
| 9 | `/services/inventory-management/` | `/capabilities/` | 301 | Section `#account-management` |
| 10 | `/services/brand-finder/` | `/brands/` | 301 | Brand access now lives on the brands page |
| 11 | `/blog/` | `/insights/` | 301 | Editorial rename |
| 12 | `/unlock-the-potential-of-your-wholesale-business-with-1sources/` | `/insights/how-to-choose-a-wholesale-distributor/` | 301 | Rewritten as a genuine buyer's guide on the same theme |

## Legacy WordPress paths (re-pointed, no chains)

| Old URL | New URL |
|---|---|
| `/home/` | `/` |
| `/about/` | `/about-us/` |
| `/contact/` | `/contact-us/` |
| `/terms/` | `/terms-conditions/` |
| `/privacy/` | `/privacy-policy/` |
| `/distribution-services/` | `/capabilities/` |
| `/product-sourcing/` | `/capabilities/` |
| `/inventory-management/` | `/capabilities/` |
| `/brand-finder/` | `/brands/` |
| `/services/:path*` (any other) | `/capabilities/` |
| `/blog/:path*` | `/insights/` |
| `/category/:path*` | `/insights/` |
| `/author/:path*` | `/insights/` |
| `/feed/` and `/comments/feed/` | `/insights/` |

## Convenience aliases (new; 301)

These catch URLs that people type or that other sites are likely to link to.

| Alias | Target |
|---|---|
| `/about/` | `/about-us/` |
| `/contact/` | `/contact-us/` |
| `/apply/`, `/account/`, `/new-account/`, `/wholesale-account/` | `/open-account/` |
| `/services/` | `/capabilities/` |
| `/blog/` | `/insights/` |
| `/brands-we-carry/` | `/brands/` |
| `/manufacturers/`, `/for-brands/` | `/brand-partners/` |
| `/for-retailers/`, `/buyers/` | `/retailers/` |

## New URLs (no predecessor)

`/categories/`, `/categories/{health-beauty, personal-care, household, food-grocery, toys-games, apparel, footwear, electronics, general-merchandise, seasonal-closeouts}/`, `/brands/`, `/capabilities/`, `/retailers/`, `/brand-partners/`, `/insights/`, `/insights/{slug}/`, `/faq/`, `/open-account/`, `/open-account/success/` (noindex), `/accessibility/`.

## Pre-launch checklist

- [ ] Crawl the live WordPress site with Screaming Frog, including the `/wp-content/uploads/` media URLs, and diff it against this table.
- [ ] Export GSC → Indexing → Pages (indexed) and GSC → Links → Top linked pages. Add any URL that's missing here.
- [ ] If a backlink points at a media file (a PDF or image), keep the file at the same path under `public/`.
- [ ] After deploy, run `npm run check:redirects -- https://<preview-url>`. It asserts that every row returns exactly one 301 followed by a 200.
- [ ] After DNS cut-over, submit `https://1sources.com/sitemap-index.xml` in GSC and Bing Webmaster Tools. Use URL Inspection on the five most important old URLs.
- [ ] Monitor GSC → Pages → Not found (404) weekly for 8 weeks and add redirects for any stragglers.
