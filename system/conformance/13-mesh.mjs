// Mesh (D-029). Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  await go('/components/mesh/code');
  await check('Mesh', 'decorative by default, an img with its label when named, never focusable', async () => {
    const meshes = main().locator('[data-component="Mesh"]');
    expect((await meshes.count()) > 0, 'no Mesh on the Code page');
    const named = main().locator('[data-component="Mesh"][role="img"]').first();
    expect((await named.getAttribute('aria-label'))?.length > 0, 'a named mesh has no aria-label');
    const tab = await meshes.first().evaluate((e) => e.tabIndex);
    expect(tab < 0, 'a mesh is focusable');
  });
  await check('Mesh', 'forced colours drop the pools', async () => {
    await page.emulateMedia({ forcedColors: 'active' });
    const shown = await main().locator('[data-component="Mesh"] [class*="paint"]').first().evaluate((e) => getComputedStyle(e).display);
    await page.emulateMedia({ forcedColors: 'none' });
    expect(shown === 'none', `paint layer is ${shown} in forced colours`);
  });
}
