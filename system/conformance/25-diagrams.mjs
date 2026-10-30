// ConfidenceChip, NodeCard, NetworkGraph and SequenceDiagram. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page, tabTo } = t;
  // retry an assertion for a second: selection and live lines land a tick after the key
  const eventually = async (fn, ms = 1000) => { const end = Date.now() + ms; for (;;) { try { return await fn(); } catch (e) { if (Date.now() > end) throw e; await new Promise((r) => setTimeout(r, 50)); } } };
  const ex = () => main().locator('figure.example');

  await go('/components/confidence-chip/code');
  await check('ConfidenceChip', 'it is an image that says its level', async () => {
    const c = ex().locator('[data-component="ConfidenceChip"]').nth(3);
    expect(await c.getAttribute('role') === 'img', 'not an image');
    expect(await c.getAttribute('tabindex') === null, 'it takes focus');
  });
  await check('ConfidenceChip', 'it says the level in words', async () => {
    const said = (await ex().locator('[data-component="ConfidenceChip"]').nth(3).getAttribute('aria-label')) ?? '';
    expect(said === 'High, 4 of 5', `said "${said}"`);
    const own = (await ex().locator('[data-component="ConfidenceChip"][aria-label^="Confidence"]').first().getAttribute('aria-label')) ?? '';
    expect(own === 'Confidence: High, 4 of 5', `said "${own}"`);
  });

  await go('/components/node-card/code');
  const nodes = () => ex().locator('[data-component="NodeCard"]');
  await check('NodeCard', 'each node is a tab stop', async () => {
    const n = nodes().first();
    await tabTo(page, n);
    expect(await n.getAttribute('aria-roledescription') === 'node', 'not described as a node');
  });
  await check('NodeCard', 'Enter picks the node', async () => {
    const n = ex().locator('[data-component="NodeCard"][aria-label="Source"]').first();
    await n.focus(); await page.keyboard.press('Enter');
    await eventually(async () => expect(await n.getAttribute('aria-current') === 'true' && await n.getAttribute('data-selected') !== null, 'Enter did not pick it'));
  });
  await check('NodeCard', 'arrow keys move the node', async () => {
    const n = ex().locator('[data-component="NodeCard"][aria-label="Move me"]').first();
    const at = n.locator('xpath=..').locator('p[aria-live]');
    await n.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Shift+ArrowDown');
    await eventually(async () => { const s = (await at.textContent()) ?? ''; expect(s === 'At 1, 10', `after → and Shift+↓ it says "${s}"`); });
  });

  await go('/components/network-graph/code');
  const plot = () => ex().first().locator('[data-component="NetworkGraph"] [aria-roledescription="chart"]');
  await check('NetworkGraph', 'the plot is one tab stop', async () => {
    await tabTo(page, plot());
    const said = (await plot().getAttribute('aria-label')) ?? '';
    expect(/6 nodes and 6 links/.test(said), `said "${said}"`);
  });
  await check('NetworkGraph', 'arrow keys walk from node to node', async () => {
    await plot().focus(); await page.keyboard.press('ArrowRight');
    const live = ex().first().locator('[data-component="NetworkGraph"] [aria-live]');
    await eventually(async () => { const s = (await live.textContent()) ?? ''; expect(/, linked to \d/.test(s), `live line "${s}"`); });
    const first = await live.textContent(); await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft');
    await eventually(async () => expect((await live.textContent()) !== first, 'the arrows did not move'));
  });
  await check('NetworkGraph', 'Enter picks the node', async () => {
    const fig = ex().nth(2);
    const p = fig.locator('[aria-roledescription="chart"]');
    await p.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter');
    await eventually(async () => { const s = (await fig.locator('p[aria-live]').textContent()) ?? ''; expect(s.startsWith('Picked '), `said "${s}"`); });
  });

  await go('/components/sequence-diagram/code');
  await check('SequenceDiagram', 'each step is spoken in order', async () => {
    const said = await ex().first().locator('[data-component="SequenceDiagram"] ol > li').evaluateAll((l) => l.map((x) => x.getAttribute('aria-label')));
    expect(said[0] === 'App to API: Place order' && said[2] === 'Bank replies to API: Approved', `said ${JSON.stringify(said)}`);
  });
  await check('SequenceDiagram', 'the lanes scroll with the keyboard', async () => {
    await page.setViewportSize({ width: 375, height: 800 });
    const s = ex().locator('[data-component="SequenceDiagram"] [role="region"][aria-label="Placing an order"]').first();
    await s.scrollIntoViewIfNeeded(); await s.focus();
    const before = await s.evaluate((e) => e.scrollLeft); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    await eventually(async () => expect(await s.evaluate((e) => e.scrollLeft) > before, 'the lanes did not scroll'));
    await page.setViewportSize({ width: 1280, height: 900 });
  });
}
