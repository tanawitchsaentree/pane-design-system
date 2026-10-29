// The colour page's palette and roles, laid out to be read at a glance: one row per family with every
// step side by side (click a step to copy its variable), and the roles grouped in tabs with the dark and
// light value next to each other. Values come from the built tokens, never typed here.
import { useState } from 'react';
import { Tabs } from 'pane-react';
import { CopyButton, TOKENS, WhyText } from './kit';

const FAMILIES: Array<{ id: string; name: string; use: string; ground?: 'dark' | 'light' }> = [
  { id: 'color.graphite', name: 'Neutral', use: 'Opaque reading surfaces, the reduced-transparency fallback and diagrams.' },
  { id: 'color.paper', name: 'Paper', use: 'The light theme’s page, raised and sunken surfaces.' },
  { id: 'color.ink', name: 'Ink', use: 'Text and the loud solid in the light theme.' },
  { id: 'color.white-a', name: 'White at opacities', use: 'Glass, rims, sheen and text on dark glass.', ground: 'dark' },
  { id: 'color.ink-a', name: 'Ink at opacities', use: 'Rings, dividers and text on light glass.', ground: 'light' },
  { id: 'color.green', name: 'Positive', use: 'Status only: success marks and fills.' },
  { id: 'color.amber', name: 'Warning', use: 'Status only: warning marks and fills.' },
  { id: 'color.red', name: 'Critical', use: 'Status only: error marks and fills.' },
  { id: 'color.blue', name: 'Info', use: 'Status only: the info mark. Pane spends no blue on actions (D-024).' },
];

const step = (key: string) => key.split('.').pop() ?? '';
const order = (a: string, b: string) => (parseFloat(step(a)) || (step(a) === 'solid' ? 999 : 0)) - (parseFloat(step(b)) || (step(b) === 'solid' ? 999 : 0));
export function PaletteGrid() {
  const [copied, setCopied] = useState('');
  const copy = (css: string) => { navigator.clipboard?.writeText(`var(${css})`); setCopied(css); setTimeout(() => setCopied(''), 1200); };
  return (
    <div className="palette">
      {FAMILIES.map((f) => {
        const keys = Object.keys(TOKENS).filter((k) => k.startsWith(`${f.id}.`) && TOKENS[k].tier === 'primitive').sort(order);
        if (!keys.length) return null;
        return (
          <div className="palette-row" key={f.id}>
            <div className="palette-name"><b>{f.name}</b><span className="muted small">{f.use}</span><code className="small">{f.id}</code></div>
            <ul className={`palette-strip${f.ground ? ` on-${f.ground}` : ''}`} style={{ gridTemplateColumns: `repeat(${keys.length}, minmax(0, 1fr))` }}>
              {keys.map((k) => {
                const t = TOKENS[k]; const v = String(t.value);
                return (
                  <li key={k}>
                    <button type="button" className="palette-swatch" onClick={() => copy(t.css)} title={`${k} · ${v}`}>
                      <span className="palette-chip" style={{ backgroundImage: `linear-gradient(var(${t.css}), var(${t.css}))` }} aria-hidden="true" />
                      <span className="palette-step">{copied === t.css ? 'Copied' : step(k)}</span>
                      {keys.length <= 12 && <span className="palette-hex">{v.replace('#', '')}</span>}
                      <span className="visually-hidden">{keys.length > 12 ? ` ${v.replace('#', '')}` : ''}, {k}. Copy its variable</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const GROUPS: Array<[string, string, string]> = [
  ['text', 'Text', 'text.'], ['surface', 'Surfaces', 'surface.'], ['action', 'Actions', 'action.'], ['line', 'Lines', 'line.'], ['status', 'Status', 'status.'],
];
const Chip = ({ v }: { v: string }) => <span className="role-chip"><span className="role-dot" style={{ background: v }} aria-hidden="true" /><code>{v}</code></span>;

export function RoleTabs() {
  return (
    <Tabs.Root defaultValue="text">
      <Tabs.List aria-label="Colour roles">{GROUPS.map(([id, label]) => <Tabs.Trigger key={id} value={id}>{label}</Tabs.Trigger>)}</Tabs.List>
      {GROUPS.map(([id, , prefix]) => {
        const rows = Object.entries(TOKENS).filter(([k, t]) => k.startsWith(prefix) && t.tier === 'semantic' && t.type === 'color');
        return (
          <Tabs.Content key={id} value={id}>
            <div className="table-wrap">
              <table className="roles">
                <thead><tr><th scope="col">Role</th><th scope="col">Dark</th><th scope="col">Light</th><th scope="col">Why</th></tr></thead>
                <tbody>
                  {rows.map(([k, t], i) => {
                    // a reason shared by a run of roles is written once, spanning them
                    const same = (j: number) => JSON.stringify(rows[j]?.[1].why) === JSON.stringify(t.why);
                    const first = i === 0 || !same(i - 1);
                    let span = 1; while (first && i + span < rows.length && same(i + span)) span++;
                    return (
                      <tr key={k}>
                        <th scope="row"><code>{k}</code></th>
                        <td><Chip v={String(t.value)} /></td>
                        <td><Chip v={String(t.themes?.light?.value ?? t.value)} /></td>
                        {first && <td data-why="" rowSpan={span}><WhyText w={t.why} /></td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}

// The token reference: one collapsible group per top-level name, one line per token. A search or a tier
// opens every group that matches, so a reader finds a token without scrolling past six hundred others.
export function TokenBrowser({ tier, query = '' }: { tier?: string; query?: string }) {
  const q = query.toLowerCase();
  const rows = Object.entries(TOKENS).filter(([p, t]) => (!tier || t.tier === tier) && (!q || p.includes(q) || t.css.includes(q) || String(t.value).toLowerCase().includes(q) || (t.ref ?? '').includes(q)));
  const groups = new Map<string, typeof rows>();
  for (const r of rows) { const g = r[0].split('.')[0]; groups.set(g, [...(groups.get(g) ?? []), r]); }
  return (
    <div className="token-browser">
      <p className="muted small">{rows.length} tokens in {groups.size} groups. Read from <code>pane-tokens/json</code>.</p>
      {[...groups].map(([g, list]) => (
        <details key={g} className="token-group" open={Boolean(q) || groups.size === 1}>
          <summary><b>{g}</b><span className="muted small">{list.length} · {[...new Set(list.map(([, t]) => t.tier))].join(', ')}</span></summary>
          <div className="table-wrap">
            <table className="tokens compact">
              <thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Points at</th><th scope="col">Why</th><th scope="col"><span className="visually-hidden">Copy</span></th></tr></thead>
              <tbody>
                {list.map(([p, t]) => (
                  <tr key={p}>
                    <th scope="row"><code>{t.css}</code></th>
                    <td>{t.type === 'color' && <span className="swatch-dot" style={{ background: `var(${t.css})` }} aria-hidden="true" />}<code>{String(t.value)}</code></td>
                    <td>{t.ref ? <code>{t.ref}</code> : <span className="muted">value</span>}</td>
                    <td data-why="" className="why-line"><WhyText w={t.why} /></td>
                    <td><CopyButton text={`var(${t.css})`} label={`Copy var(${t.css})`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </div>
  );
}
