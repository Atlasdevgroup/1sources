# Design System

## 1. Philosophy

**Concept: the trade ledger.** A distributor's working documents are the offer sheet, the price list, the bill of lading and the trade journal. They're dense, ruled, numbered and precise, and they're trusted because they're orderly, not because they're decorated. The site borrows that register: hairline rules instead of card borders, numbered indexes instead of icon grids, and margin notes instead of centred eyebrow + heading + paragraph stacks. Type does most of the work.

Rules the whole system follows:

1. **Structure comes from type and rules, not boxes.** A card is used only when the thing really is a discrete, clickable object: an article teaser or a form. Everything else is typography on a grid, separated by 1px rules.
2. **The margin column.** On desktop, most sections use a 12-column grid where columns 1–3 hold a *margin label* (section number + name, and sometimes a note) and columns 4–12 hold content. The pattern recognisably belongs to 1Sources, and it's broken deliberately (full-bleed moments, a dark band, a split panel) to create rhythm.
3. **Teal is a signal, not a paint.** Teal marks the *one* thing to notice: the primary button, the active nav state, the index numerals in the category ledger, focus rings, links in running text. Headings are never teal, and backgrounds are never teal except for one small moment per page at most.
4. **The cut.** The logo is built from slanted planes, so images and the dark bands carry a single **angled cut on one corner**: `clip-path` with an 8° slope, ending at 48px on desktop and 28px on mobile. It's used sparingly (hero image, audience panel, article lead image) and never on buttons.
5. **No invented proof.** No counters, no fake dashboards, no testimonial carousels. When a verified fact is missing, the component renders nothing.

## 2. Colour

Tokens are defined in `src/styles/tokens.css`. Values are chosen for WCAG 2.2 AA; contrast figures were measured with the WCAG formula.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--background-primary` | `#FFFFFF` | Page | — |
| `--background-secondary` | `#F4F2ED` (warm paper) | Alternating bands, form panels | — |
| `--background-inverse` | `#15191A` (ink) | Dark bands, footer | — |
| `--surface` | `#FFFFFF` | Inputs, menus | — |
| `--surface-elevated` | `#FBFAF7` | Mega-menu, sticky rail | — |
| `--text-primary` | `#15191A` | Body, headings | 17.7:1 on white, 15.8:1 on paper |
| `--text-secondary` | `#474F52` | Supporting copy | 8.4:1 on white, 7.5:1 on paper |
| `--text-muted` | `#646C6F` | Meta, captions (≥14px) | 5.4:1 on white, 4.8:1 on paper |
| `--text-inverse` | `#F4F2ED` | Text on ink | 15.8:1 |
| `--text-inverse-muted` | `#A9B1B3` | Secondary on ink | 8.1:1 |
| `--border` | `#DDD9D0` | Hairlines | decorative |
| `--border-strong` | `#15191A` | Section-top rules, table heads | — |
| `--accent` | `#0B6B66` (1Sources teal) | Primary button fill, links, index numerals | 6.3:1 on white, 5.7:1 on paper; paper text on teal 5.7:1 |
| `--accent-hover` | `#08524E` | Hover/pressed | 9.0:1 |
| `--accent-on-dark` | `#6CCBBF` | Links and numerals on ink | 9.2:1 on ink |
| `--accent-tint` | `#E3F0EE` | Selected option, focus fill (rare) | — |
| `--success` | `#2F6B3F` | Form success | 6.4:1 |
| `--warning` | `#8A5A00` | Notices | 5.9:1 |
| `--error` | `#B42318` | Form errors | 6.6:1 |

Error states always pair colour with text and an icon, so colour is never the only signal.

## 3. Typography

**Family:** *Schibsted Grotesk* (variable, 400–800). It was drawn for the Schibsted news group, which gives it the right lineage for an "editorial trade publication": sturdy, slightly condensed, with distinctive `g`, `R` and `1` shapes that give the wordmark character without a custom font. It's self-hosted as WOFF2 through Fontsource, with `font-display: swap`, a preload of the Latin subset, and a metric-adjusted Arial fallback to avoid CLS.

`font-variant-numeric: tabular-nums` is applied in ledgers and forms. `lining-nums` is used throughout.

