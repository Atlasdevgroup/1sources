import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site, fullAddress } from '@/config/site';

/** Generated from the same config and collections as the site, so it cannot drift. */
export const GET: APIRoute = async () => {
  const categories = (await getCollection('categories', (c) => c.data.confirmed)).sort((a, b) => a.data.order - b.data.order);
  const articles = (await getCollection('insights', (a) => !a.data.draft)).sort((a, b) => +b.data.published - +a.data.published);
  const u = (p: string) => `${site.url}${p}`;

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'Key facts:',
    `- Business type: wholesale distributor (jobber) selling by the case to approved business accounts`,
    `- Address: ${fullAddress}`,
    `- Phone: ${site.phone.display}`,
    `- Email: ${site.email}`,
    ...(site.yearEstablished ? [`- Established: ${site.yearEstablished}`] : []),
    ...(site.serviceArea ? [`- Service area: ${site.serviceArea}`] : []),
    '- Buyers: independent and regional retailers, pharmacies, grocers, beauty and discount stores, ecommerce and marketplace sellers, other wholesalers',
    '- Does not sell to consumers.',
    '',
    '## Categories',
    '',
    ...categories.map((c) => `- [${c.data.title}](${u(`/categories/${c.id}/`)}): ${c.data.definition.replace(/\s+/g, ' ').trim()}`),
    '',
    '## Working with 1Sources',
    '',
    `- [Open a wholesale account](${u('/open-account/')}): application for business buyers.`,
    `- [For retailers](${u('/retailers/')}): how buying from 1Sources works.`,
    `- [For brands and manufacturers](${u('/brand-partners/')}): distribution partnerships and inventory.`,
    `- [Capabilities](${u('/capabilities/')}): sourcing, purchasing, fulfillment and account management.`,
    `- [FAQ](${u('/faq/')}): accounts, ordering, shipping and brand questions.`,
    `- [About](${u('/about-us/')}) · [Contact](${u('/contact-us/')})`,
    '',
    '## Insights',
    '',
    ...articles.map((a) => `- [${a.data.title}](${u(`/insights/${a.id}/`)}): ${a.data.description}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
