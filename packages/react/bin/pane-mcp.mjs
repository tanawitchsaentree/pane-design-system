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
  { name: 'check_usage', description: 'Review a JSX or CSS snippet against the rules Pane enforces (one loud action per pane, no raw colours or pixels, names for icon buttons, the id on FormField, status by glyph and word, no unknown components) and list what to change.', inputSchema: { type: 'object', properties: { code: { type: 'string', description: 'The JSX/TSX or CSS to check.' } }, required: ['code'] } },
  { name: 'choose_appearance', description: 'Pick how a product built with Pane should look: the material (glass or solid), theme, brand and environment, in that order, with the reasons and the code. Describe the product, such as "a clinic dashboard over a live map" or "a photo journal".', inputSchema: { type: 'object', properties: { product: { type: 'string', description: 'What the product is and what sits behind its interface.' } } } },
  { name: 'how_to_install', description: 'How to install Pane in a React project or a plain HTML site.', inputSchema: { type: 'object', properties: {} } },
];
const words = (s) => String(s).toLowerCase().split(/[^a-z0-9ก-๙]+/).filter(Boolean);
// check_usage: fast, rule-shaped checks that need no build; each finding names the rule and the fix
function checkUsage(code) {
  const out = []; const lines = code.split('\n');
  const at = (re) => lines.map((l, i) => (re.test(l) ? i + 1 : 0)).filter(Boolean);
  const say = (ls, msg) => { if (ls.length) out.push(`line ${ls.join(', ')}: ${msg}`); };
  say(at(/#[0-9a-f]{3,8}\b(?![\w-])/i), 'a raw colour; use a token such as var(--ds-text-primary) or a component prop');
  say(at(/(?<![\w-])(?!0px)\d+(\.\d+)?px\b/), 'a raw pixel value; use a spacing, size or radius token');
  say(at(/<IconButton(?![^>]*aria-label)[^>]*>/), 'an IconButton without aria-label has no name a screen reader can say');
  say(at(/<FormField[^>]*>\s*<(Input|Textarea|Select)[^>]*\bid=/), 'the id belongs on FormField; an id on the field inside breaks the label');
  say(at(/style=\{\{[^}]*color\s*:\s*['"]?(red|green|#)/i), 'status by colour alone; use Badge, Banner or HelperText tones, which add a glyph and a word');
  const louds = [...code.matchAll(/<Button\b([^>]*)>/g)].filter((m) => !/variant=/.test(m[1]) || /variant="(light|accent)"/.test(m[1]));
  if (louds.length > 1) out.push(`${louds.length} loud Buttons; a pane has one, so make the others variant="glass" or "ghost"`);
  const known = new Set(K.components.map((c) => c.name));
  const tags = [...new Set([...code.matchAll(/<([A-Z][A-Za-z]+)/g)].map((m) => m[1]))].filter((n) => /pane-react/.test(code) && !known.has(n) && !/^(Fragment|Suspense)$/.test(n) && !K.components.some((c) => c.exports.some((e) => e.name === n)));
  if (tags.length) out.push(`not Pane components: ${tags.join(', ')}; check list_components, or build them from tokens`);
  const mats = [...code.matchAll(/<Environment\b[^>]*material="(glass|solid)"/g)].map((x) => x[1]);
  if (new Set(mats).size > 1) out.push('glass and solid on one screen; pick one material for the whole screen (see choose_appearance)');
  if (/<(Card|Sheet|Dialog|Drawer|Navbar|BottomNav)\b/.test(code) && !/<Environment\b/.test(code)) out.push('panes with no Environment above them; wrap the screen in <Environment material brightness> so the glass knows the scene, or say which file does');
  if (/<p\b|<span\b/.test(code) && !/<(Card|Sheet|Dialog|Popover|Drawer)\b/.test(code)) out.push('text with no pane around it; put content on a Card (or another pane) so it never sits straight on the scene');
  return out.length ? `${out.length} things to change:\n- ${out.join('\n- ')}` : 'No problems found by the quick checks. Run the docs gates for layout and contrast.';
}
// choose_appearance: the four choices in order (M1), each with the reason drawn from the description
function chooseAppearance(text) {
  const A = K.appearance; if (!A) return 'This build carries no appearance guide; see the Materials chapter.';
  const t = text.toLowerCase();
  const live = /video|map|3d|camera|game|stream|live/.test(t), dense = /dashboard|table|admin|crm|report|form|data|ops|operations|back.?office|clinic|ehr/.test(t), scene = /photo|wallpaper|travel|journal|gallery|music|weather|place|spatial|vision/.test(t);
  const m = live || (dense && !scene) ? 'solid' : scene ? 'glass' : 'solid';
  const why = live ? 'there is a live backdrop, and blurring a moving picture every frame costs the frame rate' : dense && !scene ? 'the screen is mostly reading or data, where a quiet opaque surface reads best for a long time' : scene ? 'the scene is part of the product, so glass shows it' : 'nothing says there is a scene worth seeing, so solid is the safe default';
  const brand = A.brands.list.find((b) => t.includes(b.id) || t.includes(b.name.toLowerCase()));
  const lines = [
    `1. Material: ${m}, because ${why}. ${A.materials.find((x) => x.id === m).what}`,
    '2. Theme: leave data-theme off to follow the reader\'s system, or set dark or light; both work on either material.',
    `3. Brand: ${brand ? `${brand.name} (${brand.id}). ${brand.description}` : 'Pane, unless the product is white-label; then load a brand sheet. Samples: ' + A.brands.list.map((b) => b.id).join(', ') + '.'} ${A.brands.how}`,
    `4. Environment: ${m === 'glass' ? 'set brightness for the brightest spot a pane can land on (bright when unsure)' : 'solid ignores brightness, so leave it at bright'}.`,
    '', 'Rules: ' + A.rules.join(' '), '',
    'Code:', `<Environment material="${m}" brightness="bright">`, '  <App />', '</Environment>', brand ? `@import 'pane-react/tokens/brands/${brand.id}.css';  <html data-brand="${brand.id}">` : '', '', `Docs: ${A.docs}`,
  ];
  return lines.filter((l, i, all) => !(l === '' && all[i - 1] === '')).join('\n');
}
function call(name, a = {}) {
  if (name === 'list_components') return K.components.map((c) => `${c.name}: ${c.concept}`).join('\n');
  if (name === 'search_components') { const q = words(a.query); const hits = K.components.map((c) => ({ c, s: q.filter((w) => `${c.name} ${c.concept} ${c.exports.flatMap((e) => e.props.map((p) => p.description)).join(' ')}`.toLowerCase().includes(w)).length })).filter((x) => x.s).sort((x, y) => y.s - x.s).slice(0, 8); return hits.length ? hits.map(({ c }) => `${c.name}: ${c.concept}`).join('\n') : 'No component matches; try list_components.'; }
  if (name === 'get_component') { const c = byName.get(String(a.name).toLowerCase()); if (!c) return `No component named ${a.name}. Use list_components.`; return JSON.stringify(c, null, 2); }
  if (name === 'search_tokens') { const q = String(a.query).toLowerCase(); return JSON.stringify(K.tokens.filter((t) => (!a.tier || t.tier === a.tier) && (t.name.includes(q) || t.css.includes(q) || String(t.value).toLowerCase().includes(q))).slice(0, 60), null, 1); }
  if (name === 'check_usage') return checkUsage(String(a.code ?? ''));
  if (name === 'choose_appearance') return chooseAppearance(String(a.product ?? ''));
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