| Token | Size (mobile → desktop, `clamp`) | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `display` | 44 → 76px | 600 | 1.0 | -0.028em | Homepage H1 only |
| `h1` | 36 → 56px | 600 | 1.04 | -0.024em | Page titles |
| `h2` | 28 → 40px | 600 | 1.1 | -0.018em | Section titles |
| `h3` | 21 → 26px | 600 | 1.2 | -0.01em | Sub-sections, ledger items |
| `h4` | 18 → 19px | 600 | 1.3 | -0.005em | Minor heads |
| `body-lg` | 19 → 21px | 400 | 1.5 | -0.006em | Leads, definitions |
| `body` | 17px | 400 | 1.6 | 0 | Running text |
| `body-sm` | 15px | 400 | 1.55 | 0 | Meta, secondary lists |
| `label` | 13px | 600 | 1.3 | 0.01em | Form labels, table heads |
| `eyebrow` | 12.5px | 600 | 1.2 | 0.09em, uppercase | Margin labels |
| `nav` | 15px | 500 | 1 | 0 | Primary nav |
| `button` | 15.5px | 600 | 1 | 0.005em | Buttons |

Headlines are sentence case and set tight. They're kept small enough to read as a trade journal rather than a SaaS landing page: even the display size stops at 76px. The measure is 60–72 characters for running text (`--measure: 38rem`) and 44rem for articles.

## 4. Grid and layout

| Token | Value |
|---|---|
| `--width-max` | 1360px (outer frame, incl. gutters) |
| `--width-content` | 1240px |
| `--width-reading` | 44rem (~704px) |
| `--width-measure` | 38rem |
| Columns | 12 (desktop ≥ 1024), 8 (tablet 640–1023), 4 (mobile) |
| Gutter (column gap) | 24px desktop · 20px tablet · 16px mobile |
| Page margin | `clamp(16px, 4vw, 48px)` |

**Composition patterns:**
- **Margin column:** label in 1–3, content in 4–12. On tablet the label stacks above the content as a ruled label row.
- **Asymmetric split:** 7/5 or 5/7, never 6/6 unless it's a form.
- **Ledger:** full-width rows split by rules. Columns are index, name, description and arrow.
- **Band:** a full-bleed dark or paper background for one section. Pages allow at most two bands.
- **Full-bleed image:** one per page at most.

## 5. Spacing

