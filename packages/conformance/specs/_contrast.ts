/**
 * WCAG 2.x contrast-ratio math over values captured live from `getComputedStyle()` in a real
 * browser (not read from token source files) — the point is to catch a future token edit that
 * regresses a contrast ratio input.json/PinInput.module.css claim, by re-computing the ratio from
 * whatever CSS the browser actually resolved for that element on that page.
 */

export type Rgb = [number, number, number];

/** แปลง `rgb(r, g, b)` / `rgba(r, g, b, a)` (รูปแบบที่ getComputedStyle คืนมา) เป็น [r,g,b] */
export function parseRgb(cssColor: string): Rgb {
  const match = cssColor.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i,
  );
  if (!match) {
    throw new Error(`parseRgb: ไม่รู้จักรูปแบบสี "${cssColor}" (ต้องเป็น rgb()/rgba() จาก getComputedStyle)`);
  }
  const [, r, g, b] = match;
  return [Number(r), Number(g), Number(b)];
}

/** WCAG relative luminance: sRGB (0-255) -> linear (gamma-corrected) -> weighted sum */
export function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [rl, gl, bl] = [channel(r), channel(g), channel(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** (L_lighter + 0.05) / (L_darker + 0.05) */
export function contrastRatio(rgb1: Rgb, rgb2: Rgb): number {
  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
