#!/usr/bin/env node
// derivation-guard — PreToolUse hook: a component's CSS or TSX cannot be written until its form has
// been derived from the concept (references/derivation.md). The component's <Name>.why.json must hold
// the generic default it avoids, derivation steps that quote the principles, and a variant the user
// picked — or "identity": false with a reason, for layout primitives with no form of their own.
// Reads the hook payload on stdin; exit 2 blocks the write and tells the agent what is missing.
// Bash edits bypass hooks, which is why tooling/kiln/rationale.mjs checks the same thing in verify.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { docsConfig } from './config.mjs';

let payload = {};
try { payload = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { process.exit(0); }
const file = payload.tool_input?.file_path ?? payload.tool_input?.path;
if (!file) process.exit(0);
const C = docsConfig();
const comp = C.abs(C.componentsDir);
const rel = path.relative(comp, path.resolve(file));
const m = rel.match(/^([A-Z][\w]*)\/\1\.(module\.css|tsx)$/);
if (!m || rel.startsWith('..')) process.exit(0);
const name = m[1];
const whyFile = path.join(comp, name, `${name}.why.json`);
const why = existsSync(whyFile) ? JSON.parse(readFileSync(whyFile, 'utf8')) : null;
const missing = [];
if (!why) missing.push(`${name}.why.json does not exist`);
else if (why.identity === false) { if (!why.identity_reason) missing.push('identity: false needs identity_reason'); }
else {
  if (!(why.default_to_avoid ?? []).length) missing.push('default_to_avoid (the generic pattern this must not become)');
  if ((why.derivation ?? []).length < 3) missing.push('derivation (≥3 steps quoting the principles\' Therefore text)');
  if (why.variants?.by !== 'user' || !why.variants?.picked) missing.push('variants.picked by the user (render ≥3 in apps/lab first)');
}
if (!missing.length) process.exit(0);
console.error(`BLOCKED: ${name}'s form has not been derived from the concept yet. Before writing ${path.basename(file)}, fill ${name}.why.json:\n  - ${missing.join('\n  - ')}\nSee kiln references/derivation.md. Design comes from the principles, then the code.`);
process.exit(2);
