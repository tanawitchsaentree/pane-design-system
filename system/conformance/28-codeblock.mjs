// D-040: CodeBlock. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  const blocks = () => main().locator('figure.example [data-component="CodeBlock"]');

  await go('/components/code-block/code');
  await check('CodeBlock', 'actions and code take focus', async () => {
    const b = blocks().first();
    await b.locator('button[data-copy]').focus();
    expect(await b.locator('button[data-copy]').evaluate((e) => e === document.activeElement), 'Copy does not take focus');
    await page.keyboard.press('Tab');
    expect(await b.locator('pre').evaluate((e) => e === document.activeElement), 'the code does not take focus after Copy');
    expect(((await b.locator('pre').getAttribute('aria-label')) ?? '').length > 0, 'the code region has no name');
  });
  await check('CodeBlock', 'Copy copies all', async () => {
    const b = blocks().first();
    await page.evaluate(() => { window.__copied = ''; navigator.clipboard.writeText = async (s) => { window.__copied = s; }; });
    await b.locator('button[data-copy]').click();
    const got = await page.evaluate(() => window.__copied);
    const shown = (await b.locator('pre').textContent()) ?? '';
    expect(got.length >= shown.trim().length && got.includes('pane-react'), `copied ${got.length} characters`);
    expect(((await b.locator('[role="status"]').textContent()) ?? '').length > 0, 'nothing told a screen reader it was copied');
  });
  await check('CodeBlock', '44px actions', async () => {
    const h = await blocks().first().locator('button[data-copy]').evaluate((e) => parseFloat(getComputedStyle(e, '::after').blockSize));
    expect(h >= 44, `the press area is ${h}px`);
  });
  await check('CodeBlock', 'roles are coloured and a code theme changes them', async () => {
    const colours = await blocks().first().locator('[data-syntax]').evaluateAll((l) => [...new Set(l.map((e) => getComputedStyle(e).color))]);
    expect(colours.length >= 3, `only ${colours.length} colours`);
    const kw = (n) => blocks().nth(n).locator('[data-syntax="property"]').first().evaluate((e) => getComputedStyle(e).color);
    const themed = main().locator('[data-code-theme="dracula"]').first().locator('[data-syntax="property"]').first();
    const plain = await kw(0).catch(() => null); const dr = await themed.evaluate((e) => getComputedStyle(e).color).catch(() => null);
    expect(dr && dr !== plain, 'Dracula did not change the colours');
  });
}
