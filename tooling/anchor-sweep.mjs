#!/usr/bin/env node
// anchor-sweep — finds the lightest version of the chosen anchor (D-008, card A) that passes
// 4.5:1 for every text node on every backdrop, by measuring, not estimating. Sweeps glass tint
// lightness × alpha × secondary-text alpha (first run showed alpha alone can't pass: the anchor's
// rgb(118,118,128) caps white text at ~4.6:1 even fully opaque); the selected-tab blue is fixed to a darker hue of the same blue
// (#1d9bf0 measures ~2.9:1 under white text on its own fill, before any glass is involved).
// Text on the image (media) is excluded — it depends on the image, not on the glass.
// Usage: node tooling/anchor-sweep.mjs → system/reports/anchor-sweep-{date}.json
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve-dist.mjs';
import { measurePageText } from './text-contrast.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCENES = ['room', 'blobs', 'night', 'daylight'];
const TONES = [[118, 118, 128], [88, 88, 96], [64, 64, 72], [44, 44, 52]];
const GLASS = [0.4, 0.5, 0.6, 0.7];
const INK2 = [0.75, 0.85];
const TAB_BLUE = '#0071e3';

const srv = await serveDist(path.join(ROOT, 'apps', 'lab', 'anchor'));
const browser = await chromium.launch();
const rows = [];
try {
  const page = await browser.newPage({ viewport: { width: 1640, height: 1000 }, deviceScaleFactor: 1 });
  for (const scene of SCENES) {
    await page.goto(`${srv.base}/index.html?scene=${scene}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // only card A matters here; hiding the others keeps the run fast and the page short
    await page.addStyleTag({ content: '.col:not(:first-child) { display: none !important; }' });
    for (const tone of TONES) for (const g of GLASS) for (const a2 of INK2) {
      await page.evaluate(({ tone, g, a2, blue }) => {
        const c = document.querySelector('.v-spatial');
        c.style.setProperty('--glass', `rgba(${tone.join(', ')}, ${g})`);
        c.style.setProperty('--ink-2', `rgba(255, 255, 255, ${a2})`);
        c.style.setProperty('--tab-on-bg', blue);
      }, { tone, g, a2, blue: TAB_BLUE });
      const r = await measurePageText(page, 4.5);
      const card = r.all.filter((t) => t.group === 'A');
      const fails = card.filter((t) => t.min == null || t.min < 4.5);
      rows.push({ scene, tone: tone.join(','), glass: g, ink2: a2, texts: card.length, fails: fails.length, worst: Math.min(...card.map((t) => t.min ?? 0)), failing: fails.map((t) => `${t.label} ${t.min}`) });
      console.log(`${scene.padEnd(9)} tone ${tone[0]} glass ${g} ink2 ${a2}: ${fails.length}/${card.length} fail, worst ${Math.min(...card.map((t) => t.min ?? 0))}`);
    }
  }
} finally {
  await browser.close();
  srv.close();
}

const combos = TONES.flatMap((t) => GLASS.flatMap((g) => INK2.map((a2) => ({ tone: t.join(','), glass: g, ink2: a2 }))));
const passing = combos.filter((c) => SCENES.every((s) => rows.find((r) => r.scene === s && r.tone === c.tone && r.glass === c.glass && r.ink2 === c.ink2)?.fails === 0));
// closest to the anchor as picked: lightest tone, then least opaque glass, then most translucent secondary text
passing.sort((a, b) => Number(b.tone.split(',')[0]) - Number(a.tone.split(',')[0]) || a.glass - b.glass || a.ink2 - b.ink2);
const out = { generatedAt: new Date().toISOString(), tabBlue: TAB_BLUE, scenes: SCENES, rows, passing, pick: passing[0] ?? null };
writeFileSync(path.join(ROOT, 'system', 'reports', `anchor-sweep-${out.generatedAt.slice(0, 10)}.json`), JSON.stringify(out, null, 2) + '\n');
console.log(`\n${out.pick ? `✓ lightest passing: tone rgb(${out.pick.tone}) glass ${out.pick.glass}, ink-2 ${out.pick.ink2}, tab ${TAB_BLUE}` : '✗ no combination passes on all four backdrops'}`);
