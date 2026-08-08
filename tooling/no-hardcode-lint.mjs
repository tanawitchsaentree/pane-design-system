#!/usr/bin/env node
// no-hardcode-lint v2 — ปิดช่องโหว่ที่ W1 หลุด (sizing + physical inset + inline style)
// ใช้: node tooling/no-hardcode-lint.mjs [files...]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const TARGETS = ['packages/react/src', 'packages/styles', 'packages/tokens/preview'];
const EXT = new Set(['.tsx', '.ts', '.css', '.scss']);

const SIZING = 'width|height|min-width|max-width|min-height|max-height|block-size|inline-size|min-inline-size|max-inline-size|min-block-size|max-block-size';
const SPACING = 'margin|padding|gap|row-gap|column-gap|inset|inset-inline|inset-block|top|left|right|bottom';
const OTHER = 'font-size|line-height|border-radius|border-width|letter-spacing|flex-basis';

const RULES = [
  { re: /#[0-9a-fA-F]{3,8}\b/g, msg: 'hex color ดิบ → var(--ds-*)' },
  { re: /\b(rgb|rgba|hsl|hsla|oklch|lab|lch)\(\s*[\d.]/g, msg: 'color function ดิบ → var(--ds-*)' },
  { re: new RegExp(`(?<![-\\w])(${SIZING}|${SPACING}|${OTHER})\\s*:\\s*(?!0\\b|auto|100%|inherit|initial|unset|var\\()[^;{}]*?[\\d.]+(px|rem|em)`, 'g'),
    msg: 'ค่าขนาด/ระยะดิบ → var(--ds-*)' },
  { re: /\b(margin|padding|border)-(left|right)\b/g, msg: 'physical property → logical (-inline-start/-inline-end)' },
  { re: /(?<![-\w])(width|min-width|max-width|height|min-height|max-height)\s*:/g, msg: 'physical sizing → logical (inline-size/block-size)' },
  { re: /(?<![-\w])(left|right)\s*:/g, msg: 'physical inset → inset-inline-start/end' },
  { re: /\btext-align\s*:\s*(left|right)\b/g, msg: 'text-align physical → start/end' },
  { re: /style=\{\{[^}]*(background|color|padding|margin|width|height|boxShadow|borderRadius)/g, msg: 'inline style ที่มีค่าดีไซน์ → CSS Module' },
];
const SKIP_FILE = /(stories\.|test\.|spec\.|\.d\.ts|node_modules)/;

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, acc) : EXT.has(extname(p)) && acc.push(p);
  }
  return acc;
}

const argv = process.argv.slice(2).filter(f => EXT.has(extname(f)) && existsSync(f));
const files = argv.length ? argv : TARGETS.flatMap(t => walk(t));
let n = 0;
for (const file of files) {
  if (SKIP_FILE.test(file)) continue;
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/no-hardcode-ok/.test(line)) return;
    for (const { re, msg } of RULES) {
      re.lastIndex = 0;
      if (re.test(line)) { console.error(`${file}:${i + 1}  ${msg}\n    ${line.trim()}`); n++; }
    }
  });
}
if (n) { console.error(`\n✗ ${n} violation(s) — ทุกค่าต้องมาจาก token, ทุก property ต้อง logical`); process.exit(1); }
console.log(`✓ clean (${files.length} files scanned)`);
