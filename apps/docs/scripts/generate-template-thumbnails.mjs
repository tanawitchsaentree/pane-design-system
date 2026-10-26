#!/usr/bin/env node
/**
 * Generates real screenshots for the templates index (G-T4: a thumbnail must be a real render,
 * never a placeholder, and must be regenerated whenever the template's own render changes — this
 * script also writes each thumbnail's content hash into thumbnail-manifest.json so a later staleness
 * check can compare "hash of current render" against "hash recorded when the index was last built"
 * without needing to keep the actual screenshot bytes in git).
 *
 * Requires the dev/prod server already running at the given base URL (default localhost:3000) —
 * this script does not start one itself, since a real repo may already have one running (dev
 * loop) or prefer to run this against a built+served output (CI).
 *
 * Usage: node scripts/generate-template-thumbnails.mjs [--base-url http://localhost:3000]
 */
import { chromium } from 'playwright';
import esbuild from 'esbuild';
import { createHash } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/** Transpiles the real templates.ts (TS, not importable directly by plain Node) to a temp .mjs
 * and imports it — same "read the real source, never hand-copy" discipline as everything else in
 * this skill, just needing a transpile step since this is a .ts file, not .tsx/.mdx with an
 * existing Next.js loader. */
async function loadTemplates() {
  const srcPath = path.join(process.cwd(), 'src/lib/templates.ts');
  const result = await esbuild.build({
    entryPoints: [srcPath],
    bundle: false,
    format: 'esm',
    write: false,
    logLevel: 'silent',
  });
  const tmpPath = path.join(process.cwd(), `.template-manifest-${process.pid}.mjs`);
  writeFileSync(tmpPath, result.outputFiles[0].text);
  try {
    const mod = await import(pathToFileURL(tmpPath).href);
    return mod.TEMPLATES;
  } finally {
    const { rmSync } = await import('node:fs');
    rmSync(tmpPath, { force: true });
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args['base-url'] || 'http://localhost:3000';

  const TEMPLATES = await loadTemplates();

  const outDir = path.join(process.cwd(), 'public', 'template-thumbnails');
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const manifest = {};

  for (const template of TEMPLATES) {
    await page.goto(`${baseUrl}/examples/${template.slug}`, { waitUntil: 'networkidle', timeout: 20000 });
    const buffer = await page.screenshot();
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16);
    const filename = `${template.slug}.png`;
    writeFileSync(path.join(outDir, filename), buffer);
    manifest[template.slug] = { filename, hash };
    console.log(`  ${template.slug}: ${filename} (${hash})`);
  }

  writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await browser.close();
  console.log(`Wrote ${Object.keys(manifest).length} thumbnails + manifest.json to ${outDir}`);
}

main();
