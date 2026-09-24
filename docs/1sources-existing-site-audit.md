# 1Sources — Existing Site Audit

**Audited:** 24 September 2026
**Scope:** Every URL discoverable on 1sources.com, plus legacy WordPress paths that already have redirects in the repository.

## Method and limitations

The sandbox's network policy blocked direct crawling of `1sources.com`, so this audit draws on three sources:

1. **The repository (`atlasdevgroup/1sources`, commit `4db9cd4`).** A static HTML rebuild of the WordPress site, carrying the same copy, claims and URL structure. Every page was parsed for title, meta description, canonical, robots, headings, links, images, alt text and JSON-LD.
2. **Search-engine index data (retrieved 24 Sep 2026).** Google/Bing results for `site:1sources.com`, "1Sources wholesale", and the company name with Jersey City. These show the page titles actually indexed today, for example `1 Sources – Wholesale Distribution Solutions For E-commerce` and `Contact us – 1 Sources`.
3. **Third-party profiles** such as ZoomInfo that mirror on-site claims.

**Before the DNS cut-over,** re-crawl the live WordPress site with Screaming Frog or a similar tool. Export Search Console → Pages → Indexed, and export any backlink report (Ahrefs, Semrush or GSC Links). Any URL found there that isn't listed below should be added to `redirect-map.md`.

---

## Site-wide findings

| Area | Finding | Severity |
|---|---|---|
| Positioning | The indexed homepage title reads "Wholesale Distribution Solutions **For E-commerce**", and the H1 reads "Supply & Demand Solved." The company comes across as a sourcing platform for online sellers, not as a wholesale distributor with retail relationships. | High |
| Claims | Unsupported and conflicting statistics appear across pages: 17K+ "members active", 20+ years, 98% satisfaction, 350+ experts, 1,000+ clients (elsewhere 2,000+ active clients), 100,000+ products, 900+ brands and "50 states". None is sourced, and several contradict each other. See `fact-verification.md`. | Critical |
| Testimonials | Three testimonials ("Sara, Owner of Urban Goods", "Emma L, Founder of Trendy Essentials", "Michael R, Manager at Retail Solutions") read as template filler and can't be verified. | Critical — remove |
| Imagery | All photography is generic stock. Alt text states that these photos show "a 1Sources distribution facility" and "1Sources warehouse staff", which implies facilities and staff that haven't been verified. | High |
| Brand logos | The homepage marquee shows Kraft, Hasbro, Mattel, Henkel, Kenvue, J&J, Colgate-Palmolive and Orville Redenbacher's logos under "Join 1000+ Wholesale Sellers Who Succeeded With These Top Brands". This implies a relationship without stating one, and trademark logos need permission. | High |
| Service model | Four "services" (Product Sourcing, Distribution Services, Brand Finder, Inventory Management) describe 3PL-style and software-style capabilities: "real-time tracking", "centralized platform", "customizable forecasting". There's no evidence that 1Sources sells these as services. For a distributor they are features of the buying relationship, not products. | High |
| Categories | Categories are mentioned only in passing (Health & Beauty, Toys & Games, Grocery, Electronics, Household). There are no category pages, so the site has no topical surface for "wholesale [category] distributor" searches. | High |
| Conversion | The only conversion is a generic contact form ("Get Started", "Contact Us"). There's no account-application path, nothing about buyer qualification (resale certificate, business type), and no path for brands or manufacturers. | High |
| Copy | Heavy use of phrases the brief bans: *unlock*, *seamless*, *cutting-edge*, *empower*, *elevate*, *transform*, *game-changer*, *profitable empire*. The four service pages each open with the same pattern of four "benefit" headings. | Medium |
| Duplication | The same six-question FAQ block appears on /, /services/ and /contact-us/. The same "Why choose us" and "Ready to Transform" blocks repeat on nearly every page. Service FAQs restate body copy. | Medium |
| Structured data | `Organization` + `LocalBusiness` is declared with `numberOfEmployees ≥ 350`, and `sameAs` links only to Instagram. `FAQPage` is repeated on several URLs. `makesOffer` lists "Brand Finder" as a Service. These would need to change once the claims are removed. | Medium |
| Entity data | NAP (name, address, phone) is consistent: 629 Grove Street, Jersey City, NJ 07310; +1 (973) 498-8191; hello@1sources.com. The display name is inconsistent: the logo says "1Sources" but the WordPress titles use "1 Sources". The legal name isn't stated anywhere. | Medium |
| Technical | The static rebuild is clean: canonicals, trailing slashes, a sitemap, robots.txt with AI crawlers allowed, `llms.txt`, and security headers. The live WordPress site has `/category/uncategorized/` and `/home/`-style artefacts. | Low |
| Accessibility | Skip link and focus states are present. Decorative hero images are hidden correctly. Count-up animations on statistics change text content, so screen readers may announce numbers mid-animation. Carousels ("Swipe for more") rely on horizontal swipe. | Low–Medium |
| Brand identity | The logo is a gradient royal-blue "1" monogram with a navy wordmark, set in generic Inter Tight. The theme colour is #0B1F3B. Visually it's indistinguishable from SaaS templates. | Medium |

