#!/usr/bin/env node
// release-pack — builds and packs pane-tokens + pane-react into ./release as installable tarballs,
// for handing to another project without publishing anywhere (publishing stays the user's call).
//   npm install ./release/pane-tokens-0.1.0.tgz ./release/pane-react-0.1.0.tgz
import { mkdirSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'release');
mkdirSync(OUT, { recursive: true });
for (const dir of ['tokens', 'react']) {
  const r = spawnSync('pnpm', ['pack', '--pack-destination', OUT], { cwd: path.join(ROOT, 'packages', dir), stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log(`\n✓ release/: ${readdirSync(OUT).filter((f) => f.endsWith('.tgz')).join(', ')}`);
