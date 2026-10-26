// text-contrast — worst-pixel WCAG contrast for every visible text node on a page, read from the
// real rendered pixels (after backdrop-filter, gradients, images — whatever is actually behind it).
// Shared by glass-evidence (harness + docs page) and anchor-evidence (lab anchor round).
import { PNG } from 'pngjs';

export const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
export const parseColor = (s) => {
  if (!s) return null;
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return a < 1 ? null : [r, g, b];
  }
  const h = s.trim().match(/^#([0-9a-f]{6})/i);
  return h ? [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16)) : null;
};

/** rgba() with 0 < alpha < 1 → [r, g, b, a]; opaque or unparseable → null. */
export const parseTranslucent = (s) => {
  const m = s?.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return a > 0 && a < 1 ? [r, g, b, a] : null;
};
// Translucent text is painted with source-over blending, so the colour a reader sees at a pixel is
// exactly a·fg + (1−a)·bg — computed per pixel against the real bg, not assumed.
const blend = ([r, g, b, a], bg) => [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)];

/**
 * Scrolls the page one viewport at a time; at each stop wraps every visible text node in a
 * background-less span, hides only those spans, screenshots, and scores each text node against the
 * pixels under its own boxes. Returns one entry per text node (worst across scroll stops), tagged
 * with the nearest [data-group] ancestor so callers can aggregate per card/variant.
 */
export async function measurePageText(page, threshold = 4.5) {
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
      out.push({ key: span.dataset.evDoc, group: span.closest('[data-group]')?.dataset.group ?? null, label: n.textContent.trim().slice(0, 40), color: getComputedStyle(span).color, rects: rects.map((r) => ({ x: r.left, y: r.top, w: r.width, h: r.height })) });
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
      const tl = fg ? null : parseTranslucent(it.color);
      let min = Infinity;
      let where = null;
      for (const r of it.rects)
        for (let py = Math.ceil(r.y); py < Math.floor(r.y + r.h); py++)
          for (let px = Math.ceil(r.x); px < Math.floor(r.x + r.w); px++) {
            if (px < 0 || py < 0 || px >= png.width || py >= png.height) continue;
            const i = (py * png.width + px) * 4;
            const rgb = [png.data[i], png.data[i + 1], png.data[i + 2]];
            const v = fg ? ratio(fg, rgb) : tl ? ratio(blend(tl, rgb), rgb) : 0;
            if (v < min) { min = v; where = { x: px, y: py + at, rgb }; }
          }
      if (!fg && !tl) { // gradient / translucent text has no single colour to score — count it, don't guess it
        if (!worst.has(it.key)) worst.set(it.key, { label: it.label, min: null, unmeasurable: true, color: it.color, group: it.group });
        continue;
      }
      if (!Number.isFinite(min)) continue;
      const prev = worst.get(it.key);
      if (!prev || min < prev.min) worst.set(it.key, { label: it.label, min: Math.round(min * 100) / 100, color: it.color, at: where, rects: it.rects.length, group: it.group });
    }
  }
  const all = [...worst.values()].sort((a, b) => (a.min ?? -1) - (b.min ?? -1));
  return { textElements: all.length, failures: all.filter((t) => t.min == null || t.min < threshold), worst: all.slice(0, 5), all };
}

