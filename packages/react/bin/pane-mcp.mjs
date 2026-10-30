#!/usr/bin/env node
// pane-mcp: a Model Context Protocol server (stdio) that lets an agent in another project look Pane up
// instead of guessing: list and search components, read a component's import, props, tokens and docs
// link, and search the tokens. No dependencies; it reads dist/mcp/pane-knowledge.json from this package.
// Add it to an agent:  claude mcp add pane -- npx pane-mcp     (or "command": "npx", "args": ["pane-mcp"])
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
const K = JSON.parse(readFileSync(new URL('../dist/mcp/pane-knowledge.json', import.meta.url), 'utf8'));
const byName = new Map(K.components.map((c) => [c.name.toLowerCase(), c]));
const TOOLS = [
  { name: 'list_components', description: 'Every Pane component with its one-line concept.', inputSchema: { type: 'object', properties: {} } },
  { name: 'search_components', description: 'Find Pane components by a need, such as "date range", "upload", "chart over time".', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'get_component', description: 'One component: import line, every prop (type, default, description), its theme tokens, and links to its docs and API page.', inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } },
  { name: 'search_tokens', description: 'Find design tokens by name or value, such as "gap", "critical", "radius"; returns CSS custom properties with dark and light values.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, tier: { type: 'string', enum: ['primitive', 'semantic', 'component'] } }, required: ['query'] } },
  { name: 'how_to_install', description: 'How to install Pane in a React project or a plain HTML site.', inputSchema: { type: 'object', properties: {} } },
];
const words = (s) => String(s).toLowerCase().split(/[^a-z0-9ก-๙]+/).filter(Boolean);
function call(name, a = {}) {
  if (name === 'list_components') return K.components.map((c) => `${c.name}: ${c.concept}`).join('\n');
  if (name === 'search_components') { const q = words(a.query); const hits = K.components.map((c) => ({ c, s: q.filter((w) => `${c.name} ${c.concept} ${c.exports.flatMap((e) => e.props.map((p) => p.description)).join(' ')}`.toLowerCase().includes(w)).length })).filter((x) => x.s).sort((x, y) => y.s - x.s).slice(0, 8); return hits.length ? hits.map(({ c }) => `${c.name}: ${c.concept}`).join('\n') : 'No component matches; try list_components.'; }
  if (name === 'get_component') { const c = byName.get(String(a.name).toLowerCase()); if (!c) return `No component named ${a.name}. Use list_components.`; return JSON.stringify(c, null, 2); }
  if (name === 'search_tokens') { const q = String(a.query).toLowerCase(); return JSON.stringify(K.tokens.filter((t) => (!a.tier || t.tier === a.tier) && (t.name.includes(q) || t.css.includes(q) || String(t.value).toLowerCase().includes(q))).slice(0, 60), null, 1); }
  if (name === 'how_to_install') return `${K.install}\nDocs: ${K.site} (version ${K.version}).`;
  throw new Error(`unknown tool ${name}`);
}
const send = (m) => process.stdout.write(JSON.stringify(m) + '\n');
createInterface({ input: process.stdin }).on('line', (line) => {
  let msg; try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;
  if (method === 'initialize') return send({ jsonrpc: '2.0', id, result: { protocolVersion: params?.protocolVersion ?? '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'pane', version: K.version } } });
  if (method === 'notifications/initialized' || id === undefined) return;
  if (method === 'tools/list') return send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
  if (method === 'tools/call') { try { return send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: call(params.name, params.arguments) }] } }); } catch (e) { return send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: String(e.message) }], isError: true } }); } }
  if (method === 'ping') return send({ jsonrpc: '2.0', id, result: {} });
  send({ jsonrpc: '2.0', id, error: { code: -32601, message: `no method ${method}` } });
});
