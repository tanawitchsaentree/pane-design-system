#!/usr/bin/env node
// Builds src/{primitive,semantic,component}.json (DTCG) into build/css/tokens.css + build/json/tokens.json.
// Enforces the three-tier rule (CLAUDE.md iron rule 1) at build time rather than by review:
// semantic tokens may only reference primitive ones, component tokens only semantic ones —
// a component token pointing at a primitive fails the build.
// Glass surfaces get their D-005 opaque fallback emitted here, so no component can forget it.
// Tokens with $extensions["pane.environment"] get one override block per environment (D-009);
// each environment value obeys the same tier rule as $value.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { parseCss, filterCss, sheetOf } from './split-css.mjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const TIERS = ['primitive', 'semantic', 'component'];
const tokens = new Map(); // path -> { tier, type, raw, description }
const collisions = [];

function walk(node, tier, trail, inheritedType, inheritedWhy) {
  const type = node.$type ?? inheritedType;
  // kiln.why: the reason for a value, on the token or its nearest group (system/CONCEPT.md principles)
  const why = node.$extensions?.['kiln.why'] ?? inheritedWhy;
  if ('$value' in node) {
    const key = trail.join('.');
    if (tokens.has(key)) collisions.push(`${key} is defined in both ${tokens.get(key).tier} and ${tier} — paths must be unique across tiers`);
    tokens.set(trail.join('.'), { tier, type, raw: node.$value, description: node.$description, env: node.$extensions?.['pane.environment'], bp: node.$extensions?.['pane.breakpoint'], theme: node.$extensions?.['pane.theme'], why });
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (!k.startsWith('$') && v && typeof v === 'object') walk(v, tier, [...trail, k], type, why);
  }
}
for (const tier of TIERS) walk(JSON.parse(readFileSync(path.join(ROOT, 'src', `${tier}.json`), 'utf8')), tier, [], undefined);

