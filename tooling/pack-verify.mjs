#!/usr/bin/env node
// pack-verify — proves a package is actually installable and usable BEFORE it's published, by
// doing exactly what a real consumer would do: `npm pack`, install the tarball into a scratch
// project, then resolve every path in `exports` (and `main`) to confirm it points at real content.
//
// Exists because @dial/tokens shipped with a package.json exports map pointing at filenames the
// build script never produced (tokens.json, variables.css, etc. — the build only ever emits
// per-theme files) — caught by hand during ORDERS block B1 by doing this exact sequence manually.
// This script exists so that check runs every time, automatically, via `prepublishOnly` — not
// only when someone happens to test it by hand again.
//
// Usage: node ../../tooling/pack-verify.mjs   (run from inside the package directory being verified)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const scratchDir = mkdtempSync(join(tmpdir(), 'pack-verify-'));

function log(msg) {
  console.log(`[pack-verify] ${msg}`);
}

try {
  log(`packing ${pkg.name}@${pkg.version}...`);
  const packOutput = execFileSync('npm', ['pack', '--json', '--pack-destination', scratchDir], {
    encoding: 'utf8',
  });
  const [{ filename }] = JSON.parse(packOutput);
  const tarballPath = join(scratchDir, filename);

  log('installing tarball into a scratch project...');
  const projectDir = join(scratchDir, 'consumer');
  writeFileSync(
    join(scratchDir, 'package.json'),
    JSON.stringify({ name: 'pack-verify-scratch', private: true }, null, 2),
  );
  // Install directly at scratchDir root (npm accepts a tarball path as a positional install arg
  // without needing a project scaffold beyond a package.json to attach node_modules to).
  execFileSync('npm', ['install', '--no-audit', '--no-fund', '--prefix', scratchDir, tarballPath], {
    stdio: 'pipe',
  });

  log('resolving every exports/main path against the installed package...');
  const nodeModulesPkgDir = join(scratchDir, 'node_modules', pkg.name);
  const pathsToCheck = [];
  if (typeof pkg.main === 'string') pathsToCheck.push(['main', pkg.main]);
  if (typeof pkg.types === 'string') pathsToCheck.push(['types', pkg.types]);
  if (pkg.exports && typeof pkg.exports === 'object') {
    for (const [subpath, target] of Object.entries(pkg.exports)) {
      const resolved = typeof target === 'string' ? target : target.import ?? target.require ?? target.default;
      if (typeof resolved === 'string') pathsToCheck.push([`exports["${subpath}"]`, resolved]);
    }
  }

  let failures = 0;
  for (const [label, relPath] of pathsToCheck) {
    const absPath = join(nodeModulesPkgDir, relPath);
    if (!existsSync(absPath)) {
      console.error(`  ✗ ${label} -> ${relPath} does NOT exist in the packed tarball`);
      failures++;
    } else {
      console.log(`  ✓ ${label} -> ${relPath}`);
    }
  }

  if (failures > 0) {
    console.error(`\n[pack-verify] ${failures} broken path(s) — these would 404 for a real consumer.`);
    process.exit(1);
  }
  log(`all ${pathsToCheck.length} declared entry point(s) resolve to real files. Safe to publish.`);
} finally {
  rmSync(scratchDir, { recursive: true, force: true });
}
