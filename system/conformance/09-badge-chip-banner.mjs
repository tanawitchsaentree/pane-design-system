// Badge / Chip / Banner. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Badge / Chip / Banner ------------------------------------------------------------------------
  await go('/components/badge/code');
  await check('Badge', 'status is in the text, with no role (read in place)', async () => {
    const b = main().getByText('Failed', { exact: true }).first();
    expect((await b.getAttribute('role')) === null, 'has a role');
  });
  await go('/components/chip/code');
  const photos = main().getByRole('button', { name: 'Photos' }).first();
  await check('Chip', 'reachable with Tab', () => tabTo(page, photos));
  await check('Chip', 'Space and Enter toggle aria-pressed', async () => {
    const vids = main().getByRole('button', { name: 'Videos' }).first();
    await tabTo(page, vids);
    expect((await vids.getAttribute('aria-pressed')) === 'false', 'not unpressed at start');
    await page.keyboard.press('Space');
    await eventually(() => vids.getAttribute('aria-pressed'), 'true', 'Space did not press');
    await page.keyboard.press('Enter');
    await eventually(() => vids.getAttribute('aria-pressed'), 'false', 'Enter did not unpress');
  });
  await check('Chip', 'a check mark marks the selected chip as well as its colour', async () => {
    expect((await photos.locator('svg').count()) === 1, 'no check mark on the selected chip');
  });
  await check('Chip', 'an input chip’s remove button is named after the chip and removes it', async () => {
    const rm = main().getByRole('button', { name: 'Remove Grace Hopper' });
    expect((await rm.count()) === 1, 'no "Remove Grace Hopper" button');
    await rm.click();
    expect((await main().getByRole('button', { name: 'Remove Grace Hopper' }).count()) === 0, 'chip still there');
  });
}
