import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, relative, dirname } from 'node:path';
import { readdirSync, existsSync, readFileSync } from 'node:fs';

// Library build, tree-shakable (R-024): ESM keeps one file per source module, so importing Button pulls
// in Button and what it imports, nothing else; each module imports its own CSS, so a bundler ships only
// the styles of the components used. CJS stays one file for require(). styles.css still holds every
// component's styles for a plain <link>, and all.css (tooling/bundle-tokens.mjs) adds the tokens.
// Component tokens travel the same way (R-031): a module whose CSS or code reads var(--ds-<group>-…) also
// imports css/tokens/<group>.css, so a product loading pane-react/tokens/core.css + colour.css pays only for
// the component tokens of what it imports. pane-react/tokens.css still holds them all.
const TOKENS = resolve(__dirname, '../tokens/build');
const componentGroups = () => {
  const byName = new Map(Object.entries(JSON.parse(readFileSync(resolve(TOKENS, 'css/components/groups.json'), 'utf8'))) as [string, string][]);
  const allNames = new Set(Object.values(JSON.parse(readFileSync(resolve(TOKENS, 'json/tokens.json'), 'utf8')) as { css: string }[]).map((t) => t.css));
  const groups = [...new Set(byName.values())].sort((a, b) => b.length - a.length);
  // exact names first; a name built at run time (`--ds-viz-series-${i}`) matches its group by prefix
  return (text: string) => {
    const found = new Set<string>();
    for (const [name] of text.matchAll(/--ds-[a-z0-9-]+/g)) {
      const g = byName.get(name) ?? (allNames.has(name) ? undefined : groups.find((x) => name.startsWith(`--ds-${x}-`)));
      if (g) found.add(g);
    }
    return [...found].sort();
  };
};
const injectCss = (): Plugin => ({
  name: 'pane-inject-css',
  apply: 'build',
  enforce: 'post',
  generateBundle(options, bundle) {
    if (options.format !== 'es') return;
    const all: string[] = [];
    const sources = new Map<string, string>();
    for (const f of Object.values(bundle)) if (f.type === 'asset' && f.fileName.endsWith('.css')) { all.push(String(f.source)); sources.set(f.fileName, String(f.source)); }
    const groupsIn = componentGroups(); const emitted = new Set<string>();
    for (const chunk of Object.values(bundle)) {
      if (chunk.type !== 'chunk') continue;
      const own = [...((chunk as unknown as { viteMetadata?: { importedCss: Set<string> } }).viteMetadata?.importedCss ?? [])];
      const groups = groupsIn([chunk.code, ...own.map((c) => sources.get(c) ?? '')].join('\n'));
      for (const g of groups) if (!emitted.has(g)) { emitted.add(g); this.emitFile({ type: 'asset', fileName: `css/tokens/${g}.css`, source: readFileSync(resolve(TOKENS, `css/components/${g}.css`), 'utf8') }); }
      const css = [...groups.map((g) => `css/tokens/${g}.css`), ...own];
      if (!css.length) continue;
      const lines = css.map((c) => { let r = relative(dirname(chunk.fileName), c); if (!r.startsWith('.')) r = `./${r}`; return `import '${r}';`; }).join('\n');
      chunk.code = `${lines}\n${chunk.code}`;
    }
    this.emitFile({ type: 'asset', fileName: 'styles.css', source: all.join('\n') });
  },
});

// PANE_NODE=1 builds the same modules for Node (SSR, tests) into dist/node without CSS imports, since Node
// cannot import a stylesheet; the package's "node" export condition points there
const NODE = process.env.PANE_NODE === '1';

export default defineConfig({
  plugins: NODE ? [react()] : [react(), injectCss()],
  css: { modules: { generateScopedName: 'pane-[name]__[local]' } },
  build: {
    outDir: NODE ? 'dist/node' : 'dist',
    emptyOutDir: !NODE,
    cssCodeSplit: !NODE,
    // every component's index is its own entry, so pane-react/Button resolves to a real file
    lib: { entry: { index: resolve(__dirname, 'src/index.ts'), ...Object.fromEntries(readdirSync(resolve(__dirname, 'src/components')).filter((d) => existsSync(resolve(__dirname, 'src/components', d, 'index.ts'))).map((d) => [`components/${d}/index`, resolve(__dirname, 'src/components', d, 'index.ts')])) }, formats: ['es'] },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', /^@radix-ui\//],
      // CSS files drop ".module" from their names: a consumer's bundler would otherwise treat them as CSS
      // modules again and rename the classes the JS refers to
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js', assetFileNames: (a) => `css/${(a.names?.[0] ?? a.name ?? 'asset').replace(/\.module(?=\.css$)/, '')}` },
    },
  },
});
