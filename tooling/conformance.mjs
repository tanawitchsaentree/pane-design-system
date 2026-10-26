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
    const missing = documented.filter((p) => !new RegExp(`\\b${p}\\??:`).test(src));
    expect(missing.length === 0, `documented but not in ${comp}.tsx: ${missing.join(', ')}`);
    return `${documented.length} props`;
  });
}

const srv = await serveDist(path.join(ROOT, 'apps/docs/dist'));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${srv.base}/index.html`, { waitUntil: 'networkidle' });

  // --- Button ---------------------------------------------------------------------------------
  const publish = page.getByRole('button', { name: 'Publish' });
  await check('Button', 'renders a native <button type="button">', async () => {
    expect((await publish.getAttribute('type')) === 'button', 'type is not "button"');
  });
  await check('Button', 'reachable with Tab', () => tabTo(page, publish));
  await check('Button', 'Enter and Space activate it', async () => {
    const draft = page.getByRole('button', { name: 'bauhaus', exact: true });
    const white = page.getByRole('button', { name: 'white', exact: true });
    await tabTo(page, white);
    await page.keyboard.press('Enter');
    expect((await white.getAttribute('aria-pressed')) === 'true', 'Enter did not activate');
    await tabTo(page, draft);
    await page.keyboard.press('Space');
    expect((await draft.getAttribute('aria-pressed')) === 'true', 'Space did not activate');
  });
  await check('Button', 'keyboard focus draws the double ring (2px solid outline)', async () => {
    const save = page.getByRole('button', { name: 'Save draft' });
    await tabTo(page, save);
    const s = await save.evaluate((el) => { const c = getComputedStyle(el); return { style: c.outlineStyle, width: c.outlineWidth, shadow: c.boxShadow }; });
    expect(s.style === 'solid' && s.width === '2px', `outline ${s.style} ${s.width}`);
    expect((s.shadow.match(/rgb/g) ?? []).length >= 2, 'outer white ring missing from box-shadow');
  });
  await check('Button', 'disabled: native disabled attribute + dashed mullion (non-colour cue)', async () => {
    const dis = page.getByRole('button', { name: 'Disabled' });
    expect(await dis.isDisabled(), 'not disabled');
    expect((await dis.evaluate((el) => getComputedStyle(el).borderTopStyle)) === 'dashed', 'disabled mullion is not dashed (non-colour cue)');
  });

  // --- Badge ----------------------------------------------------------------------------------
  await check('Badge', 'renders as plain text with no role', async () => {
    const b = page.locator('span', { hasText: /^Live$/ }).first();
    expect((await b.getAttribute('role')) === null, 'has a role');
  });

  // --- Panel ----------------------------------------------------------------------------------
  await check('Panel', 'is a <section> whose title is a real heading at headingLevel', async () => {
    const h = page.getByRole('heading', { name: 'Quarterly report', level: 4 });
    expect((await h.count()) === 1, 'no h4 "Quarterly report"');
    expect((await h.evaluate((el) => el.parentElement?.tagName)) === 'SECTION', 'heading parent is not a section');
  });

  // --- TextField ------------------------------------------------------------------------------
  await check('TextField', 'label is programmatically tied to the input', async () => {
    expect((await page.getByLabel('Full name').count()) === 1, 'getByLabel("Full name") found no input');
  });
  await check('TextField', 'errorText sets aria-invalid and is announced via aria-describedby (error first)', async () => {
    const input = page.getByLabel('Email', { exact: true });
    expect((await input.getAttribute('aria-invalid')) === 'true', 'aria-invalid not true');
    const ids = (await input.getAttribute('aria-describedby'))?.split(' ') ?? [];
    const first = await page.locator(`[id="${ids[0]}"]`).textContent();
    expect(/enter a full email/i.test(first ?? ''), `first describedby is "${first}"`);
  });
  await check('TextField', 'helperText is linked via aria-describedby', async () => {
    const ids = (await page.getByLabel('Full name').getAttribute('aria-describedby'))?.split(' ') ?? [];
    const txt = await page.locator(`[id="${ids[0]}"]`).textContent();
    expect(/as it appears/i.test(txt ?? ''), `describedby is "${txt}"`);
  });
  await check('TextField', 'reachable with Tab', () => tabTo(page, page.getByLabel('Full name')));

  // --- Switch ---------------------------------------------------------------------------------
  const sw = page.getByRole('switch', { name: 'Uncontrolled' });
  await check('Switch', 'role="switch" with aria-checked="false" initially', async () => {
    expect((await sw.getAttribute('aria-checked')) === 'false', `aria-checked=${await sw.getAttribute('aria-checked')}`);
  });
  await check('Switch', 'Space toggles it on, Enter toggles it off', async () => {
    await tabTo(page, sw);
    await page.keyboard.press('Space');
    expect((await sw.getAttribute('aria-checked')) === 'true', 'Space did not turn it on');
    await page.keyboard.press('Enter');
    expect((await sw.getAttribute('aria-checked')) === 'false', 'Enter did not turn it off');
  });
  await check('Switch', 'click toggles it', async () => {
    await sw.click();
    expect((await sw.getAttribute('aria-checked')) === 'true', 'click did not toggle');
    await sw.click();
  });
  await check('Switch', 'controlled: onCheckedChange drives external state', async () => {
    const ctl = page.getByRole('switch', { name: 'Sync over Wi-Fi only' });
    const badge = ctl.locator('xpath=ancestor::div[1]').locator('span', { hasText: /^(On|Off)$/ });
    expect((await badge.textContent()) === 'On', 'badge did not start On');
    await ctl.click();
    expect((await ctl.getAttribute('aria-checked')) === 'false' && (await badge.textContent()) === 'Off', 'state did not flow out');
  });
  await check('Switch', 'state has a non-colour cue (thumb moves to the other end)', async () => {
    const thumbX = async () => sw.locator('[aria-hidden] > span').evaluate((el) => el.getBoundingClientRect().left);
    const off = await thumbX();
    await sw.click();
    const on = await thumbX();
    await sw.click();
    expect(on - off >= 16, `thumb moved ${on - off}px`);
  });
  await check('Switch', 'thumb follows writing direction in RTL', async () => {
    const pos = await sw.evaluate((el) => {
      const thumb = el.querySelector('[aria-hidden] > span');
      const track = el.querySelector('[aria-hidden]');
      const read = () => thumb.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const ltrOff = read();
      el.closest('section').setAttribute('dir', 'rtl');
      const rtlOff = read();
      el.closest('section').removeAttribute('dir');
      return { ltrOff, rtlOff };
    });
    expect(pos.rtlOff > pos.ltrOff, `off-state thumb did not move to the right edge in RTL (${pos.ltrOff} -> ${pos.rtlOff})`);
  });

  // --- whole page: axe ------------------------------------------------------------------------
  for (const mode of ['none', 'active']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, forcedColors: mode });
    const p = await ctx.newPage();
    await p.goto(`${srv.base}/index.html`, { waitUntil: 'networkidle' });
    await check('Docs page', `axe: no violations (forced-colors ${mode})`, async () => {
      const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(r.violations.length === 0, r.violations.map((v) => `${v.id} ×${v.nodes.length}`).join(', '));
      // axe cannot see through backdrop-filter, so it reports glass contrast as "incomplete" —
      // that is what glass-evidence.mjs exists to settle; say so instead of hiding it.
      const cc = r.incomplete.find((i) => i.id === 'color-contrast');
      return `${r.passes.length} rules pass; color-contrast incomplete on ${cc?.nodes.length ?? 0} nodes (axe cannot see through backdrop-filter — settled per pixel by glass-evidence docs-page pass)`;
    });
    await ctx.close();
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
