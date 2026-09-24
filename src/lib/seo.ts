import { site, fullAddress, sameAs } from '@/config/site';

export type Crumb = { name: string; path: string };

export type PageMeta = {
  /** Page title without the brand suffix. */
  title: string;
  description: string;
  /** Path beginning and ending with "/" (e.g. "/about-us/"). */
  path: string;
  /** Use the title as-is (no " | 1Sources" suffix). Homepage only. */
  absoluteTitle?: boolean;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  ogType?: 'website' | 'article';
  /** schema.org WebPage subtype. */
  pageType?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'FAQPage';
  breadcrumbs?: Crumb[];
  /** Extra JSON-LD nodes merged into the page graph. */
  schema?: Record<string, unknown>[];
  article?: { published: Date; modified?: Date; section?: string };
};

export const absoluteUrl = (path: string) => new URL(path, site.url).href;

export function formatTitle(meta: Pick<PageMeta, 'title' | 'absoluteTitle'>) {
  return meta.absoluteTitle ? meta.title : `${meta.title} | ${site.name}`;
}

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organizationNode() {
  const node: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', url: absoluteUrl(site.logo), width: 512, height: 512 },
    description: site.description,
    email: site.email,
    telephone: site.phone.e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: site.phone.e164,
        email: site.email,
        availableLanguage: ['English'],
        ...(site.serviceArea ? { areaServed: 'US' } : {}),
      },
    ],
    knowsAbout: [
      'Wholesale distribution',
      'Health and beauty wholesale',
      'Household products wholesale',
      'Grocery wholesale',
      'Toy wholesale',
      'Consumer electronics wholesale',
    ],
  };
  if (site.legalName) node.legalName = site.legalName;
  if (site.yearEstablished) node.foundingDate = String(site.yearEstablished);
  if (site.trust.duns) node.duns = site.trust.duns;
  if (sameAs.length) node.sameAs = sameAs;
  return node;
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${site.url}/`,
    name: site.name,
    description: site.shortDescription,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

export function breadcrumbNode(crumbs: Crumb[], pageUrl: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function buildGraph(meta: PageMeta) {
  const url = absoluteUrl(meta.path);
  const page: Record<string, unknown> = {
    '@type': meta.pageType ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: formatTitle(meta),
    description: meta.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
  const graph: Record<string, unknown>[] = [organizationNode(), websiteNode(), page];
  if (meta.breadcrumbs?.length) {
    page.breadcrumb = { '@id': `${url}#breadcrumb` };
    graph.push(breadcrumbNode(meta.breadcrumbs, url));
  }
  if (meta.schema) graph.push(...meta.schema);
  return { '@context': 'https://schema.org', '@graph': graph };
}

export { fullAddress };
