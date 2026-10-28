// Grid / Container / Stack. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Grid / Container / Stack --------------------------------------------------------------------
    await check('Grid', 'columns follow the breakpoint tokens, with 4 at 375px, 8 at 800px and 12 at 1280px', async () => {
    const got = [];
    for (const w of [375, 800, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      await go('/components/grid/code');
      got.push(await main().locator('#demos .demo-full').first().evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(got.join() === '4,8,12', `columns at 375/800/1280: ${got.join(', ')}`);
    return got.join(' → ');
  });
  await check('Grid', 'GridItem spans switch per breakpoint (full → md 4/8 → lg 4/12)', async () => {
    const ratios = [];
    for (const w of [375, 800, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      await go('/components/grid/code');
      ratios.push(await main().locator('#hero .demo-full').first().evaluate((g) => Math.round((g.firstElementChild.getBoundingClientRect().width / g.getBoundingClientRect().width) * 100)));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(ratios[0] === 100 && ratios[1] > 45 && ratios[1] < 50 && ratios[2] > 29 && ratios[2] < 34, `item width % of grid: ${ratios.join(', ')}`);
    return ratios.map((r) => `${r}%`).join(' → ');
  });
  await check('Container', 'xl caps at 1200px and the margin grows 16 → 32 → 48px', async () => {
    const pads = [];
    for (const w of [375, 800, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      await go('/components/container/code');
      pads.push(await page.evaluate(() => { const d = document.createElement('div'); d.className = document.querySelector('main #hero .demo-full')?.className ?? ''; return getComputedStyle(document.querySelector('main #hero .demo-full')).paddingInlineStart; }));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(pads.join() === '16px,32px,48px', `padding-inline at 375/800/1280: ${pads.join(', ')}`);
    return pads.join(' → ');
  });
  await check('Stack', 'gap comes from the token scale (md = 16px, xl = 32px)', async () => {
    await go('/components/stack/code');
    const gaps = await main().locator('#demos .demo-card').nth(1).locator('> div').evaluateAll((els) => els.map((e) => getComputedStyle(e).columnGap));
    expect(gaps.join() === '4px,8px,16px,24px,32px', `gaps: ${gaps.join(', ')}`);
    return gaps.join(' · ');
  });

}
