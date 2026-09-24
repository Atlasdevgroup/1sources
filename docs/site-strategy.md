# Site Strategy

## 1. Positioning

**One sentence (the entity statement, used verbatim in schema, `llms.txt`, About and footer):**

> 1Sources is a wholesale distributor based in Jersey City, New Jersey, supplying name-brand consumer goods to retailers, ecommerce sellers and other professional resellers across the United States.

*("across the United States" stays pending until the service area is confirmed. See `fact-verification.md`.)*

**What 1Sources is:** a wholesale distributor and jobber. It buys from brands, their distributors and other legitimate inventory sources, and resells by the case to professional buyers under one account relationship.

**What it is not:** an Amazon supplier, a dropshipper, a liquidation site, a consumer store or a software platform. Marketplace sellers are one buyer segment among several. They're served on `/retailers/` and never define the brand.

**Positioning line:** *Wholesale distribution built around relationships.* The claim is that one accountable relationship replaces a fragmented vendor list. Buyers get one account, one contact and one PO across many brands. Brands get a distributor that places product responsibly with vetted buyers.

**Competitive frame** (from `competitive-analysis.md`):

| Competitor | Position | Where 1Sources goes instead |
|---|---|---|
| L&R | Scale, heritage, 3PL and merchandising. A split marketing site and eShop. | Can't compete on heritage. Competes on clarity, responsiveness and a single coherent site. |
| SDA | HBC depth, many thin SEO pages, rep-only accounts. | Fewer, deeper category pages, and a self-serve application. |
| Regal | Marketplace-seller store, grey-market signals, no address. | Visibly legitimate: NAP, legal name, policies, and a "never claims authorization it doesn't have" posture. |

## 2. Audiences and jobs

| Audience | Arrives from | Job to be done | Primary path | Conversion |
|---|---|---|---|---|
| Independent and regional retailers (grocery, pharmacy, beauty, c-store, discount, specialty) | "wholesale [category] distributor", brand + "wholesale", referrals | Find a reliable supplier for name-brand lines; check legitimacy; understand minimums and terms | Home → Categories → Category → Open Account | **Open an Account** |
| Ecommerce and marketplace sellers | "wholesale supplier for Amazon sellers", brand + "wholesale" | Find authentic, invoiced inventory that ships to a prep center | Home or Retailers → FAQ → Open Account | **Open an Account** |
| Other wholesalers and exporters | Brand/category searches | Fill gaps and access opportunistic buys | Categories → Contact / Open Account | Open an Account / Contact |
| Brands and manufacturers | "distributor for [category] brand", LinkedIn, referrals | Judge channel discipline, reach and fit; move excess inventory | Home → For Brands → Discuss Distribution | **Discuss Distribution** (contact form, type pre-set to "Brand") |
| Verification reviewers (marketplaces, banks, brand compliance) | Direct | Confirm the company exists, what it does and how to reach it | About, Contact, footer, legal pages | n/a (trust) |
| Answer engines and crawlers | Crawl | Extract entity, services, categories and location | `llms.txt`, schema, FAQ, About | n/a |

## 3. Sitemap

```
/                                   Home
/about-us/                          About (kept URL)
/categories/                        Category index
  /categories/health-beauty/
  /categories/personal-care/        *pending confirmation (noindex until confirmed)
  /categories/household/
  /categories/food-grocery/
  /categories/toys-games/
  /categories/apparel/              *pending
  /categories/footwear/             *pending
  /categories/electronics/
  /categories/general-merchandise/  *pending
  /categories/seasonal-closeouts/   *pending
/brands/                            Brands we carry (approved names only)
/capabilities/                      How we work: sourcing, purchasing, fulfilment, account management
/retailers/                         For retailers and buyers
/brand-partners/                    For brands and manufacturers
/insights/                          Editorial index
  /insights/[slug]/
/faq/                               Buyer and brand FAQ
/contact-us/                        Contact (kept URL)
/open-account/                      Account application
/open-account/success/              Confirmation (noindex)
/privacy-policy/  /terms-conditions/  /accessibility/
/404
```

