# Fact Verification Register

Each business claim found on the current site, or needed by the new one, is sorted into one of three statuses:

- **VERIFIED:** Consistent across the site, search indexes and third-party profiles, and low-risk. Safe to publish, though the client should still confirm.
- **CLIENT CONFIRMATION REQUIRED:** Plausible and possibly true, but no evidence has been seen. It **is not published** on the new site, or is published only in neutral wording, until the client confirms. Where the site needs the value, it's stored as `null` in `src/config/site.ts` or the content collections, and the component that would show it renders nothing.
- **REMOVE:** Unsupported, contradictory, fabricated-looking or legally risky. Excluded from the new site.

A claim moves to VERIFIED only when the client supplies evidence: a document, a registration number, written brand approval or similar. Record who confirmed each item and when in the last column.

## Company identity

| Claim | Where found | Status | Notes / how it's handled | Confirmed by / date |
|---|---|---|---|---|
| Display name "1Sources" | Logo, schema | VERIFIED | Used everywhere. The WordPress titles use "1 Sources", so standardise on **1Sources**. | |
| Legal entity name | Not found | CLIENT CONFIRMATION REQUIRED | `legalName: null` in site config. Needed for the footer, Terms, schema and marketplace verification. | |
| Address: 629 Grove Street, Jersey City, NJ 07310 | Site, search index, ZoomInfo | VERIFIED (publicly stated) | Published as the business address. **Confirm:** is it an office, a warehouse, or a mailing address? The site doesn't describe it as a facility. | |
| Phone: +1 (973) 498-8191 | Site, search index | VERIFIED (publicly stated) | Published. | |
| Email: hello@1sources.com | Site, search index | VERIFIED (publicly stated) | Published. | |
| Instagram: instagram.com/1sources | Site footer | CLIENT CONFIRMATION REQUIRED | Is the account active and owned by the company? Hidden from `sameAs` until confirmed. | |
| LinkedIn company page | Not found | CLIENT CONFIRMATION REQUIRED | `social.linkedin: null`. | |
| WhatsApp Business number | Not found | CLIENT CONFIRMATION REQUIRED | `whatsapp: null`. The WhatsApp UI stays hidden until this is set. | |
| "Headquartered in Jersey City" | Site | VERIFIED (publicly stated) | Worded as "based in Jersey City, New Jersey". | |
| Business hours | Not found | CLIENT CONFIRMATION REQUIRED | `hours: null`. Needed for LocalBusiness and GBP. | |

## Scale and history

| Claim | Where found | Status | Notes |
|---|---|---|---|
| "20+ years of experience" | Home, About, llms.txt | CLIENT CONFIRMATION REQUIRED | Unclear whether this is company age or combined staff experience. Not published. `yearEstablished: null`. |
| "17K+ members active" | Home hero, stat bar | REMOVE | "Members" doesn't fit a distributor model and contradicts the client counts. |
| "98% client satisfaction" | Home, About, Inventory page | REMOVE | No survey methodology. |
| "350+ expert team / specialists" | Home, About, schema `numberOfEmployees` | REMOVE (pending evidence) | Also sits in JSON-LD. Removed from schema. |
| "1,000+ clients / wholesale sellers" | Home, About, Brand Finder | CLIENT CONFIRMATION REQUIRED | Contradicted by the "2,000+ active clients" in the search index. |
| "2,000+ active clients" | Search index snippet (live WP) | REMOVE | Contradicts the figure above. |
| "100,000+ products" | Product Sourcing, llms.txt, meta | CLIENT CONFIRMATION REQUIRED | Is this active SKUs or reachable SKUs? Not published. |
| "900+ trusted brands" | Brand Finder, meta, llms.txt | CLIENT CONFIRMATION REQUIRED | Not published. `/brands/` shows only approved names. |
| "50 states served / nationwide" | Distribution page | CLIENT CONFIRMATION REQUIRED | "Serving buyers across the United States" is used as *intent* wording only. `serviceArea` is set to `null` until confirmed. |
| Sales volume / revenue | — | — | Not claimed and not published. |

## Operations and capabilities

