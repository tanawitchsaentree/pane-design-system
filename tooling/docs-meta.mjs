#!/usr/bin/env node
// docs-meta — generates apps/docs/src/book/meta.json, the source for every table the docs-engine
// content model forbids hand-typing:
//   props        react-docgen-typescript over each component's own source (props declared in
//                node_modules — React's HTML attributes, Radix — are filtered out and reported as
//                "inherits")
//   variantCount enum props + canonical state props the component itself declares → demo floor
//                variant_count + 3 (content-model.md point 5)
//   bundle       esbuild --minify of the component's own export, react external, CSS modules
//                included, gzipped (content-model.md point 2: never guessed)
//   version      packages/react/package.json
// Usage: node tooling/docs-meta.mjs
import { readFileSync, writeFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REACT = path.join(ROOT, 'packages', 'react');
const COMP_DIR = path.join(REACT, 'src', 'components');
const require = createRequire(import.meta.url);
const docgen = require('react-docgen-typescript');

const CANONICAL_STATES = ['disabled', 'invalid', 'error', 'loading', 'indeterminate', 'readOnly'];
const parser = docgen.withCustomConfig(path.join(REACT, 'tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => ![prop.parent, ...(prop.declarations ?? [])].some((d) => d?.fileName?.includes('node_modules')),
});

const components = readdirSync(COMP_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const version = JSON.parse(readFileSync(path.join(REACT, 'package.json'), 'utf8')).version;
const out = { generatedAt: new Date().toISOString(), version, components: {} };
const scratch = mkdtempSync(path.join(tmpdir(), 'docs-meta-'));

try {
  for (const name of components) {
    const file = path.join(COMP_DIR, name, `${name}.tsx`);
    const docs = parser.parse(file);
    const exports = docs.map((d) => ({
      displayName: d.displayName,
      props: Object.values(d.props).map((p) => ({
        name: p.name,
        type: p.type.name === 'enum' ? p.type.value.map((v) => v.value).join(' | ') : p.type.name,
        required: p.required,
        default: p.defaultValue?.value ?? null,
        description: p.description || null,
        enum: p.type.name === 'enum' && p.type.value.every((v) => /^['"]/.test(v.value)),
      })),
    }));
    const primary = exports.find((e) => e.displayName === name) ?? exports[0];
    const own = primary?.props ?? [];
    const enums = own.filter((p) => p.enum).map((p) => p.name);
    const states = own.filter((p) => CANONICAL_STATES.includes(p.name)).map((p) => p.name);

    // bundle size of this component's own export
    const entry = path.join(scratch, `${name}.ts`);
    writeFileSync(entry, `export * from ${JSON.stringify(path.join(COMP_DIR, name, 'index.ts'))};\n`);
    const res = await build({
      entryPoints: [entry], bundle: true, minify: true, write: false, format: 'esm', outdir: scratch,
      external: ['react', 'react-dom', 'react/jsx-runtime'], loader: { '.module.css': 'local-css' }, logLevel: 'silent',
    });
    const bytes = (ext) => res.outputFiles.filter((f) => f.path.endsWith(ext)).reduce((n, f) => n + f.contents.length, 0);
    const gz = (ext) => res.outputFiles.filter((f) => f.path.endsWith(ext)).reduce((n, f) => n + gzipSync(f.contents).length, 0);

    out.components[name] = {
      source: `packages/react/src/components/${name}/${name}.tsx`,
      exports,
      variantDimensions: [...enums, ...states],
      variantCount: enums.length + states.length,
      demoFloor: enums.length + states.length + 3,
      bundle: { jsMin: bytes('.js'), cssMin: bytes('.css'), gzip: gz('.js') + gz('.css') },
    };
    console.log(`${name.padEnd(12)} dims ${out.components[name].variantCount} (${[...enums, ...states].join(', ') || '—'}) → floor ${out.components[name].demoFloor} · ${(out.components[name].bundle.gzip / 1024).toFixed(1)} kB gz`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
writeFileSync(path.join(ROOT, 'apps', 'docs', 'src', 'book', 'meta.json'), JSON.stringify(out, null, 2) + '\n');
