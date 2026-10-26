#!/usr/bin/env node
// glass-evidence — D-003: glass passes by measured pixels, never by token arithmetic.
//
// Renders apps/docs/harness.html (every glass surface × every worst-case backdrop) in real
// Chromium, hides the measured text/graphics, screenshots, and reads the actual composited pixels
// (after backdrop-filter blur + saturate) under every glyph box. Text colour is opaque and known,
// so contrast = WCAG ratio of that colour against each real pixel; the score is the WORST pixel.
//
//   text   ≥ 4.5:1 at the worst pixel under the text box               (WCAG 1.4.3)
//   edge   ≥ 3:1 at every perimeter point, for the better of the two    (WCAG 1.4.11, D-004)
//          mullion lines against the backdrop pixel just outside
//   focus  same rule for the two focus-ring colours, 6px outside         (WCAG 2.4.11-ish)
//   thumb  ≥ 3:1, Switch thumb vs the pixels under it                   (WCAG 1.4.11)
//
// Modes: normal, reduced-transparency (CDP media emulation), forced-colors.
// `*-bare` scenes put text straight on a backdrop with no pane; they are reported but expected to
// fail — that measured failure is the reason for the "text sits on a pane" usage rule.
//
// Usage: node tooling/glass-evidence.mjs [--no-build]
// Writes apps/docs/public/evidence.json and system/reports/glass-evidence-{date}.json.
import { writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { serveDist } from './serve-dist.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'apps', 'docs', 'dist');
const T = { text: 4.5, edge: 3, focus: 3, thumb: 3 };

if (!process.argv.includes('--no-build')) {
  for (const f of ['pane-tokens', 'pane-docs']) {
    const r = spawnSync('pnpm', ['--filter', f, 'build'], { cwd: ROOT, stdio: 'inherit' });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}

// --- WCAG maths ---------------------------------------------------------------------------
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const parseColor = (s) => {
  if (!s) return null;
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return a < 1 ? null : [r, g, b];
  }
  const h = s.trim().match(/^#([0-9a-f]{6})/i);
  return h ? [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16)) : null;
};

const srv = await serveDist(DIST);
const BASE = srv.base;

// --- measurement --------------------------------------------------------------------------
const HIDE = `
  [data-ev-text], [data-ev-input] { color: transparent !important; caret-color: transparent !important; forced-color-adjust: none !important; }
  [data-ev-switch] [aria-hidden] > span { visibility: hidden !important; }
`;

async function plan(page) {
  return page.evaluate(() => {
    const css = (el, p) => getComputedStyle(el).getPropertyValue(p);
    const root = getComputedStyle(document.documentElement);
    const rectOf = (r) => ({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height });
    return [...document.querySelectorAll('[data-scene]')].map((scene) => {
      const texts = [...scene.querySelectorAll('[data-ev-text]')].map((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        return { label: el.textContent, color: css(el, 'color'), rects: [...range.getClientRects()].map(rectOf) };
      });
      for (const el of scene.querySelectorAll('[data-ev-input]')) {
        const r = el.getBoundingClientRect();
        const pad = parseFloat(css(el, 'padding-inline-start'));
        const fs = parseFloat(css(el, 'font-size'));
        texts.push({
          label: `input value "${el.value}"`,
          color: css(el, 'color'),
          rects: [{ x: r.left + scrollX + pad, y: r.top + scrollY + (r.height - fs) / 2, w: r.width - pad * 2, h: fs }],
        });
      }
      const edgeEls = [...scene.querySelectorAll('[data-ev-edge], [data-ev-input], [data-ev-switch] [aria-hidden]')];
      const edges = edgeEls.map((el) => ({
        rect: rectOf(el.getBoundingClientRect()),
        outer: css(el, 'border-top-color'),
        // box-shadow carries the inner mullion; forced-colors drops box-shadow, so it only counts when painted
        inner: css(el, 'box-shadow') !== 'none' ? root.getPropertyValue('--ds-border-mullion-inner') : null,
        focusable: el.matches('button, input, [aria-hidden]'),
      }));
      const thumbs = [...scene.querySelectorAll('[data-ev-switch] [aria-hidden] > span')].map((el) => ({
        rect: rectOf(el.getBoundingClientRect()),
        color: css(el, 'background-color'),
      }));
      return {
        id: scene.dataset.scene,
        texts,
        edges,
        thumbs,
        ring: [root.getPropertyValue('--ds-focus-ring-inner'), root.getPropertyValue('--ds-focus-ring-outer')],
      };
    });
  });
}

function measure(png, scenes) {
  const px = (x, y) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= png.width || y >= png.height) return null;
    const i = (y * png.width + x) * 4;
    return [png.data[i], png.data[i + 1], png.data[i + 2]];
  };
  const pixelsIn = (r) => {
    const out = [];
    for (let y = Math.ceil(r.y); y < Math.floor(r.y + r.h); y++)
      for (let x = Math.ceil(r.x); x < Math.floor(r.x + r.w); x++) { const p = px(x, y); if (p) out.push(p); }
    return out;
  };
  const perimeter = (r, off, step = 3) => {
    const pts = [];
    const [x0, y0, x1, y1] = [r.x - off, r.y - off, r.x + r.w + off, r.y + r.h + off];
    for (let x = x0; x <= x1; x += step) pts.push([x, y0], [x, y1]);
    for (let y = y0; y <= y1; y += step) pts.push([x0, y], [x1, y]);
    return pts.map(([x, y]) => px(x, y)).filter(Boolean);
  };
  const worst = (pixels, score) => pixels.reduce((m, p) => Math.min(m, score(p)), Infinity);
  const r2 = (n) => (Number.isFinite(n) ? Math.round(n * 100) / 100 : null);

  return Object.fromEntries(scenes.map((s) => {
    const text = s.texts.map((t) => {
      const fg = parseColor(t.color);
      const under = t.rects.flatMap(pixelsIn);
      const ls = under.map(lum);
      const mean = ls.reduce((a, b) => a + b, 0) / (ls.length || 1);
      const std = Math.sqrt(ls.reduce((a, b) => a + (b - mean) ** 2, 0) / (ls.length || 1));
      return { label: t.label, min: fg && under.length ? r2(worst(under, (p) => ratio(fg, p))) : null, pixels: under.length, lumStd: r2(std) };
    });
    const pair = (a, b) => [parseColor(a), parseColor(b)].filter(Boolean);
    const edge = s.edges.map((e) => {
      const lines = pair(e.outer, e.inner);
      return r2(worst(perimeter(e.rect, 2), (p) => Math.max(...lines.map((c) => ratio(c, p)))));
    });
    const ring = pair(...s.ring);
    const focus = s.edges.filter((e) => e.focusable).map((e) => r2(worst(perimeter(e.rect, 6), (p) => Math.max(...ring.map((c) => ratio(c, p))))));
    const thumb = s.thumbs.map((th) => {
      const c = parseColor(th.color);
      return c ? r2(worst(pixelsIn(th.rect), (p) => ratio(c, p))) : null;
    });
    const bare = s.id.endsWith('-bare');
    const checks = [
      ...text.map((t) => ['text', t.label, t.min, T.text]),
      ...edge.map((v) => ['edge', 'double mullion', v, T.edge]),
      ...focus.map((v) => ['focus', 'focus ring', v, T.focus]),
      ...thumb.map((v) => ['thumb', 'switch thumb', v, T.thumb]),
    ];
    const failures = checks.filter(([, , v, min]) => v == null || v < min).map(([k, l, v, min]) => `${k} "${l}" ${v} < ${min}`);
    return [s.id, { bare, pass: failures.length === 0, failures, text, edge, focus, thumb }];
  }));
}

