// Button. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Button ---------------------------------------------------------------------------------
  await go('/components/button/code');
  const follow = main().getByRole('button', { name: 'Follow', exact: true }).first();
  await check('Button', 'native <button type="button">', async () => {
    expect((await follow.getAttribute('type')) === 'button', 'type is not "button"');
  });
  await check('Button', 'reachable with Tab', () => tabTo(page, follow));
  await check('Button', 'Enter and Space activate it', async () => {
    // Counted on the real Button, not on a docs control: the scene toggles this used to press became a Select (D-017).
    await follow.evaluate((el) => { el.dataset.clicks = '0'; el.addEventListener('click', () => { el.dataset.clicks = String(Number(el.dataset.clicks) + 1); }); });
    await tabTo(page, follow);
    await page.keyboard.press('Enter');
    await eventually(() => follow.getAttribute('data-clicks'), '1', 'Enter did not activate');
    await page.keyboard.press('Space');
    await eventually(() => follow.getAttribute('data-clicks'), '2', 'Space did not activate');
  });
  await check('Button', 'keyboard focus draws a 2px white ring with a dark halo', async () => {
    await tabTo(page, follow);
    const st = await follow.evaluate((el) => { const c = getComputedStyle(el); return { style: c.outlineStyle, width: c.outlineWidth, color: c.outlineColor, shadow: c.boxShadow }; });
    expect(st.style === 'solid' && st.width === '2px' && st.color === 'rgb(255, 255, 255)', `outline ${st.style} ${st.width} ${st.color}`);
    expect(/rgba\(0, 0, 0/.test(st.shadow), `halo missing: ${st.shadow}`);
  });
  await check('Button', 'disabled is the native attribute', async () => {
    expect(await main().getByRole('button', { name: 'Disabled' }).isDisabled(), 'not disabled');
  });
  await check('Button', 'hover motion uses the soft tokens (420ms, cubic-bezier(0.22, 1, 0.36, 1))', async () => {
    const free = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p2 = await free.newPage();
    await p2.goto(`${srv.base}/components/button?scene=room&theme=dark`, { waitUntil: 'networkidle' });
    const t = await p2.locator('main').getByRole('button', { name: 'Follow', exact: true }).first().evaluate((el) => { const c = getComputedStyle(el); return { d: c.transitionDuration, e: c.transitionTimingFunction }; });
    await free.close();
    expect(t.d.split(',').every((x) => x.trim() === '0.42s') && /cubic-bezier\(0\.22, 1, 0\.36, 1\)/.test(t.e), `${t.d} / ${t.e}`);
    return `${t.d.split(',')[0]} ${t.e.split('),')[0]})`;
  });

}
