#!/usr/bin/env node
// no-hardcode-lint: จับค่าดิบใน component code — ต้องมาจาก token vars เท่านั้น
// ใช้: node tooling/no-hardcode-lint.mjs [ไฟล์...]   (ไม่ระบุ = สแกน packages/react/src ทั้งหมด)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const TARGET = 'packages/react/src';
const EXT = new Set(['.tsx', '.ts', '.css', '.scss']);
const RULES = [
  { re: /#[0-9a-fA-F]{3,8}\b/g, msg: 'hex color ดิบ — ใช้ var(--ds-*)' },
  { re: /\b(rgb|rgba|hsl|hsla|oklch)\(/g, msg: 'color function ดิบ — ใช้ var(--ds-*)' },
  { re: /(?<![-\w])(margin|padding|gap|top|left|right|bottom|width|height|font-size|border-radius|inset)[^;{}]*?:\s*[\d.]+(px|rem|em)/g, msg: 'ค่าระยะดิบ — ใช้ var(--ds-*)' },
  { re: /\b(padding|margin|border)-(left|right)\b/g, msg: 'physical property — ใช้ logical (-inline-start/-inline-end)' },
];
const ALLOW = /(no-hardcode-ok|stories\.|test\.|\.d\.ts)/;

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, acc) : EXT.has(extname(p)) && acc.push(p);
  }
  return acc;
}

const files = process.argv.slice(2).filter(f => EXT.has(extname(f)) && existsSync(f));
const targets = files.length ? files : walk(TARGET);
let violations = 0;

for (const file of targets) {
  if (ALLOW.test(file)) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes('no-hardcode-ok')) return;
    for (const { re, msg } of RULES) {
      re.lastIndex = 0;
      if (re.test(line)) { console.error(`${file}:${i + 1}  ${msg}\n    ${line.trim()}`); violations++; }
    }
  });
}

if (violations) { console.error(`\n✗ ${violations} violation(s) — ทุกค่าต้องมาจาก token`); process.exit(1); }
console.log('✓ no hardcoded values');
