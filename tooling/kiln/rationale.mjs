#!/usr/bin/env node
// rationale — nothing in a kiln system exists because it looked nice. Every value and every behaviour
// traces back to a principle distilled from the system's concept (skill kiln, references/concept.md).
//
//   concept     system/CONCEPT.md has a concept paragraph and ≥3 principles "### P<n> <name>", each
//               with a "Therefore" consequence for every axis (space, shape, depth, colour, type, motion,
//               interaction)
//   tokens      every token in the DTCG sources resolves a $extensions["kiln.why"] = { p, why } on
//               itself or its nearest group; p names real principles; why is a reason, not a taste
//   components  every component has <Name>.why.json covering everything its CSS module does:
//               each class (part, seen or unseen), each state selector (hover, focus, disabled,
//               data-state, forced colours, reduced motion…), each transitioned property and keyframes
//
// A reason fails if it is shorter than 8 words or argues from appearance ("looks clean", "modern",
// "สวย", "rounded is friendlier" without saying what it is for).
// Usage: node tooling/kiln/rationale.mjs [--json]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { docsConfig } from './config.mjs';

const C = docsConfig();
const R = { concept: 'system/CONCEPT.md', tokens: 'packages/tokens/src', components: C.componentsDir, ...(C.rationale ?? {}) };
const AXES = ['space', 'shape', 'depth', 'colour', 'type', 'motion', 'interaction'];
const TASTE = /\b(looks?|feels?) (nice|good|clean|modern|better|cool|premium|sleek|elegant|beautiful|pretty|friendly|right|fresh)\b|\baesthetic(ally)?\b|\bvisual(ly)? appeal|\btrend(y|ing)?\b|\bjust (nicer|prettier)\b|สวย|ดูดี|ทันสมัย|น่ารัก|เท่ห?์?/i;
const problems = [];
const add = (area, msg) => problems.push({ area, msg });

// ---------------------------------------------------------------- concept
const conceptFile = C.abs(R.concept);
const principles = new Map();
if (!existsSync(conceptFile)) add('concept', `${R.concept} missing. Distil the concept into principles before designing anything.`);
else {
  const md = readFileSync(conceptFile, 'utf8');
  const intro = md.split(/^### P\d+/m)[0].replace(/^#.*$/gm, '').trim();
  if (intro.split(/\s+/).length < 40) add('concept', 'the concept paragraph is under 40 words; say what the system is, for whom, and what it must never become');
  for (const m of md.matchAll(/^### (P\d+)\s+(.+)\n([\s\S]*?)(?=^### P\d+|^## |(?![\s\S]))/gm)) {
    const [, id, name, body] = m;
    principles.set(id, name.trim());
    const therefore = body.split(/\*\*Therefore\*\*/i)[1] ?? '';
    const missing = AXES.filter((a) => !new RegExp(`\\b${a === 'colour' ? 'colou?r' : a}\\b`, 'i').test(therefore));
    if (!therefore) add('concept', `${id} has no **Therefore** block`);
    else if (missing.length) add('concept', `${id} says nothing about ${missing.join(', ')} under Therefore (write "not affected, because …" if so)`);
  }
  if (principles.size < 3) add('concept', `${principles.size} principles found; at least 3 "### P<n> <name>" headings are needed`);
}
const checkReason = (where, w) => {
  if (!w || typeof w !== 'object') return add(where.split(' ')[0], `${where}: no reason`);
  const ps = [].concat(w.p ?? []);
  if (!ps.length) add(where.split(' ')[0], `${where}: names no principle`);
  for (const p of ps) if (!principles.has(p)) add(where.split(' ')[0], `${where}: principle ${p} is not in ${R.concept}`);
  const words = String(w.why ?? '').trim().split(/\s+/).filter(Boolean).length;
  if (words < 8) add(where.split(' ')[0], `${where}: reason has ${words} words; say what it does for the reader or the concept`);
  if (TASTE.test(w.why ?? '')) add(where.split(' ')[0], `${where}: reason argues from taste ("${String(w.why).match(TASTE)[0]}")`);
};

// ---------------------------------------------------------------- tokens
let tokenCount = 0;
const tokDir = C.abs(R.tokens);
const walk = (node, trail, inherited, file) => {
  const own = node.$extensions?.['kiln.why'];
  const why = own ?? inherited;
  if (own) checkReason(`tokens ${file}:${trail.join('.') || '(root)'}`, own);
  if ('$value' in node) {
    tokenCount++;
    if (!why) add('tokens', `${file}:${trail.join('.')} has no reason on itself or any group above it`);
    return;
  }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...trail, k], why, file);
};
if (existsSync(tokDir)) for (const f of readdirSync(tokDir).filter((n) => n.endsWith('.json'))) walk(JSON.parse(readFileSync(path.join(tokDir, f), 'utf8')), [], null, f);
else add('tokens', `${R.tokens} not found`);

