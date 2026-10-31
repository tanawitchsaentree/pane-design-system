// Builds pane-knowledge.json: everything an agent needs to use Pane without reading the source. For each
// component the import, a one-line concept (from its .why.json), every prop with type, default and
// description (from the generated meta), and its component tokens; plus every token with its CSS name
// and value. Feeds pane-mcp (the MCP server in pane-react/bin) and llms.txt (the docs build).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const meta = JSON.parse(readFileSync(path.join(root, 'apps/docs/src/book/meta.json'), 'utf8'));
const tokens = JSON.parse(readFileSync(path.join(root, 'packages/tokens/build/json/tokens.json'), 'utf8'));
const routes = JSON.parse(readFileSync(path.join(root, 'apps/docs/src/book/routes.json'), 'utf8'));
const slugOf = Object.fromEntries(routes.parts.find((p) => p.title === 'Components').pages.map((p) => [p.title, p.path.replace('/components/', '')]));
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const SITE = 'https://pane-design-system.pages.dev';
const components = Object.entries(meta.components).map(([name, m]) => {
  const why = path.join(root, 'packages/react/src/components', name, `${name}.why.json`);
  const concept = existsSync(why) ? JSON.parse(readFileSync(why, 'utf8')).concept ?? '' : '';
  const slug = slugOf[name];
  return {
    name, concept, import: `import { ${m.exports.map((e) => e.displayName).join(', ')} } from 'pane-react';`,
    docs: slug ? `${SITE}/components/${slug}/usage` : null, api: slug ? `${SITE}/api/${slug}` : null,
    exports: m.exports.map((e) => ({ name: e.displayName, props: e.props.map((p) => ({ name: p.name, type: p.type, required: p.required, default: p.default ?? null, description: p.description })) })),
    tokens: Object.entries(tokens).filter(([k, t]) => t.tier === 'component' && k.startsWith(`${kebab(name)}.`)).map(([k, t]) => ({ name: k, css: t.css, value: t.value })),
  };
});
const out = { version: meta.version, site: SITE, install: 'Pane is not on npm. Install the release tarball: npm install /path/to/pilot-glass/release/pane-react-<version>.tgz, then import \'pane-react/tokens.css\'. Plain HTML: <link rel="stylesheet" href="' + SITE + '/pane-tokens-<version>.css">.', components,
  tokens: Object.entries(tokens).map(([k, t]) => ({ name: k, tier: t.tier, type: t.type, css: t.css, value: t.value, light: t.themes?.light?.value ?? null })) };
const dest = path.join(root, 'packages/react/dist/mcp'); mkdirSync(dest, { recursive: true });
// how a product sets its look (M1): the four choices in order, read by choose_appearance and the skill
const brandsFile = path.join(root, 'packages', 'tokens', 'build', 'css', 'brands', 'brands.json');
out.appearance = {
  order: ['material', 'theme', 'brand', 'environment'],
  materials: [
    { id: 'glass', default: true, what: 'Translucent panes over a blurred, dimmed scene. The same lit, carved shapes as solid.', when: 'A product with a scene worth seeing (a photo, a wallpaper, a place) or a brand that asks for depth over a picture.', code: '<Environment material="glass" brightness="bright">…</Environment>' },
    { id: 'solid', what: 'The same lit, carved shapes, opaque. Nothing shows through and no backdrop filter runs.', when: 'A live backdrop (video, map, 3D), a reading- or data-heavy tool, a business app with no scene, or low-power devices. Reduced transparency falls back to it by itself.', code: '<Environment material="solid">…</Environment>' },
  ],
  rules: ['Set the material once, on the Environment at the root of a screen.', 'Never put glass and solid panes side by side on one screen.', 'An overlay takes the material of the screen it opens over.', 'Change material only for a whole region that is a different place, such as a full-screen video player.'],
  themes: { values: ['dark', 'light'], how: 'data-theme on <html> or any region; leave it out to follow the system.' },
  brands: { list: existsSync(brandsFile) ? JSON.parse(readFileSync(brandsFile, 'utf8')).map((b) => ({ id: b.id, name: b.name, description: b.description })) : [], how: "@import 'pane-react/tokens/brands/<id>.css' and data-brand=\"<id>\"; check your own with npx pane-theme check brand.json." },
  environments: { values: ['dim', 'mid', 'bright'], how: 'Environment brightness, sized for the brightest spot a pane can land on; solid ignores it.' },
  docs: `${SITE}/getting-started/look`,
};
writeFileSync(path.join(dest, 'pane-knowledge.json'), JSON.stringify(out));
console.log(`✓ pane-knowledge: ${components.length} components, ${out.tokens.length} tokens`);