**Primary navigation:**
- About
- Categories (mega-menu)
- Brands
- Capabilities
- For Retailers
- For Brands
- Insights
- Contact
- **[Open an Account]** as a button

"Home" is carried by the logo. The brief listed it as a nav item, but a separate Home link on a corporate site is redundant, and dropping it frees horizontal space for the audience links.

**Utility bar** (desktop only): address · phone · email · "Existing customer? Call your account contact". This keeps NAP in view on every page for verification.

## 4. Conversion architecture

The hierarchy is deliberate. Not every section ends with a CTA.

| Intent | CTA copy | Destination | Where it appears |
|---|---|---|---|
| Ready buyer | **Open an Account** | `/open-account/` | Header button, hero, retailer section, category pages (end), final homepage band |
| Browsing buyer | Explore Categories | `/categories/` | Hero secondary |
| Needs a person | Talk to Our Team / Contact | `/contact-us/` | Hero tertiary text link, final band, footer |
| Brand | **Discuss Distribution** | `/contact-us/?topic=brand` | Brand section, For Brands page |
| Category-specific buyer | Request [Category] pricing | `/open-account/?category=<slug>` (pre-selects the category) | Category page side rail |
| Reader | Contextual link to the category or guide | Commercial pages | Article body and end |

**Account form** (`/open-account/`): a single page split into three labelled fieldsets, with progress shown as section numbers rather than a JS wizard, so it works without JavaScript.
1. **Your business:** company, contact, email, phone, website, address.
2. **How you sell:** business type, sales channels, categories, estimated monthly purchasing.
3. **Getting set up:** resale certificate status, how you heard about us, message.

No uploads or tax IDs are collected at this stage. Those are requested by the account team during onboarding. The events tracked are `account_form_view`, `account_form_start`, `account_form_submit`, `account_form_error` and `account_form_success`.

**Lead data model** (`src/lib/leads.ts`): a typed `Lead` object with `source`, `type` (`account_application | contact | brand_inquiry`), `utm`, `page` and `submittedAt`. It's posted as JSON to `site.forms.endpoint`. The same shape maps to a CRM contact/company, and later to a QuickBooks customer. See section 11.

## 5. SEO architecture

- **URL conventions:** lowercase, hyphenated, trailing slash. Hierarchical only where the hierarchy is real (`/categories/x/`, `/insights/x/`).
- **Metadata:** `src/lib/seo.ts` builds the title, description, canonical, OG/Twitter tags and robots from page props. The title pattern is `{Page title} | 1Sources`, and the homepage uses its own full title. The build fails if two pages share a title or description (`scripts/check-meta.mjs`).
- **Headings:** one H1 per page, which names the page's subject in plain language. For example, the H1 is "Wholesale Health & Beauty Distributor", not "Beauty".

**Structured data:**

| Page(s) | Schema |
|---|---|
| Every page | `Organization` (single `@id`, from `site.ts`), `WebSite`, `WebPage` (or subtype `AboutPage`, `ContactPage`, `CollectionPage`, `FAQPage`) |
| Pages with breadcrumbs | `BreadcrumbList` |
| Articles | `Article` with `author` = Organization (no invented people), `datePublished` / `dateModified` |
| `/faq/` only | `FAQPage` markup. Google now shows FAQ rich results mainly for authoritative government and health sites, so the markup sits on one canonical FAQ page rather than being repeated site-wide. Category FAQs are visible HTML, which answer engines still read. |
| Address data | `LocalBusiness` isn't used until the address type is confirmed. `PostalAddress` sits inside `Organization`. `WholesaleStore` implies a walk-in store, so it isn't used. |

**Explicitly excluded from schema:** ratings, reviews, prices, availability, employee counts, awards.

