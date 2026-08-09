import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deliberately no @dial/react alias to source (unlike apps/storybook's main.ts) — this app is
// meant to exercise the package the way a real external consumer would, resolving through
// node_modules/@dial/react's built dist/, not live TS source. If a real bug only reproduces
// against the built output (not the source), this is where it would surface.
export default defineConfig({
  plugins: [react()],
});
