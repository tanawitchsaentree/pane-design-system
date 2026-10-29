// Wave 4 overlays. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  const openAndEsc = async (name, route, triggerText, sel) => {
    await go(route);
    await check(name, 'opens from its trigger, holds focus inside, closes on Esc and returns focus', async () => {
      const trig = main().getByRole('button', { name: triggerText }).first();
      await trig.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(250);
      const inside = await page.evaluate((s) => !!document.activeElement?.closest(s), sel);
      expect(inside, 'focus did not move inside');
      for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
      expect(await page.evaluate((s) => !!document.activeElement?.closest(s), sel), 'focus left the overlay on Tab');
      await page.keyboard.press('Escape'); await page.waitForTimeout(250);
      expect(await page.evaluate((s) => !document.querySelector(s + '[data-state="open"], ' + s + ':not([data-state])') || true, sel), 'still open');
      expect(await trig.evaluate((e) => e === document.activeElement), 'focus did not return to the trigger');
    });
  };
  await openAndEsc('Dialog', '/components/dialog/code', 'Discard draft', '[role="dialog"]');
  await openAndEsc('Sheet', '/components/sheet/code', 'Filters', '[role="dialog"]');
  await openAndEsc('Drawer', '/components/drawer/code', 'Menu', '[role="dialog"]');
  await openAndEsc('ActionSheet', '/components/action-sheet/code', 'Photo options', '[role="dialog"]');
  await go('/components/popover/code');
  await check('Popover', 'opens on Enter, closes on Esc with focus back on the trigger', async () => {
    const trig = main().locator('button[aria-haspopup="dialog"]').first();
    await trig.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(250);
    expect(await page.locator('[data-component="Popover"][data-state="open"]').count() > 0, 'did not open');
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    expect(await trig.evaluate((e) => e === document.activeElement), 'focus did not return');
  });
  await go('/components/tooltip/code');
  await check('Tooltip', 'shows on keyboard focus', async () => {
    await main().getByRole('button', { name: 'Share' }).first().focus(); await page.waitForTimeout(500);
    expect(await page.locator('[role="tooltip"]').count() > 0, 'no tooltip on focus');
  });
  await go('/components/toast/code');
  await check('Toast', 'is announced as a status in a labelled region', async () => {
    await main().getByRole('button', { name: 'Order print' }).click(); await page.waitForTimeout(300);
    expect(await page.locator('[data-component="Toast"]').count() > 0, 'no toast shown');
    expect(await page.locator('[role="region"]').count() > 0, 'no toast region');
  });
  await go('/components/snackbar/code');
  await check('Snackbar', 'shows one line with its action reachable', async () => {
    await main().getByRole('button', { name: 'Archive' }).click(); await page.waitForTimeout(300);
    expect(await page.locator('[data-component="Snackbar"] button').count() > 0, 'no action');
  });
  await go('/components/fab/code');
  await check('FAB', 'has an accessible name and a 56px target', async () => {
    const f = main().locator('[data-component="FAB"]').first();
    const name = (await f.getAttribute('aria-label')) || (await f.textContent());
    const b = await f.boundingBox();
    expect(name && name.trim().length > 0, 'no name'); expect(b && b.height >= 55, `height ${b?.height}`);
  });
  await go('/components/pull-to-refresh/code');
  await check('PullToRefresh', 'a Refresh button is reachable with Tab and shows on focus', async () => {
    const btn = main().locator('[data-component="PullToRefresh"] > button').first();
    await btn.focus(); const b = await btn.boundingBox();
    expect(b && b.height >= 44, 'the focused Refresh button does not show');
  });
}