| Claim | Where found | Status | Notes |
|---|---|---|---|
| "Strategically located distribution and logistics centers" (plural) | Distribution page | REMOVE (pending evidence) | Implies several facilities. Not published. |
| "Secure drive-in loading docks" | Distribution page | CLIENT CONFIRMATION REQUIRED | Not published. |
| Pick, pack and ship fulfilment | Distribution page | CLIENT CONFIRMATION REQUIRED | Wording in the new site: "orders are picked, packed and shipped to your receiving location or fulfillment center". **Confirm.** |
| Consolidated purchasing: one PO across many brands | Distribution page, article | CLIENT CONFIRMATION REQUIRED | This is the core distributor value, and the new site relies on it. **Priority confirmation.** |
| Shipping to Amazon FBA / Walmart WFS prep centers | Not stated | CLIENT CONFIRMATION REQUIRED | The ecommerce buyer copy says "ship to your warehouse or prep center". **Confirm.** |
| "Real-time order tracking" | FAQ, service copy | REMOVE | No portal exists. Replaced with "tracking numbers / BOL shared on shipment", which is standard practice. **Confirm.** |
| "Centralized platform / innovative technology" | Home, About | REMOVE | No platform exists. |
| Inventory forecasting as a service | Inventory page | REMOVE | Reframed as "reorder planning with your account manager". **Confirm.** |
| "Adhering to all safety standards" | Inventory page | REMOVE | Vague. |
| "Early access to promotions before catalog distribution" | Brand Finder | CLIENT CONFIRMATION REQUIRED | The new site says "account holders receive offer lists". **Confirm the cadence** (weekly or ad hoc). |
| "Reply within 48 hours" vs "one business day" | Contact page vs top bar | CLIENT CONFIRMATION REQUIRED | They contradict each other. The site uses `responseTime` from config, set to **"one business day"** as a placeholder. **Confirm.** |
| "Every enquiry answered by a named specialist" | Contact page | REMOVE | |
| Dedicated account manager per account | Implied | CLIENT CONFIRMATION REQUIRED | The new site says "a named account contact". **Confirm.** |
| Minimum order quantity / minimum order value | Not stated | CLIENT CONFIRMATION REQUIRED | `accountTerms.minimumOrder: null`. The FAQ answer is phrased so that it doesn't invent a number. |
| Payment terms (prepay, net terms after history) | Not stated | CLIENT CONFIRMATION REQUIRED | The FAQ answer is phrased so that it doesn't invent terms. |
| Resale certificate required to buy | Not stated | CLIENT CONFIRMATION REQUIRED | Standard for tax-exempt wholesale purchasing. The application form asks for status only (it doesn't collect the document). **Confirm the policy.** |
| Returns policy | Not stated | CLIENT CONFIRMATION REQUIRED | The FAQ points to the account terms. |
| Closeout / excess inventory buying from brands | Not stated | CLIENT CONFIRMATION REQUIRED | Used on the Brand Partners page as "discuss excess or discontinued inventory". **Confirm.** |

## Categories

| Category | Status | Notes |
|---|---|---|
| Health & Beauty | VERIFIED (stated repeatedly) | |
| Toys & Games | VERIFIED (stated repeatedly) | |
| Food & Grocery | VERIFIED (stated repeatedly) | |
| Electronics | VERIFIED (stated in FAQ and contact page) | |
| Household | VERIFIED (stated in contact page and Brand Finder) | |
| Personal Care | CLIENT CONFIRMATION REQUIRED | In the brief's list. Overlaps with H&B, so the scope split must be defined. |
| Apparel | CLIENT CONFIRMATION REQUIRED | In the brief's list. |
| Footwear | CLIENT CONFIRMATION REQUIRED | In the brief's list. |
| General Merchandise | CLIENT CONFIRMATION REQUIRED | In the brief's list. |
| Seasonal / Closeouts | CLIENT CONFIRMATION REQUIRED | In the brief's list. |

Every category is in `src/content/categories/` with a `confirmed` flag. When `confirmed: false`, the category page renders with `noindex` and is left out of the sitemap, so it can be reviewed on staging without being published to search. The client flips the flag once confirmed.

## Brands

| Brand (as shown on current site) | Status | Notes |
|---|---|---|
| Kraft, Hasbro, Mattel, Henkel, Kenvue, Johnson & Johnson, Colgate-Palmolive, Orville Redenbacher's (logos) | CLIENT CONFIRMATION REQUIRED | **Logos removed.** Names appear only when `publicDisplay: true` in `src/content/brands/`. |
| OPI, Kraft, Nestlé, L'Oréal (named in text) | CLIENT CONFIRMATION REQUIRED | Same as above. |
| "Authorized distributor" of any brand | Never stated | REMOVE / never claim | The site never uses "authorized". The brands page footer carries a trademark disclaimer. |

## Social proof

| Claim | Status | Notes |
|---|---|---|
| Testimonials: Sara (Urban Goods), Emma L (Trendy Essentials), Michael R (Retail Solutions) | REMOVE | These look fabricated. A testimonial comes back only with a full name, company and written permission. |
| "Trusted by / join 1000+ wholesale sellers" | REMOVE | |
| Certifications, memberships, awards | None found | Nothing is published. `trust.memberships: []`. |
| DUNS number | Not found | CLIENT CONFIRMATION REQUIRED | Once supplied, it goes into the Organization schema as `duns`. |
| BBB accreditation | Not found | CLIENT CONFIRMATION REQUIRED | |

## Imagery

| Asset | Status | Notes |
|---|---|---|
| `racking-*`, `facility-aisle-*`, `operations-*`, `staff-aisle-*`, `consult-*`, `account-review-*`, `planning-*`, `team-portrait-*` | REMOVE the captions; limit use | These are stock photos. The new site uses only two people-free warehouse images, as *atmosphere*, with neutral alt text ("Pallet racking in a distribution warehouse"). They're never captioned as 1Sources facilities. Replace them with authentic photography (see `content-required.md`). |
| Brand logos in `assets/img/brands-opt/` | REMOVE from use | Kept in the repo history only. |
