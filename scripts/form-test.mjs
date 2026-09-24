// Submits the account form empty, then valid, and screenshots the states. Also logs dataLayer events.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }
const out = process.argv[2];
const b = await pw.chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:4321/open-account/?category=toys-games');
await page.click('button[type=submit]');
await page.waitForTimeout(200);
console.log('focused:', await page.evaluate(() => document.activeElement?.textContent));
await page.screenshot({ path: `${out}/form-errors.png` });
await page.fill('#f-company', 'Test Co'); await page.fill('#f-name', 'Pat Buyer'); await page.fill('#f-email', 'pat@test.co');
await page.fill('#f-phone', '555'); await page.fill('#f-street', '1 Main'); await page.fill('#f-city', 'Newark'); await page.fill('#f-region', 'NJ'); await page.fill('#f-postalCode', '07102');
await page.selectOption('#f-businessType', { index: 1 }); await page.evaluate(() => { const i = document.querySelector('#g-channels-0'); i.click(); }); await page.selectOption('#f-resaleCertificate', { index: 1 });
await page.evaluate(() => document.querySelector('form[data-lead-form]').requestSubmit());
await page.waitForTimeout(300);
console.log('toys preselected:', await page.isChecked('input[name=categories][value=toys-games]'));
console.log('summary:', await page.textContent('[data-summary]'));
console.log('notice:', await page.textContent('[data-notice]'));
console.log('events:', JSON.stringify(await page.evaluate(() => window.dataLayer.map((e) => e.event))));
await page.screenshot({ path: `${out}/form-notice.png` });
await b.close();
