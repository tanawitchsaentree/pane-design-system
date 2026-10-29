// Wave 7 data display. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;

  await go('/components/progress/code');
  await check('Progress', 'a known amount is a progressbar with its value', async () => {
    const bar = main().locator('[data-component="Progress"] [role="progressbar"][aria-valuenow]').first();
    expect(await bar.count() === 1, 'no progressbar with a value');
    expect(await bar.getAttribute('aria-label'), 'the bar has no name');
    expect(await bar.getAttribute('aria-valuemax') === '100', 'no max');
  });
  await check('Progress', 'an unknown amount has no value', async () => {
    const bars = main().locator('[data-component="Progress"] [role="progressbar"]:not([aria-valuenow])');
    expect(await bars.count() > 0, 'no unknown bar on the page');
    // the book is checked under reduced motion, where the bar must stand still; with motion allowed it travels
    const anim = () => bars.first().locator('span').evaluate((e) => getComputedStyle(e).animationName);
    expect(await anim() === 'none', 'the unknown bar moves under reduced motion');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const moving = await anim();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(moving && moving !== 'none', 'the unknown bar does not travel');
  });

  await go('/components/meter/code');
  await check('Meter', 'a meter with its range and reading', async () => {
    const m = main().locator('[data-component="Meter"] [role="meter"]').first();
    expect(await m.getAttribute('aria-valuemin') !== null && await m.getAttribute('aria-valuemax') !== null, 'no range');
    expect(await m.getAttribute('aria-valuetext'), 'no reading in words');
  });
  await check('Meter', 'a high reading says Almost full and a full one says Full', async () => {
    const warn = main().locator('[data-component="Meter"][data-level="warning"]').first();
    const full = main().locator('[data-component="Meter"][data-level="critical"]').first();
    expect((await warn.textContent())?.includes('Almost full'), 'no Almost full');
    expect((await full.textContent())?.includes('Full'), 'no Full');
    expect((await full.locator('[role="meter"]').getAttribute('aria-valuetext'))?.includes('full'), 'the level is not read aloud');
  });

  await go('/components/stat/code');
  await check('Stat', 'the change is read with its direction', async () => {
    const txt = await main().locator('[data-component="Stat"]').first().textContent();
    expect((txt ?? '').includes('up 12%'), `direction not in the text: ${txt}`);
  });

  await go('/components/empty-state/code');
  await check('EmptyState', 'the title is a heading at the level given', async () => {
    const root = main().locator('[data-component="EmptyState"]');
    expect(await root.first().locator('h2').count() === 1, 'default title is not an h2');
    expect(await main().locator('[data-component="EmptyState"] h4').count() > 0, 'level={4} did not make an h4');
  });

  await go('/components/timeline/code');
  await check('Timeline', 'an ordered list with the current event marked', async () => {
    const ol = main().locator('ol[data-component="Timeline"]').first();
    expect(await ol.getAttribute('aria-label'), 'no name');
    expect(await ol.locator('li[aria-current="step"]').count() === 1, 'not one current event');
  });

  await go('/components/description-list/code');
  await check('DescriptionList', 'terms and details in a dl', async () => {
    const dl = main().locator('dl[data-component="DescriptionList"]').first();
    expect(await dl.locator('dt').count() > 0 && await dl.locator('dt').count() === await dl.locator('dd').count(), 'terms and details do not pair');
  });

  await go('/components/list/code');
  await check('List', 'a list whose pressable rows are links or buttons', async () => {
    const ul = main().locator('ul[data-component="List"]');
    expect(await ul.first().locator('li').count() > 0, 'no rows');
    expect(await ul.locator('li > a[href]').count() > 0, 'no link rows');
    expect(await ul.locator('li > button').count() > 0, 'no button rows');
    const h = await ul.locator('li > a[href]').first().evaluate((e) => e.getBoundingClientRect().height);
    expect(h >= 44, `a pressable row is ${h}px tall`);
  });

  await go('/components/table/code');
  await check('Table', 'a captioned table in a focusable named region', async () => {
    const r = main().locator('[data-component="Table"][role="region"]').first();
    expect(await r.getAttribute('aria-label'), 'region has no name');
    expect(await r.getAttribute('tabindex') === '0', 'region does not take focus');
    expect(await r.locator('caption').count() === 1, 'no caption');
  });
  await check('Table', 'a sortable header is a button and says its order', async () => {
    const r = main().locator('[data-component="Table"][aria-label="Prints in the shop"]').first();
    expect(await r.locator('th[aria-sort] button').count() > 0, 'no sort buttons');
    expect(await r.locator('th[aria-sort="descending"]').count() === 1, 'the default sort is not marked');
  });
  await check('Table', 'pressing a header sorts the rows', async () => {
    const r = main().locator('[data-component="Table"][aria-label="Prints in the shop"]').first();
    const first = () => r.locator('tbody tr:first-child td:first-child').textContent();
    await r.locator('th', { hasText: 'Print' }).locator('button').click(); await page.waitForTimeout(100);
    expect(await first() === 'Höfn harbour', `ascending by print starts with ${await first()}`);
    expect(await r.locator('th', { hasText: 'Print' }).getAttribute('aria-sort') === 'ascending', 'aria-sort did not follow');
    await r.locator('th', { hasText: 'Print' }).locator('button').click(); await page.waitForTimeout(100);
    expect(await first() === 'Vík in fog', `descending by print starts with ${await first()}`);
  });
}
