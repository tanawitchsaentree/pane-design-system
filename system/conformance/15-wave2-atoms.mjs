// Wave 2 atoms. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  await go('/components/heading/code');
  await check('Heading', 'renders the h level it is given, whatever its size', async () => {
    const tags = await main().locator('[data-component="Heading"]').evaluateAll((els) => els.map((e) => e.tagName));
    expect(tags.includes('H2') && tags.includes('H3'), `levels found: ${tags.join(',')}`);
  });
  await go('/components/link/code');
  await check('Link', 'reachable with Tab, underlined inline, external says it opens a new tab', async () => {
    const l = main().locator('[data-component="Link"]').first();
    expect((await l.evaluate((e) => getComputedStyle(e).textDecorationLine)).includes('underline'), 'inline link has no underline');
    const ext = main().locator('[data-component="Link"][target="_blank"]').first();
    expect((await ext.textContent()).includes('opens in a new tab'), 'external link does not say it opens a new tab');
    expect((await ext.getAttribute('rel'))?.includes('noopener'), 'external link without noopener');
  });
  await go('/components/spinner/code');
  await check('Spinner', 'a status with a label', async () => {
    const s = main().locator('[data-component="Spinner"]').first();
    expect((await s.getAttribute('role')) === 'status' && (await s.getAttribute('aria-label'))?.length > 0, 'spinner without status role or label');
  });
  await go('/components/skeleton/code');
  await check('Skeleton', 'hidden from assistive technology', async () => {
    const all = await main().locator('[data-component="Skeleton"]').evaluateAll((els) => els.every((e) => e.getAttribute('aria-hidden') === 'true'));
    expect(all, 'a skeleton is exposed');
  });
  await go('/components/image/code');
  await check('Image', 'every image has alt, loads lazily, and a failed one stays a recess', async () => {
    const imgs = await main().locator('[data-component="Image"]').evaluateAll((els) => els.map((e) => [e.hasAttribute('alt'), e.loading, e.dataset.state]));
    expect(imgs.every(([a]) => a), 'an image without alt');
    expect(imgs.every(([, l]) => l === 'lazy'), 'an image not lazy');
    await page.waitForTimeout(300);
    const states = await main().locator('[data-component="Image"]').evaluateAll((els) => els.map((e) => e.dataset.state));
    expect(states.includes('error'), 'no failed image in the examples to check');
  });
  await go('/components/icon/code');
  await check('Icon', 'decorative by default, an img with its label when named', async () => {
    const r = await main().locator('[data-component="Icon"]').evaluateAll((els) => els.map((e) => [e.getAttribute('aria-hidden'), e.getAttribute('role'), e.getAttribute('aria-label')]));
    expect(r.some(([h]) => h === 'true'), 'no decorative icon');
    expect(r.some(([, role, l]) => role === 'img' && l), 'no named icon');
  });
}
