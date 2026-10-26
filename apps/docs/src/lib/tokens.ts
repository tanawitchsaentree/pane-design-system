import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Resolves --ds-* custom property values at build time from the real built CSS
 * (packages/tokens/build/css/{light,dark}.css) — the same discipline
 * apps/storybook/src/foundations/_shared.tsx's useCssVar applies at runtime, done here at build
 * time instead since this app is statically exported with no client-side token-reading step for
 * content that needs to appear in the static HTML itself (search-indexable, no client JS
 * required to see the value).
 */

const TOKENS_ROOT = path.join(process.cwd(), '..', '..', 'packages', 'tokens', 'build', 'css');

let cache: { light: Map<string, string>; dark: Map<string, string> } | null = null;

function parseVars(css: string): Map<string, string> {
  const vars = new Map<string, string>();
  const base = css.split(/@media/)[0];
  for (const m of base.matchAll(/--ds-([a-z0-9-]+):\s*([^;]+);/g)) {
    vars.set(m[1], m[2].trim());
  }
  return vars;
}

function resolve(name: string, vars: Map<string, string>, seen = new Set<string>()): string {
  if (seen.has(name)) throw new Error(`circular var reference: ${[...seen, name].join(' -> ')}`);
  seen.add(name);
  const raw = vars.get(name);
  if (!raw) return '(not found)';
  const ref = raw.match(/^var\(--ds-([a-z0-9-]+)\)$/);
  if (ref) return resolve(ref[1], vars, seen);
  return raw;
}

function load() {
  if (cache) return cache;
  const light = parseVars(readFileSync(path.join(TOKENS_ROOT, 'light.css'), 'utf8'));
  const dark = parseVars(readFileSync(path.join(TOKENS_ROOT, 'dark.css'), 'utf8'));
  cache = { light, dark };
  return cache;
}

export interface TokenValue {
  name: string;
  light: string;
  dark: string;
}

/** @param names Token names without the --ds- prefix, e.g. "button-solid-bg-primary-default". */
export function resolveTokens(names: string[]): TokenValue[] {
  const { light, dark } = load();
  return names.map((name) => ({
    name,
    light: resolve(name, light),
    dark: resolve(name, dark),
  }));
}

/**
 * Converts a resolved "#rrggbb" hex value into Fumadocs' own HSL-components format — unitless hue,
 * percent saturation, percent lightness, space-separated, no `hsl()` wrapper (e.g. "34.3 21.2%
 * 93.5%") — because Fumadocs' generated CSS consumes its --fd-* variables as `hsl(var(--fd-x) / a)`,
 * not as a plain colour value. Only used by the Fumadocs token adapter; every other consumer of
 * resolveTokens() keeps reading plain hex.
 */
export function hexToFumadocsHsl(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}
