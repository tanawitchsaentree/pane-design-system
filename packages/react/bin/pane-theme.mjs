#!/usr/bin/env node
// pane-theme: make and check a white-label brand for Pane (D-033).
//   pane-theme list                 the sample brands that ship, and what each overrides
//   pane-theme check <brand.json>   only brandable tokens, and the loud action and focus ring still clear WCAG
//   pane-theme css <brand.json>     print a brand sheet to load after pane-react/tokens.css
// A brand file is { "name", "description", "tokens": { "<semantic.path>": "#hex" | { "dark": "#hex", "light": "#hex" } } }.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const need = createRequire(import.meta.url);
const tokensJson = JSON.parse(readFileSync(path.join(here, '..', 'dist', 'tokens', 'tokens.json'), 'utf8'));
const brands = JSON.parse(readFileSync(path.join(here, '..', 'dist', 'tokens', 'brands', 'brands.json'), 'utf8'));
let check;
try { ({ checkBrand: check } = await import(need.resolve('pane-tokens/brand-check'))); } catch { ({ checkBrand: check } = await import(path.join(here, '..', '..', 'tokens', 'brand-check.mjs'))); }
const BRANDABLE = new Set(['action.loud-top', 'action.loud-foot', 'action.foot-solid', 'action.accent', 'action.accent-hover', 'action.accent-foot', 'text.on-light', 'text.on-accent', 'focus.ring', 'surface.chosen-top', 'surface.chosen-foot', 'type.family', 'corner.panel', 'corner.inner', 'corner.media']);
const [cmd, file] = process.argv.slice(2);
const cssName = (p) => `--ds-${p.replace(/\./g, '-')}`;
if (cmd === 'list' || !cmd) {
  for (const b of brands) console.log(`${b.id.padEnd(8)} ${b.name}: ${Object.keys(b.tokens).length} tokens. ${b.description}`);
  console.log(`\nBrandable: ${[...BRANDABLE].join(', ')}.\nLoad one with  @import 'pane-react/tokens/brands/<id>.css';  and set data-brand="<id>" on the root.`);
} else if (cmd === 'check' || cmd === 'css') {
  if (!file) { console.error('pane-theme: give a brand file, such as pane-theme check brand.json'); process.exit(2); }
  const b = JSON.parse(readFileSync(file, 'utf8'));
  const problems = check(b, BRANDABLE);
  if (cmd === 'check') { if (problems.length) { console.error(`✗ ${b.name ?? file}\n  ${problems.join('\n  ')}`); process.exit(1); } console.log(`✓ ${b.name ?? file}: ${Object.keys(b.tokens ?? {}).length} tokens, all brandable, contrast holds in dark and light`); }
  else {
    if (problems.length) { console.error(`✗ fix these first:\n  ${problems.join('\n  ')}`); process.exit(1); }
    const id = path.basename(file).replace(/\.json$/, '');
    const v = (x, th) => { const y = x && typeof x === 'object' ? x[th] ?? x.dark : x; return typeof y === 'string' && y.startsWith('{') ? `var(${cssName(y.slice(1, -1))})` : y; };
    // every token whose reference chain reaches a brand token is re-declared, so component tokens follow
    const refOf = (k) => tokensJson[k]?.ref ?? null;
    const reaches = (k) => { for (let r = refOf(k); r; r = refOf(r)) if (b.tokens[r]) return true; return false; };
    const deps = Object.keys(tokensJson).filter((k) => !b.tokens[k] && reaches(k));
    const body = (th) => [...Object.entries(b.tokens).map(([k, x]) => `  ${cssName(k)}: ${v(x, th)};`), ...deps.map((k) => `  ${cssName(k)}: var(${cssName(refOf(k))});`)].join('\n');
    console.log(`/* ${b.name ?? id}: load after pane-react/tokens.css. Component tokens follow because they read these semantic tokens where the brand is set. */\n[data-brand="${id}"][data-brand] {\n${body('dark')}\n}\n[data-theme="light"] [data-brand="${id}"][data-brand], [data-brand="${id}"][data-brand][data-theme="light"] {\n${body('light')}\n}`);
  }
} else { console.error(`pane-theme: unknown command ${cmd}; try list, check or css`); process.exit(2); }
void tokensJson;
