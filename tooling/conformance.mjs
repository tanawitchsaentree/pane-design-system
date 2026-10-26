#!/usr/bin/env node
// conformance — behaviour checks for every Pane component, run against the BUILT docs page in real
// Chromium (not jsdom), plus an axe scan of the whole page in normal and forced-colors mode and a
// props-drift check (every prop the docs list must exist in the component's TS source).
//
// Usage: node tooling/conformance.mjs [--no-build]
// Writes apps/docs/public/conformance.json. Exit 1 on any failed check.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { serveDist } from './serve-dist.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv.includes('--no-build')) {
  const r = spawnSync('pnpm', ['--filter', 'pane-docs', 'build'], { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const checks = [];
async function check(component, name, fn) {
  try {
    const detail = await fn();
    checks.push({ component, name, ok: true, ...(typeof detail === 'string' ? { detail } : {}) });
  } catch (e) {
    checks.push({ component, name, ok: false, detail: String(e.message ?? e).split('\n')[0] });
  }
}
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
// Radix moves roving focus in a setTimeout, so selection lands a tick after the key press.
async function eventually(read, want, msg, ms = 1000) {
  const end = Date.now() + ms;
  let got;
  while (Date.now() < end) { if ((got = await read()) === want) return; await new Promise((r) => setTimeout(r, 25)); }
  throw new Error(`${msg} (got ${got})`);
}

// Press Tab until `locator` has focus — proves it is in the keyboard tab sequence. (Chromium starts
// from its sequential-navigation point, not the page top, so the press count is not meaningful.)
async function tabTo(page, locator, max = 300) {
  await page.evaluate(() => (document.activeElement)?.blur());
  await page.locator('body').focus();
  const target = await locator.elementHandle();
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate((el) => document.activeElement === el, target)) return;
  }
  throw new Error(`not reached in ${max} Tab presses`);
}

