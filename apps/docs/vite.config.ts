import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

// Two pages: the docs (index.html) and the evidence harness (harness.html) that
// tooling/glass-evidence.mjs and tooling/conformance.mjs drive. Same build, same CSS.
export default defineConfig({
  // index.html paints each scene's average colour on the first frame; the colours come from
  // tooling/optimize-scenes.mjs so they are never typed by hand.
  plugins: [react(), { name: 'scene-colors', transformIndexHtml: (html: string) => html.replace('__SCENE_COLORS__', readFileSync(resolve(__dirname, 'src/scene-colors.json'), 'utf8').trim()) }],
  build: {
    rollupOptions: { input: { index: resolve(__dirname, 'index.html'), harness: resolve(__dirname, 'harness.html') } },
  },
});