const REF = /^\{([^}]+)\}$/;
const errors = [...collisions];
const ALLOWED = { primitive: [], semantic: ['primitive'], component: ['semantic'] };
const checkRef = (p, t, raw, label) => {
  const m = typeof raw === 'string' && raw.match(REF);
  if (!m) { if (t.tier !== 'primitive') errors.push(`${t.tier} token ${p}${label} has a raw value — only primitives hold literals`); return; }
  const target = tokens.get(m[1]);
  if (!target) errors.push(`${p}${label} references missing token {${m[1]}}`);
  else if (!ALLOWED[t.tier].includes(target.tier)) errors.push(`${t.tier} token ${p}${label} -> ${target.tier} {${m[1]}} (allowed: ${ALLOWED[t.tier].join(', ') || 'none'})`);
};
for (const [p, t] of tokens) for (const [env, raw] of Object.entries(t.env ?? {})) checkRef(p, t, raw, ` [${env}]`);
for (const [p, t] of tokens) for (const [bp, raw] of Object.entries(t.bp ?? {})) checkRef(p, t, raw, ` [@${bp}]`);
for (const [p, t] of tokens) for (const [th, raw] of Object.entries(t.theme ?? {})) checkRef(p, t, raw, ` [theme ${th}]`);
for (const [p, t] of tokens) {
  const m = typeof t.raw === 'string' && t.raw.match(REF);
  if (!m) {
    if (t.tier !== 'primitive') errors.push(`${t.tier} token ${p} has a raw value — only primitives hold literals`);
    continue;
  }
  const target = tokens.get(m[1]);
  if (!target) errors.push(`${p} references missing token {${m[1]}}`);
  else if (!ALLOWED[t.tier].includes(target.tier)) errors.push(`${t.tier} token ${p} -> ${target.tier} {${m[1]}} (allowed: ${ALLOWED[t.tier].join(', ') || 'none'})`);
}
if (errors.length) {
  console.error(`✗ token build failed — ${errors.length} tier violation(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

const resolve = (p, seen = []) => {
  const t = tokens.get(p);
  const m = typeof t.raw === 'string' && t.raw.match(REF);
  if (!m) return t.raw;
  if (seen.includes(m[1])) throw new Error(`cycle: ${[...seen, m[1]].join(' -> ')}`);
  return resolve(m[1], [...seen, m[1]]);
};
const cssName = (p) => `--ds-${p.replace(/\./g, '-')}`;
const format = (type, v) => (type === 'cubicBezier' ? `cubic-bezier(${v.join(', ')})` : String(v));
const cssValue = (p) => {
  const t = tokens.get(p);
  const m = typeof t.raw === 'string' && t.raw.match(REF);
  return m ? `var(${cssName(m[1])})` : format(t.type, t.raw);
};

const lines = [...tokens.keys()].map((p) => `  ${cssName(p)}: ${cssValue(p)};`);
const glassSurfaces = [...tokens.keys()].filter((p) => p === 'surface.glass' || p.startsWith('surface.glass.'));
const glassBlurs = [...tokens.keys()].filter((p) => p.startsWith('glass.blur'));
const ENVS = [...new Set([...tokens.values()].flatMap((t) => Object.keys(t.env ?? {})))];
// A custom property holding var(--x) is resolved where it is declared (:root) and inherits as a
// finished value — overriding --x inside [data-environment] would not reach --ds-card-bg. So every
// token whose reference chain passes through an environment token is re-declared in each block.
const refOf = (p) => { const t = tokens.get(p); const m = typeof t.raw === 'string' && t.raw.match(REF); return m ? m[1] : null; };
const dependsOn = (p, target) => { for (let r = refOf(p); r; r = refOf(r)) if (r === target) return true; return false; };
const envBlocks = ENVS.map((env) => {
  const own = [...tokens].filter(([, t]) => t.env?.[env]);
  const deps = [...tokens.keys()].filter((p) => own.some(([o]) => dependsOn(p, o)));
  const body = [
    ...own.map(([p, t]) => `  ${cssName(p)}: var(${cssName(t.env[env].slice(1, -1))});`),
    ...deps.map((p) => `  ${cssName(p)}: ${cssValue(p)};`),
  ].join('\n');
  return `[data-environment="${env}"] {\n${body}\n}`;
}).join('\n');
const fallback = [
  ...glassSurfaces.map((p) => `  ${cssName(p)}: var(${cssName('surface.solid')});`),
  ...glassBlurs.map((p) => `  ${cssName(p)}: 0px;`),
  // opaque fallback: nothing to dim behind a solid surface
  ...[...tokens.keys()].filter((p) => p === 'glass.brightness').map((p) => `  ${cssName(p)}: 1;`),
  ...[...tokens.keys()].filter((p) => p === 'card.brightness').map((p) => `  ${cssName(p)}: 1;`),
].join('\n');

// A scoped override must re-declare every token that reads a glass token, because a var() is resolved
// where it is declared (see envBlocks above): --ds-card-bg would otherwise keep the :root glass value.
const solidTargets = new Set([...glassSurfaces, ...glassBlurs, 'glass.brightness', 'card.brightness'].filter((p) => tokens.has(p)));
const solidDeps = [...tokens.keys()].filter((p) => !solidTargets.has(p) && [...solidTargets].some((t) => dependsOn(p, t))).map((p) => `    ${cssName(p)}: ${cssValue(p)};`).join('\n');
const css = `/* GENERATED by packages/tokens/build.mjs — do not hand-edit. */
:root {
${lines.join('\n')}
}

/* D-009 — the app declares how bright the world behind the glass is; glass darkens to match. */
${envBlocks}

/* D-005 — glass is mood, never information: every way out of glass lands on the opaque surface.
   Selectors repeat [data-environment] so the fallback outranks the environment blocks above. */
@media (prefers-reduced-transparency: reduce) {
  :root:root, :root [data-environment], :root [data-theme] {
${fallback.replace(/^/gm, '  ')}
  }
}
/* D-021 — the app may choose the opaque surface itself (<Environment material="solid">), for a live
   backdrop such as a 3D scene where re-blurring every frame costs the frame rate. Same fallback values
   as D-005, and the backdrop filter is removed outright so the compositor does no backdrop work. */
:root [data-material='solid'], :root [data-material='solid'] [data-environment], :root [data-material='solid'] [data-theme], :root [data-environment][data-material='solid'] {
${fallback.replace(/^/gm, '  ')}
${solidDeps}
}
:root [data-material='solid'] * { -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  :root:root, :root [data-environment], :root [data-theme] {
${fallback.replace(/^/gm, '  ')}
  }
}
@media (forced-colors: active) {
  :root:root, :root [data-environment], :root [data-theme] {
${fallback.replace(/^/gm, '  ')}
  }
}
`;

// Reduced motion: every duration collapses to 0 at the token level, so no component can forget it.
const durations = [...tokens].filter(([, t]) => t.type === 'duration').map(([p]) => `    ${cssName(p)}: 0ms;`).join('\n');
const motionCss = `
/* Reduced motion — durations are zero everywhere; movement distances too. */
@media (prefers-reduced-motion: reduce) {
  :root, [data-environment] {
${durations}
    ${cssName('distance.rise')}: 0px;
    ${cssName('distance.lift')}: 0px;
    ${cssName('scale.press')}: 1;
  }
}
`;
// Themes (D-015): tokens with $extensions["pane.theme"] get a value per theme; $value is dark.
// @scope gives proximity, so a [data-theme] element nested inside another theme wins for its own
// subtree (the component pages put light and dark cells side by side). Environment-dependent tokens
// keep their environment value in dark and take the theme value in light, so the environment blocks
// are repeated inside each theme scope. A page with no data-theme follows prefers-color-scheme.
const THEMES = [...new Set([...tokens.values()].flatMap((t) => Object.keys(t.theme ?? {})))];
const themed = [...tokens].filter(([, t]) => t.theme);
const themeDeps = [...tokens.keys()].filter((p) => themed.some(([o]) => dependsOn(p, o)));
const themeBody = (th, indent) => [
  ...themed.map(([p, t]) => `${indent}${cssName(p)}: ${th && t.theme[th] ? `var(${cssName(t.theme[th].slice(1, -1))})` : cssValue(p)};`),
  ...themeDeps.map((p) => `${indent}${cssName(p)}: ${cssValue(p)};`),
].join('\n');
const envUnderTheme = (th, indent) => ENVS.map((env) => {
  const own = [...tokens].filter(([, t]) => t.env?.[env]);
  const deps = [...tokens.keys()].filter((p) => own.some(([o]) => dependsOn(p, o)));
  const val = ([p, t]) => (th && t.theme?.[th] ? `var(${cssName(t.theme[th].slice(1, -1))})` : `var(${cssName(t.env[env].slice(1, -1))})`);
  return `${indent}[data-environment="${env}"] {\n${[...own.map((o) => `${indent}  ${cssName(o[0])}: ${val(o)};`), ...deps.map((d) => `${indent}  ${cssName(d)}: ${cssValue(d)};`)].join('\n')}\n${indent}}`;
}).join('\n');
const themeCss = [
  // color-scheme too, so native parts (select popups, scrollbars, date pickers) follow the theme
  ...THEMES.map((th) => `@scope ([data-theme="${th}"]) {\n  :scope {\n    color-scheme: ${th};\n${themeBody(th, '    ')}\n  }\n${envUnderTheme(th, '  ')}\n}`),
  `@scope ([data-theme="dark"]) {\n  :scope {\n    color-scheme: dark;\n${themeBody(null, '    ')}\n  }\n${envUnderTheme(null, '  ')}\n}`,
  ...THEMES.map((th) => `@media (prefers-color-scheme: ${th}) {\n  @scope (:root:not([data-theme])) {\n    :scope {\n      color-scheme: ${th};\n${themeBody(th, '      ')}\n    }\n${envUnderTheme(th, '    ')}\n  }\n}`),
].join('\n');

// Responsive tokens (D-014): $extensions["pane.breakpoint"] → one @media block per breakpoint, at the
// min-width the breakpoint token itself resolves to — no breakpoint is typed twice. Dependents are
// re-declared for the same reason as in the environment blocks.
const BPS = [...new Set([...tokens.values()].flatMap((t) => Object.keys(t.bp ?? {})))]
  .sort((a, b) => parseFloat(resolve(`breakpoint.${a}`)) - parseFloat(resolve(`breakpoint.${b}`)));
const bpBlocks = BPS.map((bp) => {
  const own = [...tokens].filter(([, t]) => t.bp?.[bp]);
  const deps = [...tokens.keys()].filter((p) => own.some(([o]) => dependsOn(p, o)));
  const body = [
    ...own.map(([p, t]) => `    ${cssName(p)}: var(${cssName(t.bp[bp].slice(1, -1))});`),
    ...deps.map((p) => `    ${cssName(p)}: ${cssValue(p)};`),
  ].join('\n');
  return `@media (min-width: ${resolve(`breakpoint.${bp}`)}) {\n  :root {\n${body}\n  }\n}`;
}).join('\n');
// Grid spans: GridItem sets --pane-span-base(-md|-lg) inline (never --pane-span itself — inline would
// beat the media rules) plus data attributes; which one applies is decided
// here, from the same breakpoint tokens.
const spanCss = `
/* GridItem spans — generated from the breakpoint tokens (D-014) */
[data-pane-span] { --pane-span: var(--pane-span-base, ${'var(' + cssName('grid.columns') + ')'}); grid-column: span min(var(--pane-span), ${'var(' + cssName('grid.columns') + ')'}); }
${BPS.map((bp) => `@media (min-width: ${resolve(`breakpoint.${bp}`)}) { [data-pane-span-${bp}] { --pane-span: var(--pane-span-${bp}); } }`).join('\n')}
`;
const json = Object.fromEntries(
  [...tokens].map(([p, t]) => [p, { tier: t.tier, type: t.type, value: format(t.type, resolve(p)), ref: typeof t.raw === 'string' && REF.test(t.raw) ? t.raw.slice(1, -1) : null, css: cssName(p), description: t.description ?? null, why: t.why ?? null, ...(t.bp ? { breakpoints: Object.fromEntries(Object.entries(t.bp).map(([bp, r]) => [bp, { ref: r.slice(1, -1), value: format(t.type, resolve(r.slice(1, -1))) }])) } : {}), ...(t.theme ? { themes: Object.fromEntries(Object.entries(t.theme).map(([th, r]) => [th, { ref: r.slice(1, -1), value: format(t.type, resolve(r.slice(1, -1))) }])) } : {}) }]),
);

mkdirSync(path.join(ROOT, 'build', 'css'), { recursive: true });
mkdirSync(path.join(ROOT, 'build', 'json'), { recursive: true });
const fullCss = css.replace('/* D-005', `/* D-015 themes: dark is the default ($value); light via [data-theme="light"] or prefers-color-scheme */\n${themeCss}\n\n/* D-005`) + motionCss + '\n/* D-014 responsive layout */\n' + bpBlocks + '\n' + spanCss;
writeFileSync(path.join(ROOT, 'build', 'css', 'tokens.css'), fullCss);

// Split sheets (R-031): core.css + colour.css + components/<group>.css load to exactly what tokens.css
// does, so a product loads the two shared sheets and pane-react brings each component's own tokens.
const byName = new Map([...tokens].map(([p, t]) => [cssName(p), { tier: t.tier, type: t.type, group: p.split('.')[0] }]));
const tree = parseCss(fullCss);
const head = (what) => `/* GENERATED by packages/tokens/build.mjs — do not hand-edit. ${what} */\n`;
writeFileSync(path.join(ROOT, 'build', 'css', 'core.css'), head('Pane core tokens: space, size, corner, type, motion, layers, glass numbers, layout. Load with colour.css, or with your own colours.') + filterCss(tree, (d, pre) => sheetOf(d, pre, byName) === 'core') + '\n');
writeFileSync(path.join(ROOT, 'build', 'css', 'colour.css'), head('Pane colour tokens: colour and shadow primitives, semantic colours, themes, environments.') + filterCss(tree, (d, pre) => sheetOf(d, pre, byName) === 'colour') + '\n');
const groupDir = path.join(ROOT, 'build', 'css', 'components');
rmSync(groupDir, { recursive: true, force: true }); mkdirSync(groupDir, { recursive: true });
const GROUPS = [...new Set([...tokens].filter(([, t]) => t.tier === 'component').map(([p]) => p.split('.')[0]))];
for (const g of GROUPS) writeFileSync(path.join(groupDir, `${g}.css`), head(`Component tokens of ${g}, shipped with the components that read them.`) + filterCss(tree, (d, pre) => sheetOf(d, pre, byName) === `component:${g}`) + '\n');
// every declaration lands in exactly one sheet; a sheetOf that drops or doubles one fails the build
{ const count = (n) => n.children.reduce((a, k) => a + ('prop' in k ? 1 : count(k)), 0); const sheets = new Map(); const walk = (n, pre) => { for (const k of n.children) if ('prop' in k) { const s = sheetOf(k, pre, byName); sheets.set(s, (sheets.get(s) ?? 0) + 1); } else walk(k, [...pre, k.prelude]); }; walk(tree, []);
  const known = [...sheets.keys()].filter((s) => s === 'core' || s === 'colour' || GROUPS.includes(s.replace('component:', '')));
  if (known.length !== sheets.size || [...sheets.values()].reduce((a, b) => a + b, 0) !== count(tree)) { console.error(`✗ token split: sheets ${[...sheets.keys()].join(', ')} do not cover tokens.css`); process.exit(1); } }
// cssName → group, so a bundler plugin can map the var(--ds-…) a stylesheet reads to the sheets it needs
writeFileSync(path.join(groupDir, 'groups.json'), JSON.stringify(Object.fromEntries([...byName].filter(([, t]) => t.tier === 'component').map(([n, t]) => [n, t.group]))));


// ---- other formats for consuming projects: ESM + types, SCSS ----
mkdirSync(path.join(ROOT, 'build', 'js'), { recursive: true });
mkdirSync(path.join(ROOT, 'build', 'scss'), { recursive: true });
const flat = Object.fromEntries([...tokens.keys()].map((p) => [p, format(tokens.get(p).type, resolve(p))]));
const vars = Object.fromEntries([...tokens.keys()].map((p) => [p, `var(${cssName(p)})`]));
writeFileSync(path.join(ROOT, 'build', 'js', 'tokens.mjs'),
  `// GENERATED by packages/tokens/build.mjs\n/** Resolved value of every token, by DTCG path. */\nexport const tokens = ${JSON.stringify(flat, null, 2)};\n/** CSS custom property reference for every token — use these in styles so themes/environments apply. */\nexport const cssVar = ${JSON.stringify(vars, null, 2)};\nexport default tokens;\n`);
writeFileSync(path.join(ROOT, 'build', 'js', 'tokens.d.ts'),
  `// GENERATED by packages/tokens/build.mjs\nexport type TokenName =\n${[...tokens.keys()].map((p) => `  | '${p}'`).join('\n')};\nexport declare const tokens: Readonly<Record<TokenName, string>>;\nexport declare const cssVar: Readonly<Record<TokenName, \`var(--ds-\${string})\`>>;\nexport default tokens;\n`);
writeFileSync(path.join(ROOT, 'build', 'scss', '_tokens.scss'),
  `// GENERATED by packages/tokens/build.mjs — \$ds-* hold var() references (theme/environment aware);\n// \$ds-raw-* hold resolved values for places that cannot take a custom property (media queries).\n${[...tokens.keys()].map((p) => `\$ds-${p.replace(/\./g, '-')}: var(${cssName(p)});`).join('\n')}\n${[...tokens.keys()].map((p) => `\$ds-raw-${p.replace(/\./g, '-')}: ${format(tokens.get(p).type, resolve(p))};`).join('\n')}\n`);
writeFileSync(path.join(ROOT, 'build', 'json', 'tokens.json'), JSON.stringify(json, null, 2) + '\n');
const count = (tier) => [...tokens.values()].filter((t) => t.tier === tier).length;
console.log(`✓ ${tokens.size} tokens → css, json, js+d.ts, scss; themes: dark, ${THEMES.join(', ')}; breakpoints: ${BPS.join(', ')}; (${TIERS.map((t) => `${count(t)} ${t}`).join(', ')}), ${glassSurfaces.length} glass surface(s) with fallback, environments: ${ENVS.join(', ') || 'none'}`);

// ---- Swift (X10 · Native): every token as a static property on `enum PaneTokens`, for PaneKit ----
// Colours carry both themes and resolve at draw time (UIColor trait provider on iOS, NSColor appearance
// on macOS); dimensions are points (px → pt one to one, em kept as a multiple of the font size, dvh as a
// fraction of the screen height); shadows become PaneShadow lists; curves become PaneCurve.
const resolveTheme = (p, th, seen = []) => {
  const t = tokens.get(p);
  const raw = th && t.theme?.[th] ? t.theme[th] : t.raw;
  const m = typeof raw === 'string' && raw.match(REF);
  if (!m) return raw;
  if (seen.includes(m[1])) throw new Error(`cycle: ${[...seen, m[1]].join(' -> ')}`);
  return resolveTheme(m[1], th, [...seen, m[1]]);
};
const swiftName = (p) => p.split(/[.\-_]/).filter(Boolean).map((s, i) => (i === 0 ? s.toLowerCase() : s[0].toUpperCase() + s.slice(1))).join('').replace(/^(\d)/, '_$1');
const hexRGBA = (h) => { const s = String(h).replace('#', ''); const n = (i) => parseInt(s.slice(i, i + 2), 16) / 255; return [n(0), n(2), n(4), s.length >= 8 ? n(6) : 1].map((x) => +x.toFixed(4)); };
const swColor = (hex) => { const [r, g, b, a] = hexRGBA(hex); return `PaneRGBA(${r}, ${g}, ${b}, ${a})`; };
const swDim = (v) => { const s = String(v).trim(); const m = s.match(/^(-?[\d.]+)(px|em|rem|dvh|vh|%)?$/); if (!m) return null; return { n: +m[1], unit: m[2] ?? '' }; };
const swShadow = (v) => String(v).split(/,(?![^(]*\))/).map((part) => {
  const inset = /\binset\b/.test(part); const toks = part.replace('inset', '').trim().split(/\s+/);
  const color = toks.find((x) => x.startsWith('#')) ?? '#00000000'; const nums = toks.filter((x) => !x.startsWith('#')).map((x) => parseFloat(x) || 0);
  const [x = 0, y = 0, blur = 0, spread = 0] = nums;
  return `PaneShadow(x: ${x}, y: ${y}, blur: ${blur}, spread: ${spread}, color: ${swColor(color)}, inset: ${inset})`;
});
const WEIGHT = (w) => { const n = +w; return n < 350 ? '.light' : n < 450 ? '.regular' : n < 575 ? '.medium' : n < 675 ? '.semibold' : '.bold'; };
const swiftLines = []; const names = new Set();
for (const p of tokens.keys()) {
  const t = tokens.get(p); let name = swiftName(p); while (names.has(name)) name += '_'; names.add(name);
  const dark = resolveTheme(p, null); const light = resolveTheme(p, 'light');
  const doc = `  /// ${p}${t.description ? ` — ${String(t.description).replace(/\s+/g, ' ').slice(0, 140)}` : ''}`;
  let line = null;
  if (t.type === 'color') line = `  public static let ${name} = PaneDynamicColor(dark: ${swColor(dark)}, light: ${swColor(light)})`;
  else if (t.type === 'dimension') { const d = swDim(dark), l = swDim(light); if (d) line = d.unit === 'em' || d.unit === 'rem' ? `  /// em: multiply by the font size\n  public static let ${name}: CGFloat = ${d.n}` : d.unit === 'dvh' || d.unit === 'vh' ? `  /// fraction of the screen height\n  public static let ${name}: CGFloat = ${d.n / 100}` : d.unit === '%' ? `  /// fraction of the container\n  public static let ${name}: CGFloat = ${d.n / 100}` : (l && l.n !== d.n ? `  public static let ${name} = PaneDynamicMetric(dark: ${d.n}, light: ${l.n})` : `  public static let ${name}: CGFloat = ${d.n}`); }
  else if (t.type === 'number') {
    const v = String(dark).trim(); const ratio = v.match(/^([\d.]+)\s*\/\s*([\d.]+)$/); const vh = v.match(/^([\d.]+)(dvh|vh)$/);
    line = ratio ? `  /// width ÷ height\n  public static let ${name}: Double = ${+(ratio[1] / ratio[2]).toFixed(6)}` : vh ? `  /// fraction of the screen height\n  public static let ${name}: Double = ${vh[1] / 100}` : `  public static let ${name}: Double = ${+v}`;
  }
  else if (t.type === 'duration') line = `  public static let ${name}: TimeInterval = ${parseFloat(dark) / (String(dark).endsWith('ms') ? 1000 : 1)}`;
  else if (t.type === 'fontWeight') line = `  public static let ${name}: Font.Weight = ${WEIGHT(dark)}`;
  else if (t.type === 'fontFamily') line = `  public static let ${name}: String = ${JSON.stringify(String(dark).split(',')[0].trim().replace(/['"]/g, ''))}`;
  else if (t.type === 'cubicBezier') { const v = Array.isArray(dark) ? dark : String(dark).match(/[\d.]+/g).map(Number); line = `  public static let ${name} = PaneCurve(${v.join(', ')})`; }
  else if (t.type === 'shadow') line = `  public static let ${name} = PaneDynamicShadow(dark: [${swShadow(dark).join(', ')}], light: [${swShadow(light).join(', ')}])`;
  if (line) swiftLines.push(doc, line);
}
const swift = `// GENERATED by packages/tokens/build.mjs — do not hand-edit. ${tokens.size} tokens, dark and light.
import SwiftUI
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

public struct PaneRGBA: Sendable, Equatable { public let r, g, b, a: Double; public init(_ r: Double, _ g: Double, _ b: Double, _ a: Double) { self.r = r; self.g = g; self.b = b; self.a = a }
  public var color: Color { Color(.sRGB, red: r, green: g, blue: b, opacity: a) } }
/// A colour with a value per theme that follows the system appearance (or a forced \`.preferredColorScheme\`).
public struct PaneDynamicColor: Sendable { public let dark: PaneRGBA; public let light: PaneRGBA
  public func resolve(_ scheme: ColorScheme) -> Color { (scheme == .dark ? dark : light).color }
  public var color: Color {
    #if canImport(UIKit)
    return Color(UIColor { $0.userInterfaceStyle == .light ? UIColor(red: light.r, green: light.g, blue: light.b, alpha: light.a) : UIColor(red: dark.r, green: dark.g, blue: dark.b, alpha: dark.a) })
    #elseif canImport(AppKit)
    return Color(NSColor(name: nil) { $0.bestMatch(from: [.aqua, .darkAqua]) == .aqua ? NSColor(srgbRed: light.r, green: light.g, blue: light.b, alpha: light.a) : NSColor(srgbRed: dark.r, green: dark.g, blue: dark.b, alpha: dark.a) })
    #else
    return dark.color
    #endif
  } }
public struct PaneDynamicMetric: Sendable { public let dark: CGFloat; public let light: CGFloat; public func resolve(_ scheme: ColorScheme) -> CGFloat { scheme == .dark ? dark : light } }
public struct PaneShadow: Sendable { public let x, y, blur, spread: CGFloat; public let color: PaneRGBA; public let inset: Bool
  public init(x: CGFloat, y: CGFloat, blur: CGFloat, spread: CGFloat, color: PaneRGBA, inset: Bool) { self.x = x; self.y = y; self.blur = blur; self.spread = spread; self.color = color; self.inset = inset } }
public struct PaneDynamicShadow: Sendable { public let dark: [PaneShadow]; public let light: [PaneShadow]; public func resolve(_ scheme: ColorScheme) -> [PaneShadow] { scheme == .dark ? dark : light } }
public struct PaneCurve: Sendable { public let x1, y1, x2, y2: Double; public init(_ x1: Double, _ y1: Double, _ x2: Double, _ y2: Double) { self.x1 = x1; self.y1 = y1; self.x2 = x2; self.y2 = y2 }
  public func animation(_ duration: TimeInterval) -> Animation { .timingCurve(x1, y1, x2, y2, duration: duration) } }

public enum PaneTokens {
${swiftLines.join('\n')}
}
`;
mkdirSync(path.join(ROOT, 'build', 'swift'), { recursive: true });
writeFileSync(path.join(ROOT, 'build', 'swift', 'PaneTokens.swift'), swift);
console.log(`✓ swift: ${names.size} tokens → build/swift/PaneTokens.swift`);
