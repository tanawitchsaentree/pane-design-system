#!/usr/bin/env node
// optimize-scenes — re-encodes the backdrop photos for the web through Chromium's own encoder (no
// image dependency): 2000px wide, JPEG quality 0.72, plus each photo's average colour, written to
// apps/docs/src/scene-colors.json, plus a WebP copy of each full photo for the page backdrop, so the page paints that colour on its first frame, before the
// photo arrives, and an 800px <name>-sm.jpg for tiles and thumbnails, which never need the full photo.
// Originals stay in git history. Usage: node tooling/optimize-scenes.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'apps', 'docs', 'public', 'scenes');
const browser = await chromium.launch();
const page = await browser.newPage();
const colors = {};
for (const f of readdirSync(DIR).filter((n) => n.endsWith('.jpg') && !n.endsWith('-sm.jpg'))) {
  const src = `data:image/jpeg;base64,${readFileSync(path.join(DIR, f)).toString('base64')}`;
  const r = await page.evaluate(async (s) => {
    const img = new Image(); img.src = s; await img.decode();
    const w = Math.min(2000, img.naturalWidth), h = Math.round(img.naturalHeight * (w / img.naturalWidth));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, w, h);
    const one = document.createElement('canvas'); one.width = one.height = 1;
    one.getContext('2d').drawImage(img, 0, 0, 1, 1);
    const [R, G, B] = one.getContext('2d').getImageData(0, 0, 1, 1).data;
    const s2 = document.createElement('canvas'); s2.width = 800; s2.height = Math.round(800 * h / w);
    s2.getContext('2d').drawImage(img, 0, 0, s2.width, s2.height);
    const webp = c.toDataURL('image/webp', 0.74).split(',')[1];
    return { webp, small: s2.toDataURL('image/jpeg', 0.7).split(',')[1], data: c.toDataURL('image/jpeg', 0.72).split(',')[1], color: `#${[R, G, B].map((v) => v.toString(16).padStart(2, '0')).join('')}` };
  }, src);
  const before = readFileSync(path.join(DIR, f)).length;
  const buf = Buffer.from(r.data, 'base64');
  if (buf.length < before * 0.9) writeFileSync(path.join(DIR, f), buf); // re-encoding an already web-sized JPEG only loses detail
  writeFileSync(path.join(DIR, f.replace('.jpg', '-sm.jpg')), Buffer.from(r.small, 'base64'));
  writeFileSync(path.join(DIR, f.replace('.jpg', '.webp')), Buffer.from(r.webp, 'base64'));
  colors[f.replace('.jpg', '')] = r.color;
  console.log(`${f}: ${(before / 1024).toFixed(0)} kB → ${(Math.min(buf.length, before) / 1024).toFixed(0)} kB · ${r.color}`);
}
await browser.close();
writeFileSync(path.join(ROOT, 'apps', 'docs', 'src', 'scene-colors.json'), JSON.stringify(colors, null, 2) + '\n');
