// Wave 6 navigation. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  const focused = () => page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');

  await go('/components/segmented-control/code');
  await check('SegmentedControl', 'one tab stop', async () => {
    const root = main().locator('[data-example-live] [data-component="SegmentedControl"]').first();
    // the roving group is one stop: the group itself until a segment has been focused, then that segment
    const stops = await root.evaluate((r) => [r, ...r.querySelectorAll('button')].filter((e) => e.tabIndex === 0).length);
    expect(stops === 1, `${stops} tab stops`);
  });
  await check('SegmentedControl', 'arrow keys move', async () => {
    const root = main().locator('[data-example-live] [data-component="SegmentedControl"]').first();
    await root.locator('[data-state="on"]').focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
    expect(await focused() === 'List', `focus on ${await focused()}`);
  });
  await check('SegmentedControl', 'Space chooses', async () => {
    const root = main().locator('[data-example-live] [data-component="SegmentedControl"]').first();
    await page.keyboard.press('Space'); await page.waitForTimeout(100);
    expect((await root.locator('button[data-state="on"]').first().textContent()) === 'List', 'Space did not choose');
  });

  await go('/components/bottom-nav/code');
  await check('BottomNav', 'links in a nav with the current page marked', async () => {
    const nav = main().locator('nav[data-component="BottomNav"]').first();
    expect(await nav.getAttribute('aria-label'), 'no name');
    expect(await nav.locator('a[aria-current="page"]').count() === 1, 'no single current page');
  });

  await go('/components/navbar/code');
  await check('Navbar', 'links in a nav with the current page marked', async () => {
    const bar = main().locator('[data-component="Navbar"]').first();
    expect(await bar.locator('nav[aria-label] a[aria-current="page"]').count() === 1, 'no single current page');
  });

  await go('/components/sidebar/code');
  await check('Sidebar', 'links in a nav, groups named by their titles', async () => {
    const nav = main().locator('nav[data-component="Sidebar"]').first();
    expect(await nav.locator('a[aria-current="page"]').count() === 1, 'no single current page');
    const named = await nav.locator('ul[aria-labelledby]').evaluateAll((ls) => ls.every((l) => document.getElementById(l.getAttribute('aria-labelledby'))?.textContent));
    expect(named, 'a group points at a missing title');
  });

  await go('/components/breadcrumb/code');
  await check('Breadcrumb', 'links in a nav, the current page announced and not a link', async () => {
    const nav = main().locator('nav[data-component="Breadcrumb"]').first();
    const cur = nav.locator('[aria-current="page"]');
    expect(await cur.count() === 1, 'no current page');
    expect(await cur.evaluate((e) => e.tagName !== 'A'), 'the current page is a link');
  });

  await go('/components/pagination/code');
  await check('Pagination', 'buttons in a nav', async () => {
    const nav = main().locator('nav[data-component="Pagination"]').first();
    expect(await nav.locator('[aria-current="page"]').count() === 1, 'no current page');
  });
  await check('Pagination', 'Next goes on', async () => {
    const nav = main().locator('nav[data-component="Pagination"]').first();
    const before = await nav.locator('[aria-current="page"]').textContent();
    await nav.locator('button', { hasText: 'Next' }).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(100);
    const after = await nav.locator('[aria-current="page"]').textContent();
    expect(Number(after) === Number(before) + 1, `page ${before} → ${after}`);
  });

  await go('/components/stepper/code');
  await check('Stepper', 'aria-current="step" on one step, the rest say done or not started', async () => {
    const ol = main().locator('ol[data-component="Stepper"]').first();
    expect(await ol.locator('[aria-current="step"]').count() === 1, 'no single current step');
    const text = await ol.textContent();
    expect(text.includes(', done') && text.includes(', not started'), 'steps do not announce their state');
  });

  await go('/components/accordion/code');
  await check('Accordion', 'each heading is a button', async () => {
    const root = main().locator('[data-component="Accordion"]').first();
    const n = await root.locator(':is(h2, h3, h4) > button[aria-expanded]').count();
    expect(n >= 2, `${n} heading buttons`);
  });
  await check('Accordion', 'Enter opens a section', async () => {
    const root = main().locator('[data-component="Accordion"]').first();
    const closed = root.locator('button[aria-expanded="false"]').first();
    await closed.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.activeElement?.getAttribute('aria-expanded')) === 'true', 'Enter did not open');
  });

  await go('/components/navigation-menu/code');
  await check('NavigationMenu', 'Enter opens a panel', async () => {
    const nav = main().locator('nav[data-component="NavigationMenu"]').first();
    const btn = nav.locator('button[aria-expanded]').first();
    await btn.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(150);
    expect(await btn.getAttribute('aria-expanded') === 'true', 'did not open');
    expect(await nav.locator(`#${await btn.getAttribute('aria-controls')}`).isVisible(), 'panel not shown');
  });
  await check('NavigationMenu', 'Esc closes and focus returns', async () => {
    const nav = main().locator('nav[data-component="NavigationMenu"]').first();
    const btn = nav.locator('button[aria-expanded]').first();
    await page.keyboard.press('Tab'); await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    expect(await btn.getAttribute('aria-expanded') === 'false', 'still open');
    expect(await btn.evaluate((e) => e === document.activeElement), 'focus did not return');
  });

  await go('/components/table-of-contents/code');
  await check('TableOfContents', 'a link moves focus to its heading', async () => {
    // the hero lists sections of an imagined article; the tracked example links to headings on this page
    const hrefs = await main().locator('nav[data-component="TableOfContents"] a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')).filter((h) => document.getElementById(h.slice(1))));
    expect(hrefs.length > 0, 'no contents link points at a heading on the page');
    const id = hrefs[0].slice(1);
    await main().locator(`nav[data-component="TableOfContents"] a[href="#${id}"]`).first().click(); await page.waitForTimeout(100);
    expect(await page.evaluate(() => document.activeElement?.id) === id, 'focus did not move to the heading');
  });
}
