// Card. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Card -----------------------------------------------------------------------------------
  await go('/components/card/code');
  await check('Card', 'glass card blurs, saturates and dims what is behind it', async () => {
    const bf = await main().getByRole('article', { name: 'Trip to Lauterbrunnen' }).first().evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(/blur\(/.test(bf) && /saturate\(/.test(bf) && /brightness\(/.test(bf), `backdrop-filter: ${bf}`);
    return bf;
  });
  await check('Card', 'inset variant adds no second glass layer', async () => {
    const bf = await main().locator('[class*="inset"]').first().evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(bf === 'none', `inset backdrop-filter: ${bf}`);
  });

}
