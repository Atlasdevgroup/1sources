# Content Required From 1Sources

This is the information the site needs before launch, or to reach its full potential. Items marked **Launch-blocking** should be answered before DNS cut-over. Everything else improves ranking, trust or conversion, and can follow.

Where each answer goes:
- **Company, contact, social, trust:** `src/config/site.ts`
- **Categories:** `src/content/categories/*.md`
- **Brands:** `src/content/brands/brands.yaml`
- **FAQs:** `src/content/faqs/*.yaml`

When a field is still unanswered it's set to `null`, and the component that would show it renders nothing. The site never displays placeholder text to visitors.

---

## 1. Company

| Item | Needed for | Priority |
|---|---|---|
| Legal entity name (e.g. "1Sources LLC") and state of formation | Footer, Terms, Organization schema, marketplace verification | **Launch-blocking** |
| Display name confirmation: **1Sources** (the old WordPress titles used "1 Sources") | Entity consistency | **Launch-blocking** |
| Year established `[YEAR ESTABLISHED]` | About page, schema `foundingDate` | High |
| What 629 Grove Street is: office, warehouse, showroom, or mailing address | About and Contact wording, Google Business Profile category | **Launch-blocking** |
| Any other operating locations (warehouses, 3PL partners) and whether they can be named | Capabilities, About | High |
| Business hours and time zone | Contact, LocalBusiness schema, GBP | High |
| Main phone confirmation, plus whether a separate sales line exists | Contact | High |
| Email routing: is hello@ monitored? Should applications go to sales@ or accounts@? | Forms, contact | **Launch-blocking** |
| WhatsApp Business number, and who answers it | WhatsApp links | Medium |
| Service territory `[SERVICE AREA]`: all 50 states, lower 48, or any export? | About, FAQ, schema `areaServed` | High |
| A one-paragraph company description in your own words: history, founders, why the company exists | About page | High |
| Leadership: names, titles, photos and short bios (optional, but a strong trust signal) | About page | Medium |
| Company timeline or milestones, only ones that are true | About page | Medium |

## 2. Categories

For each of the 10 proposed categories:

| Item | Priority |
|---|---|
| Confirm whether you actively supply it (Yes/No). The unconfirmed ones are Personal Care, Apparel, Footwear, General Merchandise and Seasonal / Closeouts. | **Launch-blocking** |
| Subcategories you actually carry | High |
| Typical inventory type: ongoing replenishment, opportunistic buys, closeouts, or seasonal | High |
| Typical lead time from PO to ship `[LEAD TIME]` | High |
| Any category-specific requirements: dating on food/HBA, hazmat restrictions, age grading on toys | Medium |
| Two or three representative brands per category that are **approved for public display** | High |
| A photograph of the product in your possession: cases, pallets, shelves | Medium |

## 3. Brands

| Item | Priority |
|---|---|
| The complete list of brands you supply | High |
| Of those, which may be **named publicly** (Yes/No per brand) | **Launch-blocking** for the brands page |
| Which are priority or "featured" brands (6–12) | High |
| Relationship status per brand: direct from the brand, via the brand's distributor, or secondary market. This stays internal; the site never claims "authorized" unless you confirm it in writing. | High |
| Brand logos you have written permission to use (optional) | Low |

## 4. Customers and accounts

| Item | Priority |
|---|---|
| Buyer types you accept: independent retail, chains, pharmacy, grocery, c-store, beauty, discount, ecommerce/marketplace sellers, other wholesalers, exporters | **Launch-blocking** |
| Account requirements: resale certificate, EIN, business license, trade references | **Launch-blocking** |
| Minimum order (value or cases) `[MINIMUM ORDER]` | High |
| Payment methods and terms: prepay, ACH, wire, card, net terms after history | High |
| Typical approval time for a new account | High |
| Whether you ship to Amazon FBA / Walmart WFS prep centers | High |
| Whether you sell internationally/export | Medium |
| How pricing is shared: price lists, offer sheets, quotes, a portal in future | High |

## 5. Operations

| Item | Priority |
|---|---|
| Shipping methods: LTL, FTL, parcel, customer pickup, and who books freight | High |
| Ship-from location(s) | High |
| Order process: offer sheet → PO → invoice → payment → ship? | High |
| Tracking and documentation shared: BOL, tracking numbers, invoices, packing lists | Medium |
| Returns, shortages and damages policy | High |
| Account management: does each account get a named rep? | High |
| Response-time promise: one business day, or 48 hours? The current site says both. | **Launch-blocking** |

## 6. Brand partners (manufacturers)

| Item | Priority |
|---|---|
| What you offer brands: retail placement, ecommerce channel management, closeout/excess purchase, regional expansion | High |
| Channel policies you respect: MAP, authorized-reseller programs, territory restrictions | High |
| Whether you buy excess, discontinued or short-dated inventory from brands | High |
| Who brand inquiries go to | High |

## 7. Trust and verification

| Item | Priority |
|---|---|
| D-U-N-S number | High |
| BBB profile, if any | Medium |
| State sales-tax / seller's permit status (not published; used internally for schema accuracy) | Medium |
| Industry memberships (e.g. trade associations) | Medium |
| Certifications or registrations (e.g. FDA food facility registration if you store food), only ones that actually exist | Medium |
| Customer testimonials with full name, company and **written permission** | Medium |
| Verified statistics you're comfortable publishing: brands, SKUs, accounts, years. Each needs a source. | Medium |

## 8. Social and listings

| Item | Priority |
|---|---|
| LinkedIn company page URL (create one if it doesn't exist; strongly recommended for B2B verification) | High |
| Instagram (confirm it's active and owned) | Low |
| Google Business Profile: exists? Who owns it? | High |
| Bing Places, Apple Business Connect | Medium |
| Any trade directory listings | Low |

## 9. Technical and access

| Item | Priority |
|---|---|
| Form endpoint (CRM webhook, HubSpot form, Formspree/Basin, or Zapier/Make) and the email address that receives leads | **Launch-blocking** |
| GA4 Measurement ID and/or GTM container ID | High |
| Google Search Console and Bing Webmaster access | High |
| Access to the current WordPress site to export URLs and media | **Launch-blocking** |
| Backlink export (Ahrefs, Semrush, or GSC Links) | High |
| Who edits content day to day (for CMS setup) | Medium |

## 10. Photography

Authentic photography does more for trust than any other asset. A one-day shoot would cover all of the following:

- Exterior and signage at the business address, if it's a facility
- Warehouse aisles, pallets and cases with your labels
- Product on hand for each category (cases, not styled lifestyle shots)
- Receiving and shipping docks
- The team at work (no posed handshakes)
- Headshots for the About page

Until then, the site uses two people-free warehouse images as neutral atmosphere, with alt text that doesn't imply they show your facility.
