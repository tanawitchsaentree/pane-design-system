// Scale and RadarChart. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  const ex = () => main().locator('figure.example');

  await go('/components/scale/code');
  await check('Scale', 'says its label, word, position and the comparison in one sentence', async () => {
    const said = (await ex().locator('[data-component="Scale"][aria-label*="format average"]').first().getAttribute('aria-label')) ?? '';
    expect(/^Speed: Fast, 4\.4 of 5, above the format average$/.test(said), `said "${said}"`);
    const below = (await ex().locator('[data-component="Scale"][aria-label^="Consistency"][aria-label*="average"]').first().getAttribute('aria-label')) ?? '';
    expect(below.includes('below the format average'), `said "${below}"`);
  });
  await check('Scale', 'a value between two steps sits between them and lights the steps up to the nearest', async () => {
    const s = ex().locator('[data-component="Scale"][aria-label^="Curve"]').first();
    const at = await s.evaluate((e) => getComputedStyle(e.querySelector('[data-part="value"]')).getPropertyValue('--pane-at').trim());
    expect(Math.abs(parseFloat(at) - 75) < 0.5, `5.5 of 7 sits at ${at}`);
    expect((await s.getAttribute('aria-label'))?.includes('5.5 of 7'), 'the fraction is not said');
  });
  await check('Scale', 'a rise where lower is better takes the critical band and an up arrow', async () => {
    const s = ex().locator('[data-component="Scale"][aria-label^="Mulligan"]').first();
    const band = await s.evaluate((e) => [...e.querySelectorAll('span[class*="band"]')].map((b) => b.className).join(' '));
    expect(/bad/.test(band) && !/good/.test(band), `band classes ${band}`);
    expect(await s.locator('svg').count() === 1, 'no arrow beside the word');
  });
  await go('/components/scale/usage');
  await check('Scale', 'in RTL the steps fill from the right', async () => {
    const s = main().locator('[dir="rtl"] [data-component="Scale"]').first();
    await s.scrollIntoViewIfNeeded();
    const [l, r, dot] = await s.evaluate((e) => { const tr = e.children[1].getBoundingClientRect(); const d = e.querySelector('[data-part="value"]').getBoundingClientRect(); return [tr.left, tr.right, d.left + d.width / 2]; });
    // 4 of 5 is three quarters of the way along; in RTL that is a quarter of the way from the left edge
    expect(r > l && Math.abs((dot - l) / (r - l) - 0.25) < 0.08, `the bead sits at ${Math.round(((dot - l) / Math.max(1, r - l)) * 100)}% of the track from the left`);
  });

  await go('/components/radar-chart/code');
  await check('RadarChart', 'Show table gives every axis and series as a table, and back', async () => {
    const r = ex().locator('[data-component="RadarChart"]').nth(1);
    await r.locator('figcaption button').click();
    const rows = await r.locator('table tbody tr').count();
    expect(rows === 4, `${rows} table rows for 4 axes`);
    expect(await r.locator('table thead th').count() === 3, 'two series and the axis column expected');
    await r.locator('figcaption button').click();
    expect(await r.locator('svg polygon').count() > 0, 'the chart did not come back');
  });
  await check('RadarChart', 'arrow keys walk the axes and read every series there', async () => {
    const r = ex().locator('[data-component="RadarChart"]').nth(1);
    await r.locator('[aria-roledescription="chart"]').focus();
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(80);
    const said = (await r.locator('[aria-live="polite"]').textContent()) ?? '';
    expect(said.startsWith('Speed:') && said.includes('Mono white tokens 4.6') && said.includes('Blue control 1.8'), `said "${said}"`);
    await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(80);
    expect(((await r.locator('[aria-live="polite"]').textContent()) ?? '').startsWith('Consistency:'), 'ArrowLeft from the first axis did not wrap to the last');
  });
}