---

## URL-by-URL audit

### `/` — Home
- **Indexed title:** `1 Sources – Wholesale Distribution Solutions For E-commerce` (live). The repo has `Wholesale Distribution & Product Sourcing Company | 1Sources`.
- **Purpose:** Introduces the company and routes visitors to services and contact.
- **Useful information:**
  - Address, phone and email.
  - The categories named (Health & Beauty, Toys & Games, Grocery, Electronics, Household).
  - The idea that 1Sources sits between manufacturers/brands and resellers.
  - The idea that consolidated purchasing lets smaller buyers order from one place.
  - Brand names the company has publicly associated itself with. These need confirmation before reuse.
- **Problems:**
  - The H1 "Supply & Demand Solved." says nothing about what the company is.
  - Unverified statistics appear twice: a hero aside and a separate stat bar.
  - The trademark logo marquee is captioned with an unsupported "1000+ sellers".
  - The testimonials look fabricated.
  - The FAQ answers are generic, and "Can I track my orders in real-time? Yes!" is an unverified technology claim.
  - The CTAs point to services, not to an account.
  - Six near-identical sections are stacked in a row.
- **Decision:** **KEEP URL / REWRITE** — a full redesign on the same URL.

### `/about-us/`
- **Title:** `About 1Sources | Wholesale Distribution Company` (live: `About us – 1 Sources`).
- **Purpose:** Company background.
- **Useful information:** Jersey City headquarters, and the company's role between manufacturers and wholesalers.
- **Problems:**
  - No founding story, people, history, legal name or location detail.
  - The body copy is duplicated from the homepage.
  - The statistics are unverified.
  - The H1 is "About Us", which isn't descriptive.
- **Decision:** **KEEP URL / REWRITE.** Keep `/about-us/`: it's indexed, it's short, and changing it gains nothing. `/about/` should 301 here.

### `/services/`
- **Title:** `Wholesale Distribution & Sourcing Services | 1Sources` (live: `Services – 1 Sources`).
- **Purpose:** Overview of the four services.
- **Useful information:** The concept list: sourcing, distribution, consolidated purchasing, fulfilment.
- **Problems:**
  - The service framing doesn't match a distributor model.
  - Bullet headings are marketing slogans ("Turn Your Wholesale Business into a Profitable Empire").
  - The FAQ is duplicated.
- **Decision:** **301 REDIRECT → `/capabilities/`.** The content is rewritten there as operational capabilities.

### `/services/product-sourcing/`
- **Title:** `Wholesale Product Sourcing Services | 1Sources`.
- **Purpose:** Sourcing service page.
- **Useful information:** 1Sources sources product on behalf of buyers across beauty, toys, food and grocery, and electronics.
- **Problems:**
  - "100,000+ products" is unverified.
  - The copy is generic.
  - The FAQ restates the body.
- **Decision:** **301 REDIRECT → `/capabilities/#product-sourcing`.** A 301 can't carry a fragment reliably, so the target is `/capabilities/`, and the section keeps the `product-sourcing` id for internal links.

### `/services/distribution-services/`
- **Title:** `Wholesale Distribution Services Nationwide | 1Sources`.
- **Purpose:** Logistics service page.
- **Useful information:** Pick/pack/ship and consolidated shipments, both pending confirmation.
- **Problems:**
  - Claims "strategically located distribution and logistics centers" (plural).
  - Claims "secure drive-in loading docks" and "50 states served".
  - None of these is verified.
- **Decision:** **301 REDIRECT → `/capabilities/`** (fulfilment section).

### `/services/brand-finder/`
- **Title:** `Brand Finder | 900+ Wholesale Brands | 1Sources`.
- **Purpose:** Brand access.
- **Useful information:**
  - Named brands: OPI, Kraft, Nestlé, L'Oréal. Confirmation required.
  - Early access to promotions before a catalog goes out, if true.
