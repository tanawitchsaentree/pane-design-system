import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Two pages: the docs (index.html) and the evidence harness (harness.html) that
// tooling/glass-evidence.mjs and tooling/conformance.mjs drive. Same build, same CSS.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: { input: { index: resolve(__dirname, 'index.html'), harness: resolve(__dirname, 'harness.html') } },
  },
});
