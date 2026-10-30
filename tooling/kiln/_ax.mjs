import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await c.newPage();
await p.goto('http://localhost:4173' + process.argv[2] + '?theme=dark&backdrop=studio', { waitUntil: 'networkidle' }); await p.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = true; }); await p.waitForTimeout(300);
const res = await new AxeBuilder({ page: p }).withRules([process.argv[3]]).analyze();
for (const v of res.violations) for (const n of v.nodes) console.log(n.html.slice(0, 200), '::', n.failureSummary.slice(0, 200));
await b.close();
