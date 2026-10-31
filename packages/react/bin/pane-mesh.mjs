#!/usr/bin/env node
// pane-mesh — makes a Pane mesh (D-029) from a brand image or four colours, and checks it.
//   npx pane-mesh --from brand.png [--out mesh.css] [--scope :root]
//   npx pane-mesh --colors "#F7B27C,#F2837B,#5F5BF2,#B9A3F5" [--base "#ECE7F1"]
// Writes CSS that overrides the mesh variables, so <Mesh /> takes the brand's
// colours. PNG only (no dependencies); export a JPEG as PNG first (macOS: sips -s format png in.jpg --out in.png).
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const die = (m) => { console.error(`pane-mesh: ${m}`); process.exit(1); };
const hex = (c) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
const parse = (h) => { const m = h.trim().replace('#', ''); if (!/^[0-9a-f]{6}$/i.test(m)) die(`not a #RRGGBB colour: ${h}`); return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16)); };
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const sat = ([r, g, b]) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx === 0 ? 0 : (mx - mn) / mx; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function readPng(file) {
  const buf = readFileSync(file);
  if (buf.readUInt32BE(0) !== 0x89504e47) die(`${file} is not a PNG (export it as PNG first)`);
  let p = 8, w = 0, h = 0, depth = 0, type = 0; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), kind = buf.toString('ascii', p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
    if (kind === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; type = data[9]; if (data[12]) die('interlaced PNGs are not supported'); }
    if (kind === 'IDAT') idat.push(data);
    if (kind === 'IEND') break;
    p += 12 + len;
  }
  const ch = { 2: 3, 6: 4, 0: 1, 4: 2 }[type]; if (!ch || depth !== 8) die('use an 8-bit RGB or RGBA PNG');
  const raw = inflateSync(Buffer.concat(idat)), stride = w * ch, px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[y * stride + x - ch] : 0, b = y ? px[(y - 1) * stride + x] : 0, c = x >= ch && y ? px[(y - 1) * stride + x - ch] : 0;
      const pr = (() => { const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; })();
      px[y * stride + x] = (row[x] + [0, a, b, (a + b) >> 1, pr][f]) & 255;
    }
  }
  const out = []; const step = Math.max(1, Math.floor(Math.sqrt((w * h) / 6000)));
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
    const k = y * stride + x * ch; const g = ch < 3;
    if (ch === 4 && px[k + 3] < 128) continue; if (ch === 2 && px[k + 1] < 128) continue;
    out.push(g ? [px[k], px[k], px[k]] : [px[k], px[k + 1], px[k + 2]]);
  }
  return out;
}

function kmeans(pts, k) {
  let cs = [pts[0]]; while (cs.length < k) cs.push(pts.reduce((best, p) => (Math.min(...cs.map((c) => dist(p, c))) > Math.min(...cs.map((c) => dist(best, c))) ? p : best), pts[0]));
  for (let it = 0; it < 12; it++) {
    const sum = cs.map(() => [0, 0, 0, 0]);
    for (const p of pts) { let bi = 0, bd = Infinity; cs.forEach((c, i) => { const d = dist(p, c); if (d < bd) { bd = d; bi = i; } }); sum[bi][0] += p[0]; sum[bi][1] += p[1]; sum[bi][2] += p[2]; sum[bi][3]++; }
    cs = sum.map((s, i) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : cs[i]));
    cs.counts = sum.map((s) => s[3]);
  }
  return cs.map((c, i) => ({ c, n: cs.counts?.[i] ?? 0 }));
}

let pools, base;
if (arg('--colors')) {
  pools = arg('--colors').split(',').map(parse); if (pools.length !== 4) die('--colors takes four colours: top left, top right, low, bottom left');
} else if (arg('--from')) {
  const clusters = kmeans(readPng(arg('--from')), 7).filter((x) => x.n > 0);
  // the mesh wants colour, not the image's greys: rank by how saturated and how common a cluster is
  const ranked = clusters.filter((x) => sat(x.c) > 0.18).sort((a, b) => b.n * (0.3 + sat(b.c)) - a.n * (0.3 + sat(a.c)));
  if (ranked.length < 3) die('the image has fewer than three real colours; pass --colors instead');
  const pick = ranked.slice(0, 4); while (pick.length < 4) pick.push({ c: pick[pick.length - 1].c.map((v) => v * 0.85 + 255 * 0.15) });
  // the darkest pool sits low (the mesh's low point); the lightest at the top left, where the light comes from
  const byLum = [...pick].sort((a, b) => lum(b.c) - lum(a.c));
  pools = [byLum[0].c, byLum[1].c, byLum[3].c, byLum[2].c];
} else die('pass --from brand.png or --colors "#a,#b,#c,#d"');
base = arg('--base') ? parse(arg('--base')) : pools[0].map((v, i) => v * 0.12 + 245 * 0.88 + (pools[2][i] - 128) * 0.02);

// checks: a mesh needs a low point, pools that differ, and a ground pale enough for dark glass to dim
const warn = [];
const low = lum(pools[2]), top = lum(pools[0]);
if (top - low < 0.12) warn.push(`the low pool (${hex(pools[2])}) is barely darker than the top one, so the mesh will look flat; pick a deeper third colour`);
for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (dist(pools[i], pools[j]) < 40) warn.push(`pools ${'abcd'[i]} and ${'abcd'[j]} are nearly the same colour, so they will merge into one`);
if (lum(base) < 0.6) warn.push('the ground is dark; Pane\'s glass is tuned for a pale mesh ground, so dark text on light glass may lose contrast');
const ink = [17, 18, 20], white = [255, 255, 255];
const report = pools.map((c, i) => `  mesh-${'abcd'[i]} ${hex(c)}  white ${contrast(c, white).toFixed(2)}:1  ink ${contrast(c, ink).toFixed(2)}:1`);

const scope = arg('--scope') ?? ':root';
const css = `/* pane-mesh ${new Date().toISOString().slice(0, 10)} from ${arg('--from') ?? 'colours'}. Text goes on glass over the mesh, never on the mesh itself (D-029). */
${scope} {
  --ds-mesh-a: ${hex(pools[0])};
  --ds-mesh-b: ${hex(pools[1])};
  --ds-mesh-c: ${hex(pools[2])};
  --ds-mesh-d: ${hex(pools[3])};
  --ds-mesh-base: ${hex(base)};
}
`;
const out = arg('--out') ?? 'pane-mesh.css';
writeFileSync(out, css);
console.log(`✓ wrote ${out} (import it after pane-react/all.css)\n  ground ${hex(base)}\n${report.join('\n')}`);
console.log(`  text on these pools directly would need 4.5:1; put it on a Card over the mesh, which Pane measures.`);
for (const w of warn) console.log(`  ! ${w}`);
console.log(`\n  <Mesh />            uses these colours\n  <Mesh preset="tide"/> keeps a built-in set\n  <Mesh colors={['${hex(pools[0])}', '${hex(pools[1])}', '${hex(pools[2])}', '${hex(pools[3])}']} rotate={20} glow />`);
