// Verifies every redirect in vercel.json against a deployed URL:
// exactly one 301 hop, landing on a 200. Usage:
//   npm run check:redirects -- https://your-preview.vercel.app
import { readFileSync } from 'node:fs';

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) { console.error('Usage: npm run check:redirects -- https://<deployment>'); process.exit(2); }

const { redirects } = JSON.parse(readFileSync('vercel.json', 'utf8'));
const sources = redirects.filter((r) => !r.source.includes(':')).map((r) => [r.source, r.destination]);
sources.push(['/services/anything-else/', '/capabilities/'], ['/blog/2024/10/old-post/', '/insights/'], ['/category/news/', '/insights/']);

let failed = 0;
for (const [src, dest] of sources) {
  const r1 = await fetch(base + src, { redirect: 'manual' });
  const loc = r1.headers.get('location') ?? '';
  const target = new URL(loc, base).pathname;
  let problem = '';
  if (r1.status !== 301 && r1.status !== 308) problem = `expected 301/308, got ${r1.status}`;
  else if (target !== dest) problem = `→ ${target}, expected ${dest}`;
  else {
    const r2 = await fetch(new URL(loc, base), { redirect: 'manual' });
    if (r2.status !== 200) problem = `destination returned ${r2.status} (redirect chain?)`;
  }
  if (problem) { failed++; console.log(`✗ ${src} ${problem}`); }
}
console.log(failed ? `\n${failed} redirect problem(s)` : `✓ ${sources.length} redirects OK`);
process.exit(failed ? 1 : 0);
