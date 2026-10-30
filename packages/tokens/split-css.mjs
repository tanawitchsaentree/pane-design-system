// Splits the generated tokens.css into sheets a product can load separately (R-031):
//   core.css    every non-colour primitive and semantic token (space, size, corner, type, motion, z, glass
//               numbers, widths, layout) with the media blocks they need
//   colour.css  every colour and shadow primitive and semantic token, themes, environments, color-scheme
//   components/<group>.css  one sheet per component token group, every block it appears in
// Each declaration goes to exactly one sheet and keeps its selector, at-rule and order, so the three kinds
// loaded together cascade exactly like tokens.css. Component tokens are re-declared inside the theme and
// environment blocks on purpose (a var() resolves where it is declared), and the split keeps that.
// The parser only has to read what build.mjs writes: rules, at-rules, declarations and comments.
export function parseCss(css) {
  const root = { children: [] }; const stack = [root]; let buf = ''; let i = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '/' && css[i + 1] === '*') { const end = css.indexOf('*/', i + 2); i = end < 0 ? css.length : end + 2; continue; }
    if (c === '{') { const node = { prelude: buf.trim(), children: [] }; stack.at(-1).children.push(node); stack.push(node); buf = ''; }
    else if (c === ';' || c === '}') {
      const text = buf.trim(); buf = '';
      if (text) { const k = text.indexOf(':'); stack.at(-1).children.push({ prop: text.slice(0, k).trim(), value: text.slice(k + 1).trim() }); }
      if (c === '}') stack.pop();
    } else buf += c;
    i++;
  }
  return root;
}

// keep(decl, preludes) → true to keep a declaration; rules left empty are dropped
export function filterCss(tree, keep) {
  const out = (node, preludes, indent) => {
    const kids = node.children.map((n) => ('prop' in n ? (keep(n, preludes) ? `${indent}${n.prop}: ${n.value};` : '') : out(n, [...preludes, n.prelude], `${indent}  `))).filter(Boolean);
    if (!kids.length) return '';
    return node.prelude == null ? kids.join('\n') : `${indent.slice(2)}${node.prelude} {\n${kids.join('\n')}\n${indent.slice(2)}}`;
  };
  return out(tree, [], '');
}

// Which sheet a declaration belongs to. byName maps a token's CSS name to { tier, type, group }.
const COLOUR_TYPES = new Set(['color', 'shadow']);
export function sheetOf(decl, preludes, byName) {
  const t = byName.get(decl.prop);
  if (t?.tier === 'component') return `component:${t.group}`;
  if (t) return COLOUR_TYPES.has(t.type) ? 'colour' : 'core';
  // GridItem spans read the grid component tokens, so they travel with them
  if (preludes.some((p) => p.includes('data-pane-span'))) return 'component:grid';
  if (decl.prop === 'color-scheme') return 'colour';
  return 'core';
}