**Crawl files:**
- **Sitemap:** generated at build time, excluding `noindex` pages (pending categories, the success page, 404).
- **robots.txt:** allows all crawlers, including AI crawlers, and links the sitemap.
- **llms.txt:** generated from `site.ts` plus the collections, so it can't drift from the site.

**Local SEO:** NAP comes from one config object and is rendered identically in the utility bar, footer, Contact and schema. Google Business Profile, Bing Places and Apple Business Connect use the same strings (see section 9).

## 6. GEO / AEO strategy

Answer engines quote pages that state facts plainly and consistently.

- **The entity statement** appears as literal text near the top of Home and About, and in the footer. It isn't hidden in schema.
- **Definitions early:** each category page opens with a two-sentence definition of what 1Sources supplies in that category and to whom.
- **Q&A blocks:** each category page has 4–6 category-specific FAQs, such as dating on HBA, age-grading on toys, and case packs. The FAQ page answers account questions (minimums, resale certificates, payment, shipping) with explicit variables until the client supplies the numbers.
- **Articles** show an author (the 1Sources editorial team), published and updated dates, and sources for external facts.
- **Consistent naming:** always "1Sources" in one word, and always "Jersey City, New Jersey".
- **`llms.txt`** gives a curated index: entity, categories, how to open an account, contact.

## 7. Category architecture

There are ten categories. Each category is a Markdown file with frontmatter, so it can be edited in a CMS:

```yaml
title: Health & Beauty
h1: Wholesale Health & Beauty Distributor
slug: health-beauty
confirmed: true                 # false → noindex + excluded from sitemap
order: 1
summary: ...                    # index card + meta description seed
definition: ...                 # the 2-sentence answer-engine definition
subcategories: [...]
buyers: [...]                   # who buys this category from us
considerations: [{title, body}] # category-specific purchasing realities
leadTime: null                  # renders only when set
faqs: [{q, a}]
related: [personal-care, household]
insights: [slug]                # related articles
```

Body copy lives in Markdown, so the template enforces the page structure while the words stay specific to each category. The template renders the following, in order:
1. Breadcrumb
2. H1
3. Definition
4. Intro body
5. Subcategory index
6. "What to expect when buying [category] from us" (the considerations)
7. Who buys it
8. Representative brands (only approved ones)
9. Purchasing information
10. FAQ
11. Related categories
12. Related insights
13. Account CTA plus contact

## 8. Brand architecture

- `src/content/brands/brands.yaml` holds a list of `{name, categories[], featured, publicDisplay}` entries.
- `/brands/` renders **only** entries with `publicDisplay: true`. They're grouped by category and set as type rather than logos, which avoids trademark-permission issues and 100-logo walls.
- The homepage shows up to eight `featured` brands followed by "Explore all brands".
- The page footnote reads: "Brand names are trademarks of their respective owners. Their appearance indicates products 1Sources has supplied, not an authorization or endorsement unless stated."
- Individual brand pages (`/brands/[slug]/`) are deferred until the client supplies per-brand detail. Thin pages with one line each would hurt more than help.

## 9. Article architecture

**Clusters:**

| Cluster | Commercial page it supports | Seed articles |
|---|---|---|
| Wholesale buying | `/retailers/`, `/open-account/` | How to Choose a Wholesale Distributor; Wholesale Distributor vs Wholesaler vs Jobber; How Resale Certificates Work |
| Supplier evaluation | `/about-us/`, `/faq/` | How to Verify a Wholesale Distributor; What Retailers Should Look for in a Supplier |
| Ecommerce | `/retailers/` | How Wholesale Purchasing Works for Ecommerce Sellers |
| Distribution (brand side) | `/brand-partners/` | How Brands Choose Distribution Partners |
| Category guides | Each category | Wholesale Health & Beauty Buying Guide, etc. |
| Operations | `/capabilities/` | Understanding Wholesale Lead Times |

