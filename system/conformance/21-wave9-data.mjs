// Wave 9 complex data and charts. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  // examples only: the header's live demo stage renders the component first on every tab
  const ex = () => main().locator('figure.example');
  const focused = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent ?? '');

  await go('/components/calendar/code');
  await check('Calendar', 'a month is a grid of day buttons named in full, with the chosen day selected', async () => {
    const cal = ex().locator('[data-component="Calendar"]').first();
    expect(await cal.locator('[role="grid"]').count() === 1, 'no grid');
    const sel = cal.locator('[role="gridcell"][aria-selected="true"] button');
    expect((await sel.getAttribute('aria-label'))?.includes('November'), `the chosen day reads ${await sel.getAttribute('aria-label')}`);
  });
  await check('Calendar', 'arrow keys move a day and a week, and Enter chooses', async () => {
    const cal = ex().locator('[data-component="Calendar"]').first();
    await cal.locator('button[tabindex="0"]').focus();
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowDown');
    expect(/November 20|20 November/.test(await focused()), `focus is on ${await focused()}`);
    await page.keyboard.press('Enter');
    expect(/November 20|20 November/.test((await cal.locator('[role="gridcell"][aria-selected="true"] button').getAttribute('aria-label')) ?? ''), 'Enter did not choose');
  });
  await check('Calendar', 'Page Down shows the next month', async () => {
    const cal = ex().locator('[data-component="Calendar"]').first();
    await cal.locator('button[tabindex="0"]').focus(); await page.keyboard.press('PageDown');
    expect((await cal.locator('h2').textContent())?.includes('December'), 'the month did not change');
  });
  await check('Calendar', 'a range is chosen with two presses', async () => {
    const cal = ex().locator('[data-component="Calendar"]').nth(1);
    await cal.locator('button', { hasText: /^3$/ }).first().click(); await cal.locator('button', { hasText: /^6$/ }).first().click();
    expect(await cal.locator('[role="gridcell"][aria-selected="true"]').count() === 4, `${await cal.locator('[role="gridcell"][aria-selected="true"]').count()} days chosen`);
  });
  await check('Calendar', 'unavailable days cannot be chosen', async () => {
    const cal = ex().locator('[data-component="Calendar"]').nth(2);
    const sunday = cal.locator('button[aria-disabled="true"]', { hasText: /^8$/ }).first();
    expect(await sunday.count() === 1, 'Sunday is not marked unavailable');
    await sunday.click({ force: true });
    expect(await cal.locator('[role="gridcell"][aria-selected="true"]').count() === 0, 'an unavailable day was chosen');
  });

  await go('/components/date-picker/code');
  await check('DatePicker', 'it opens the calendar, and choosing closes it with focus back on the field', async () => {
    const trig = ex().locator('button[data-component="DatePicker"]').first();
    await trig.click();
    const pop = page.locator('[data-radix-popper-content-wrapper] [data-component="Calendar"]');
    expect(await pop.count() === 1, 'no calendar opened');
    await pop.locator('button', { hasText: /^20$/ }).first().click(); await page.waitForTimeout(150);
    expect(await pop.count() === 0, 'the calendar stayed open');
    expect(await trig.evaluate((e) => e === document.activeElement), 'focus did not return to the field');
    expect((await trig.textContent())?.includes('20'), 'the field does not show the day');
  });
  await check('DatePicker', 'Esc closes the calendar', async () => {
    const trig = ex().locator('button[data-component="DatePicker"]').first();
    await trig.click(); await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    expect(await page.locator('[data-radix-popper-content-wrapper] [data-component="Calendar"]').count() === 0, 'Esc did not close');
  });

  await go('/components/time-picker/code');
  await check('TimePicker', 'times are offered at the step', async () => {
    const trig = ex().locator('[data-component="TimePicker"] [role="combobox"]').first();
    await trig.click();
    const n = await page.locator('[role="listbox"] [role="option"]').count();
    await page.keyboard.press('Escape');
    expect(n === 17, `${n} times between 9:00 and 17:00 every 30 minutes`);
  });

  await go('/components/tree-view/code');
  await check('TreeView', 'it is a tree with levels and open state', async () => {
    const tree = ex().locator('[data-component="TreeView"]').first();
    expect(await tree.getAttribute('role') === 'tree', 'no tree role');
    expect(await tree.locator('[role="treeitem"][aria-level="3"]').count() > 0, 'no levels');
    expect(await tree.locator('[role="treeitem"][aria-expanded="true"]').count() === 2, 'open state is not said');
  });
  await check('TreeView', 'arrow keys open, close and move between rows', async () => {
    const tree = ex().locator('[data-component="TreeView"]').first();
    await tree.locator('[role="treeitem"][tabindex="0"]').focus();
    await page.keyboard.press('ArrowLeft');
    const parent = tree.locator('[role="treeitem"][aria-level="2"]').first();
    expect(await parent.evaluate((e) => e === document.activeElement), 'Left did not go to the parent');
    await page.keyboard.press('ArrowLeft');
    expect(await parent.getAttribute('aria-expanded') === 'false', 'Left did not close');
    await page.keyboard.press('ArrowRight');
    expect(await parent.getAttribute('aria-expanded') === 'true', 'Right did not open');
  });
  await check('TreeView', 'typing a letter finds the next row', async () => {
    const tree = ex().locator('[data-component="TreeView"]').nth(1);
    await tree.locator('[role="treeitem"]').first().focus(); await page.keyboard.press('d');
    expect((await focused()).startsWith('Drafts'), `focus is on ${await focused()}`);
  });

  await go('/components/carousel/code');
  await check('Carousel', 'slides are named groups and Next moves on', async () => {
    const car = ex().locator('[data-component="Carousel"]').first();
    expect(await car.locator('[aria-roledescription="slide"]').first().getAttribute('aria-label') === '1 of 4', 'slides are not named');
    await car.getByRole('button', { name: 'Next slide' }).click(); await page.waitForTimeout(500);
    expect((await car.locator('[aria-live="polite"]').textContent())?.startsWith('2 of'), 'Next did not move on');
  });
  await check('Carousel', 'it never moves by itself', async () => {
    const car = ex().locator('[data-component="Carousel"]').nth(1);
    const before = await car.locator('[aria-live="polite"]').textContent(); await page.waitForTimeout(2500);
    expect(await car.locator('[aria-live="polite"]').textContent() === before, 'it moved on its own');
  });

  await go('/components/virtual-list/code');
  await check('VirtualList', 'only rows in view are drawn and each says its place', async () => {
    const list = ex().locator('[data-component="VirtualList"]').first();
    const n = await list.locator('li').count();
    expect(n > 0 && n < 80, `${n} rows drawn`);
    expect(await list.locator('li').first().getAttribute('aria-setsize') === '5000', 'no set size');
  });
  await check('VirtualList', 'scrolling draws the rows further down', async () => {
    const list = ex().locator('[data-component="VirtualList"]').first();
    await list.evaluate((e) => { e.scrollTop = 44 * 2000; e.dispatchEvent(new Event('scroll')); }); await page.waitForTimeout(150);
    expect(Number(await list.locator('li').first().getAttribute('aria-posinset')) > 1900, 'the rows did not follow the scroll');
  });

  await go('/components/transfer-list/code');
  await check('TransferList', 'Add moves the chosen items and says how many', async () => {
    const tl = ex().locator('[data-component="TransferList"]').nth(1);
    await tl.locator('[role="option"]', { hasText: 'Photo Rag' }).click();
    const add = tl.getByRole('button', { name: /Add 1/ });
    expect(await add.count() === 1, 'the button does not say how many');
    await add.click();
    expect(await tl.locator('[role="listbox"]').nth(1).locator('[role="option"]', { hasText: 'Photo Rag' }).count() === 1, 'the item did not move');
  });

  await go('/components/data-grid/code');
  await check('DataGrid', 'one tab stop, and arrow keys move between cells', async () => {
    const grid = ex().locator('[data-component="DataGrid"]').first();
    expect(await grid.locator('[tabindex="0"]').count() === 1, `${await grid.locator('[tabindex="0"]').count()} tab stops`);
    await grid.locator('[tabindex="0"]').focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowRight');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('data-cell')) === '1-1', 'the arrows did not move between cells');
  });
  await check('DataGrid', 'choose all chooses every row', async () => {
    const grid = ex().locator('[data-component="DataGrid"]').first();
    await grid.getByRole('checkbox', { name: 'Choose all rows' }).click();
    expect(await grid.locator('tbody tr[aria-selected="true"]').count() === 4, 'not every row is chosen');
  });
  await check('DataGrid', 'pressing a sortable header sorts the rows', async () => {
    const grid = ex().locator('[data-component="DataGrid"]').first();
    await grid.locator('th[aria-sort] button', { hasText: 'Price' }).click();
    expect(await grid.locator('th[aria-sort="ascending"]').count() === 1, 'aria-sort does not follow');
    expect((await grid.locator('tbody tr').first().textContent())?.includes('Senja'), 'the rows did not sort');
  });

  await go('/components/bar-chart/code');
  await check('BarChart', 'arrow keys read each category aloud', async () => {
    const fig = ex().locator('[data-component="BarChart"]').first();
    await fig.locator('[aria-roledescription="chart"]').focus(); await page.keyboard.press('ArrowRight');
    expect((await fig.locator('[aria-live="polite"]').textContent())?.includes('Jan'), 'nothing is read');
  });
  await check('BarChart', 'the table view holds every value', async () => {
    const fig = ex().locator('[data-component="BarChart"]').first();
    await fig.getByRole('button', { name: 'Show table' }).click();
    expect(await fig.locator('table tbody tr').count() === 9, 'the table does not have every month');
    await fig.getByRole('button', { name: 'Show chart' }).click();
  });
  await check('BarChart', 'two or more series have a legend', async () => {
    expect(await ex().locator('[data-component="BarChart"]').nth(1).locator('[aria-label="Legend"] li').count() === 2, 'no legend for two series');
  });

  await go('/components/line-chart/code');
  await check('LineChart', 'arrow keys walk the points and every series is read', async () => {
    const fig = ex().locator('[data-component="LineChart"]').nth(1);
    await fig.locator('[aria-roledescription="chart"]').focus(); await page.keyboard.press('ArrowRight');
    const said = await fig.locator('[aria-live="polite"]').textContent();
    expect(said?.includes('Oslo') && said?.includes('Bergen') && said?.includes('Tromsø'), `read ${said}`);
  });
  await check('LineChart', 'up to four series are labelled at their ends', async () => {
    const labels = await ex().locator('[data-component="LineChart"]').nth(1).locator('svg text').allTextContents();
    expect(['Oslo', 'Bergen', 'Tromsø'].every((n) => labels.includes(n)), 'end labels are missing');
  });

  await go('/components/sparkline/code');
  await check('Sparkline', 'it is an image with its trend in words', async () => {
    const s = ex().locator('[data-component="Sparkline"]').first();
    expect(await s.getAttribute('role') === 'img' && (await s.getAttribute('aria-label'))?.includes('rising'), 'no trend in words');
  });

  await go('/components/heatmap/code');
  await check('Heatmap', 'arrow keys read each cell aloud', async () => {
    const fig = ex().locator('[data-component="Heatmap"]').first();
    await fig.locator('[aria-roledescription="chart"]').focus(); await page.keyboard.press('ArrowRight');
    expect((await fig.locator('[aria-live="polite"]').textContent())?.includes('Mon, 08'), 'nothing is read');
  });
  await check('Heatmap', 'a scale says the lowest and the highest value', async () => {
    const txt = await ex().locator('[data-component="Heatmap"]').first().textContent();
    expect(txt?.includes('1') && txt?.includes('14'), 'no scale');
  });
}
