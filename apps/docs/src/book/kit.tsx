// The book's building blocks. Everything derivable is derived: tokens from pane-tokens/json,
// "tokens used" from each component's real CSS module, evidence and conformance from the JSON the
// verify run writes. Prose is the only hand-written part.
import { useState, type ReactNode } from 'react';
import tokens from 'pane-tokens/json';
import { Button, Card, Environment, Tag, highlight, type CodeLanguage } from 'pane-react';
// the book's code blocks read their language from the label, as the component's language prop would
const langOf = (label: string, code = ''): CodeLanguage => {
  const l = label.toLowerCase();
  if (l === 'css' || l === 'scss') return 'css'; if (l === 'json') return 'json'; if (/terminal|bash|shell|zsh/.test(l)) return 'bash'; if (l === 'html') return 'html';
  // a block labelled only Code is read by its shape: declarations in braces are CSS, a leading { " is JSON
  if (/^\s*[{[]\s*"/.test(code)) return 'json';
  if (/^[^\n]*\{\s*\n\s*[a-z-]+\s*:[^;\n]+;/m.test(code) && !/\b(import|const|function|return)\b/.test(code)) return 'css';
  if (/^\s*(npx|npm|pnpm|git|node|cd)\s/.test(code)) return 'bash';
  return 'tsx';
};
import { SCENES, sceneById } from '../scenes';

export type Why = { p: string | string[]; why: string };
export type Token = { tier: string; type: string; value: string; ref: string | null; css: string; description: string | null; why?: Why | null; themes?: Record<string, { ref: string; value: string }>; breakpoints?: Record<string, { ref: string; value: string }> };
export const TOKENS = tokens as Record<string, Token>;
const BY_CSS = Object.fromEntries(Object.entries(TOKENS).map(([p, t]) => [t.css, p]));

// the shell's light half (contexts, Link, verification types) lives in kit-core, so the shell's first
// chunk does not carry the tokens, CSS sources and concept text this file holds; re-exported here
export { VerifyContext, useVerify, SceneContext, useScene, Link } from './kit-core';
export type { GroupResult, Evidence, Conformance } from './kit-core';
import { useVerify, useScene, useSetScene, Link } from './kit-core';
import { lazyMap } from './lazy';

// ---------- page structure ----------
export function Page({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede: ReactNode; children: ReactNode }) {
  return (
    <article className="book-page">
      <header className="page-head">
        <p className="flush eyebrow">{eyebrow}</p>
        <h1 id="page-title" tabIndex={-1} className="flush page-title">{title}</h1>
        <div className="lede">{lede}</div>
      </header>
      {children}
    </article>
  );
}

export function Section({ id, title, children, wide, fold }: { id: string; title: string; children: ReactNode; wide?: boolean; fold?: boolean }) {
  // fold: a long secondary section starts closed behind its heading, so a page reads in a few screens;
  // the content stays in the page (search, print, and the depth gate all see it) and opens on click or
  // when a link points at it
  if (fold) return (
    <section id={id} className={`book-section folded${wide ? ' wide' : ''}`} aria-labelledby={`${id}-h`}>
      <details className="fold">
        <summary><h2 id={`${id}-h`} className="flush">{title}</h2></summary>
        {/* a details element does not lay its content out as flex, so the rhythm lives on this wrapper */}
        <div className="prose">{children}</div>
      </details>
    </section>
  );
  return (
    <section id={id} className={`book-section${wide ? ' wide' : ''}`} aria-labelledby={`${id}-h`}>
      <div className="prose">
        <h2 id={`${id}-h`} className="flush"><a className="heading-anchor" href={`#${id}`} aria-hidden="true" tabIndex={-1}>#</a>{title}</h2>
        {children}
      </div>
    </section>
  );
}

// a link to a folded section opens it before the browser scrolls to it
if (typeof window !== 'undefined') {
  const openTarget = () => { const el = location.hash ? document.getElementById(location.hash.slice(1)) : null; const d = el?.querySelector(':scope > details.fold'); if (d && !d.hasAttribute('open')) d.setAttribute('open', ''); };
  window.addEventListener('hashchange', openTarget);
  document.addEventListener('click', (e) => { const a = (e.target as Element)?.closest?.('a[href^="#"]'); if (a) setTimeout(openTarget, 0); });
}

export function Callout({ tone = 'note', title, children }: { tone?: 'note' | 'rule' | 'caution'; title: string; children: ReactNode }) {
  const label = { note: 'Note', rule: 'Rule', caution: 'Caution' }[tone];
  return (
    <aside className={`callout callout-${tone}`} aria-label={`${label}: ${title}`}>
      <p className="flush callout-title"><span className="callout-kind">{label}</span> {title}</p>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

/** A code block with its copy button always visible (USER-STANDARDS #7, G-C1). Long blocks show the
 *  first lines with "Show all"; Copy always copies the whole block. */
export function CodeBlock({ code, label = 'Code', lines = 14 }: { code: string; label?: string; lines?: number }) {
  const body = code.trim();
  const long = body.split('\n').length > lines;
  const [open, setOpen] = useState(!long);
  const [copied, setCopied] = useState(false);
  const shown = open ? body : body.split('\n').slice(0, lines).join('\n');
  return (
    <div className="codeblock" data-codeblock="">
      <div className="codeblock-bar">
        <span className="codeblock-label">{label}</span>
        <span className="codeblock-actions">
          {long && <button type="button" className="copy-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Show less' : `Show all ${body.split('\n').length} lines`}</button>}
          <button type="button" className="copy-btn" data-copy="" onClick={() => { navigator.clipboard?.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 1600); }}>{copied ? 'Copied' : 'Copy'}</button>
        </span>
      </div>
      <pre className={open ? 'code' : 'code clipped'} data-clipped={open ? undefined : ''} tabIndex={0} aria-label={`${label} snippet`}><code>{highlight(shown, langOf(label, body)).map((r, k) => (r.role ? <span key={k} data-syntax={r.role}>{r.text}</span> : r.text))}</code></pre>
    </div>
  );
}

/** The demo backdrop, picked where the examples are (R-038): one round swatch per scene. The choice is the
 *  book's, so every example follows it, and it sits beside the example the reader is looking at. */
export function BackdropPicker({ className = '' }: { className?: string }) {
  const scene = useScene(); const set = useSetScene();
  return (
    <div className={`bd-picker ${className}`} role="radiogroup" aria-label="Demo backdrop" data-scene-control="" data-component="BackdropPicker">
      {SCENES.map((s) => (
        <button key={s.id} type="button" role="radio" aria-checked={s.id === scene} aria-label={s.label} title={s.label}
          className={`bd-swatch bd-${s.id}`} data-value={s.id} onClick={() => set(s.id)} />
      ))}
    </div>
  );
}

/** A demo stage: the one place glass appears in the docs. The current demo backdrop sits behind it,
 *  so a component is always seen the way it will be used, over a scene. */
export function Stage({ children, plain, className = '', backdrop, picker }: { children: ReactNode; plain?: boolean; className?: string; backdrop?: 'scene' | 'field'; picker?: boolean }) {
  const chosen = useScene();
  // diagrams pass backdrop="field": the subject is structure, so a photo would only compete with it
  const field = backdrop === 'field' || (backdrop !== 'scene' && chosen === 'field');
  // the studio is drawn in CSS, not a photo; a diagram that asks for a scene still gets one (D-036: no mesh backdrop)
  const drawn = !field && chosen === 'studio' && backdrop !== 'scene';
  const studio = drawn && chosen === 'studio';
  const scene = field ? 'field' : drawn ? chosen : chosen === 'studio' ? 'room' : chosen;
  return (
    <div className={`example-live${plain ? ' plain' : ''}${field ? ' stage-field' : ''}${studio ? ' stage-studio' : ''} ${className}`} data-example-live="" data-surface="" style={field || drawn ? undefined : { backgroundImage: `url(/scenes/${scene}.webp)` }}>
      <Environment brightness={sceneById(scene).brightness} className="stage-env">{children}</Environment>
      {/* the backdrop is picked on the picture itself, where the component is shown (R-042) */}
      {picker && <BackdropPicker className="stage-backdrop" />}
    </div>
  );
}

export type DemoMaterial = 'glass' | 'liquid' | 'solid';
const MATERIAL_NOTE: Record<DemoMaterial, string> = { glass: 'Blurs and dims the scene', liquid: 'Bends the scene at the rim', solid: 'Opaque, no backdrop work' };
/** One scene, the same render on each material side by side (the demo stage, picked B on 2026-11-02): the
 *  difference between the materials is the lesson. Columns wrap to rows when the stage is too narrow (docs.css). */
export function MaterialStage({ render, chosen, onChoose }: { render: (m: DemoMaterial) => ReactNode; chosen: DemoMaterial; onChoose: (m: DemoMaterial) => void }) {
  const chosenScene = useScene();
  const scene = chosenScene === 'studio' || chosenScene === 'field' ? 'room' : chosenScene;
  return (
    <div className="example-live material-stage" data-example-live="" data-material-compare="" data-surface="" style={{ backgroundImage: `url(/scenes/${scene}.webp)` }}>
      <div className="material-grid-live" role="group" aria-label="The same component on each material">
        {(['glass', 'liquid', 'solid'] as const).map((m) => (
          <Environment key={m} material={m} brightness={sceneById(scene).brightness} className="material-cell">
            <div className="material-cell-body">{render(m)}</div>
            <div className="material-cell-caption">
              <button type="button" className="material-cell-pick" aria-pressed={m === chosen} onClick={() => onChoose(m)}>{m[0].toUpperCase() + m.slice(1)}</button>
              <p className="material-cell-note flush">{MATERIAL_NOTE[m]}</p>
            </div>
          </Environment>
        ))}
      </div>
      <BackdropPicker className="stage-backdrop" />
    </div>
  );
}

/** Live example + the exact source file that renders it (imported with ?raw), code visible by default. */
// the line "Edit in chat" copies: the example and the rules an agent needs to change it without breaking it
const chatPrompt = (title: string, body: string) => `Using Pane (pane-react), change this example from the Pane book ("${title}", ${location.href}) for my project. Keep Pane's components and tokens, never hard-code a colour, size or duration, and keep text inside the glass at 4.5:1. Ask me what to change if I have not said.

\`\`\`tsx
${body}
\`\`\``;

const I = {
  spark: <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5 11.6 8.4 17.5 10l-5.9 1.6L10 17.5l-1.6-5.9L2.5 10l5.9-1.6Z" fill="currentColor" /></svg>,
  copy: <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="6.5" y="6.5" width="10" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M4 13V4.5A1.5 1.5 0 0 1 5.5 3H13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
  reset: <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.8-4.1M4.5 3.5v3.6h3.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  theme: <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10 3.5a6.5 6.5 0 0 1 0 13Z" fill="currentColor" /></svg>,
};

/** A live demo with its toolbar (R-047, after MUI): Edit in chat, Show code, Copy, Reset and a light/dark
 *  switch for this demo alone. The code is open by default; the toolbar only hides or copies it. */
export function Example({ title, code, children, plain, backdrop }: { title: string; code: string; children: ReactNode; plain?: boolean; backdrop?: 'scene' | 'field' }) {
  const body = code.replace(/^\/\/ @example.*\n/m, '').trim();
  const [open, setOpen] = useState(true);
  const [run, setRun] = useState(0);
  const [theme, setTheme] = useState<'page' | 'light' | 'dark'>('page');
  const [said, setSaid] = useState('');
  const flash = (t: string) => { setSaid(t); setTimeout(() => setSaid(''), 1800); };
  const copy = async (text: string, done: string) => { try { await navigator.clipboard.writeText(text); flash(done); } catch { flash('Copying was blocked'); } };
  const flip = () => setTheme((t) => (t === 'page' ? (document.documentElement.dataset.theme === 'light' ? 'dark' : 'light') : t === 'light' ? 'dark' : 'light'));
  return (
    <figure className="example" data-example="">
      {/* the caption sits in the stage's top-left corner, like a label on a studio plate */}
      <div className="example-plate" data-theme={theme === 'page' ? undefined : theme}>
        <figcaption className="example-bar"><span className="example-title">{title}</span></figcaption>
        <Stage plain={plain} backdrop={backdrop} picker={!plain}><div key={run} className="example-run">{children}</div></Stage>
      </div>
      <div className="example-tools" role="toolbar" aria-label={`${title}: tools`}>
        <button type="button" className="example-tool example-chat" onClick={() => copy(chatPrompt(title, body), 'Copied for your agent')}>{I.spark}<span>Edit in chat</span></button>
        <span className="example-said" aria-live="polite">{said}</span>
        <button type="button" className="example-tool example-show" aria-expanded={open} onClick={() => setOpen((o) => !o)}><span>{open ? 'Hide code' : 'Show code'}</span></button>
        <button type="button" className="example-tool" aria-label="Copy the code" title="Copy the code" onClick={() => copy(body, 'Code copied')}>{I.copy}</button>
        <button type="button" className="example-tool" aria-label="Reset the demo" title="Reset the demo" onClick={() => { setRun((n) => n + 1); flash('Demo reset'); }}>{I.reset}</button>
        <button type="button" className="example-tool" aria-label={`Show this demo in ${theme === 'light' ? 'dark' : 'light'}`} title="Light or dark, for this demo only" aria-pressed={theme !== 'page'} onClick={flip}>{I.theme}</button>
      </div>
      {open && <CodeBlock code={body} label="TSX" />}
    </figure>
  );
}

export function Code({ children, label }: { children: string; label?: string }) {
  return <CodeBlock code={children} label={label} />;
}

// ---------- tables ----------
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="copy-btn" aria-label={label} onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1400); }}>
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}
export interface PropDoc { name: string; type: string; default?: string; description: string }
export function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead>
        <tbody>{props.map((p) => <tr key={p.name}><th scope="row"><code>{p.name}</code></th><td><code>{p.type}</code></td><td>{p.default ? <code>{p.default}</code> : '—'}</td><td>{p.description}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function KeyboardTable({ keys }: { keys: Array<[string, string]> }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th scope="col">Key</th><th scope="col">Does</th></tr></thead>
        <tbody>{keys.map(([k, a]) => <tr key={k}><th scope="row"><kbd>{k}</kbd></th><td>{a}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function DoDont({ items }: { items: Array<{ do: string; dont: string }> }) {
  return (
    <div className="dodont">
      {items.map((it, i) => (
        <div key={i} className="dodont-row">
          <div className="dodont-cell"><p className="flush dodont-kind">Do</p><p className="flush">{it.do}</p></div>
          <div className="dodont-cell"><p className="flush dodont-kind">Don’t</p><p className="flush">{it.dont}</p></div>
        </div>
      ))}
    </div>
  );
}

export function TokenTable({ prefix, tier, query = '' }: { prefix?: string; tier?: string; query?: string }) {
  const q = query.toLowerCase();
  const rows = Object.entries(TOKENS).filter(([p, t]) => (!prefix || p.startsWith(prefix)) && (!tier || t.tier === tier) && (!q || p.includes(q) || t.css.includes(q) || String(t.value).toLowerCase().includes(q)));
  return (
    <div className="table-wrap">
      <table>
        <caption>{rows.length} token{rows.length === 1 ? '' : 's'}. Read from <code>pane-tokens/json</code></caption>
        <thead><tr><th scope="col">Token</th><th scope="col">Tier</th><th scope="col">Points at</th><th scope="col">Resolved value</th><th scope="col">Why</th><th scope="col"><span className="visually-hidden">Copy</span></th></tr></thead>
        <tbody>
          {rows.map(([p, t]) => (
            <tr key={p}>
              <th scope="row"><code>{t.css}</code></th>
              <td>{t.tier}</td>
              <td>{t.ref ? <code>{t.ref}</code> : '—'}</td>
              <td>{t.type === 'color' && <span className="swatch-dot" style={{ background: `var(${t.css})` }} aria-hidden="true" />}<code>{String(t.value)}</code></td>
              <td data-why=""><WhyText w={t.why} /></td>
              <td><CopyButton text={`var(${t.css})`} label={`Copy var(${t.css})`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- reasons (kiln.why → system/CONCEPT.md principles) ----------
import conceptMd from '../../../../system/CONCEPT.md?raw';
export const PRINCIPLES: Array<{ id: string; name: string; claim: string; therefore: Array<[string, string]> }> = [...conceptMd.matchAll(/^### (P\d+)\s+(.+)\n([\s\S]*?)(?=^### P\d+|(?![\s\S]))/gm)].map((m) => {
  const [claim, rest = ''] = m[3].split(/\*\*Therefore\*\*/);
  const therefore = [...rest.matchAll(/(space|shape|depth|colour|type|motion|interaction): ([^]*?)(?= (?:space|shape|depth|colour|type|motion|interaction): |$)/g)].map((x) => [x[1], x[2].trim()] as [string, string]);
  return { id: m[1], name: m[2].trim(), claim: claim.trim(), therefore };
});
export const CONCEPT_INTRO = conceptMd.split(/^## Principles/m)[0].replace(/^#.*$/m, '').trim();
const principleName = (id: string) => PRINCIPLES.find((p) => p.id === id)?.name ?? id;
export function WhyText({ w }: { w?: Why | null }) {
  if (!w) return <span className="fail">No reason</span>;
  return <span className="why">{[].concat(w.p as never).map((p: string) => <Link key={p} to={`/principles#${p.toLowerCase()}`} className="why-chip" title={principleName(p)}>{p}</Link>)} {w.why}</span>;
}

// Every component's CSS module, as text. The "tokens used" list is parsed from what the component
// actually references, so it cannot drift from the code.
// each component's CSS text is loaded by its style route (cssModuleKey + CSS_MODULES.load)
export const CSS_MODULES = lazyMap(import.meta.glob<string>('../../../../packages/react/src/components/*/*.module.css', { query: '?raw', import: 'default' }));
export const cssModuleKey = (component: string) => `../../../../packages/react/src/components/${component}/${component}.module.css`;
export function TokensUsed({ component }: { component: string }) {
  const src = CSS_MODULES.read(cssModuleKey(component)) ?? '';
  const names = [...new Set([...src.matchAll(/var\((--ds-[a-z0-9-]+)/g)].map((m) => m[1]))].sort();
  // which CSS property each custom property drives, read from the declarations that use it
  const drives = (n: string) => [...new Set([...src.matchAll(/([a-z-]+)\s*:[^;{}]*?var\((--ds-[a-z0-9-]+)/g)].filter((m) => src.slice(m.index, src.indexOf(';', m.index)).includes(n)).map((m) => m[1]))].join(', ');
  if (!names.length) return <p className="muted">No CSS module found for {component}.</p>;
  return (
    <div className="table-wrap">
      <table>
        <caption>{names.length} tokens referenced by <code>{component}.module.css</code></caption>
        <thead><tr><th scope="col">Custom property</th><th scope="col">Drives</th><th scope="col">Points at</th><th scope="col">Default</th></tr></thead>
        <tbody>
          {names.map((n) => {
            const t = TOKENS[BY_CSS[n]];
            return <tr key={n}><th scope="row"><code>{n}</code></th><td>{drives(n) || '—'}</td><td>{t?.ref ? <code>{t.ref}</code> : '—'}</td><td><code>{t ? String(t.value) : 'not a token'}</code></td></tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------- verification panels ----------
export function EvidenceTable({ groups }: { groups: string[] }) {
  const { evidence } = useVerify();
  if (!evidence) return <p className="muted">UNVERIFIED. Evidence.json not found. Run <code>pnpm run verify</code>.</p>;
  return (
    <div className="table-wrap">
      <table>
        <caption>Worst-pixel text contrast under the glass in {evidence.browser}. Normal text needs {evidence.threshold} to 1 and large text needs 3 to 1.</caption>
        <thead><tr><th scope="col">Group · scene</th>{evidence.modes.map((m) => <th scope="col" key={m}>{m}</th>)}</tr></thead>
        <tbody>
          {groups.flatMap((g) => (evidence.themes ?? ['dark']).flatMap((th) => SCENES.map((s) => ({ th, s }))).map(({ th, s }) => (
            <tr key={`${g}/${th}/${s.id}`}>
              <th scope="row">{g} · {th} · {s.label}</th>
              {evidence.modes.map((m) => {
                const r = evidence.harness[m]?.[`${th}/${s.id}`]?.[g] ?? evidence.harness[m]?.[s.id]?.[g];
                if (!r) return <td key={m}>—</td>;
                const floor = evidence.exceptionFloor ?? 0;
                const state = r.failures === 0 ? 'PASS' : r.worst != null && r.worst >= floor && g !== 'media' ? 'E-001' : g === 'media' ? 'FAIL (image)' : 'FAIL';
                return <td key={m}><span className={state === 'PASS' ? 'pass' : 'fail'}>{state}</span> {r.worst != null ? `${r.worst.toFixed(2)}:1` : ''}{r.failures ? ` · ${r.failures}/${r.texts}` : ''}</td>;
              })}
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  );
}

export function ConformanceList({ component }: { component: string }) {
  const { conformance } = useVerify();
  const checks = conformance?.checks.filter((c) => c.component === component);
  if (!checks) return <p className="muted">UNVERIFIED. Conformance.json not found.</p>;
  return (
    <ul className="checks flush">
      {checks.map((c) => <li key={c.name}><span className={c.ok ? 'pass' : 'fail'}>{c.ok ? 'PASS' : 'FAIL'}</span> {c.name}{c.detail ? <span className="muted">. {c.detail}</span> : null}</li>)}
    </ul>
  );
}

// ---------- minimal markdown (for DECISIONS.md / EXCEPTIONS.md, rendered as-is) ----------
export const inline = (s: string) => s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
  part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part);
export function Markdown({ source, skipUntil }: { source: string; skipUntil?: RegExp }) {
  let lines = source.split('\n');
  if (skipUntil) { const i = lines.findIndex((l) => skipUntil.test(l)); if (i > 0) lines = lines.slice(i); }
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) { out.push(<ul key={out.length} className="flush">{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>); list = []; } };
  let fields: Array<[string, string]> = [];
  const flushFields = () => { if (fields.length) { out.push(<dl key={out.length} className="record">{fields.map(([k, v], i) => <div key={i} className="record-row"><dt>{inline(k)}</dt><dd>{inline(v)}</dd></div>)}</dl>); fields = []; } };
  for (const l of lines) {
    // a record field ("- **Where:** value") is a label/value pair, rendered as one
    const field = l.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
    if (field && !l.slice(field[0].indexOf('**', 4) + 2).includes('**')) { flush(); fields.push([field[1], field[2]]); continue; }
    flushFields();
    if (/^- /.test(l)) { list.push(l.slice(2)); continue; }
    flush();
    if (/^### /.test(l)) out.push(<h3 key={out.length} className="md-h3">{inline(l.slice(4))}</h3>);
    else if (/^## /.test(l)) out.push(<h3 key={out.length} className="md-h3">{inline(l.slice(3))}</h3>);
    else if (/^# /.test(l) || /^---\s*$/.test(l) || !l.trim()) continue;
    else if (/^> /.test(l)) out.push(<p key={out.length} className="muted">{inline(l.slice(2))}</p>);
    else out.push(<p key={out.length}>{inline(l)}</p>);
  }
  flush();
  flushFields();
  return <div className="markdown">{out}</div>;
}
