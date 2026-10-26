#!/usr/bin/env node
// glass-sweep — for each scene photo, the highest backdrop brightness (least dimming = clearest
// glass) at which every gated text node in the harness AND every text node on the scrolled docs
// page still reaches 4.5:1 (the scene is fixed, so cards pass over all of it while scrolling). Measured on the built
// harness with --ds-glass-brightness overridden; the result sets the scene → environment mapping
// and the brightness tokens (D-010).
// Usage: node tooling/glass-sweep.mjs  (after pnpm --filter pane-docs build)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve-dist.mjs';
import { measurePageText } from './text-contrast.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCENES = ['room', 'forest', 'night', 'city'];
const LEVELS = [0.5, 0.45, 0.4, 0.36, 0.32, 0.28];
const GATED = ['card', 'controls'];
const srv = await serveDist(path.join(ROOT, 'apps', 'docs', 'dist'));
const browser = await chromium.launch();
const out = { generatedAt: new Date().toISOString(), levels: LEVELS, scenes: {} };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const docs = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  for (const scene of SCENES) {
    await page.goto(`${srv.base}/harness.html?scene=${scene}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await docs.goto(`${srv.base}/index.html?scene=${scene}`, { waitUntil: 'networkidle' });
    await docs.evaluate(() => document.fonts.ready);
    out.scenes[scene] = [];
    for (const b of LEVELS) {
      await page.evaluate((v) => {
        for (const el of document.querySelectorAll('[data-environment]')) { el.style.setProperty('--ds-glass-brightness', v); el.style.setProperty('--ds-card-brightness', v); }
      }, String(b));
      const r = await measurePageText(page, 4.5);
      const ts = r.all.filter((t) => GATED.includes(t.group));
      // same level on the docs page, scrolled top to bottom
      await docs.evaluate((v) => {
        for (const el of document.querySelectorAll('[data-environment]')) { el.style.setProperty('--ds-glass-brightness', v); el.style.setProperty('--ds-card-brightness', v); }
      }, String(b));
      const d = await measurePageText(docs, 4.5);
      const dfails = d.failures.filter((t) => t.group !== 'media');
      const fails = [...ts.filter((t) => t.min == null || t.min < 4.5), ...dfails];
      ts.push(...d.all.filter((t) => t.group !== 'media'));
      out.scenes[scene].push({ brightness: b, fails: fails.length, texts: ts.length, worst: Math.min(...ts.map((t) => t.min ?? 0)) });
      console.log(`${scene.padEnd(7)} brightness ${b}: ${fails.length}/${ts.length} fail, worst ${Math.min(...ts.map((t) => t.min ?? 0))}`);
    }
    const pass = out.scenes[scene].filter((r) => r.fails === 0).map((r) => r.brightness);
    out.scenes[scene].clearest = pass.length ? Math.max(...pass) : null;
  }
} finally {
  await browser.close();
  srv.close();
}
const summary = Object.fromEntries(SCENES.map((s) => [s, Math.max(...out.scenes[s].filter((r) => r.fails === 0).map((r) => r.brightness), -Infinity)]));
out.clearestPassing = summary;
writeFileSync(path.join(ROOT, 'system', 'reports', `glass-sweep-${out.generatedAt.slice(0, 10)}.json`), JSON.stringify(out, null, 2) + '\n');
console.log('\nclearest passing brightness per scene:', JSON.stringify(summary));
