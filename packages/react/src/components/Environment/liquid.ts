// Liquid glass (R-045, variant B): each glass surface inside <Environment material="liquid"> bends what is
// behind its edge and lifts its middle a little, like a lens. A displacement map is built from the surface's
// own signed distance field (its size and corner), and its filter is put in front of the surface's
// own backdrop recipe: backdrop-filter: url(#lens) blur(…) saturate(…) brightness(…).
// Only Chromium runs url() inside backdrop-filter. Everywhere else nothing changes and the glass stays the
// blur recipe (variant C), so the fallback is the system as it was.
// The bend lives in a band of 8–22px at the rim; text sits inside padding wider than that, so what is read
// is never bent.

const SVG_NS = 'http://www.w3.org/2000/svg';
let defs: SVGDefsElement | null = null;
const made = new Map<string, string>();

export const liquidSupported = () => typeof CSS !== 'undefined' && (CSS.supports('backdrop-filter', 'url(#a)') || CSS.supports('-webkit-backdrop-filter', 'url(#a)'));

const sdRect = (x: number, y: number, w: number, h: number, r: number) => {
  const qx = Math.abs(x - w / 2) - (w / 2 - r), qy = Math.abs(y - h / 2) - (h / 2 - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
};

function defsEl() {
  if (defs?.isConnected) return defs;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.style.position = 'absolute'; svg.style.pointerEvents = 'none';
  defs = document.createElementNS(SVG_NS, 'defs') as SVGDefsElement; svg.append(defs); document.body.append(svg);
  return defs;
}

/** The id of a lens filter for a w×h surface with corner r, made once per size bucket. */
function lens(w: number, h: number, r: number): string {
  const W = Math.round(w / 4) * 4, H = Math.round(h / 4) * 4, R = Math.round(Math.min(r, W / 2, H / 2));
  const key = `${W}x${H}r${R}`;
  const hit = made.get(key); if (hit) return hit;
  const band = Math.max(8, Math.min(22, Math.min(W, H) * 0.18)), amp = band * 0.7, mag = 0.02;
  // the map is drawn at most 320px wide and stretched; the bend is smooth, so nothing is lost
  const k = Math.min(1, 320 / Math.max(W, H)), cw = Math.max(8, Math.round(W * k)), ch = Math.max(8, Math.round(H * k));
  const c = document.createElement('canvas'); c.width = cw; c.height = ch;
  const g = c.getContext('2d'); if (!g) return '';
  const img = g.createImageData(cw, ch); const span = amp * 2 + Math.max(W, H) * mag;
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
    const x = (i + 0.5) / k, y = (j + 0.5) / k, d = sdRect(x, y, W, H, R), o = (j * cw + i) * 4;
    let dx = 0, dy = 0;
    if (d < 0) {
      const nx = sdRect(x + 1, y, W, H, R) - sdRect(x - 1, y, W, H, R), ny = sdRect(x, y + 1, W, H, R) - sdRect(x, y - 1, W, H, R), nl = Math.hypot(nx, ny) || 1;
      const t = Math.max(0, 1 - -d / band), bend = amp * t * t * t;
      dx = (-nx / nl) * bend + (W / 2 - x) * mag; dy = (-ny / nl) * bend + (H / 2 - y) * mag;
    }
    img.data[o] = 128 + (dx / span) * 127; img.data[o + 1] = 128 + (dy / span) * 127; img.data[o + 2] = 128; img.data[o + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const id = `pane-lens-${key}`;
  const f = document.createElementNS(SVG_NS, 'filter');
  f.id = id;
  for (const [a, v] of [['x', '0'], ['y', '0'], ['width', String(W)], ['height', String(H)], ['filterUnits', 'userSpaceOnUse'], ['primitiveUnits', 'userSpaceOnUse'], ['color-interpolation-filters', 'sRGB']]) f.setAttribute(a, v);
  f.innerHTML = `<feImage href="${c.toDataURL()}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="${(span * 2).toFixed(1)}" xChannelSelector="R" yChannelSelector="G"/>`;
  defsEl().append(f); made.set(key, id); return id;
}

const MARK = 'data-pane-lens';
const CLEAR = 0.4;
function apply(el: HTMLElement) {
  if (el.hasAttribute(MARK)) { el.style.removeProperty('backdrop-filter'); el.style.removeProperty('-webkit-backdrop-filter'); }
  const cs = getComputedStyle(el); const base = cs.backdropFilter || (cs as unknown as Record<string, string>).webkitBackdropFilter;
  if (!base || base === 'none' || base.includes('url(')) { el.removeAttribute(MARK); return; }
  const b = el.getBoundingClientRect(); if (b.width < 24 || b.height < 24) return;
  const id = lens(b.width, b.height, parseFloat(cs.borderTopLeftRadius) || 0); if (!id) return;
  // a lens is clear glass: the blur is lighter than the frosted recipe (CLEAR of it) so the bent rim shows;
  // brightness and saturation stay, and so does the measured contrast check on the text inside
  const v = `url(#${id}) ${base.replace(/blur\(([\d.]+)px\)/, (_, n) => `blur(${(parseFloat(n) * CLEAR).toFixed(1)}px)`)}`;
  el.style.setProperty('backdrop-filter', v); el.style.setProperty('-webkit-backdrop-filter', v); el.setAttribute(MARK, '');
}

/** Gives every glass surface under root its lens, and keeps it right as surfaces resize, appear or change. */
export function enableLiquid(root: HTMLElement): () => void {
  if (!liquidSupported()) return () => {};
  let queued = false, last = 0;
  const ro = new ResizeObserver((entries) => { for (const e of entries) apply(e.target as HTMLElement); });
  const seen = new WeakSet<Element>();
  const scan = () => {
    queued = false;
    for (const el of Array.from(root.querySelectorAll<HTMLElement>('*'))) {
      const bf = getComputedStyle(el).backdropFilter;
      if ((bf && bf !== 'none') || el.hasAttribute(MARK)) { apply(el); if (!seen.has(el)) { seen.add(el); ro.observe(el); } }
    }
  };
  // at most four scans a second: a live demo that changes every frame must not cost a full scan each time
  const ask = () => { if (queued) return; queued = true; const wait = Math.max(0, 250 - (performance.now() - last)); setTimeout(() => requestAnimationFrame(() => { last = performance.now(); scan(); }), wait); };
  const mo = new MutationObserver(ask);
  mo.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'data-theme', 'data-environment', 'data-level', 'data-state', 'open'] });
  ask();
  return () => {
    mo.disconnect(); ro.disconnect();
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(`[${MARK}]`))) { el.style.removeProperty('backdrop-filter'); el.style.removeProperty('-webkit-backdrop-filter'); el.removeAttribute(MARK); }
  };
}
