// IconButton. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
import { readFileSync } from 'node:fs';
import path from 'node:path';
const ROUTES = JSON.parse(readFileSync(path.join(process.cwd(), 'apps/docs/src/book/routes.json'), 'utf8')).parts.flatMap((p) => p.pages.flatMap((pg) => (pg.tabs ? pg.tabs.map((t) => `${pg.path}/${t}`) : [pg.path])));
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- IconButton -----------------------------------------------------------------------------
  await go('/components/icon-button/code');
  await check('IconButton', 'reachable with Tab', () => tabTo(page, main().getByRole('button', { name: 'Edit profile' }).first()));
  await check('IconButton', 'every button with no visible text, on every page of the book, has an accessible name', async () => {
    let unnamed = [];
    for (const r of ROUTES) {
      await go(r);
      // a name can also come from a <label for> or aria-labelledby (Radix checkboxes, radios and switches are buttons named that way)
      const u = await page.locator('button').evaluateAll((bs) => bs.filter((b) => {
        if (b.innerText.trim() || (b.getAttribute('aria-label') || '').trim()) return false;
        if ([...(b.labels ?? [])].some((l) => l.textContent.trim())) return false;
        const by = (b.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean);
        return !by.some((id) => document.getElementById(id)?.textContent.trim());
      }).length);
      if (u) unnamed.push(`${r}: ${u}`);
    }
    expect(unnamed.length === 0, unnamed.join(', '));
    return `${ROUTES.length} pages`;
  });

}
