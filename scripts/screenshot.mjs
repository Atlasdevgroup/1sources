// Usage: node scripts/screenshot.mjs <outDir> <path...>  (widths via WIDTHS env, default 1440,390)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }
const [outDir, ...paths] = process.argv.slice(2);
const widths = (process.env.WIDTHS || '1440,390').split(',').map(Number);
const base = process.env.BASE || 'http://localhost:4321';
const browser = await pw.chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const name = `${outDir}/${(p.replace(/\//g, '_') || '_')}-${w}.png`;
    await page.screenshot({ path: name, fullPage: process.env.FULL !== '0' });
    console.log(name);
  }
  await page.close();
}
await browser.close();
