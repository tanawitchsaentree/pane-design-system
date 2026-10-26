#!/usr/bin/env node
// Builds src/{primitive,semantic,component}.json (DTCG) into build/css/tokens.css + build/json/tokens.json.
// Enforces the three-tier rule (CLAUDE.md iron rule 1) at build time rather than by review:
// semantic tokens may only reference primitive ones, component tokens only semantic ones —
// a component token pointing at a primitive fails the build.
// Glass surfaces get their D-005 opaque fallback emitted here, so no component can forget it.
// Tokens with $extensions["pane.environment"] get one override block per environment (D-009);
// each environment value obeys the same tier rule as $value.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const TIERS = ['primitive', 'semantic', 'component'];
const tokens = new Map(); // path -> { tier, type, raw, description }
const collisions = [];

function walk(node, tier, trail, inheritedType) {
  const type = node.$type ?? inheritedType;
  if ('$value' in node) {
    const key = trail.join('.');
    if (tokens.has(key)) collisions.push(`${key} is defined in both ${tokens.get(key).tier} and ${tier} — paths must be unique across tiers`);
    tokens.set(trail.join('.'), { tier, type, raw: node.$value, description: node.$description, env: node.$extensions?.['pane.environment'] });
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (!k.startsWith('$') && v && typeof v === 'object') walk(v, tier, [...trail, k], type);
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

const css = `/* GENERATED by packages/tokens/build.mjs — do not hand-edit. */
:root {
${lines.join('\n')}
}

/* D-009 — the app declares how bright the world behind the glass is; glass darkens to match. */
${envBlocks}

/* D-005 — glass is mood, never information: every way out of glass lands on the opaque surface.
   Selectors repeat [data-environment] so the fallback outranks the environment blocks above. */
@media (prefers-reduced-transparency: reduce) {
  :root, [data-environment] {
${fallback.replace(/^/gm, '  ')}
  }
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  :root, [data-environment] {
${fallback.replace(/^/gm, '  ')}
  }
}
@media (forced-colors: active) {
  :root, [data-environment] {
${fallback.replace(/^/gm, '  ')}
  }
}
`;

const json = Object.fromEntries(
  [...tokens].map(([p, t]) => [p, { tier: t.tier, type: t.type, value: format(t.type, resolve(p)), ref: typeof t.raw === 'string' && REF.test(t.raw) ? t.raw.slice(1, -1) : null, css: cssName(p), description: t.description ?? null }]),
);

mkdirSync(path.join(ROOT, 'build', 'css'), { recursive: true });
mkdirSync(path.join(ROOT, 'build', 'json'), { recursive: true });
writeFileSync(path.join(ROOT, 'build', 'css', 'tokens.css'), css);
writeFileSync(path.join(ROOT, 'build', 'json', 'tokens.json'), JSON.stringify(json, null, 2) + '\n');
const count = (tier) => [...tokens.values()].filter((t) => t.tier === tier).length;
console.log(`✓ ${tokens.size} tokens (${TIERS.map((t) => `${count(t)} ${t}`).join(', ')}), ${glassSurfaces.length} glass surface(s) with fallback, environments: ${ENVS.join(', ') || 'none'}`);
