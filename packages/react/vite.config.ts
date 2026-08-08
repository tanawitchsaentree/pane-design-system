import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Library build config — CSS Modules compiled + emitted as a single stylesheet (dist/style.css),
// components bundled as ESM + CJS. Consumers import '@dial/react/styles.css' once (BLUEPRINT §1).
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@radix-ui/react-slot'],
    },
    sourcemap: true,
    emptyOutDir: false,
  },
});
