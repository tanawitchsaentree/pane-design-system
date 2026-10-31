// Checks a white-label brand file (D-033): only brandable tokens, and the pairs a brand can break still
// clear WCAG, the loud action's text on both stops of its fill (4.5:1) and the focus ring on the page
// (3:1), in dark and light. Used by the token build and by `pane-theme check`.
const hex = (s) => { const m = String(s).trim().match(/^#([0-9a-f]{6})$/i); return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : null; };
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
export const PAGE = { dark: [5, 5, 6], light: [242, 242, 244] };
export function checkBrand(brand, brandable) {
  const out = []; const t = brand.tokens ?? {};
  for (const k of Object.keys(t)) { if (brandable && !brandable.has(k)) out.push(`${k} is not brandable`); }
  const at = (k, th) => { const v = t[k]; return hex(v && typeof v === 'object' ? v[th] ?? v.dark : v); };
  for (const th of ['dark', 'light']) {
    for (const fill of ['action.loud-top', 'action.loud-foot']) { for (const ink of ['text.on-light', 'text.on-accent']) {
      const a = at(fill, th), b = at(ink, th);
      if (a && b && ratio(a, b) < 4.5) out.push(`${th}: ${ink} on ${fill} is ${ratio(a, b).toFixed(2)}:1 (needs 4.5)`);
    } }
    const ring = at('focus.ring', th);
    if (ring && ratio(ring, PAGE[th]) < 3) out.push(`${th}: focus.ring on the page is ${ratio(ring, PAGE[th]).toFixed(2)}:1 (needs 3)`);
  }
  return out;
}
