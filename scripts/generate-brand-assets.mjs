// Renders the 1Sources OG image, logo PNG and icon set from HTML with Chromium.
// Run: node scripts/generate-brand-assets.mjs   (requires Playwright; see README)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }

const font = readFileSync('node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2').toString('base64');
const mark = (a, b) => `<svg viewBox="16 8 100 154" xmlns="http://www.w3.org/2000/svg"><polygon points="70,18 114,10 114,44 62,60 40,76 22,80 33,52" fill="${a}"/><polygon points="82,48 114,38 114,148 88,160 88,86 55,97 34,113 18,115 28,88" fill="${a}"/><polygon points="33,88 88,69 88,93 40,110 18,115 18,98" fill="${b}"/></svg>`;
const base = `<style>@font-face{font-family:S;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}*{margin:0;box-sizing:border-box}body{font-family:S,sans-serif}</style>`;

const og = `${base}<body style="width:1200px;height:630px;background:#15191a;color:#f4f2ed;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:18px"><div style="width:34px;height:52px">${mark('#f4f2ed', '#6ccbbf')}</div><span style="font-size:40px;font-weight:700;letter-spacing:-1.4px">1Sources</span></div>
    <div>
      <p style="font-size:76px;font-weight:600;line-height:1;letter-spacing:-2.4px;max-width:900px">Wholesale distribution built around relationships.</p>
      <div style="margin-top:40px;padding-top:22px;border-top:2px solid #f4f2ed;display:flex;gap:56px;font-size:22px;color:#a9b1b3">
        <span><b style="color:#f4f2ed;font-weight:600">Wholesale distributor</b></span><span>Jersey City, New Jersey</span><span>Name-brand goods, by the case</span>
      </div>
    </div>
  </div>
  <div style="position:absolute;right:0;top:0;width:180px;height:180px;background:#0b6b66;clip-path:polygon(100% 0,100% 100%,0 0)"></div>
</body>`;

const icon = (size, pad, bg = '#15191a') => `${base}<body style="width:${size}px;height:${size}px;background:${bg};display:grid;place-items:center"><div style="height:${size * (1 - pad * 2)}px;aspect-ratio:100/154">${mark('#f4f2ed', '#6ccbbf')}</div></body>`;

const b = await pw.chromium.launch();
async function render(html, w, h, path) {
  const page = await b.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ path, omitBackground: false });
  await page.close();
  console.log(path);
  return buf;
}
await render(og, 1200, 630, 'public/assets/og/1sources-og.png');
await render(icon(512, 0.16), 512, 512, 'public/assets/brand/1sources-symbol.png');
await render(icon(512, 0.2), 512, 512, 'public/assets/icons/android-chrome-512x512.png');
await render(icon(192, 0.18), 192, 192, 'public/assets/icons/android-chrome-192x192.png');
await render(icon(512, 0.26), 512, 512, 'public/assets/icons/maskable-icon-512x512.png');
await render(icon(180, 0.18), 180, 180, 'public/assets/icons/apple-touch-icon.png');
await render(icon(48, 0.12), 48, 48, 'public/assets/icons/favicon-48x48.png');
await render(icon(32, 0.1), 32, 32, 'public/assets/icons/favicon-32x32.png');
const png16 = await render(icon(16, 0.06), 16, 16, 'public/assets/icons/favicon-16x16.png');
const png32 = readFileSync('public/assets/icons/favicon-32x32.png');
await b.close();

// favicon.ico containing PNG-encoded 16px and 32px images (valid since Windows Vista / all modern browsers).
const imgs = [[16, png16], [32, png32]];
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(imgs.length, 4);
let offset = 6 + 16 * imgs.length;
const dir = imgs.map(([s, data]) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(data.length, 8); e.writeUInt32LE(offset, 12);
  offset += data.length; return e;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...dir, ...imgs.map(([, d]) => d)]));
console.log('public/favicon.ico');
