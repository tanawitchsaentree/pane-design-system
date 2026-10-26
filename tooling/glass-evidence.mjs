#!/usr/bin/env node
// glass-evidence — D-003: glass passes by measured pixels, never by token arithmetic.
//
// For every scene × mode it loads apps/docs/harness.html (the anchor card + every component
// variant + one card per environment) and the docs page itself, and scores every text node
// against the real pixels under it (tooling/text-contrast.mjs: hide text, screenshot, worst pixel,
// translucent text blended per pixel). Threshold 4.5:1 for all text.
//
//   gating        harness groups card / controls / environment, and every docs-page text node
//   informational harness group media — text on the post image depends on the picture, which the
//                 system doesn't control; and env-misuse — a card declared darker than its scene.
//                 Both are reported, never hidden.
//
// Modes: normal, reduced-transparency (CDP media emulation), forced-colors. Each mode checks its
// emulation actually took effect before measuring.
// Usage: node tooling/glass-evidence.mjs [--no-build]
// Writes apps/docs/public/evidence.json and system/reports/glass-evidence-{date}.json.
import { writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve-dist.mjs';
import { measurePageText } from './text-contrast.mjs';
import { readFileSync } from 'node:fs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const THRESHOLD = 4.5;
// E-001 (system/EXCEPTIONS.md): white text on thin glass over photos with sunlit regions may land
// between this floor and its WCAG minimum. Those nodes are counted as "excepted", never as passing;
// anything under the floor still fails. The floor must match E-001's scope line exactly.
const E001_FLOOR = 3.8;
const isExcepted = (t) => t.min != null && t.min >= E001_FLOOR && t.min < t.required;
const SCENES = ['room', 'forest', 'night', 'city'];
// Every page of the book. Normal mode: every page on every scene. The fallback modes paint opaque
// glass, so the backdrop no longer matters — every page on one scene keeps the run bounded.
const ROUTES = JSON.parse(readFileSync(path.join(ROOT, 'apps', 'docs', 'src', 'book', 'routes.json'), 'utf8')).parts.flatMap((p) => p.pages.map((pg) => pg.path));
const DOCS_SCENES = { normal: SCENES, 'reduced-transparency': ['room'], 'forced-colors': ['room'] };
const THEMES = ['dark', 'light']; // D-015: every measurement runs in both themes
const GATING_GROUPS = ['card', 'controls', 'status', 'layout', 'environment'];
const INFO_GROUPS = ['media', 'env-misuse'];
const MODES = {
  normal: {},
  'reduced-transparency': { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] },
  'forced-colors': { forcedColors: 'active' },
};

