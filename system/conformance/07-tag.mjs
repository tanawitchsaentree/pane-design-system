// Tag. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
import { readFileSync } from 'node:fs';
import path from 'node:path';
const ROUTES = JSON.parse(readFileSync(path.join(process.cwd(), 'apps/docs/src/book/routes.json'), 'utf8')).parts.flatMap((p) => p.pages.flatMap((pg) => (pg.tabs ? pg.tabs.map((t) => `${pg.path}/${t}`) : [pg.path])));
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Tag ------------------------------------------------------------------------------------
  await go('/components/tag/code');
  await check('Tag', 'plain text with no role, small caps via CSS (source text stays readable)', async () => {
    const t = main().getByText('Visual asset 05', { exact: true }).first();
    expect((await t.getAttribute('role')) === null, 'has a role');
    expect((await t.evaluate((el) => getComputedStyle(el).textTransform)) === 'uppercase', 'not uppercase');
  });

  await check('Docs page', `G-D3, no literal backtick in rendered text on any of the ${ROUTES.length} pages`, async () => {
    const bad = [];
    for (const r of ROUTES) {
      await go(r);
      const hits = await page.evaluate(() => {
        const w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT); const out = [];
        for (let n = w.nextNode(); n; n = w.nextNode()) if (n.textContent.includes('`') && !n.parentElement.closest('pre, code')) out.push(n.textContent.trim().slice(0, 40));
        return out;
      });
      for (const h of hits) bad.push(`${r}: ${h}`);
    }
    expect(bad.length === 0, bad.slice(0, 4).join(' | '));
  });

}
