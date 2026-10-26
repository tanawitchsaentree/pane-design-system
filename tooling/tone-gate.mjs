#!/usr/bin/env node
// tone-gate — every page of the built book must pass the human-tone lint (lint.py: dashes, negation
// scaffolding, label colons, banned lexicon, formula constructions, fake engagement, bow-ties).
// Reads the RENDERED prose (headings, paragraphs, list items, table descriptions), not the source,
// so generated text is checked too. Code blocks and live examples are excluded.
//
// Excluded page: /reference/decisions — the decision log is append-only (guard-decisions.mjs), so its
// historical entries cannot be rewritten; new entries should still be written to the rules.
//
// lint.py location: $HUMAN_TONE_LINT, else the local human-tone install. Missing = FAIL (fail closed).
// Usage: node tooling/tone-gate.mjs [--no-build]   → system/reports/tone-gate-{date}.json
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir, homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import { serveDist } from './serve-dist.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LINT = process.env.HUMAN_TONE_LINT ?? path.join(homedir(), 'Downloads', 'human-tone-folder', '.claude', 'skills', 'human-tone', 'scripts', 'lint.py');
if (!existsSync(LINT)) {
  console.error(`✗ tone gate: lint.py not found at ${LINT} — set HUMAN_TONE_LINT. Nothing was checked, so this fails.`);
  process.exit(1);
}
const EXCLUDE = new Set(['/reference/decisions']);
const ROUTES = JSON.parse(readFileSync(path.join(ROOT, 'apps/docs/src/book/routes.json'), 'utf8')).parts.flatMap((p) => p.pages.map((x) => x.path)).filter((r) => !EXCLUDE.has(r));

const srv = await serveDist(path.join(ROOT, 'apps', 'docs', 'dist'));
const browser = await chromium.launch();
const scratch = mkdtempSync(path.join(tmpdir(), 'tone-'));
const out = { generatedAt: new Date().toISOString(), lint: LINT, excluded: [...EXCLUDE], pages: {} };
let failed = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const r of ROUTES) {
    await page.goto(`${srv.base}${r}?scene=room`, { waitUntil: 'networkidle' });
    const text = await page.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3, main h4, main p, main li, main td, main caption, main .example-title')]
      .filter((e) => !e.closest('pre, code, .example-live, .backdrop-cell, .stats, [data-group], .md-skip') && !e.querySelector('p, li') && e.innerText.trim().split(/\s+/).length >= 2)
      // a cell or item that is nothing but code (a type, a token name) is not prose
      .filter((e) => e.textContent.replace(/\s/g, '') !== [...e.querySelectorAll('code')].map((c) => c.textContent).join('').replace(/\s/g, ''))
      // inline code is not prose: swap it for a placeholder word before linting
      .map((e) => { const c = e.cloneNode(true); c.querySelectorAll('code, kbd').forEach((k) => k.replaceWith('code')); return c.textContent.replace(/\s+/g, ' ').trim(); }).join('\n'));
    const f = path.join(scratch, `${r.replace(/\W+/g, '_') || 'root'}.txt`);
    writeFileSync(f, text);
    const res = spawnSync('python3', [LINT, '--json', '--no-profile', f], { encoding: 'utf8' });
    let report;
    try { report = JSON.parse(res.stdout); } catch { report = { raw: res.stdout.slice(0, 400) }; }
    const hard = report.hard ?? [];
    const lines = text.split('\n');
    const ok = res.status === 0;
    if (!ok) failed++;
    out.pages[r] = { ok, words: text.split(/\s+/).length, hard: hard.length, report };
    console.log(`${ok ? '✓' : '✗'} ${r.padEnd(32)} ${text.split(/\s+/).length} words${ok ? '' : ` · ${hard.length} hard`}`);
    if (process.argv.includes('--verbose')) for (const v of hard) console.log(`    ${v.rule.padEnd(46)} | ${lines[v.line - 1]?.slice(0, 160)}`);
  }
} finally {
  await browser.close();
  srv.close();
}
writeFileSync(path.join(ROOT, 'system', 'reports', `tone-gate-${out.generatedAt.slice(0, 10)}.json`), JSON.stringify(out, null, 2) + '\n');
console.log(`\n${failed ? '✗' : '✓'} tone gate: ${ROUTES.length - failed}/${ROUTES.length} pages pass human-tone lint (excluded: ${[...EXCLUDE].join(', ')})`);
process.exit(failed ? 1 : 0);