// ---------------------------------------------------------------- components
let compCount = 0;
const compDir = C.abs(R.components);
const STATE_RE = /:(hover|active|focus-visible|focus-within|focus|disabled|checked|invalid|placeholder-shown|empty)\b|\[(data-[\w-]+|aria-[\w-]+)(?:=['"]?([\w-]+)['"]?)?\]/g;
function cssFacts(css) {
  const body = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const classes = new Set([...body.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
  const states = new Set();
  for (const m of body.matchAll(STATE_RE)) states.add(m[1] ? m[1] : m[3] ? `${m[2]}=${m[3]}` : m[2]);
  for (const m of body.matchAll(/@media\s*\(([\w-]+)(?::\s*([\w-]+))?\)/g)) if (!/width|height/.test(m[1])) states.add(`@media ${m[1]}${m[2] ? `: ${m[2]}` : ''}`);
  const motion = new Set();
  for (const m of body.matchAll(/transition(?:-property)?\s*:\s*([^;]+);/g)) for (const part of m[1].split(',')) { const prop = part.trim().split(/\s+/)[0]; if (prop && !/^var\(|^\d|^none$/.test(prop)) motion.add(prop); }
  for (const m of body.matchAll(/@keyframes\s+([\w-]+)/g)) motion.add(`@${m[1]}`);
  return { classes, states, motion };
}
if (existsSync(compDir)) for (const name of readdirSync(compDir).filter((n) => statSync(path.join(compDir, n)).isDirectory())) {
  const cssFile = path.join(compDir, name, `${name}.module.css`);
  if (!existsSync(cssFile)) continue;
  compCount++;
  const whyFile = path.join(compDir, name, `${name}.why.json`);
  if (!existsSync(whyFile)) { add('components', `${name}: no ${name}.why.json`); continue; }
  const why = JSON.parse(readFileSync(whyFile, 'utf8'));
  if (!why.concept || String(why.concept).split(/\s+/).length < 12) add('components', `${name}: "concept" must say in a sentence how this component expresses the system's concept`);
  const facts = cssFacts(readFileSync(cssFile, 'utf8'));
  for (const [kind, set] of [['parts', facts.classes], ['states', facts.states], ['motion', facts.motion]]) {
    for (const key of set) if (!why[kind]?.[key]) add('components', `${name}: ${kind} "${key}" is in the CSS but has no reason`);
    for (const [key, w] of Object.entries(why[kind] ?? {})) { if (!set.has(key)) add('components', `${name}: ${kind} "${key}" has a reason but is not in the CSS (stale)`); checkReason(`components ${name} ${kind}.${key}`, w); }
  }
}

const by = (a) => problems.filter((p) => p.area === a).length;
if (process.argv.includes('--json')) console.log(JSON.stringify({ principles: [...principles], tokenCount, compCount, problems }, null, 2));
else {
  for (const p of problems.slice(0, 60)) console.log(`✗ ${p.area.padEnd(10)} ${p.msg}`);
  if (problems.length > 60) console.log(`  … ${problems.length - 60} more`);
  console.log(`${problems.length ? '✗' : '✓'} rationale: ${principles.size} principles · ${tokenCount} tokens (${by('tokens')} problems) · ${compCount} components (${by('components')} problems) · concept ${by('concept')} problems`);
}
process.exit(problems.length ? 1 : 0);