**Cadence:** 2–4 useful articles a month beats daily filler. Each article is 1,200–2,500 words, answers one real question, links to one or two commercial pages, and cites sources.

**Launch set** (written for this build):
1. How to Choose a Wholesale Distributor
2. Wholesale Distributor vs. Wholesaler vs. Jobber
3. How Resale Certificates Work for Wholesale Buyers
4. How to Verify a Wholesale Distributor Before Your First Order

## 10. Internal linking

- **Category → sibling categories:** 2–3 related. **Category → articles:** 1–3. **Category → Open Account:** with the category pre-selected. **Category → FAQ.**
- **Article → categories** mentioned in the body, **→ Retailers or Brand Partners** (one contextual CTA), **→ related articles** in the same cluster.
- **Retailers → Categories** index, FAQ, Open Account. **Brand Partners → Capabilities**, Contact (brand topic).
- **Footer:** a structured set of about 30 links, with no keyword stuffing.
- **Anchor text** describes the destination ("our health & beauty category"), never "click here" and never exact-match spam.

## 11. Technology decision

**Phase 1 audit of the repo:**
- Hand-built static HTML: 12 pages, one CSS file, one JS file, no build step, deployed to Vercel.
- The contact form isn't connected. There's no CMS and no analytics.

**Decision: [Astro](https://astro.build) 5, static output.**

- It produces static HTML by default, with **zero client JavaScript** unless a component opts in. That's ideal for Core Web Vitals and matches the current hosting (Vercel static). The migration doesn't need a server.
- **Content collections** (Markdown/YAML with a typed schema) give non-developers structured files for categories, brands, FAQs and articles.
- A git-based CMS (**Decap / Sveltia CMS** at `/admin`) can sit on top later with no server, so ordinary content edits don't need code changes. Setup is documented in `README.md`.
- A shared layout and components remove the duplicated header, footer and schema across the 12 HTML files that exist now.
- The sitemap is built by `@astrojs/sitemap`. Fonts are self-hosted through Fontsource, with no Google Fonts request.

**Rejected alternatives:**
- **Next.js:** heavier runtime, and nothing here needs React.
- **WordPress:** the site the client is leaving.
- **Staying hand-built:** 25+ pages of duplicated markup would drift, as the current claims already have.

**Future architecture:**

| Future need | How it's added |
|---|---|
| Customer login, pricing, catalog | `@astrojs/vercel` adapter in hybrid mode. Protected routes use an auth provider (Clerk or Auth.js). The marketing pages stay static. |
| CRM | The form endpoint in `site.forms.endpoint` points at a HubSpot, Pipedrive or Zoho webhook. The `Lead` shape already carries company, contact, channels, categories and volume. |
| QuickBooks | CRM → QBO customer sync (Zapier/Make or a native integration) after the account is approved. The website never talks to QuickBooks directly. |
| WhatsApp automation | The `wa.me` links become WhatsApp Business API templates through a CRM integration. |

## 12. Analytics plan

`src/scripts/analytics.ts` is one delegated listener. Elements declare `data-event="open_account_click"` and optional `data-event-*` params. Events go to `window.dataLayer`, so GTM/GA4 pick them up when `site.analytics.gtmId` is set. If it isn't set, nothing loads and no cookies are written.

**Events:**
- `open_account_click`, `contact_click`, `phone_click`, `email_click`, `whatsapp_click`
- `contact_form_start`, `contact_form_submit`
- `account_form_view`, `account_form_start`, `account_form_submit`, `account_form_error`, `account_form_success`
- `category_view`, `brand_view`, `article_view`, `article_cta_click`

**Launch checklist:**
- GSC and Bing Webmaster verification
- Sitemap submission
- GA4 key events: `account_form_success` and `contact_form_submit`
- CWV via GSC and Vercel Speed Insights
- 404 report reviewed weekly for 8 weeks