Spacing uses a 4px base scale: `--space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 · `10` 40 · `12` 48 · `16` 64 · `20` 80 · `24` 96 · `32` 128.

**Section rhythm:** instead of one padding value everywhere, the scale has three.

| Rhythm | Value | Use |
|---|---|---|
| `--section-tight` | `clamp(48px, 6vw, 72px)` | Bands that continue a thought |
| `--section` | `clamp(64px, 9vw, 120px)` | Default |
| `--section-loose` | `clamp(88px, 12vw, 168px)` | Before or after a major shift (e.g. into the final CTA) |

## 6. Radius, borders, shadow

| Property | Values |
|---|---|
| Radius | `--radius-0: 0` (images, bands, sections) · `--radius-1: 2px` (buttons, inputs, chips) · `--radius-2: 4px` (menus). Nothing is pill-shaped. |
| Border | `1px solid var(--border)` hairlines · `2px solid var(--border-strong)` for section-top rules, which mark the start of a "chapter". |
| Shadow | `--shadow-menu: 0 12px 32px -12px rgb(21 25 26 / .18)`, used only for the mega-menu and the mobile menu sheet. |

## 7. Buttons and links

| Variant | Spec |
|---|---|
| **Primary** | Teal fill, paper text, 2px radius, 48px tall (44px compact). The arrow glyph shifts 3px on hover. |
| **Secondary** | 1px ink outline, ink text. It fills ink on hover. |
| **On dark** | Paper fill with ink text (primary), or a paper outline (secondary). |
| **Text link** | Ink text with a 1px underline offset 4px; the underline turns teal on hover. In running text links are teal. A standalone "Explore all brands →" link is ink with an animated underline. |

**Focus:** a 2px teal outline, offset 3px, on every interactive element. It's never removed.

## 8. Forms

- Labels sit above fields and are always visible (no placeholder-as-label). Hint text sits under the label.
- Fields are 48px tall with a 1px `--border` border and 2px radius. On focus the border turns ink and the teal focus ring appears.
- **Errors:** red text below the field with an icon, `aria-invalid`, and `aria-describedby` linking field to message. An error summary appears at the top on submit and moves focus to itself.
- Checkbox groups (channels, categories) are laid out as a two-column grid of real `<input type=checkbox>`, styled as ruled rows.
- Required fields are marked with "(required)" in text, not a red asterisk alone.

## 9. Navigation

- **Desktop header** (≥ 1100px) has a 72px row: logo · nav · Open an Account button. It sits under a 36px utility bar with the address, phone and email. The header row stays sticky; the utility bar scrolls away.
- **Categories mega-menu:** a two-column ledger of the 10 categories, with a short descriptor for each. A side panel holds "All categories", "Brands we carry" and a one-line account prompt. It opens on click or keyboard (a disclosure button, not hover-only), with a 160ms fade. Esc closes it.
- **Mobile** (< 1100px): logo · "Open account" compact button · Menu button. The menu is a full-height sheet with large type. Categories are in an expandable disclosure. The sheet ends with the contact block (phone, email, WhatsApp if configured) and the account CTA.

## 10. Imagery

- **Preferred:** authentic 1Sources photography of cases, pallets, shelves, docks and product on hand. Until that exists, only two people-free stock warehouse images are used, with neutral alt text.
- **Treatment:** slightly desaturated (`filter: saturate(.82) contrast(1.02)`) so stock orange racking doesn't fight the teal. Always sized by `aspect-ratio` to prevent CLS. `loading="lazy"` below the fold, and `fetchpriority="high"` on the hero only.
- **Banned:** handshakes, posed "consultation" shots, anyone pointing at a laptop, AI-generated people, icons standing in for photos.

## 11. Motion

| Token | Value |
|---|---|
| Durations | `--dur-fast: 120ms` · `--dur: 200ms` · `--dur-slow: 320ms` |
| Easing | `--ease: cubic-bezier(.2,.7,.2,1)` |

**Used for:**
- Menu open/close
- Arrow nudge on link hover
- Ledger row hover: background tint plus the arrow moving in
- Accordion height (via `details` / `::details-content` where supported)
- A one-time 12px rise-and-fade on section entry. It's CSS-only through `animation-timeline: view()` where supported and simply absent elsewhere.

**Not used:** parallax, counters, marquees, auto-carousels, floating elements.

**`prefers-reduced-motion: reduce`** turns all of the above into instant changes.

## 12. Responsive behaviour

| Breakpoint | Width | Notable changes |
|---|---|---|
| Large desktop | ≥ 1440 | Content caps at 1240; margins grow. |
| Laptop | 1100–1439 | Full nav. |
| Tablet | 640–1099 | 8 columns. Margin labels stack above the content. The mega-menu becomes the mobile sheet. The category ledger drops its description column. |
| Mobile | < 640 | 4 columns. The hero image moves *below* the hero copy and CTAs so the LCP is text. Ledger rows become two-line. The audience split panels stack, buyers first. Forms are single-column, and checkbox grids drop to 1 column. Tables become definition lists. |

## 13. Component inventory

**Layout:**
- `Container`
- `Section` (rhythm + background variant)
- `MarginSection` (the label/content grid)

**Chrome:**
- `Header`, `MegaMenu`, `MobileNav`
- `Footer`, `UtilityBar`

**Primitives:**
- `Button`, `TextLink`
- `Breadcrumb`
- `Logo`
- `Picture` (responsive image)
- `Accordion` (native `details`)

**Content:**
- `CategoryLedger`
- `BrandIndex`
- `ProcessRoute`
- `AudienceSplit`
- `ArticleLead`, `ArticleList`
- `FactList` (company facts as `<dl>`)
- `CTABand`
- `FAQList`
- `RichText` (prose styles)

**Forms:**
- `Field`, `CheckboxGroup`
- `AccountForm`, `ContactForm`

**Identity test:** hide the logo and the page is still recognisably 1Sources because of:
- The margin-column labels
- Ruled ledgers with teal numerals
- The single angled cut
- Ink bands with paper type
- Schibsted's letterforms