const MODES = {
  normal: {},
  'reduced-transparency': { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] },
  'forced-colors': { forcedColors: 'active' },
};

async function docsPass(page) {
  const collect = () => page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let i = 0;
    // Each text node gets its own background-less wrapper span, so hiding the text later touches
    // nothing that paints a background (forced-color-adjust on a <button> would bring its author
    // red fill back in forced-colors mode and measure a colour pair no reader ever sees).
    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
    for (const n of nodes) {
      const parent = n.parentElement;
      if (!n.textContent.trim() || !parent || parent.closest('[aria-hidden="true"], .skip, script, style, title')) continue;
      let span = parent.matches('[data-ev-doc]') && parent.childNodes.length === 1 ? parent : null;
      if (!span) {
        span = document.createElement('span');
        span.dataset.evDoc = String(i++);
        n.replaceWith(span);
        span.append(n);
      }
      const rects = [...span.getClientRects()].filter((r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight);
      if (!rects.length) continue;
      out.push({ key: span.dataset.evDoc, label: n.textContent.trim().slice(0, 40), color: getComputedStyle(span).color, rects: rects.map((r) => ({ x: r.left, y: r.top, w: r.width, h: r.height })) });
    }
    return out;
  });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize().height;
  const worst = new Map();
  for (let y = 0; y < height; y += vh) {
    // behavior 'instant' — the docs set scroll-behavior: smooth, and measuring rects mid-animation
    // then screenshotting after it settles misaligns every sample (it read mullion pixels as "text bg").
    const at = await page.evaluate((top) => { scrollTo({ top, behavior: 'instant' }); return scrollY; }, y);
    if (Math.abs(at - Math.min(y, height - vh)) > 1) throw new Error(`scroll landed at ${at}, wanted ${y}`);
    await page.waitForTimeout(50);
    const items = await collect();
    await page.addStyleTag({ content: '[data-ev-doc] { color: transparent !important; text-shadow: none !important; forced-color-adjust: none !important; } * { text-decoration-line: none !important; }' }).then((h) => h.evaluate((s) => (s.id = 'ev-hide')));
    await page.waitForTimeout(50);
    const png = PNG.sync.read(await page.screenshot());
    await page.evaluate(() => document.getElementById('ev-hide')?.remove());
    for (const it of items) {
      const fg = parseColor(it.color);
      let min = Infinity;
      let where = null;
      for (const r of it.rects)
        for (let py = Math.ceil(r.y); py < Math.floor(r.y + r.h); py++)
          for (let px = Math.ceil(r.x); px < Math.floor(r.x + r.w); px++) {
            if (px < 0 || py < 0 || px >= png.width || py >= png.height) continue;
            const i = (py * png.width + px) * 4;
            const rgb = [png.data[i], png.data[i + 1], png.data[i + 2]];
            const v = fg ? ratio(fg, rgb) : 0;
            if (v < min) { min = v; where = { x: px, y: py + y, rgb }; }
          }
      if (!Number.isFinite(min)) continue;
      const prev = worst.get(it.key);
      if (!prev || min < prev.min) worst.set(it.key, { label: it.label, min: Math.round(min * 100) / 100, color: it.color, at: where, rects: it.rects.length });
    }
  }
  const all = [...worst.values()].sort((a, b) => a.min - b.min);
  return { textElements: all.length, failures: all.filter((t) => t.min < T.text), worst: all.slice(0, 5) };
}

