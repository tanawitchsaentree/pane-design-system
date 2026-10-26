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

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const THRESHOLD = 4.5;
const SCENES = ['room', 'forest', 'night', 'city'];
const GATING_GROUPS = ['card', 'controls', 'environment'];
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
const result = { generatedAt: new Date().toISOString(), browser: `chromium ${browser.version()}`, threshold: THRESHOLD, modes: Object.keys(MODES), harness: {}, docsPage: {}, failures: [] };

async function open(mode, url) {
  const opt = MODES[mode];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, forcedColors: opt.forcedColors ?? 'none' });
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
    failures: ts.filter((t) => t.min == null || t.min < THRESHOLD).length,
    unmeasurable: ts.filter((t) => t.min == null).length,
    worstFive: [...scored].sort((a, b) => a.min - b.min).slice(0, 5).map((t) => `${t.label} ${t.min}`),
  };
};

try {
  for (const mode of Object.keys(MODES)) {
    result.harness[mode] = {};
    result.docsPage[mode] = {};
    for (const scene of SCENES) {
      const h = await open(mode, `${srv.base}/harness.html?scene=${scene}`);
      const r = await measurePageText(h.page, THRESHOLD);
      await h.close();
      const groups = {};
      for (const g of [...GATING_GROUPS, ...INFO_GROUPS]) groups[g] = summarise(r.all.filter((t) => t.group === g));
      result.harness[mode][scene] = groups;
      for (const g of GATING_GROUPS) for (const t of r.all.filter((t) => t.group === g && (t.min == null || t.min < THRESHOLD)))
        result.failures.push(`[${mode}] harness ${scene}/${g}: "${t.label}" ${t.min}`);

      const d = await open(mode, `${srv.base}/index.html?scene=${scene}`);
      const dr = await measurePageText(d.page, THRESHOLD);
      await d.close();
      result.docsPage[mode][scene] = { textElements: dr.textElements, failures: dr.failures.filter((t) => !INFO_GROUPS.includes(t.group)).length, worstFive: dr.worst.map((t) => `${t.label} ${t.min}`) };
      // the docs hero is the anchor card, image included — its image text is reported like the harness's
      const docsGating = dr.failures.filter((t) => !INFO_GROUPS.includes(t.group));
      for (const t of docsGating) result.failures.push(`[${mode}] docs ${scene}: "${t.label}" ${t.min}`);
      console.log(`${mode.padEnd(21)} ${scene.padEnd(9)} harness ${GATING_GROUPS.map((g) => `${g} ${groups[g].failures}/${groups[g].texts}`).join(' · ')} | media worst ${groups.media.worst} | docs ${result.docsPage[mode][scene].failures}/${dr.textElements}`);
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
result.summary = { gatingChecks, gatingFailures: result.failures.length, informational };

for (const out of [path.join(ROOT, 'apps', 'docs', 'public', 'evidence.json'), path.join(ROOT, 'system', 'reports', `glass-evidence-${result.generatedAt.slice(0, 10)}.json`)]) {
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
}
for (const f of result.failures.slice(0, 40)) console.log(`✗ ${f}`);
console.log(`\n${result.failures.length ? '✗' : '✓'} glass evidence: ${gatingChecks - result.failures.length}/${gatingChecks} text checks pass (${SCENES.length} scenes × ${Object.keys(MODES).length} modes, harness + docs page, ${result.browser}); image text reported only: ${informational.length} scene/mode(s) below ${THRESHOLD}:1`);
process.exit(result.failures.length ? 1 : 0);
