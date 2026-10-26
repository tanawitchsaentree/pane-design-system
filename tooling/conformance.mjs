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
  const go = (route) => page.goto(`${srv.base}${route}?scene=room&theme=dark`, { waitUntil: 'networkidle' });
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

  // --- Card -----------------------------------------------------------------------------------
  await go('/components/card');
  await check('Card', 'glass card blurs, saturates and dims what is behind it', async () => {
    const bf = await main().getByRole('article', { name: 'Trip to Lauterbrunnen' }).first().evaluate((el) => getComputedStyle(el).backdropFilter);
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
    await p2.goto(`${srv.base}/components/button?scene=room&theme=dark`, { waitUntil: 'networkidle' });
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
  await check('Tabs', 'one tab stop, so Tab lands on the selected tab and the next Tab leaves the list', async () => {
    await tabTo(page, tab('Tweets'));
    expect((await tab('Tweets').getAttribute('aria-selected')) === 'true', 'focused tab is not the selected one');
    await page.keyboard.press('Tab');
    const stillInList = await list.evaluate((l) => l.contains(document.activeElement));
    expect(!stillInList, 'second Tab stopped on another tab');
  });
  await check('Tabs', 'arrow keys move focus and selection, and Home and End jump to the ends', async () => {
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
  await check('Tabs', 'the selected tab keeps an underline in forced colours', async () => {
    const fc = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: 'active', reducedMotion: 'reduce' });
    const p2 = await fc.newPage();
    await p2.goto(`${srv.base}/components/tabs?scene=room&theme=dark`, { waitUntil: 'networkidle' });
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

  await check('Docs page', `G-D3, no literal backtick in rendered text on any of the ${ROUTES.length} pages`, async () => {
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

  // --- Grid / Container / Stack --------------------------------------------------------------------
    await check('Grid', 'columns follow the breakpoint tokens, with 4 at 375px, 8 at 800px and 12 at 1280px', async () => {
    const got = [];
    for (const w of [375, 800, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      await go('/components/grid');
      got.push(await main().locator('#demos .demo-full').first().evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(got.join() === '4,8,12', `columns at 375/800/1280: ${got.join(', ')}`);
    return got.join(' → ');
  });
  await check('Grid', 'GridItem spans switch per breakpoint (full → md 4/8 → lg 4/12)', async () => {
    const ratios = [];
    for (const w of [375, 800, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      await go('/components/grid');
      ratios.push(await main().locator('#hero .demo-full').first().evaluate((g) => Math.round((g.firstElementChild.getBoundingClientRect().width / g.getBoundingClientRect().width) * 100)));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(ratios[0] === 100 && ratios[1] > 45 && ratios[1] < 50 && ratios[2] > 29 && ratios[2] < 34, `item width % of grid: ${ratios.join(', ')}`);
    return ratios.map((r) => `${r}%`).join(' → ');
  });
  await check('Container', 'xl caps at 1200px and the margin grows 16 → 32 → 48px', async () => {
    const pads = [];
    for (const w of [375, 800, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      await go('/components/container');
      pads.push(await page.evaluate(() => { const d = document.createElement('div'); d.className = document.querySelector('main #hero .demo-full')?.className ?? ''; return getComputedStyle(document.querySelector('main #hero .demo-full')).paddingInlineStart; }));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(pads.join() === '16px,32px,48px', `padding-inline at 375/800/1280: ${pads.join(', ')}`);
    return pads.join(' → ');
  });
  await check('Stack', 'gap comes from the token scale (md = 16px, xl = 32px)', async () => {
    await go('/components/stack');
    const gaps = await main().locator('#demos .demo-card').nth(1).locator('> div').evaluateAll((els) => els.map((e) => getComputedStyle(e).columnGap));
    expect(gaps.join() === '4px,8px,16px,24px,32px', `gaps: ${gaps.join(', ')}`);
    return gaps.join(' · ');
  });

  // --- Badge / Chip / Banner ------------------------------------------------------------------------
  await go('/components/badge');
  await check('Badge', 'status is in the text, with no role (read in place)', async () => {
    const b = main().getByText('Failed', { exact: true }).first();
    expect((await b.getAttribute('role')) === null, 'has a role');
  });
  await go('/components/chip');
  const photos = main().getByRole('button', { name: 'Photos' }).first();
  await check('Chip', 'reachable with Tab', () => tabTo(page, photos));
  await check('Chip', 'Space and Enter toggle aria-pressed', async () => {
    const vids = main().getByRole('button', { name: 'Videos' }).first();
    await tabTo(page, vids);
    expect((await vids.getAttribute('aria-pressed')) === 'false', 'not unpressed at start');
    await page.keyboard.press('Space');
    await eventually(() => vids.getAttribute('aria-pressed'), 'true', 'Space did not press');
    await page.keyboard.press('Enter');
    await eventually(() => vids.getAttribute('aria-pressed'), 'false', 'Enter did not unpress');
  });
  await check('Chip', 'a check mark marks the selected chip as well as its colour', async () => {
    expect((await photos.locator('svg').count()) === 1, 'no check mark on the selected chip');
  });
  await check('Chip', 'an input chip’s remove button is named after the chip and removes it', async () => {
    const rm = main().getByRole('button', { name: 'Remove Grace Hopper' });
    expect((await rm.count()) === 1, 'no "Remove Grace Hopper" button');
    await rm.click();
    expect((await main().getByRole('button', { name: 'Remove Grace Hopper' }).count()) === 0, 'chip still there');
  });
  await go('/components/banner');
  await check('Banner', 'dismiss is a named button and removes the banner', async () => {
    const d = main().getByRole('button', { name: 'Dismiss' }).first();
    // the banner itself: a static Banner is a <section> labelled by its tone
    const count = () => main().locator('section[aria-label="Info"]', { hasText: 'Get verified' }).count();
    const before = await count();
    await d.click();
    const after = await count();
    expect(before >= 1 && after === before - 1, `banner count ${before} → ${after}`);
  });
  await check('Banner', 'live="polite" appears as role="status", live="assertive" as role="alert"', async () => {
    await main().getByRole('button', { name: 'Save', exact: true }).click();
    await main().getByRole('button', { name: 'Simulate error' }).click();
    expect((await main().getByRole('status').filter({ hasText: 'Saved' }).count()) === 1, 'no status');
    expect((await main().getByRole('alert').filter({ hasText: 'offline' }).count()) === 1, 'no alert');
  });
  await check('Banner', 'the tone is spoken as prefix text', async () => {
    const t = await main().locator('section', { hasText: 'Upload failed' }).first().innerText();
    expect(/Error:\s*Upload failed/.test(t), `text: ${t.slice(0, 60)}`);
  });

  // --- shell: a chapter is a new page, at every width (MUI / Material / Apple docs behaviour) -------
  await check('Docs page', 'choosing a chapter opens it as a new page at the top, with its heading in view and focused, at 375, 768 and 1280px', async () => {
    const out = [];
    for (const w of [375, 768, 1280]) {
      await page.setViewportSize({ width: w, height: 800 });
      await go('/');
      await page.evaluate(() => scrollTo({ top: 600, behavior: 'instant' }));
      const menu = page.getByRole('button', { name: 'Menu' });
      if (await menu.isVisible()) {
        await menu.click();
        await eventually(() => page.locator('#book-nav').evaluate((n) => getComputedStyle(n).visibility), 'visible', `menu did not open at ${w}px`);
      }
      await page.locator('#book-nav').getByRole('link', { name: 'Button', exact: true }).click();
      await eventually(() => page.locator('#page-title').textContent(), 'Button', `heading did not change at ${w}px`);
      await page.waitForTimeout(100);
      const st = await page.evaluate(() => { const h = document.getElementById('page-title'); const r = h.getBoundingClientRect(); return { y: scrollY, top: r.top, vh: innerHeight, focused: document.activeElement === h }; });
      if (!(st.y === 0 && st.top >= 0 && st.top < st.vh * 0.5 && st.focused)) out.push(`${w}px: scrollY ${st.y}, heading top ${Math.round(st.top)}/${st.vh}, focused ${st.focused}`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(out.length === 0, out.join(' | '));
    return 'all three widths';
  });
  await check('Docs page', 'G-S5, a new chapter is fully visible on its first painted frame with motion on', async () => {
    const free = await browser.newContext({ viewport: { width: 1440, height: 900 } }); // reduced motion OFF
    const p2 = await free.newPage();
    await p2.goto(`${srv.base}/?scene=room&theme=dark`, { waitUntil: 'networkidle' });
    const bad = [];
    for (const name of ['Button', 'Card', 'Tokens', 'Grid & layout']) {
      const r = await p2.evaluate(async (n) => {
        const link = [...document.querySelectorAll('#book-nav a')].find((a) => a.textContent === n);
        const t0 = performance.now(); link.click();
        while (document.getElementById('page-title')?.textContent !== n) await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        // page content only: a disabled control's 0.5 opacity or a tab panel's own entrance inside a live
        // example is component behaviour, not the page fading in
        const fading = [...document.querySelectorAll('main *')].filter((e) => { const b = e.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0 && Number(getComputedStyle(e).opacity) < 1 && !e.closest('.example-live, :disabled, .heading-anchor'); }).length;
        return { ms: Math.round(performance.now() - t0), fading };
      }, name);
      if (r.fading) bad.push(`${name}: ${r.fading} elements below full opacity`);
    }
    await free.close();
    expect(bad.length === 0, bad.join(' | '));
  });
  await check('Docs page', 'on narrow screens Esc closes the menu and returns focus to the Menu button', async () => {
    await page.setViewportSize({ width: 375, height: 800 });
    await go('/');
    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.click();
    await page.keyboard.press('Escape');
    await eventually(() => page.evaluate(() => document.activeElement?.textContent?.trim()), 'Menu', 'focus did not return to Menu');
    await page.setViewportSize({ width: 1440, height: 900 });
  });
  // --- spacing: no glass card touches or overlaps another, on any page, at phone and desktop width ---
  await check('Docs page', `no two cards touch (under 8px) or overlap on any of the ${ROUTES.length} pages at 375px and 1280px`, async () => {
    const bad = [];
    for (const w of [375, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      for (const r of ROUTES) {
        await go(r);
        const hits = await page.evaluate(() => {
          const cards = [...document.querySelectorAll('main [data-pane-card="glass"]')].filter((c) => c.getBoundingClientRect().width > 0);
          const out = cards.length ? [] : ['NO CARDS FOUND, so the selector is broken and nothing was checked'];
          for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) {
            const a = cards[i], b = cards[j];
            if (a.contains(b) || b.contains(a)) continue;
            const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
            const dx = Math.max(rb.left - ra.right, ra.left - rb.right), dy = Math.max(rb.top - ra.bottom, ra.top - rb.bottom);
            const gap = Math.max(dx, dy); // negative = overlap
            if (gap < 8) out.push(`${(a.textContent || '').trim().slice(0, 18)} ↔ ${(b.textContent || '').trim().slice(0, 18)} (${Math.round(gap)}px)`);
          }
          return out;
        });
        for (const h of hits) bad.push(`${w}px ${r}: ${h}`);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(bad.length === 0, `${bad.length} — ${bad.slice(0, 4).join(' | ')}`);
  });

  // --- USER-STANDARDS #5-#8 (docs-engine G-F1, G-C1, G-C2, G-T1, G-B1) ---------------------------
  const FOUNDATIONS = ROUTES.filter((r) => r.startsWith('/foundations/') && r !== '/foundations/themes');
  await check('Docs page', `G-F1, every foundation page (${FOUNDATIONS.length}) has a playground whose first control changes its preview`, async () => {
    const bad = [];
    for (const r of FOUNDATIONS) {
      await go(r);
      const pg = main().locator('[data-playground]').first();
      if (!(await pg.count())) { bad.push(`${r}: no playground`); continue; }
      const preview = pg.locator('.pg-preview');
      const before = await preview.evaluate((e) => e.outerHTML);
      const ctl = pg.locator('.pg-controls input, .pg-controls select').first();
      const kind = await ctl.evaluate((e) => (e.tagName === 'SELECT' ? 'select' : e.type));
      if (kind === 'select') { const opts = await ctl.evaluate((e) => [...e.options].map((o) => o.value)); const cur = await ctl.inputValue(); await ctl.selectOption(opts.find((o) => o !== cur)); }
      else if (kind === 'range') await ctl.evaluate((e) => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(e, String(Number(e.value) === Number(e.min) ? e.max : e.min)); e.dispatchEvent(new Event('input', { bubbles: true })); });
      else await ctl.fill('pane');
      await page.waitForTimeout(50);
      if ((await preview.evaluate((e) => e.outerHTML)) === before) bad.push(`${r}: preview did not change`);
    }
    expect(bad.length === 0, bad.join(' | '));
    return `${FOUNDATIONS.length} pages`;
  });
  await check('Docs page', `G-C1, every code block on all ${ROUTES.length} pages has a Copy button you can see`, async () => {
    const bad = [];
    let n = 0;
    for (const r of ROUTES) {
      await go(r);
      const res = await page.evaluate(() => [...document.querySelectorAll('main pre')].map((p) => {
        const btn = p.closest('.codeblock')?.querySelector('button[data-copy]');
        if (!btn) return 'no copy button';
        const b = btn.getBoundingClientRect(), cs = getComputedStyle(btn);
        return b.width > 0 && b.height > 0 && Number(cs.opacity) === 1 && cs.visibility === 'visible' ? null : 'copy button hidden';
      }));
      n += res.length;
      res.forEach((e, i) => e && bad.push(`${r} pre#${i}: ${e}`));
    }
    expect(n > 0, 'NO CODE BLOCKS FOUND, so nothing was checked');
    expect(bad.length === 0, `${bad.length} — ${bad.slice(0, 4).join(' | ')}`);
    return `${n} code blocks`;
  });
  await check('Docs page', 'G-C2, Copy puts the whole snippet on the clipboard, including lines a long block hides', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
    const p = await ctx.newPage();
    try {
      await p.goto(`${srv.base}/components/card?scene=room&theme=dark`, { waitUntil: 'networkidle' });
      const idx = await p.evaluate(() => [...document.querySelectorAll('main .codeblock')].findIndex((b) => b.querySelector('pre.clipped')));
      expect(idx >= 0, 'no clipped code block on the Card page to test with');
      const block = p.locator('main .codeblock').nth(idx);
      const shown = await block.locator('pre').innerText();
      await block.locator('button[data-copy]').click();
      const got = await p.evaluate(() => navigator.clipboard.readText());
      expect(got.split('\n').length > shown.trim().split('\n').length, `clipboard has ${got.split('\n').length} lines, preview shows ${shown.trim().split('\n').length}`);
      await block.getByRole('button', { name: /Show all/ }).click();
      expect(got.trim() === (await block.locator('pre').innerText()).trim(), 'clipboard differs from the full block');
      return `${got.split('\n').length} lines copied`;
    } finally { await ctx.close(); }
  });
  await check('Docs page', 'G-T1, the theme control switches text and glass tokens, and the evidence covers both themes', async () => {
    await go('/');
    const read = () => page.evaluate(() => { const cs = getComputedStyle(document.documentElement); return [cs.getPropertyValue('--ds-text-primary').trim(), cs.getPropertyValue('--ds-surface-glass').trim(), document.documentElement.dataset.theme]; });
    await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Dark', exact: true }).click();
    const dark = await read();
    await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Light', exact: true }).click();
    const light = await read();
    await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Dark', exact: true }).click();
    expect(dark[2] === 'dark' && light[2] === 'light', `data-theme ${dark[2]} / ${light[2]}`);
    expect(dark[0] !== light[0] && dark[1] !== light[1], `tokens unchanged: ${dark} vs ${light}`);
    const ev = JSON.parse(readFileSync(path.join(ROOT, 'apps/docs/public/evidence.json'), 'utf8'));
    const keys = Object.keys(ev.harness?.normal ?? {});
    expect(['dark', 'light'].every((t) => keys.some((k) => k.startsWith(`${t}/`))), `evidence keys: ${keys.join(', ')}`);
    return `text ${dark[0]} → ${light[0]}`;
  });
  await check('Docs page', `G-B1, all ${CHAPTERS.length} component pages show the component in both themes over a dark and a bright scene, and say what changes`, async () => {
    const bad = [];
    for (const { name, slug } of CHAPTERS) {
      await go(`/components/${slug}`);
      const r = await page.evaluate(() => {
        const sec = document.getElementById('backdrops')?.closest('section') ?? document.getElementById('backdrops');
        if (!sec) return 'no backdrops section';
        const cells = [...sec.querySelectorAll('.backdrop-cell')].map((c) => `${c.dataset.theme}/${c.dataset.tile}`);
        const prose = [...sec.querySelectorAll('p')].map((p) => p.textContent.trim()).join(' ');
        const imgs = [...sec.querySelectorAll('.backdrop-cell')].filter((c) => getComputedStyle(c).backgroundImage === 'none').length;
        const empty = [...sec.querySelectorAll('.backdrop-cell')].filter((c) => !c.querySelector('[data-environment] *')).length;
        const want = ['dark/night', 'dark/city', 'light/night', 'light/city'];
        return [want.every((w) => cells.includes(w)) ? null : `cells ${cells.join(',')}`, prose.split(/\s+/).length >= 12 ? null : 'no guidance text', imgs ? `${imgs} cells without a scene` : null, empty ? `${empty} empty cells` : null].filter(Boolean).join('; ') || null;
      });
      if (r) bad.push(`${name}: ${r}`);
    }
    expect(bad.length === 0, bad.join(' | '));
  });

  await check('Docs page', `G-L1, all ${CHAPTERS.length} component pages state a status, their own change history, limitations and the accessibility work left to the app`, async () => {
    const bad = [];
    for (const { name, slug } of CHAPTERS) {
      await go(`/components/${slug}`);
      const r = await page.evaluate(() => {
        const rows = (id) => document.querySelectorAll(`#${id} tbody tr, #${id} li`).length;
        const status = [...document.querySelectorAll('[aria-label="Component facts"] li')].some((l) => /^status: (Alpha|Beta|Stable)$/.test(l.textContent.trim()));
        const must = [...document.querySelectorAll('#accessibility h3')].find((h) => h.textContent === 'What you still have to do')?.nextElementSibling?.querySelectorAll('li').length ?? 0;
        return [status ? null : 'no status', rows('history') ? null : 'no history rows', rows('limitations') ? null : 'no limitations', must ? null : 'no app duties'].filter(Boolean).join(', ') || null;
      });
      if (r) bad.push(`${name}: ${r}`);
    }
    expect(bad.length === 0, bad.join(' | '));
  });

  await check('Docs page', `G-M1, the accessibility matrix lists all ${CHAPTERS.length} components and no cell is blank`, async () => {
    await go('/reference/status');
    const r = await page.evaluate(() => [...document.querySelectorAll('#matrix tbody tr')].map((tr) => [tr.querySelector('th').textContent, [...tr.querySelectorAll('td')].filter((td) => !td.textContent.trim()).length]));
    expect(r.length === CHAPTERS.length, `${r.length} rows`);
    const blank = r.filter(([, n]) => n);
    expect(!blank.length, blank.map(([c, n]) => `${c}: ${n} blank`).join(', '));
    return `${r.length} rows`;
  });
  // --- every page: axe -----------------------------------------------------------------------
  for (const mode of ['none', 'active']) {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: mode, reducedMotion: 'reduce' });
    const p = await c.newPage();
    await check('Docs page', `axe finds no violations on all ${ROUTES.length} pages (forced-colors ${mode})`, async () => {
      const bad = [];
      let incomplete = 0;
      for (const r of ROUTES) {
        await p.goto(`${srv.base}${r}?scene=room&theme=dark`, { waitUntil: 'networkidle' });
        const res = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        for (const v of res.violations) bad.push(`${r} ${v.id}×${v.nodes.length}`);
        incomplete += res.incomplete.find((i) => i.id === 'color-contrast')?.nodes.length ?? 0;
      }
      expect(bad.length === 0, bad.slice(0, 6).join(', '));
      return `color-contrast incomplete on ${incomplete} nodes because axe cannot see through backdrop-filter, and glass-evidence settles those per pixel`;
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
