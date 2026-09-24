// node scripts/shot-segments.mjs <out-prefix> <path> <width> <y1,y2,...>  — viewport-height clips at offsets
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }
const [prefix, path, width, ys] = process.argv.slice(2);
const h = Number(process.env.H || 900);
const b = await pw.chromium.launch();
const page = await b.newPage({ viewport: { width: Number(width), height: h } });
await page.goto((process.env.BASE || 'http://localhost:4321') + path, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
for (const y of ys.split(',').map(Number)) {
  await page.screenshot({ path: `${prefix}-${y}.png`, fullPage: true, clip: { x: 0, y, width: Number(width), height: h } });
  console.log(`${prefix}-${y}.png`);
}
await b.close();
