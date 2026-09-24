import type { APIRoute } from 'astro';

// Search engines and answer engines are welcome — 1Sources wants to be
// understood and quoted accurately. Utility pages carry their own noindex.
export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /open-account/success/',
      'Disallow: /admin/',
      '',
      `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
