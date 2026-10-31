// Checks a white-label brand file (D-033): only brandable tokens, and the pairs a brand can break still
// clear WCAG, the loud action's text on both stops of its fill (4.5:1) and the focus ring on the page
// (3:1), in dark and light. Used by the token build and by `pane-theme check`.
const hex = (s) => { const m = String(s).trim().match(/^#([0-9a-f]{6})$/i); return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : null; };
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
export const PAGE = { dark: [5, 5, 6], light: [242, 242, 244] };
// The list a brand may set without "tier": "expert" (D-033, D-037). The token build and pane-theme both read it here.
export const BRANDABLE = new Set(['action.loud-top', 'action.loud-foot', 'action.foot-solid', 'action.accent', 'action.accent-hover', 'action.accent-foot', 'text.on-light', 'text.on-accent', 'focus.ring', 'surface.chosen-top', 'surface.chosen-foot', 'type.family', 'corner.panel', 'corner.inner', 'corner.media',
  // D-037: the personality axes, so ten brands on one product read as ten products
  'type.weight-medium', 'type.weight-semibold', 'type.tracking-display', 'glass.saturate', 'mesh.a', 'mesh.b', 'mesh.c', 'mesh.d', 'mesh.base',
  'motion.hover', 'motion.press', 'motion.enter', 'motion.scene', 'motion.easing']);
// Presets a brand names instead of listing tokens: density moves every gap one step along the space scale
// (the card inset with it, and the inner corner follows so nesting holds); motion sets the tempo.
export const SPACE_STEPS = ['0', '0-5', '1', '1-5', '2', '2-5', '3', '3-5', '4', '5', '5-5', '6', '7', '8', '10', '12', '14', '16', '20', '24', '32'];
export const DENSITY = { compact: -1, regular: 0, roomy: 1 };
export const TEMPO = { brisk: { 'motion.hover': '200ms', 'motion.press': '120ms', 'motion.enter': '320ms', 'motion.scene': '420ms' }, steady: {}, calm: { 'motion.hover': '560ms', 'motion.press': '240ms', 'motion.enter': '820ms', 'motion.scene': '900ms' } };
/** The brand's tokens with its presets spelled out. paths: every token path; refOf(path): the path it references, or null. */
export function expandBrand(brand, paths, refOf) {
  const out = {}; const errors = [];
  if (brand.density !== undefined) {
    if (!(brand.density in DENSITY)) errors.push(`density must be one of ${Object.keys(DENSITY).join(', ')}`);
    else {
      for (const p of paths) {
        if (!p.startsWith('gap.') || p === 'gap.none') continue;
        const r = refOf(p); const m = r && r.match(/^space\.([\w-]+)$/); if (!m) continue;
        const i = SPACE_STEPS.indexOf(m[1]); const j = Math.min(SPACE_STEPS.length - 1, Math.max(1, i + DENSITY[brand.density]));
        if (i >= 0 && j !== i) out[p] = `{space.${SPACE_STEPS[j]}}`;
      }
      if (DENSITY[brand.density] && !brand.tokens?.['corner.inner']) out['corner.inner'] = 'max(var(--ds-radius-sm), calc(var(--ds-corner-panel) - var(--ds-gap-inset)))';
    }
  }
  if (brand.motion !== undefined) { if (!(brand.motion in TEMPO)) errors.push(`motion must be one of ${Object.keys(TEMPO).join(', ')}`); else Object.assign(out, TEMPO[brand.motion]); }
  return { tokens: { ...out, ...(brand.tokens ?? {}) }, errors };
}
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
  // D-037 personality axes: keep each inside the range the system was measured in
  const num = (k) => { const v = t[k]; const n = parseFloat(v && typeof v === 'object' ? v.dark : v); return Number.isFinite(n) ? n : null; };
  for (const k of ['type.weight-medium', 'type.weight-semibold']) { const n = num(k); if (n !== null && (n < 400 || n > 800)) out.push(`${k} is ${n} (keep 400 to 800 so labels stay readable on glass)`); }
  { const n = num('glass.saturate'); if (n !== null && (n < 1 || n > 2)) out.push(`glass.saturate is ${n} (keep 1 to 2; past 2 the scene's colour turns to neon behind text)`); }
  for (const k of ['motion.hover', 'motion.press', 'motion.enter', 'motion.scene']) { const n = num(k); if (n !== null && (n < 80 || n > 1000)) out.push(`${k} is ${n}ms (keep 80 to 1000ms)`); }
  if (brand.density !== undefined && !['compact', 'regular', 'roomy'].includes(brand.density)) out.push(`density is ${brand.density} (compact, regular or roomy)`);
  if (brand.motion !== undefined && !['brisk', 'steady', 'calm'].includes(brand.motion)) out.push(`motion is ${brand.motion} (brisk, steady or calm)`);
  return out;
}
