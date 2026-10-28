// render system sheet → PNG (รันบนเครื่อง user ที่ลง playwright แล้ว)
import { chromium } from 'playwright';
import { resolve } from 'node:path';
const out = process.argv[2] || `system/sheets/sheet-${new Date().toISOString().slice(0,10)}.png`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1240, height: 100 }, deviceScaleFactor: 2 });
await page.goto('file://' + resolve('apps/sheet/template.html'));
await page.waitForTimeout(300);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('sheet →', out);
