// Serves the token stylesheet from the docs site itself, so a plain HTML project can link one URL
// instead of installing a tarball: /pane-tokens.css (latest) and /pane-tokens-<version>.css (pinned).
import { copyFileSync, readFileSync, mkdirSync } from 'node:fs';
const src = new URL('../../../packages/tokens/build/css/tokens.css', import.meta.url);
const { version } = JSON.parse(readFileSync(new URL('../../../packages/tokens/package.json', import.meta.url), 'utf8'));
mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
for (const name of ['pane-tokens.css', `pane-tokens-${version}.css`]) copyFileSync(src, new URL(`../public/${name}`, import.meta.url));
// plain-HTML recipes for components a site without React can still use, on the same tokens
for (const f of ['pane-scale.css']) copyFileSync(new URL(`../recipes/${f}`, import.meta.url), new URL(`../public/${f}`, import.meta.url));
console.log(`✓ public/pane-tokens.css and pane-tokens-${version}.css`);
