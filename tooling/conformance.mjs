#!/usr/bin/env node
// conformance — behaviour checks for every Pane component, run against the BUILT docs book in real
// Chromium (not jsdom), on the component's own chapter; an axe scan of EVERY page of the book in
// normal and forced-colors mode; a props-drift check (every prop the book lists must exist in the
// component's TS source); and a whole-book check that no icon-only button is unnamed.
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

// --- generated API + demo floor (docs-engine content model, points 5 and 8) ---------------------
const META = JSON.parse(readFileSync(path.join(ROOT, 'apps/docs/src/book/meta.json'), 'utf8'));
const CHAPTERS = [...readFileSync(path.join(ROOT, 'apps/docs/src/book/components-data.tsx'), 'utf8').matchAll(/name: '(\w+)',\n\s+slug: '([\w-]+)'/g)].map((m) => ({ name: m[1], slug: m[2] }));
for (const { name } of CHAPTERS) {
  await check(name, 'props table is generated from TS and every own prop is documented (JSDoc)', () => {
    const own = META.components[name].exports.flatMap((e) => e.props);
    const undocumented = own.filter((p) => !p.description).map((p) => p.name);
    expect(undocumented.length === 0, `no JSDoc: ${undocumented.join(', ')}`);
    return own.length ? `${own.length} props` : 'no props of its own (pass-through only)';
  });
}

