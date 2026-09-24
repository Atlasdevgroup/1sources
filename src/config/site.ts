/**
 * Single source of truth for the 1Sources business entity.
 *
 * Every component, schema block, llms.txt line and footer reads from here, so
 * name / address / phone can never drift between pages.
 *
 * `null` means "not yet confirmed by the client" (see docs/fact-verification.md
 * and docs/content-required.md). Components must render nothing for a null
 * value — never a placeholder.
 */

export const site = {
  url: 'https://1sources.com',
  name: '1Sources',
  legalName: null as string | null,
  /** The canonical one-sentence entity statement. Used verbatim across the site. */
  description:
    '1Sources is a wholesale distributor based in Jersey City, New Jersey, supplying name-brand consumer goods to retailers, ecommerce sellers and other professional resellers.',
  shortDescription: 'Wholesale distribution built around relationships.',
  yearEstablished: null as number | null,
  /** Confirmed service territory, e.g. "the contiguous United States". */
  serviceArea: null as string | null,

  address: {
    street: '629 Grove Street',
    city: 'Jersey City',
    region: 'NJ',
    regionName: 'New Jersey',
    postalCode: '07310',
    country: 'US',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=629+Grove+Street+Jersey+City+NJ+07310',
  },

  phone: {
    display: '(973) 498-8191',
    e164: '+19734988191',
  },
  email: 'hello@1sources.com',
  /** WhatsApp Business number in E.164 without "+", e.g. "19735550100". Hidden until set. */
  whatsapp: null as string | null,
  /** e.g. "Monday–Friday, 9am–5pm ET". Hidden until set. */
  hours: null as string | null,
  /** Response-time promise shown on forms. Placeholder pending client confirmation. */
  responseTime: 'one business day',

  social: {
    linkedin: null as string | null,
    instagram: null as string | null, // instagram.com/1sources pending ownership confirmation
  },

  trust: {
    duns: null as string | null,
    bbb: null as string | null,
    memberships: [] as { name: string; url?: string }[],
  },

  accountTerms: {
    minimumOrder: null as string | null,
    paymentTerms: null as string | null,
    approvalTime: null as string | null,
  },

  forms: {
    /**
     * JSON endpoint that receives leads (CRM webhook, Formspree, Basin, Zapier…).
     * Set PUBLIC_FORM_ENDPOINT at build time. When empty, forms show an honest
     * "email us instead" message rather than pretending to submit.
     */
    endpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) || null,
  },

  analytics: {
    gtmId: (import.meta.env.PUBLIC_GTM_ID as string | undefined) || null,
  },

  ogImage: '/assets/og/1sources-og.png',
  logo: '/assets/brand/1sources-symbol.png',
  locale: 'en_US',
} as const;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

export const whatsappUrl = (text?: string) =>
  site.whatsapp
    ? `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
    : null;

export const sameAs = Object.values(site.social).filter((v): v is string => Boolean(v));

export type NavItem = { label: string; href: string; description?: string };

export const primaryNav: NavItem[] = [
  { label: 'About', href: '/about-us/' },
  { label: 'Categories', href: '/categories/' },
  { label: 'Brands', href: '/brands/' },
  { label: 'Capabilities', href: '/capabilities/' },
  { label: 'For Retailers', href: '/retailers/' },
  { label: 'For Brands', href: '/brand-partners/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'Contact', href: '/contact-us/' },
];