// --- props drift: docs content vs TS source -------------------------------------------------
const content = readFileSync(path.join(ROOT, 'apps/docs/src/content.tsx'), 'utf8');
const blocks = content.split(/\n  \{\n    name: '/).slice(1);
for (const block of blocks) {
  const comp = block.slice(0, block.indexOf("'"));
  const src = readFileSync(path.join(ROOT, `packages/react/src/components/${comp}/${comp}.tsx`), 'utf8');
  const documented = [...block.matchAll(/\{ name: '([^'…]+)'/g)].map((m) => m[1]);
  await check(comp, 'every documented prop exists in the TS source', () => {
    const missing = documented.filter((p) => !new RegExp(`['"]?\\b${p}['"]?\\??:`).test(src));
    expect(missing.length === 0, `documented but not in ${comp}.tsx: ${missing.join(', ')}`);
    return documented.length ? `${documented.length} props` : 'only pass-through props documented — nothing of its own to cross-check';
  });
}

const srv = await serveDist(path.join(ROOT, 'apps/docs/dist'));
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${srv.base}/index.html`, { waitUntil: 'networkidle' });
  const sec = (id) => page.locator(`section#${id}`);

  // --- Environment ----------------------------------------------------------------------------
  // Real brightness values are currently all equal (D-011), so the wiring is proven with distinct
  // probe values set on :root for the duration of the check, then removed.
  const probe = { dim: '0.9', mid: '0.6', bright: '0.3' };
  const withProbe = async (fn) => {
    await page.evaluate((p) => { for (const [k, v] of Object.entries(p)) document.documentElement.style.setProperty(`--ds-brightness-${k}`, v); }, probe);
    try { return await fn(); } finally { await page.evaluate(() => { for (const k of ['dim', 'mid', 'bright']) document.documentElement.style.removeProperty(`--ds-brightness-${k}`); }); }
  };
  const tileFilters = () => sec('environment').locator('.env-tile [data-environment] > *').evaluateAll((els) => els.map((e) => getComputedStyle(e).backdropFilter));
  await check('Environment', 'each brightness wires its own backdrop dimming into the card (probe values)', () => withProbe(async () => {
    const f = await tileFilters();
    const got = f.map((x) => x.match(/brightness\(([\d.]+)\)/)?.[1]);
    expect(got.join() === [probe.dim, probe.mid, probe.bright].join(), `card backdrop-filter brightness per tile: ${got.join(', ')}`);
    return `dim→${got[0]} mid→${got[1]} bright→${got[2]}`;
  }));
  await check('Environment', 'reduced transparency turns every environment opaque, no dimming (D-005)', async () => {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
    const st = await sec('environment').locator('.env-tile [data-environment] > *').evaluateAll((els) => els.map((e) => { const c = getComputedStyle(e); return `${c.backgroundColor}|${c.backdropFilter}`; }));
    await cdp.send('Emulation.setEmulatedMedia', { features: [] });
    expect(new Set(st).size === 1, `differs: ${st.join(' / ')}`);
    expect(/rgb\(44, 44, 52\)/.test(st[0]) && /blur\(0px\)/.test(st[0]) && /brightness\(1\)/.test(st[0]), `not opaque/undimmed: ${st[0]}`);
    return st[0];
  });
  await check('Environment', 'no declaration falls back to bright (the safe end)', () => withProbe(async () => {
    const v = await page.evaluate(() => {
      const d = document.createElement('div');
      document.body.append(d);
      const out = getComputedStyle(d).getPropertyValue('--ds-glass-brightness').trim();
      d.remove();
      return out;
    });
    expect(v === probe.bright, `--ds-glass-brightness outside any environment = ${v} (bright probe ${probe.bright})`);
  }));

  // --- Card -----------------------------------------------------------------------------------
  await check('Card', 'glass card renders an <article> with backdrop blur', async () => {
    const card = page.getByRole('article', { name: 'Max Fmz profile' }).first();
    const bf = await card.evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(/blur\(/.test(bf), `backdrop-filter: ${bf}`);
  });
  await check('Card', 'inset variant adds no second glass layer', async () => {
    const bf = await sec('card').locator('.demo-card [class*="inset"]').first().evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(bf === 'none', `inset backdrop-filter: ${bf}`);
  });

  // --- Avatar ---------------------------------------------------------------------------------
  await check('Avatar', 'non-decorative avatars are role="img" named after the person', async () => {
    for (const n of ['Max Fmz', 'Visual Flow', 'Ada Lovelace']) expect((await sec('avatar').getByRole('img', { name: n }).count()) === 1, `no img named ${n}`);
  });
  await check('Avatar', 'decorative avatar beside a visible name is hidden from assistive tech', async () => {
    const hidden = await page.locator('#overview [aria-hidden="true"]').filter({ hasText: 'MF' }).count();
    expect(hidden >= 1, 'hero avatar is not aria-hidden');
  });

  // --- Button ---------------------------------------------------------------------------------
  const follow = sec('button').getByRole('button', { name: 'Follow' });
  await check('Button', 'native <button type="button">', async () => {
    expect((await follow.getAttribute('type')) === 'button', 'type is not "button"');
  });
  await check('Button', 'reachable with Tab', () => tabTo(page, follow));
  await check('Button', 'Enter and Space activate it', async () => {
    const night = page.getByRole('button', { name: 'Night café', exact: true });
    const room = page.getByRole('button', { name: 'Room', exact: true });
    await tabTo(page, night);
    await page.keyboard.press('Enter');
    expect((await night.getAttribute('aria-pressed')) === 'true', 'Enter did not activate');
    await tabTo(page, room);
    await page.keyboard.press('Space');
    expect((await room.getAttribute('aria-pressed')) === 'true', 'Space did not activate');
  });
  await check('Button', 'keyboard focus draws a 2px white ring with a dark halo', async () => {
    await tabTo(page, follow);
    const s = await follow.evaluate((el) => { const c = getComputedStyle(el); return { style: c.outlineStyle, width: c.outlineWidth, color: c.outlineColor, shadow: c.boxShadow }; });
    expect(s.style === 'solid' && s.width === '2px' && s.color === 'rgb(255, 255, 255)', `outline ${s.style} ${s.width} ${s.color}`);
    expect(/rgba\(0, 0, 0/.test(s.shadow), `halo missing: ${s.shadow}`);
  });
  await check('Button', 'disabled is the native attribute', async () => {
    expect(await sec('button').getByRole('button', { name: 'Disabled' }).isDisabled(), 'not disabled');
  });

  // --- IconButton -----------------------------------------------------------------------------
  await check('IconButton', 'every button with no visible text on the page has an accessible name', async () => {
    const unnamed = await page.locator('button').evaluateAll((bs) => bs.filter((b) => !b.innerText.trim() && !(b.getAttribute('aria-label') || '').trim()).length);
    expect(unnamed === 0, `${unnamed} unnamed icon-only buttons`);
  });
  await check('IconButton', 'reachable with Tab', () => tabTo(page, sec('iconbutton').getByRole('button', { name: 'Edit profile' })));

  // --- Tabs -----------------------------------------------------------------------------------
  const list = sec('tabs').getByRole('tablist', { name: 'Demo sections' });
  const tab = (n) => list.getByRole('tab', { name: n });
  await check('Tabs', 'roving tabindex: only the selected tab is in the tab order', async () => {
    const idx = await list.getByRole('tab').evaluateAll((ts) => ts.map((t) => t.getAttribute('tabindex')));
    expect(idx[0] === '0' && idx.slice(1).every((v) => v === '-1'), `tabindex: ${idx.join(',')}`);
  });
  await check('Tabs', '→ / ← move focus and selection; Home / End jump', async () => {
    await tabTo(page, tab('Tweets'));
    const sel = (n) => () => tab(n).getAttribute('aria-selected');
    await page.keyboard.press('ArrowRight');
    await eventually(sel('Replies'), 'true', 'ArrowRight did not select Replies');
    await page.keyboard.press('End');
    await eventually(sel('Media'), 'true', 'End did not select Media');
    await page.keyboard.press('Home');
    await eventually(sel('Tweets'), 'true', 'Home did not select Tweets');
    await page.keyboard.press('ArrowLeft');
    await eventually(sel('Media'), 'true', 'ArrowLeft from first did not wrap to last');
  });
  await check('Tabs', 'each tab controls a tabpanel that exists', async () => {
    const ids = await list.getByRole('tab').evaluateAll((ts) => ts.map((t) => t.getAttribute('aria-controls')));
    for (const id of ids) expect((await page.locator(`[id="${id}"][role="tabpanel"]`).count()) === 1, `no tabpanel #${id}`);
  });
  await check('Tabs', 'selected tab is not marked by colour alone in forced colours', async () => {
    const fc = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: 'active' });
    const p2 = await fc.newPage();
    await p2.goto(`${srv.base}/index.html`, { waitUntil: 'networkidle' });
    const deco = await p2.locator('section#tabs [role="tab"][aria-selected="true"]').evaluate((el) => getComputedStyle(el).textDecorationLine);
    await fc.close();
    expect(deco.includes('underline'), `selected tab text-decoration: ${deco}`);
  });

  // --- Tag ------------------------------------------------------------------------------------
  await check('Tag', 'plain text with no role, small caps via CSS (source text stays readable)', async () => {
    const t = sec('tag').getByText('Visual asset 05', { exact: true });
    expect((await t.getAttribute('role')) === null, 'has a role');
    expect((await t.evaluate((el) => getComputedStyle(el).textTransform)) === 'uppercase', 'not uppercase');
  });

  // --- whole page: axe ------------------------------------------------------------------------
  for (const mode of ['none', 'active']) {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: mode });
    const p = await c.newPage();
    await p.goto(`${srv.base}/index.html`, { waitUntil: 'networkidle' });
    await check('Docs page', `axe: no violations (forced-colors ${mode})`, async () => {
      const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(r.violations.length === 0, r.violations.map((v) => `${v.id} ×${v.nodes.length}`).join(', '));
      const cc = r.incomplete.find((i) => i.id === 'color-contrast');
      return `${r.passes.length} rules pass; color-contrast incomplete on ${cc?.nodes.length ?? 0} nodes (axe cannot see through backdrop-filter — settled per pixel by glass-evidence)`;
    });
    await c.close();
  }
} finally {
  await browser.close();
  srv.close();
}

const passed = checks.filter((c) => c.ok).length;
for (const c of checks) console.log(`${c.ok ? '✓' : '✗'} ${c.component}: ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
writeFileSync(
  path.join(ROOT, 'apps/docs/public/conformance.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), passed, total: checks.length, checks }, null, 2) + '\n',
);
console.log(`\n${passed === checks.length ? '✓' : '✗'} conformance: ${passed}/${checks.length}`);
process.exit(passed === checks.length ? 0 : 1);
