// Select and Slider: behaviour is Radix's, these prove it survived Pane's wrapping. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Select and Slider: behaviour is Radix's, these prove it survived Pane's wrapping ---
  await go('/components/select/code');
  // Radix hides everything outside an open list from the accessibility tree, so a role query for the
  // trigger finds nothing while the list is open; pin the trigger by id once, while it is findable
  const trigger = main().locator('#hero [data-component="Select"]').filter({ hasText: 'Who can message you' }).locator('button').first();
  await check('Select', 'reachable with Tab', () => tabTo(page, trigger));
  await check('Select', 'Enter opens the list and Escape closes it', async () => {
    await tabTo(page, trigger);
    await page.keyboard.press('Enter');
    await eventually(() => trigger.getAttribute('aria-expanded'), 'true', 'Enter did not open the list');
    expect((await page.getByRole('option').count()) === 3, 'the list does not show three options');
    await page.keyboard.press('Escape');
    await eventually(() => trigger.getAttribute('aria-expanded'), 'false', 'Escape did not close the list');
    // Radix hands focus back a tick after the list closes
    await eventually(() => trigger.evaluate((el) => document.activeElement === el), true, 'focus did not return to the trigger');
  });
  await check('Select', 'arrow keys and Enter choose a new value', async () => {
    await tabTo(page, trigger);
    await page.keyboard.press('Enter');
    await eventually(() => trigger.getAttribute('aria-expanded'), 'true', 'did not open');
    // the list moves focus onto the chosen option a tick after it opens; ArrowDown before that is lost
    await eventually(() => page.evaluate(() => document.activeElement?.getAttribute('role')), 'option', 'the list did not take focus');
    // Radix ignores keys for a frame or two after it moves focus into the list (longer on a loaded machine), so
    // press ArrowDown until focus has really moved, the way a person would, then choose with Enter
    const focusedText = () => page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');
    for (let i = 0; i < 5 && (await focusedText()) !== 'No one'; i++) { await page.waitForTimeout(80); if ((await focusedText()) !== 'No one') await page.keyboard.press('ArrowDown'); }
    await eventually(focusedText, 'No one', 'ArrowDown did not move focus to the next option');
    await page.keyboard.press('Enter');
    await eventually(() => trigger.textContent(), 'No one', 'ArrowDown then Enter did not pick the next option');
  });
  await go('/components/slider/code');
  const thumb = main().locator('#hero').getByRole('slider', { name: 'Volume' }).first();
  await check('Slider', 'reachable with Tab', () => tabTo(page, thumb));
  await check('Slider', 'arrow keys, Home and End change the value', async () => {
    await tabTo(page, thumb);
    const now = () => thumb.getAttribute('aria-valuenow');
    await page.keyboard.press('Home'); await eventually(now, '0', 'Home did not go to 0');
    await page.keyboard.press('ArrowRight'); await eventually(now, '1', 'ArrowRight did not add one step');
    await page.keyboard.press('End'); await eventually(now, '100', 'End did not go to 100');
    expect((await thumb.getAttribute('aria-valuetext')) === '100%', 'the spoken value is not formatted');
  });
  await check('Slider', 'the press area is at least 44px tall', async () => {
    const h = await thumb.evaluate((el) => el.closest('[data-component="Slider"] *[class*="slider"]')?.getBoundingClientRect().height ?? 0);
    expect(h >= 44, `press area ${h}px`);
  });

}
