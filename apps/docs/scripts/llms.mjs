// llms.txt (the index an AI reads first) and llms-full.txt (every component's import, props and tokens in
// one file), from the same pane-knowledge.json that pane-mcp serves, so the two never disagree.
import { readFileSync, writeFileSync } from 'node:fs';
const K = JSON.parse(readFileSync(new URL('../../../packages/react/dist/mcp/pane-knowledge.json', import.meta.url), 'utf8'));
const routes = JSON.parse(readFileSync(new URL('../src/book/routes.json', import.meta.url), 'utf8'));
const dist = new URL('../dist/', import.meta.url);
const idx = [`# Pane ${K.version}`, '', `> A glass design system for React: ${K.components.length} components, tokens in three tiers, English and Thai, light and dark, installable docs. Install from the release tarball, not npm.`, '', K.install, '',
  ...routes.parts.filter((p) => p.title !== 'Component API').flatMap((p) => [`## ${p.title}`, '', ...p.pages.map((pg) => `- [${pg.title}](${K.site}${pg.path})`), '']),
  '## Optional', '', `- [Every component's props and tokens in one file](${K.site}/llms-full.txt)`, `- MCP server: \`claude mcp add pane -- npx pane-mcp\` (tools: list_components, search_components, get_component, search_tokens, how_to_install)`, ''];
writeFileSync(new URL('llms.txt', dist), idx.join('\n'));
const full = [`# Pane ${K.version}, full reference`, '', K.install, ''];
for (const c of K.components) {
  full.push(`## ${c.name}`, '', c.concept, '', '```tsx', c.import, '```', '');
  for (const e of c.exports) { if (!e.props.length) continue; full.push(`### ${e.name} props`, '', '| Prop | Type | Default | Description |', '|---|---|---|---|', ...e.props.map((p) => `| ${p.name}${p.required ? '' : '?'} | \`${String(p.type).replace(/\|/g, '\\|')}\` | ${p.default ?? ''} | ${String(p.description ?? '').replace(/\n/g, ' ').replace(/\|/g, '\\|')} |`), ''); }
  if (c.tokens.length) full.push(`Tokens: ${c.tokens.map((t) => `\`${t.css}\``).join(', ')}`, '');
  if (c.docs) full.push(`Docs: ${c.docs}`, '');
}
writeFileSync(new URL('llms-full.txt', dist), full.join('\n'));
console.log(`✓ llms.txt and llms-full.txt (${K.components.length} components)`);
