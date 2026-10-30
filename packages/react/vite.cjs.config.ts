import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// The CommonJS build for require(): one file, no CSS (load pane-react/all.css or styles.css yourself).
export default defineConfig({
  plugins: [react()],
  css: { modules: { generateScopedName: 'pane-[name]__[local]' } },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['cjs'], fileName: () => 'index.cjs' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', /^@radix-ui\//], output: { assetFileNames: 'cjs-unused[extname]' } },
  },
});
