/**
 * Single source of truth for the 1Sources business entity.
 *
 * Editable business facts live in src/data/company.json (editable in the CMS at
 * /admin/). Every component, schema block, llms.txt line and footer reads from
 * here, so name / address / phone can never drift between pages.
 *
 * `null` means "not yet confirmed by the client" (docs/fact-verification.md,
 * docs/content-required.md). Components render nothing for a null value —
 * never a placeholder.
 */
import company from '@/data/company.json';

type Nullable<T> = T | null;

interface Company {
  name: string;
  legalName: Nullable<string>;
  description: string;
  yearEstablished: Nullable<number>;
  serviceArea: Nullable<string>;
  address: { street: string; city: string; region: string; regionName: string; postalCode: string; country: string };
  phone: { display: string; e164: string };
  email: string;
  /** WhatsApp Business number in E.164 without "+", e.g. "19735550100". */
  whatsapp: Nullable<string>;
  hours: Nullable<string>;
  responseTime: string;
  social: { linkedin: Nullable<string>; instagram: Nullable<string> };
  trust: { duns: Nullable<string>; bbb: Nullable<string>; memberships: { name: string; url?: string }[] };
  accountTerms: { minimumOrder: Nullable<string>; paymentTerms: Nullable<string>; approvalTime: Nullable<string> };
}

const c = company as Company;

export const site = {
  ...c,
  url: 'https://1sources.com',
  shortDescription: 'Wholesale distribution built around relationships.',
  address: {
    ...c.address,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.address.street} ${c.address.city} ${c.address.region} ${c.address.postalCode}`)}`,
  },
  forms: {
    /**
     * JSON endpoint that receives leads (CRM webhook, Formspree, Basin, Zapier…).
     * Set PUBLIC_FORM_ENDPOINT at build time. When empty, forms tell the user
     * nothing was sent and offer a pre-filled email instead.
     */
    endpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) || null,
  },
  analytics: {
    gtmId: (import.meta.env.PUBLIC_GTM_ID as string | undefined) || null,
  },
  ogImage: '/assets/og/1sources-og.png',
  logo: '/assets/brand/1sources-symbol.png',
  locale: 'en_US',
};

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

export const whatsappUrl = (text?: string) =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}` : null;

export const sameAs = Object.values(site.social).filter((v): v is string => Boolean(v));

export type NavItem = { label: string; href: string };

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
