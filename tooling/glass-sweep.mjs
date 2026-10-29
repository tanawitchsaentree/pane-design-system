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
const LEVELS = (process.env.LEVELS ?? '0.54,0.5,0.46,0.42,0.38').split(',').map(Number);
const BLURS = (process.env.BLURS ?? '40').split(',').map(Number); // px — heavier blur averages bright spots away
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
    await docs.goto(`${srv.base}/index.html?backdrop=${scene}`, { waitUntil: 'networkidle' });
    await docs.evaluate(() => document.fonts.ready);
    out.scenes[scene] = [];
    for (const blur of BLURS) for (const b of LEVELS) {
      await page.evaluate((v) => {
        for (const el of document.querySelectorAll('[data-environment]')) { el.style.setProperty('--ds-glass-brightness', v.b); el.style.setProperty('--ds-card-brightness', v.b); el.style.setProperty('--ds-card-blur', v.blur); }
      }, { b: String(b), blur: `${blur}px` });
      const r = await measurePageText(page, 4.5);
      const ts = r.all.filter((t) => GATED.includes(t.group));
      // same level on the docs page, scrolled top to bottom
      await docs.evaluate((v) => {
        for (const el of document.querySelectorAll('[data-environment]')) { el.style.setProperty('--ds-glass-brightness', v.b); el.style.setProperty('--ds-card-brightness', v.b); el.style.setProperty('--ds-card-blur', v.blur); }
      }, { b: String(b), blur: `${blur}px` });
      const d = await measurePageText(docs, 4.5);
      const dfails = d.failures.filter((t) => t.group !== 'media');
      const fails = [...ts.filter((t) => t.min == null || t.min < t.required), ...dfails];
      ts.push(...d.all.filter((t) => t.group !== 'media'));
      out.scenes[scene].push({ blur, brightness: b, fails: fails.length, texts: ts.length, worst: Math.min(...ts.map((t) => t.min ?? 0)) });
      console.log(`${scene.padEnd(7)} blur ${blur} brightness ${b}: ${fails.length}/${ts.length} fail, worst ${Math.min(...ts.map((t) => t.min ?? 0))}`);
    }

  }
} finally {
  await browser.close();
  srv.close();
}
const summary = Object.fromEntries(BLURS.map((bl) => [bl, Object.fromEntries(SCENES.map((s) => [s, Math.max(...out.scenes[s].filter((r) => r.blur === bl && r.fails === 0).map((r) => r.brightness), -Infinity)]))]));
out.clearestPassing = summary;
writeFileSync(path.join(ROOT, 'system', 'reports', `glass-sweep-${out.generatedAt.slice(0, 10)}.json`), JSON.stringify(out, null, 2) + '\n');
console.log('\nclearest passing brightness per blur per scene:', JSON.stringify(summary));