if (!process.argv.includes('--no-build')) {
  for (const f of ['pane-tokens', 'pane-docs']) {
    const r = spawnSync('pnpm', ['--filter', f, 'build'], { cwd: ROOT, stdio: 'inherit' });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}

const srv = await serveDist(path.join(ROOT, 'apps', 'docs', 'dist'));
const browser = await chromium.launch();
const result = { generatedAt: new Date().toISOString(), browser: `chromium ${browser.version()}`, threshold: THRESHOLD, modes: Object.keys(MODES), themes: THEMES, harness: {}, docsPage: {}, failures: [], excepted: [], exceptionFloor: E001_FLOOR };

async function open(mode, url) {
  const opt = MODES[mode];
  // reduced motion: entrance animations would otherwise be caught mid-fade
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, forcedColors: opt.forcedColors ?? 'none', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  if (opt.features) await (await ctx.newCDPSession(page)).send('Emulation.setEmulatedMedia', { features: opt.features });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const active = await page.evaluate((m) => ({
    normal: true,
    'reduced-transparency': matchMedia('(prefers-reduced-transparency: reduce)').matches,
    'forced-colors': matchMedia('(forced-colors: active)').matches,
  })[m], mode);
  if (!active) throw new Error(`mode ${mode} did not take effect in this browser`);
  return { page, close: () => ctx.close() };
}

const summarise = (ts) => {
  const scored = ts.filter((t) => t.min != null);
  return {
    texts: ts.length,
    worst: scored.length ? Math.min(...scored.map((t) => t.min)) : null,
    failures: ts.filter((t) => t.min == null || t.min < t.required).length,
    unmeasurable: ts.filter((t) => t.min == null).length,
    worstFive: [...scored].sort((a, b) => a.min - b.min).slice(0, 5).map((t) => `${t.label} ${t.min}`),
  };
};

try {
  for (const mode of Object.keys(MODES)) {
    result.harness[mode] = {};
    result.docsPage[mode] = {};
    for (const theme of THEMES) for (const scene of SCENES) {
      const key = `${theme}/${scene}`;
      const h = await open(mode, `${srv.base}/harness.html?scene=${scene}&theme=${theme}`);
      const r = await measurePageText(h.page, THRESHOLD);
      await h.close();
      const groups = {};
      for (const g of [...GATING_GROUPS, ...INFO_GROUPS]) groups[g] = summarise(r.all.filter((t) => t.group === g));
      result.harness[mode][key] = groups;
      for (const g of GATING_GROUPS) for (const t of r.all.filter((t) => t.group === g && (t.min == null || t.min < t.required))) {
        if (isExcepted(t)) result.excepted.push(`[${mode}] harness ${key}/${g}: "${t.label}" ${t.min}`);
        else result.failures.push(`[${mode}] harness ${key}/${g}: "${t.label}" ${t.min}`);
      }

      result.docsPage[mode][key] = { textElements: 0, failures: 0, pages: 0, worstFive: [] };
      if (DOCS_SCENES[mode].includes(scene)) for (const route of ROUTES) {
        const d = await open(mode, `${srv.base}${route}?scene=${scene}&theme=${theme}`);
        const dr = await measurePageText(d.page, THRESHOLD);
        await d.close();
        // pattern pages and the overview show the anchor card's image text — reported like the harness's
        const gating = dr.failures.filter((t) => !INFO_GROUPS.includes(t.group));
        const agg = result.docsPage[mode][key];
        agg.textElements += dr.textElements;
        agg.pages += 1;
        for (const t of gating) {
          if (isExcepted(t)) result.excepted.push(`[${mode}] docs ${route} ${scene}: "${t.label}" ${t.min}`);
          else { agg.failures += 1; result.failures.push(`[${mode}] docs ${route} ${key}: "${t.label}" ${t.min}`); }
        }
      }
      console.log(`${mode.padEnd(21)} ${key.padEnd(14)} harness ${GATING_GROUPS.map((g) => `${g} ${groups[g].failures}/${groups[g].texts}`).join(' · ')} | media worst ${groups.media.worst} | docs ${result.docsPage[mode][key].failures}/${result.docsPage[mode][key].textElements} over ${result.docsPage[mode][key].pages} pages`);
    }
  }
} finally {
  await browser.close();
  srv.close();
}

const gatingChecks = Object.values(result.harness).reduce((n, m) => n + Object.values(m).reduce((k, s) => k + GATING_GROUPS.reduce((j, g) => j + s[g].texts, 0), 0), 0)
  + Object.values(result.docsPage).reduce((n, m) => n + Object.values(m).reduce((k, s) => k + s.textElements, 0), 0);
const informational = [];
for (const [mode, m] of Object.entries(result.harness)) for (const [scene, s] of Object.entries(m)) { if (s.media.failures) informational.push(`${mode}/${scene} image text worst ${s.media.worst}:1`); if (s['env-misuse'].failures) informational.push(`${mode}/${scene} env-misuse worst ${s['env-misuse'].worst}:1`); }
result.summary = { gatingChecks, gatingFailures: result.failures.length, excepted: result.excepted.length, informational };

for (const out of [path.join(ROOT, 'apps', 'docs', 'public', 'evidence.json'), path.join(ROOT, 'system', 'reports', `glass-evidence-${result.generatedAt.slice(0, 10)}.json`)]) {
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
}
for (const f of result.failures.slice(0, 40)) console.log(`✗ ${f}`);
console.log(`\n${result.failures.length ? '✗' : '✓'} glass evidence: ${gatingChecks - result.failures.length - result.excepted.length}/${gatingChecks} text checks pass, ${result.excepted.length} excepted under E-001 (≥${E001_FLOOR}:1) (${SCENES.length} scenes × ${Object.keys(MODES).length} modes, harness + docs page, ${result.browser}); image text reported only: ${informational.length} scene/mode(s) below ${THRESHOLD}:1`);
process.exit(result.failures.length ? 1 : 0);
