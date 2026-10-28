// Tabs. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Tabs -----------------------------------------------------------------------------------
  await go('/components/tabs/code');
  const list = main().getByRole('tablist', { name: 'Profile sections' }).first();
  const tab = (n) => list.getByRole('tab', { name: n });
  // Behaviour, not attributes: Radix makes the tablist the tab stop and forwards focus, so the
  // per-tab tabindex values are an implementation detail (all -1 until first focus).
  await check('Tabs', 'one tab stop, so Tab lands on the selected tab and the next Tab leaves the list', async () => {
    await tabTo(page, tab('Tweets'));
    expect((await tab('Tweets').getAttribute('aria-selected')) === 'true', 'focused tab is not the selected one');
    await page.keyboard.press('Tab');
    const stillInList = await list.evaluate((l) => l.contains(document.activeElement));
    expect(!stillInList, 'second Tab stopped on another tab');
  });
  await check('Tabs', 'arrow keys move focus and selection, and Home and End jump to the ends', async () => {
    await tabTo(page, tab('Tweets'));
    const sel = (n) => () => tab(n).getAttribute('aria-selected');
    await page.keyboard.press('ArrowRight');
    await eventually(sel('Replies'), 'true', 'ArrowRight did not select Replies');
    await page.keyboard.press('End');
    await eventually(sel('Media'), 'true', 'End did not select Media');
    await page.keyboard.press('Home');
    await eventually(sel('Tweets'), 'true', 'Home did not select Tweets');
    await page.keyboard.press('ArrowLeft');
    await eventually(sel('Media'), 'true', 'ArrowLeft from first did not wrap to last');
  });
  await check('Tabs', 'each tab controls a tabpanel that exists', async () => {
    const ids = await list.getByRole('tab').evaluateAll((ts) => ts.map((t) => t.getAttribute('aria-controls')));
    for (const id of ids) expect((await page.locator(`[id="${id}"][role="tabpanel"]`).count()) === 1, `no tabpanel #${id}`);
  });
  await check('Tabs', 'the selected tab keeps an underline in forced colours', async () => {
    const fc = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: 'active', reducedMotion: 'reduce' });
    const p2 = await fc.newPage();
    await p2.goto(`${srv.base}/components/tabs?scene=room&theme=dark`, { waitUntil: 'networkidle' });
    const deco = await p2.locator('main [role="tab"][aria-selected="true"]').first().evaluate((el) => getComputedStyle(el).textDecorationLine);
    await fc.close();
    expect(deco.includes('underline'), `selected tab text-decoration: ${deco}`);
  });

}
