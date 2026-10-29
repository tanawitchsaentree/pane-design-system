import { chromium } from 'playwright';
import { docsConfig, url } from './kiln/config.mjs';
import { serveDist } from './kiln/serve-dist.mjs';
const C = docsConfig(); const srv = await serveDist(C.abs(C.dist));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const [route, text, name] = process.argv.slice(2);
await p.goto(url(srv.base, route, { theme: 'dark' }, C), { waitUntil: 'networkidle' });
const el = p.locator('[data-example-live]').filter({ hasText: text }).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
await el.screenshot({ path: `${process.env.OUT}/${name}.png` }); await b.close(); process.exit(0);
