import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';

// The topbar's version and component count, read from meta.json here so the first chunk does not
// carry the whole props table to print two numbers.
const META = resolve(__dirname, 'src/book/meta.json');
const bookFacts = {
  name: 'book-facts',
  resolveId: (id: string) => (id === 'virtual:book-facts' ? '\0book-facts' : null),
  load(id: string) {
    if (id !== '\0book-facts') return null;
    (this as { addWatchFile?: (f: string) => void }).addWatchFile?.(META);
    const meta = JSON.parse(readFileSync(META, 'utf8'));
    return `export const version = ${JSON.stringify(meta.version)}; export const componentCount = ${Object.keys(meta.components).length};`;
  },
};

// Example titles are each file's `// @example` line. The book lists them without loading the files,
// so this small index is built here instead of shipping every example's source in the first chunk.
const EXAMPLES = resolve(__dirname, 'src/examples');
const exampleTitles = {
  name: 'example-titles',
  resolveId: (id: string) => (id === 'virtual:example-titles' ? '\0example-titles' : null),
  load(id: string) {
    if (id !== '\0example-titles') return null;
    const titles: Record<string, string> = {};
    for (const f of readdirSync(EXAMPLES)) {
      if (!f.endsWith('.tsx')) continue;
      const file = resolve(EXAMPLES, f);
      (this as { addWatchFile?: (f: string) => void }).addWatchFile?.(file);
      const t = readFileSync(file, 'utf8').match(/^\/\/ @example (.*)$/m)?.[1];
      if (t) titles[f.slice(0, -4)] = t;
    }
    return `export default ${JSON.stringify(titles)};`;
  },
};

// Two pages: the docs (index.html) and the evidence harness (harness.html) that
// tooling/glass-evidence.mjs and tooling/conformance.mjs drive. Same build, same CSS.
export default defineConfig({
  // index.html paints each scene's average colour on the first frame; the colours come from
  // tooling/optimize-scenes.mjs so they are never typed by hand.
  plugins: [react(), exampleTitles, bookFacts, { name: 'scene-colors', transformIndexHtml: (html: string) => html.replace('__SCENE_COLORS__', readFileSync(resolve(__dirname, 'src/scene-colors.json'), 'utf8').trim()) }],
  build: {
    rollupOptions: { input: { index: resolve(__dirname, 'index.html'), harness: resolve(__dirname, 'harness.html') } },
  },
});