const srv = await serveDist(path.join(ROOT, 'apps/docs/dist'));
const ROUTES = JSON.parse(readFileSync(path.join(ROOT, 'apps/docs/src/book/routes.json'), 'utf8')).parts.flatMap((p) => p.pages.map((pg) => pg.path));
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const go = (route) => page.goto(`${srv.base}${route}?scene=room`, { waitUntil: 'networkidle' });
  const main = () => page.locator('main');

  for (const { name, slug } of CHAPTERS) {
    await go(`/components/${slug}`);
    await check(name, `demo floor met (≥ variant dimensions + 3 = ${META.components[name].demoFloor})`, async () => {
      const n = await main().locator('figure.example').count();
      expect(n >= META.components[name].demoFloor, `${n} demos on the page`);
      return `${n} demos`;
    });
  }

  // --- Environment ----------------------------------------------------------------------------
  await go('/components/environment');
  // Real brightness values are currently all equal (D-011), so the wiring is proven with distinct
  // probe values set on :root for the duration of the check, then removed.
  const probe = { dim: '0.9', mid: '0.6', bright: '0.3' };
  const withProbe = async (fn) => {
    await page.evaluate((p) => { for (const [k, v] of Object.entries(p)) document.documentElement.style.setProperty(`--ds-brightness-${k}`, v); }, probe);
    try { return await fn(); } finally { await page.evaluate(() => { for (const k of ['dim', 'mid', 'bright']) document.documentElement.style.removeProperty(`--ds-brightness-${k}`); }); }
  };
  const tiles = () => main().locator('.env-tile [data-environment] > *');
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

  // --- Card -----------------------------------------------------------------------------------
  await go('/components/card');
  await check('Card', 'glass card blurs, saturates and dims what is behind it', async () => {
    const bf = await main().getByRole('article', { name: 'Trip to Lauterbrunnen' }).evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(/blur\(/.test(bf) && /saturate\(/.test(bf) && /brightness\(/.test(bf), `backdrop-filter: ${bf}`);
    return bf;
  });
  await check('Card', 'inset variant adds no second glass layer', async () => {
    const bf = await main().locator('[class*="inset"]').first().evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(bf === 'none', `inset backdrop-filter: ${bf}`);
  });

  // --- Avatar ---------------------------------------------------------------------------------
  await go('/components/avatar');
  await check('Avatar', 'non-decorative avatars are role="img" named after the person', async () => {
    for (const n of ['Max Fmz', 'Visual Flow', 'Ada Lovelace', 'Grace Hopper']) expect((await main().getByRole('img', { name: n }).count()) >= 1, `no img named ${n}`);
  });
  await check('Avatar', 'decorative avatar beside a visible name is hidden from assistive tech', async () => {
    const n = await main().locator('[aria-hidden="true"]').filter({ hasText: 'MF' }).count();
    expect(n >= 1, 'decorative avatar is not aria-hidden');
  });

  // --- Button ---------------------------------------------------------------------------------
  await go('/components/button');
  const follow = main().getByRole('button', { name: 'Follow', exact: true }).first();
  await check('Button', 'native <button type="button">', async () => {
    expect((await follow.getAttribute('type')) === 'button', 'type is not "button"');
  });
  await check('Button', 'reachable with Tab', () => tabTo(page, follow));
  await check('Button', 'Enter and Space activate it', async () => {
    const night = page.getByRole('button', { name: 'Night café', exact: true });
    const room = page.getByRole('button', { name: 'Room', exact: true });
    await tabTo(page, night);
    await page.keyboard.press('Enter');
    await eventually(() => night.getAttribute('aria-pressed'), 'true', 'Enter did not activate');
    await tabTo(page, room);
    await page.keyboard.press('Space');
    await eventually(() => room.getAttribute('aria-pressed'), 'true', 'Space did not activate');
  });
  await check('Button', 'keyboard focus draws a 2px white ring with a dark halo', async () => {
    await tabTo(page, follow);
    const st = await follow.evaluate((el) => { const c = getComputedStyle(el); return { style: c.outlineStyle, width: c.outlineWidth, color: c.outlineColor, shadow: c.boxShadow }; });
    expect(st.style === 'solid' && st.width === '2px' && st.color === 'rgb(255, 255, 255)', `outline ${st.style} ${st.width} ${st.color}`);
    expect(/rgba\(0, 0, 0/.test(st.shadow), `halo missing: ${st.shadow}`);
  });
  await check('Button', 'disabled is the native attribute', async () => {
    expect(await main().getByRole('button', { name: 'Disabled' }).isDisabled(), 'not disabled');
  });
  await check('Button', 'hover motion uses the soft tokens (420ms, cubic-bezier(0.22, 1, 0.36, 1))', async () => {
    const free = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p2 = await free.newPage();
    await p2.goto(`${srv.base}/components/button?scene=room`, { waitUntil: 'networkidle' });
    const t = await p2.locator('main').getByRole('button', { name: 'Follow', exact: true }).first().evaluate((el) => { const c = getComputedStyle(el); return { d: c.transitionDuration, e: c.transitionTimingFunction }; });
    await free.close();
    expect(t.d.split(',').every((x) => x.trim() === '0.42s') && /cubic-bezier\(0\.22, 1, 0\.36, 1\)/.test(t.e), `${t.d} / ${t.e}`);
    return `${t.d.split(',')[0]} ${t.e.split('),')[0]})`;
  });

  // --- IconButton -----------------------------------------------------------------------------
  await go('/components/icon-button');
  await check('IconButton', 'reachable with Tab', () => tabTo(page, main().getByRole('button', { name: 'Edit profile' }).first()));
  await check('IconButton', 'every button with no visible text, on every page of the book, has an accessible name', async () => {
    let unnamed = [];
    for (const r of ROUTES) {
      await go(r);
      const u = await page.locator('button').evaluateAll((bs) => bs.filter((b) => !b.innerText.trim() && !(b.getAttribute('aria-label') || '').trim()).length);
      if (u) unnamed.push(`${r}: ${u}`);
    }
    expect(unnamed.length === 0, unnamed.join(', '));
    return `${ROUTES.length} pages`;
  });

  // --- Tabs -----------------------------------------------------------------------------------
  await go('/components/tabs');
  const list = main().getByRole('tablist', { name: 'Profile sections' }).first();
  const tab = (n) => list.getByRole('tab', { name: n });
  // Behaviour, not attributes: Radix makes the tablist the tab stop and forwards focus, so the
  // per-tab tabindex values are an implementation detail (all -1 until first focus).
  await check('Tabs', 'one tab stop: Tab lands on the selected tab, the next Tab leaves the list', async () => {
    await tabTo(page, tab('Tweets'));
    expect((await tab('Tweets').getAttribute('aria-selected')) === 'true', 'focused tab is not the selected one');
    await page.keyboard.press('Tab');
    const stillInList = await list.evaluate((l) => l.contains(document.activeElement));
    expect(!stillInList, 'second Tab stopped on another tab');
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
    const fc = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: 'active', reducedMotion: 'reduce' });
    const p2 = await fc.newPage();
    await p2.goto(`${srv.base}/components/tabs?scene=room`, { waitUntil: 'networkidle' });
    const deco = await p2.locator('main [role="tab"][aria-selected="true"]').first().evaluate((el) => getComputedStyle(el).textDecorationLine);
    await fc.close();
    expect(deco.includes('underline'), `selected tab text-decoration: ${deco}`);
  });

  // --- Tag ------------------------------------------------------------------------------------
  await go('/components/tag');
  await check('Tag', 'plain text with no role, small caps via CSS (source text stays readable)', async () => {
    const t = main().getByText('Visual asset 05', { exact: true }).first();
    expect((await t.getAttribute('role')) === null, 'has a role');
    expect((await t.evaluate((el) => getComputedStyle(el).textTransform)) === 'uppercase', 'not uppercase');
  });

  await check('Docs page', `G-D3: no literal backtick in rendered text on any of the ${ROUTES.length} pages`, async () => {
    const bad = [];
    for (const r of ROUTES) {
      await go(r);
      const hits = await page.evaluate(() => {
        const w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT); const out = [];
        for (let n = w.nextNode(); n; n = w.nextNode()) if (n.textContent.includes('`') && !n.parentElement.closest('pre, code')) out.push(n.textContent.trim().slice(0, 40));
        return out;
      });
      for (const h of hits) bad.push(`${r}: ${h}`);
    }
    expect(bad.length === 0, bad.slice(0, 4).join(' | '));
  });

  // --- every page: axe -----------------------------------------------------------------------
  for (const mode of ['none', 'active']) {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: mode, reducedMotion: 'reduce' });
    const p = await c.newPage();
    await check('Docs page', `axe: no violations on all ${ROUTES.length} pages (forced-colors ${mode})`, async () => {
      const bad = [];
      let incomplete = 0;
      for (const r of ROUTES) {
        await p.goto(`${srv.base}${r}?scene=room`, { waitUntil: 'networkidle' });
        const res = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        for (const v of res.violations) bad.push(`${r} ${v.id}×${v.nodes.length}`);
        incomplete += res.incomplete.find((i) => i.id === 'color-contrast')?.nodes.length ?? 0;
      }
      expect(bad.length === 0, bad.slice(0, 6).join(', '));
      return `color-contrast incomplete on ${incomplete} nodes (axe cannot see through backdrop-filter — settled per pixel by glass-evidence)`;
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
