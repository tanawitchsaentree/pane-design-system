#!/usr/bin/env node
// bundle-tokens — runs after pane-react's build. Copies the built tokens into pane-react/dist/tokens and
// writes dist/all.css (tokens, then component styles), so one package and one import are enough:
//   npm i pane-react          import 'pane-react/all.css'
// pane-tokens stays a separate package for projects without React. Fails loudly when the tokens have
// not been built, because shipping a pane-react with no tokens renders every component unstyled.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOK = path.join(ROOT, 'packages/tokens/build');
const DIST = path.join(ROOT, 'packages/react/dist');
const FILES = [['css/tokens.css', 'tokens.css'], ['js/tokens.mjs', 'tokens.mjs'], ['js/tokens.d.ts', 'tokens.d.ts'], ['json/tokens.json', 'tokens.json']];

const missing = FILES.filter(([from]) => !existsSync(path.join(TOK, from))).map(([from]) => from);
if (missing.length) { console.error(`✗ bundle-tokens: build pane-tokens first (missing ${missing.join(', ')})`); process.exit(1); }
if (!existsSync(path.join(DIST, 'styles.css'))) { console.error('✗ bundle-tokens: no dist/styles.css, run the vite build first'); process.exit(1); }

mkdirSync(path.join(DIST, 'tokens'), { recursive: true });
for (const [from, to] of FILES) copyFileSync(path.join(TOK, from), path.join(DIST, 'tokens', to));
const tokens = readFileSync(path.join(TOK, 'css/tokens.css'), 'utf8');
const styles = readFileSync(path.join(DIST, 'styles.css'), 'utf8');
writeFileSync(path.join(DIST, 'all.css'), `/* pane-react/all.css: pane-tokens CSS, then pane-react component styles */\n${tokens}\n${styles}`);
console.log(`✓ bundle-tokens: dist/all.css (${Math.round((tokens.length + styles.length) / 1024)} kB) and dist/tokens/`);
