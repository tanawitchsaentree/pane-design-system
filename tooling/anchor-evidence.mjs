#!/usr/bin/env node
// anchor-evidence — measures every text node of every anchor-round candidate (apps/lab/anchor) on
// every backdrop, worst pixel under the glyph boxes (tooling/text-contrast.mjs). The numbers are
// shown under each card so the anchor is picked knowing which treatments actually read.
// Usage: node tooling/anchor-evidence.mjs  → apps/lab/anchor/anchor-evidence.json
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve-dist.mjs';
import { measurePageText } from './text-contrast.mjs';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'lab', 'anchor');
const SCENES = ['room', 'blobs', 'night', 'daylight'];
const ROUND = process.argv.find((a) => a.startsWith('--round='))?.slice(8) ?? null; // e.g. --round=tune
const srv = await serveDist(DIR);
const browser = await chromium.launch();
const out = { generatedAt: new Date().toISOString(), browser: `chromium ${browser.version()}`, threshold: 4.5, scenes: {} };
try {
  for (const scene of SCENES) {
    const page = await browser.newPage({ viewport: { width: 1640, height: 1000 }, deviceScaleFactor: 1 });
    await page.goto(`${srv.base}/index.html?backdrop=${scene}${ROUND ? `&round=${ROUND}` : ''}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const r = await measurePageText(page, out.threshold);
    const groups = {};
    for (const t of r.all.filter((t) => t.group)) (groups[t.group] ??= []).push(t);
    out.scenes[scene] = Object.fromEntries(Object.entries(groups).map(([g, ts]) => {
      const scored = ts.filter((t) => t.min != null);
      return [g, {
        texts: ts.length,
        worst: Math.min(...scored.map((t) => t.min)),
        below45: ts.filter((t) => t.min == null || t.min < 4.5).length,
        below3: ts.filter((t) => t.min == null || t.min < 3).length,
        unmeasurable: ts.filter((t) => t.min == null).length,
        worstFive: [...scored].sort((a, b) => a.min - b.min).slice(0, 5).map((t) => `${t.label} ${t.min}`),
      }];
    }));
    await page.close();
  }
} finally {
  await browser.close();
  srv.close();
}
writeFileSync(path.join(DIR, ROUND ? `anchor-evidence-${ROUND}.json` : 'anchor-evidence.json'), JSON.stringify(out, null, 2) + '\n');
for (const [scene, gs] of Object.entries(out.scenes))
  console.log(scene.padEnd(9), Object.entries(gs).map(([g, v]) => `${g}: worst ${v.worst} · ${v.below45}/${v.texts} <4.5`).join('   '));
