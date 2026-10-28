import { chromium } from 'playwright';
import { serveDist } from './kiln/serve-dist.mjs';
const out = process.argv[2]; const srv = await serveDist(process.cwd() + '/apps/docs/dist');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
for (const theme of ['dark', 'light']) for (const slug of ['icon-button', 'tabs', 'chip', 'tag', 'badge', 'avatar', 'slider']) {
  await p.goto(`${srv.base}/components/${slug}/code?theme=${theme}`); await p.waitForTimeout(1200);
  const ex = p.locator('[data-example-live]').first(); await ex.scrollIntoViewIfNeeded(); await ex.screenshot({ path: `${out}/b3-${slug}-${theme}.png` });
}
await b.close(); srv.close(); process.exit(0);
