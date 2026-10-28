// Avatar. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Avatar ---------------------------------------------------------------------------------
  await go('/components/avatar/code');
  await check('Avatar', 'non-decorative avatars are role="img" named after the person', async () => {
    for (const n of ['Max Fmz', 'Visual Flow', 'Ada Lovelace', 'Grace Hopper']) expect((await main().getByRole('img', { name: n }).count()) >= 1, `no img named ${n}`);
  });
  await check('Avatar', 'decorative avatar beside a visible name is hidden from assistive tech', async () => {
    const n = await main().locator('[aria-hidden="true"]').filter({ hasText: 'MF' }).count();
    expect(n >= 1, 'decorative avatar is not aria-hidden');
  });

}