- **Problems:**
  - "Brand Finder" isn't a service a buyer searches for.
  - "900+ brands" and "Find In-Demand Brands No One Else Can" are unverified.
- **Decision:** **301 REDIRECT → `/brands/`.**

### `/services/inventory-management/`
- **Title:** `Inventory Management Services for Wholesalers | 1Sources`.
- **Purpose:** Inventory service page.
- **Useful information:** Help with reorder cadence and forecasting for accounts, if the company actually offers it.
- **Problems:**
  - Reads as a software/3PL offering.
  - "98% client satisfaction" is shown as a feature statistic.
  - "Adhering to all safety standards" is vague.
- **Decision:** **301 REDIRECT → `/capabilities/`** (account management / reorder section).

### `/contact-us/`
- **Title:** `Contact 1Sources | Wholesale Distribution, Jersey City NJ` (live: `Contact us – 1 Sources`).
- **Purpose:** Contact form and NAP.
- **Useful information:**
  - NAP.
  - Response-time promise. It conflicts with itself: 48 hours on the page, one business day in the top bar.
  - Form fields.
- **Problems:**
  - The form isn't wired to any endpoint (`action="#"`).
  - The "Service of interest" select refers to the retired service model.
  - The FAQ is duplicated.
  - "Every enquiry is answered by a named specialist" is unverified.
- **Decision:** **KEEP URL / REDESIGN.** `/contact/` 301s here.

### `/blog/`
- **Title:** `Insights on Wholesale Sourcing & Distribution | 1Sources` (live: `Blog – 1 Sources`).
- **Purpose:** Article index.
- **Problems:** Holds one article and a "four topics" block.
- **Decision:** **301 REDIRECT → `/insights/`.**

### `/unlock-the-potential-of-your-wholesale-business-with-1sources/`
- **Title:** `Unlock the Potential of Your Wholesale Business | 1Sources`. Published 16 Oct 2024.
- **Purpose:** Promotional article.
- **Useful information:** The framing that margin leaks through fragmented vendors, stock and freight is worth keeping as a theme.
- **Problems:**
  - It's a sales page dressed as an article, with a root-level slug.
  - It repeats unverified numbers.
  - The title uses a banned word.
- **Decision:** **REWRITE + 301 REDIRECT → `/insights/how-to-choose-a-wholesale-distributor/`.** That's the closest search intent: evaluating a single-source supplier.

### `/terms-conditions/` and `/privacy-policy/`
- **Purpose:** Legal pages.
- **Useful information:** Reasonable structure.
- **Problems:**
  - They reference retired services.
  - The Privacy Policy mentions analytics and cookies generically.
  - Legal review is needed.
- **Decision:** **KEEP URL / REWRITE.** Content has been updated for the new form fields and analytics. **Client legal review required.** `/terms/` and `/privacy/` 301 here.

### `/404.html`
- **Decision:** **REDESIGN.** It's already `noindex`.

### Legacy WordPress paths already redirected in the repo
`/distribution-services/`, `/product-sourcing/`, `/brand-finder/`, `/inventory-management/`, `/home/`, `/about/`, `/contact/`, `/category/uncategorized/` and `/terms/`.

**Decision:** **301 REDIRECT**, pointed straight at the *final* destinations so that no redirect chain goes through `/services/*`.

### Likely WordPress artefacts to verify after a live crawl
`/wp-login.php`, `/wp-admin/`, `/feed/`, `/comments/feed/`, `/author/*`, `/2024/10/*` date archives, `/wp-content/uploads/*` media URLs and `/?p=` IDs.

**Decision:** Redirect feeds, author and date archives to `/insights/`. Allow `/wp-content/uploads/` URLs to 404 unless backlinks exist. See `redirect-map.md`.

---

## What survives the migration

- **Entity data:** NAP, the 1Sources name and the logo geometry. The palette is being moved from royal blue to charcoal and teal, which needs client approval.
- **Positioning thread:** the company sits between brands/manufacturers and professional buyers, and a single purchasing relationship reduces vendor fragmentation.
- **Category list,** extended and pending confirmation.
- **Brand names,** only once they're approved for public display.
- **Buyer segments:** wholesalers, retailers and e-commerce sellers.
- **Technical baseline:** trailing-slash URLs, security headers, AI-crawler-friendly `robots.txt` and `llms.txt`.

## What does not survive

- Every unverified statistic.
- The testimonials.
- The trademark logo marquee.
- The "platform", "real-time tracking" and "innovative technology" claims.
- The four-service structure.
- Stock images captioned as company facilities.
- The duplicated FAQ blocks.
- The "Brand Finder" naming.