const browser = await chromium.launch();
const result = { generatedAt: new Date().toISOString(), browser: `chromium ${browser.version()}`, thresholds: T, modes: {} };
try {
  for (const [mode, opt] of Object.entries(MODES)) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, forcedColors: opt.forcedColors ?? 'none' });
    if (opt.features) {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', { features: opt.features });
    }
    await page.goto(`${BASE}/harness.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Proves the emulation actually took effect — a mode that silently didn't apply would report
    // normal-mode numbers under the wrong name.
    const active = await page.evaluate((m) => ({
      normal: true,
      'reduced-transparency': matchMedia('(prefers-reduced-transparency: reduce)').matches,
      'forced-colors': matchMedia('(forced-colors: active)').matches,
    })[m], mode);
    if (!active) throw new Error(`mode ${mode} did not take effect in this browser`);
    const scenes = await plan(page);
    await page.addStyleTag({ content: HIDE });
    await page.waitForTimeout(100);
    const png = PNG.sync.read(await page.screenshot({ fullPage: true }));
    result.modes[mode] = measure(png, scenes);

    // The docs page itself, every visible text element, one viewport at a time — what a reader
    // actually sees while scrolling (the page backdrop is fixed, so a full-page capture would not
    // match). This is what settles axe's "incomplete" colour-contrast nodes on the real page.
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    result.docsPage ??= {};
    result.docsPage[mode] = await docsPass(page);
    await page.close();
  }
} finally {
  await browser.close();
  srv.close();
}

// --- report -------------------------------------------------------------------------------
let gating = 0;
let expectedBare = 0;
for (const [mode, scenes] of Object.entries(result.modes)) {
  for (const [id, s] of Object.entries(scenes)) {
    if (s.pass) continue;
    if (s.bare) { expectedBare++; continue; }
    gating++;
    console.log(`✗ [${mode}] ${id}: ${s.failures.join('; ')}`);
  }
}
const total = Object.values(result.modes).reduce((n, m) => n + Object.values(m).filter((s) => !s.bare).length, 0);
let docsFailures = 0;
for (const [mode, d] of Object.entries(result.docsPage ?? {})) {
  for (const f of d.failures) console.log(`✗ [${mode}] docs page text "${f.label}" ${f.min} < ${T.text}`);
  docsFailures += d.failures.length;
}
gating += docsFailures;
result.summary = {
  gatingScenes: total,
  gatingFailures: gating - docsFailures,
  bareFailures: expectedBare,
  docsTextElements: Object.values(result.docsPage ?? {}).reduce((n, d) => n + d.textElements, 0),
  docsTextFailures: docsFailures,
};

for (const out of [path.join(ROOT, 'apps', 'docs', 'public', 'evidence.json'), path.join(ROOT, 'system', 'reports', `glass-evidence-${result.generatedAt.slice(0, 10)}.json`)]) {
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
}
console.log(`\n${gating ? "✗" : "✓"} glass evidence: ${result.summary.gatingScenes - result.summary.gatingFailures}/${total} gating scenes pass, docs page ${result.summary.docsTextElements - docsFailures}/${result.summary.docsTextElements} text elements pass across ${Object.keys(MODES).length} modes (${result.browser}); ${expectedBare} bare-backdrop scene(s) fail as expected`);
process.exit(gating ? 1 : 0);
