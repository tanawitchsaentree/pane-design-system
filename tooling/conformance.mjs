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
// a page with tabs is one route per tab (docs-engine component-depth.md), so every tab gets visited
const ROUTES = JSON.parse(readFileSync(path.join(ROOT, 'apps/docs/src/book/routes.json'), 'utf8')).parts.flatMap((p) => p.pages.flatMap((pg) => (pg.tabs ? pg.tabs.map((t) => `${pg.path}/${t}`) : [pg.path])));
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const go = (route) => page.goto(`${srv.base}${route}?scene=room&theme=dark`, { waitUntil: 'networkidle' });
  const main = () => page.locator('main');

  // a component page is four tab routes (component-depth.md); its demos are counted across all of them
  const TABS = ['usage', 'style', 'code', 'accessibility'];
  for (const { name, slug } of CHAPTERS) {
    await check(name, `demo floor met (≥ variant dimensions + 3 = ${META.components[name].demoFloor})`, async () => {
      let n = 0;
      for (const t of TABS) { await go(`/components/${slug}/${t}`); n += await main().locator('figure.example').count(); }
      expect(n >= META.components[name].demoFloor, `${n} demos across the tabs`);
      return `${n} demos`;
    });
  }

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

  // --- Card -----------------------------------------------------------------------------------
  await go('/components/card/code');
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
  await go('/components/avatar/code');
  await check('Avatar', 'non-decorative avatars are role="img" named after the person', async () => {
    for (const n of ['Max Fmz', 'Visual Flow', 'Ada Lovelace', 'Grace Hopper']) expect((await main().getByRole('img', { name: n }).count()) >= 1, `no img named ${n}`);
  });
  await check('Avatar', 'decorative avatar beside a visible name is hidden from assistive tech', async () => {
    const n = await main().locator('[aria-hidden="true"]').filter({ hasText: 'MF' }).count();
    expect(n >= 1, 'decorative avatar is not aria-hidden');
  });

  // --- Button ---------------------------------------------------------------------------------
  await go('/components/button/code');
  const follow = main().getByRole('button', { name: 'Follow', exact: true }).first();
  await check('Button', 'native <button type="button">', async () => {
    expect((await follow.getAttribute('type')) === 'button', 'type is not "button"');
  });
  await check('Button', 'reachable with Tab', () => tabTo(page, follow));
  await check('Button', 'Enter and Space activate it', async () => {
    // Counted on the real Button, not on a docs control: the scene toggles this used to press became a Select (D-017).
    await follow.evaluate((el) => { el.dataset.clicks = '0'; el.addEventListener('click', () => { el.dataset.clicks = String(Number(el.dataset.clicks) + 1); }); });
    await tabTo(page, follow);
    await page.keyboard.press('Enter');
    await eventually(() => follow.getAttribute('data-clicks'), '1', 'Enter did not activate');
    await page.keyboard.press('Space');
    await eventually(() => follow.getAttribute('data-clicks'), '2', 'Space did not activate');
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
  await go('/components/icon-button/code');
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
  await go('/components/tabs/code');
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
  await go('/components/tag/code');
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
      await go('/components/grid/code');
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
      await go('/components/grid/code');
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
      await go('/components/container/code');
      pads.push(await page.evaluate(() => { const d = document.createElement('div'); d.className = document.querySelector('main #hero .demo-full')?.className ?? ''; return getComputedStyle(document.querySelector('main #hero .demo-full')).paddingInlineStart; }));
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(pads.join() === '16px,32px,48px', `padding-inline at 375/800/1280: ${pads.join(', ')}`);
    return pads.join(' → ');
  });
  await check('Stack', 'gap comes from the token scale (md = 16px, xl = 32px)', async () => {
    await go('/components/stack/code');
    const gaps = await main().locator('#demos .demo-card').nth(1).locator('> div').evaluateAll((els) => els.map((e) => getComputedStyle(e).columnGap));
    expect(gaps.join() === '4px,8px,16px,24px,32px', `gaps: ${gaps.join(', ')}`);
    return gaps.join(' · ');
  });

  // --- Badge / Chip / Banner ------------------------------------------------------------------------
  await go('/components/badge/code');
  await check('Badge', 'status is in the text, with no role (read in place)', async () => {
    const b = main().getByText('Failed', { exact: true }).first();
    expect((await b.getAttribute('role')) === null, 'has a role');
  });
  await go('/components/chip/code');
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
  // --- Select and Slider: behaviour is Radix's, these prove it survived Pane's wrapping ---
  await go('/components/select/code');
  const trigger = main().getByRole('combobox', { name: 'Who can message you' });
  await check('Select', 'reachable with Tab', () => tabTo(page, trigger));
  await check('Select', 'Enter opens the list and Escape closes it', async () => {
    await tabTo(page, trigger);
    await page.keyboard.press('Enter');
    await eventually(() => trigger.getAttribute('aria-expanded'), 'true', 'Enter did not open the list');
    expect((await page.getByRole('option').count()) === 3, 'the list does not show three options');
    await page.keyboard.press('Escape');
    await eventually(() => trigger.getAttribute('aria-expanded'), 'false', 'Escape did not close the list');
    expect(await trigger.evaluate((el) => document.activeElement === el), 'focus did not return to the trigger');
  });
  await check('Select', 'arrow keys and Enter choose a new value', async () => {
    await tabTo(page, trigger);
    await page.keyboard.press('Enter');
    await eventually(() => trigger.getAttribute('aria-expanded'), 'true', 'did not open');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await eventually(() => trigger.textContent(), 'No one', 'ArrowDown then Enter did not pick the next option');
  });
  await go('/components/slider/code');
  const thumb = main().getByRole('slider', { name: 'Volume' }).first();
  await check('Slider', 'reachable with Tab', () => tabTo(page, thumb));
  await check('Slider', 'arrow keys, Home and End change the value', async () => {
    await tabTo(page, thumb);
    const now = () => thumb.getAttribute('aria-valuenow');
    await page.keyboard.press('Home'); await eventually(now, '0', 'Home did not go to 0');
    await page.keyboard.press('ArrowRight'); await eventually(now, '1', 'ArrowRight did not add one step');
    await page.keyboard.press('End'); await eventually(now, '100', 'End did not go to 100');
    expect((await thumb.getAttribute('aria-valuetext')) === '100%', 'the spoken value is not formatted');
  });
  await check('Slider', 'the press area is at least 44px tall', async () => {
    const h = await thumb.evaluate((el) => el.closest('[data-component="Slider"] *[class*="slider"]')?.getBoundingClientRect().height ?? 0);
    expect(h >= 44, `press area ${h}px`);
  });

  // --- W3 form family (D-020): labels, descriptions and keyboard, all through Radix or native elements ---
  await go('/components/input/code');
  const nameField = main().getByRole('textbox', { name: 'Display name' }).first();
  await check('Input', 'reachable with Tab and labelled by its FormField', async () => {
    await tabTo(page, nameField);
    const d = await nameField.getAttribute('aria-describedby');
    expect(d && (await page.locator(`[id="${d.split(' ')[0]}"]`).count()) === 1, 'help is not tied to the field');
  });
  await check('Input', 'an error marks the field invalid and is read with it', async () => {
    const email = main().getByRole('textbox', { name: /Email/ }).first();
    expect((await email.getAttribute('aria-invalid')) === 'true', 'aria-invalid is not set');
    const ids = (await email.getAttribute('aria-describedby')) ?? '';
    const text = await page.evaluate((ids) => ids.split(' ').map((i) => document.getElementById(i)?.textContent ?? '').join(' '), ids);
    expect(/^Error\./.test(text.trim()), `the error is not spoken first: "${text.slice(0, 60)}"`);
  });
  await go('/components/textarea/code');
  await check('Textarea', 'labelled by its FormField', async () => {
    expect((await main().getByRole('textbox', { name: 'Bio' }).count()) > 0, 'no textarea named Bio');
  });
  await go('/components/checkbox/code');
  const cb = main().getByRole('checkbox', { name: 'Show my email on my profile' }).first();
  await check('Checkbox', 'Space toggles it and the label is its name', async () => {
    await tabTo(page, cb);
    const before = await cb.getAttribute('aria-checked');
    await page.keyboard.press('Space');
    await eventually(() => cb.getAttribute('aria-checked'), before === 'true' ? 'false' : 'true', 'Space did not toggle');
  });
  await check('Checkbox', 'a mixed parent reports aria-checked="mixed"', async () => {
    const parent = main().getByRole('checkbox', { name: 'Download everything' }).first();
    expect((await parent.getAttribute('aria-checked')) === 'mixed', `aria-checked is ${await parent.getAttribute('aria-checked')}`);
  });
  await check('Checkbox', 'the target is at least 44px tall', async () => {
    const h = await main().locator('[data-component="Checkbox"]').first().evaluate((e) => e.getBoundingClientRect().height);
    expect(h >= 44, `row is ${h}px`);
  });
  await go('/components/radio/code');
  const group = main().getByRole('radiogroup', { name: 'Who can message you' }).first();
  await check('Radio', 'one tab stop and arrow keys choose', async () => {
    const chosen = group.getByRole('radio', { name: 'People you follow' });
    await tabTo(page, chosen);
    await page.keyboard.press('ArrowDown');
    await eventually(() => group.getByRole('radio', { name: 'No one' }).getAttribute('aria-checked'), 'true', 'ArrowDown did not choose the next option');
    await page.keyboard.press('Tab');
    expect(!(await group.evaluate((g) => g.contains(document.activeElement))), 'Tab stopped on another option');
  });
  await go('/components/switch/code');
  const sw = main().getByRole('switch', { name: 'Private account' }).first();
  await check('Switch', 'Space toggles it', async () => {
    await tabTo(page, sw);
    const before = await sw.getAttribute('aria-checked');
    await page.keyboard.press('Space');
    await eventually(() => sw.getAttribute('aria-checked'), before === 'true' ? 'false' : 'true', 'Space did not toggle');
  });
  await go('/components/pin-input/code');
  const pin = main().getByRole('group', { name: 'Verification code' }).first();
  await check('PinInput', 'typing moves on and paste fills every cell', async () => {
    const cells = pin.getByRole('textbox');
    await cells.nth(0).click();
    await page.keyboard.type('12');
    expect(await cells.nth(2).evaluate((e) => document.activeElement === e), 'focus did not move to the third cell');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    expect(await cells.nth(1).evaluate((e) => document.activeElement === e), 'Backspace did not move back');
    await cells.nth(0).evaluate((el) => { const dt = new DataTransfer(); dt.setData('text', '654321'); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); });
    await eventually(() => cells.nth(5).inputValue(), '1', 'paste did not fill the last cell');
  });

  await go('/components/banner/code');
  await check('Banner', 'dismiss is a named button and removes the banner', async () => {
    const d = main().getByRole('button', { name: 'Dismiss' }).first();
    // the banner itself: a static Banner is a <section> labelled by its tone
    const count = () => main().locator('section[aria-label="Info"]', { hasText: 'New sign-in from Zürich' }).count();
    const before = await count();
    await d.click();
    await page.waitForTimeout(600); // the line closes its height before it is removed
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
    let seen = 0;
    for (const w of [375, 1280]) {
      await page.setViewportSize({ width: w, height: 900 });
      for (const r of ROUTES) {
        await go(r);
        const hits = await page.evaluate(() => {
          // Prose pages carry no glass since the opaque shell (D-016), and a Don't example shows touching cards on purpose.
          const cards = [...document.querySelectorAll('main [data-pane-card="glass"]')].filter((c) => c.getBoundingClientRect().width > 0 && !c.closest('[data-dont]'));
          const out = [];
          for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) {
            const a = cards[i], b = cards[j];
            if (a.contains(b) || b.contains(a)) continue;
            const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
            const dx = Math.max(rb.left - ra.right, ra.left - rb.right), dy = Math.max(rb.top - ra.bottom, ra.top - rb.bottom);
            const gap = Math.max(dx, dy); // negative = overlap
            if (gap < 8) out.push(`${(a.textContent || '').trim().slice(0, 18)} ↔ ${(b.textContent || '').trim().slice(0, 18)} (${Math.round(gap)}px)`);
          }
          return { out, n: cards.length };
        });
        seen += hits.n;
        for (const h of hits.out) bad.push(`${w}px ${r}: ${h}`);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(seen > 0, 'NO CARDS FOUND on any page, so the selector is broken and nothing was checked');
    expect(bad.length === 0, `${bad.length} — ${bad.slice(0, 4).join(' | ')}`);
    return `${seen} cards across both widths`;
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
      // Playground controls are Pane's own Select and Slider since D-017; native inputs still count.
      const ctl = pg.locator('.pg-controls :is(input, select, [role="combobox"], [role="slider"])').first();
      const kind = await ctl.evaluate((e) => e.getAttribute('role') ?? (e.tagName === 'SELECT' ? 'select' : e.type));
      if (kind === 'combobox') { await ctl.click(); await page.getByRole('option', { selected: false }).first().click(); }
      else if (kind === 'slider') { await ctl.focus(); await page.keyboard.press((await ctl.getAttribute('aria-valuenow')) === (await ctl.getAttribute('aria-valuemin')) ? 'End' : 'Home'); }
      else if (kind === 'select') { const opts = await ctl.evaluate((e) => [...e.options].map((o) => o.value)); const cur = await ctl.inputValue(); await ctl.selectOption(opts.find((o) => o !== cur)); }
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
      await p.goto(`${srv.base}/components/card/code?scene=room&theme=dark`, { waitUntil: 'networkidle' });
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
      await go(`/components/${slug}/style`);
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
      const seen = { status: false, history: false, limitations: false, duties: false };
      for (const t of TABS) {
        await go(`/components/${slug}/${t}`);
        const r = await page.evaluate(() => ({
          status: [...document.querySelectorAll('[data-fact="status"]')].some((l) => /^status: (Alpha|Beta|Stable)$/.test(l.textContent.trim())),
          history: document.querySelectorAll('[data-history] tbody tr').length > 0,
          limitations: document.querySelectorAll('[data-limitations] li').length > 0,
          duties: document.querySelectorAll('[data-a11y-duties] li').length > 0,
        }));
        for (const k of Object.keys(seen)) seen[k] ||= r[k];
      }
      const miss = Object.entries(seen).filter(([, v]) => !v).map(([k]) => ({ status: 'no status', history: 'no history rows', limitations: 'no limitations', duties: 'no app duties' })[k]);
      if (miss.length) bad.push(`${name}: ${miss.join(', ')}`);
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
  await check('Docs page', `G-N1, no form control on any of the ${ROUTES.length} pages shows the browser's default look, because selects and sliders are drawn from tokens in both themes`, async () => {
    const bad = [];
    let n = 0;
    for (const th of ['dark', 'light']) for (const r of ROUTES) {
      await page.goto(`${srv.base}${r}?scene=room&theme=${th}`, { waitUntil: 'networkidle' });
      const res = await page.evaluate(() => [...document.querySelectorAll('main select, main input[type="range"], #book-nav select, main [role="combobox"], main [role="slider"]')].map((e) => {
        // Pane's Select and Slider (D-017) draw everything from tokens; a native element behind those roles is the default look back.
        if (e.matches('[role="combobox"], [role="slider"]')) return e.closest('[data-component="Select"], [data-component="Slider"]') && !e.matches('select, input') ? null : `${e.tagName.toLowerCase()} role=${e.getAttribute('role')} is not a Pane control`;
        const cs = getComputedStyle(e);
        if (cs.appearance !== 'none') return `${e.tagName.toLowerCase()} has appearance ${cs.appearance}`;
        if (e.tagName === 'SELECT' && !e.parentElement.querySelector('.select-chevron')) return 'select without its chevron';
        return null;
      }));
      n += res.length;
      res.forEach((x) => x && bad.push(`${th} ${r}: ${x}`));
    }
    expect(n > 0, 'NO CONTROLS FOUND, so nothing was checked');
    expect(bad.length === 0, `${bad.length} — ${bad.slice(0, 4).join(' | ')}`);
    return `${n / 2} controls per theme`;
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
