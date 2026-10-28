// Environment. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- Environment ----------------------------------------------------------------------------
  await go('/components/environment/code');
  // Real brightness values are currently all equal (D-011), so the wiring is proven with distinct
  // probe values set on :root for the duration of the check, then removed.
  const probe = { dim: '0.9', mid: '0.6', bright: '0.3' };
  const withProbe = async (fn) => {
    await page.evaluate((p) => { for (const [k, v] of Object.entries(p)) document.documentElement.style.setProperty(`--ds-brightness-${k}`, v); }, probe);
    try { return await fn(); } finally { await page.evaluate(() => { for (const k of ['dim', 'mid', 'bright']) document.documentElement.style.removeProperty(`--ds-brightness-${k}`); }); }
  };
  const tiles = () => main().locator('.env-tile:not(.backdrop-cell) [data-environment] > *');
  await check('Environment', 'each brightness wires its own backdrop dimming into the card (probe values)', () => withProbe(async () => {
    const got = await tiles().evaluateAll((els) => els.map((e) => getComputedStyle(e).backdropFilter.match(/brightness\(([\d.]+)\)/)?.[1]));
    expect(got.join() === [probe.dim, probe.mid, probe.bright].join(), `card backdrop-filter brightness per tile: ${got.join(', ')}`);
    return `dim→${got[0]} mid→${got[1]} bright→${got[2]}`;
  }));
  await check('Environment', 'reduced transparency turns every environment opaque, no dimming (D-005)', async () => {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
    const st = await tiles().evaluateAll((els) => els.map((e) => { const c = getComputedStyle(e); return `${c.backgroundColor}|${c.backdropFilter}`; }));
    await cdp.send('Emulation.setEmulatedMedia', { features: [] });
    expect(new Set(st).size === 1, `differs: ${st.join(' / ')}`);
    expect(/rgb\(44, 44, 52\)/.test(st[0]) && /blur\(0px\)/.test(st[0]) && /brightness\(1\)/.test(st[0]), `not opaque/undimmed: ${st[0]}`);
    return st[0];
  });
  await check('Environment', 'no declaration falls back to bright (the safe end)', () => withProbe(async () => {
    const v = await page.evaluate(() => { const d = document.createElement('div'); document.body.append(d); const out = getComputedStyle(d).getPropertyValue('--ds-glass-brightness').trim(); d.remove(); return out; });
    expect(v === probe.bright, `--ds-glass-brightness outside any environment = ${v} (bright probe ${probe.bright})`);
  }));
  await check('Environment', 'reduced motion zeroes every motion duration at the token level', async () => {
    const v = await page.evaluate(() => ['--ds-motion-hover', '--ds-motion-enter', '--ds-motion-scene'].map((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim()));
    expect(v.every((x) => x === '0ms'), v.join(', '));
  });

}
