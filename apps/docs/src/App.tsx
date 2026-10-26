import { useEffect, useState } from 'react';
import tokens from 'pane-tokens/json';
import { Badge, Button, Panel } from 'pane-react';
import { COMPONENTS, type ComponentDoc } from './content';
// Counted from the registry itself, never typed: "### E-nnn: … — OPEN" headings in system/EXCEPTIONS.md.
import exceptionsMd from '../../../system/EXCEPTIONS.md?raw';

const OPEN_EXCEPTIONS = (exceptionsMd.match(/^### E-\d{3}:.*— OPEN\s*$/gm) ?? []).length;

type Token = { tier: string; type: string; value: string; ref: string | null; css: string; description: string | null };
const TOKENS = tokens as Record<string, Token>;

interface SceneResult { bare: boolean; pass: boolean; failures: string[]; text: Array<{ label: string; min: number }>; edge: number[]; focus: number[]; thumb: number[] }
interface Evidence {
  generatedAt: string;
  browser: string;
  thresholds: Record<string, number>;
  modes: Record<string, Record<string, SceneResult>>;
  summary: { gatingScenes: number; gatingFailures: number; bareFailures: number };
}
interface Conformance { generatedAt: string; passed: number; total: number; checks: Array<{ component: string; name: string; ok: boolean; detail?: string }> }

const BACKDROPS = ['bauhaus', 'white', 'black', 'midgray', 'stripes', 'gradient'] as const;
const MODES = ['normal', 'reduced-transparency', 'forced-colors'];

function useJson<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    fetch(url).then((r) => (r.ok ? r.json() : null)).then(setData).catch(() => setData(null));
  }, [url]);
  return data;
}

const worstOf = (s: SceneResult) => {
  const all = [...s.text.map((t) => t.min), ...s.edge, ...s.focus, ...s.thumb].filter((n) => n != null);
  return all.length ? Math.min(...s.text.map((t) => t.min)) : null;
};

function EvidenceTable({ doc, evidence }: { doc: ComponentDoc; evidence: Evidence | null }) {
  if (!evidence) return <p className="flush muted">UNVERIFIED — evidence.json not found. Run <code>pnpm run verify</code>.</p>;
  return (
    <div className="table-wrap">
      <table>
        <caption>Worst-pixel text contrast, measured in {evidence.browser}. Text needs ≥ {evidence.thresholds.text}:1.</caption>
        <thead>
          <tr>
            <th scope="col">Scene</th>
            {MODES.map((m) => <th scope="col" key={m}>{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {doc.scenes.flatMap((scene) =>
            BACKDROPS.map((bd) => {
              const id = `${bd}/${scene}`;
              return (
                <tr key={id}>
                  <th scope="row">{id}</th>
                  {MODES.map((m) => {
                    const s = evidence.modes[m]?.[id];
                    if (!s) return <td key={m}>—</td>;
                    const w = worstOf(s);
                    return (
                      <td key={m} title={s.failures.join('\n') || undefined}>
                        <span className={s.pass ? 'pass' : 'fail'}>{s.pass ? 'PASS' : s.bare ? 'FAIL (bare, expected)' : 'FAIL'}</span>{' '}
                        {w != null ? `${w.toFixed(2)}:1` : ''}
                      </td>
                    );
                  })}
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </div>
  );
}

function ComponentSection({ doc, evidence, conformance, backdrop }: { doc: ComponentDoc; evidence: Evidence | null; conformance: Conformance | null; backdrop: string }) {
  const checks = conformance?.checks.filter((c) => c.component === doc.name) ?? null;
  return (
    <section id={doc.name.toLowerCase()} className="component" aria-labelledby={`${doc.name}-h`}>
      <Panel>
        <div className="component-head">
          <h2 id={`${doc.name}-h`} className="flush">{doc.name}</h2>
          {checks && <Badge tone={checks.every((c) => c.ok) ? 'neutral' : 'accent'}>{checks.filter((c) => c.ok).length}/{checks.length} conformance checks</Badge>}
        </div>
        <p className="flush lede">{doc.summary}</p>
      </Panel>

      <div className={`stage bd-${backdrop}`}>
        <span className="stage-label">backdrop: {backdrop}</span>
        {doc.demo()}
      </div>

      <div className="two-up">
        <Panel title="Do" headingLevel={3}><p className="flush">{doc.do}</p></Panel>
        <Panel title="Don’t" headingLevel={3}><p className="flush">{doc.dont}</p></Panel>
      </div>

      <Panel title="Props" headingLevel={3}>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead>
            <tbody>
              {doc.props.map((p) => (
                <tr key={p.name}><th scope="row"><code>{p.name}</code></th><td><code>{p.type}</code></td><td>{p.default ? <code>{p.default}</code> : '—'}</td><td>{p.description}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {doc.keyboard && (
        <Panel title="Keyboard" headingLevel={3}>
          <table>
            <thead><tr><th scope="col">Key</th><th scope="col">Action</th></tr></thead>
            <tbody>{doc.keyboard.map(([k, a]) => <tr key={k}><th scope="row"><kbd>{k}</kbd></th><td>{a}</td></tr>)}</tbody>
          </table>
        </Panel>
      )}

      <Panel title="Accessibility" headingLevel={3}>
        <ul className="flush">{doc.a11y.map((a) => <li key={a}>{a}</li>)}</ul>
        {checks && (
          <>
            <h4 className="flush">Conformance run (real Chromium)</h4>
            <ul className="flush checks">
              {checks.map((c) => <li key={c.name}><span className={c.ok ? 'pass' : 'fail'}>{c.ok ? 'PASS' : 'FAIL'}</span> {c.name}{c.detail ? ` — ${c.detail}` : ''}</li>)}
            </ul>
          </>
        )}
      </Panel>

      <Panel title="Glass evidence" headingLevel={3} description="Every number below is read from rendered pixels, not computed from tokens (D-003).">
        <EvidenceTable doc={doc} evidence={evidence} />
      </Panel>
    </section>
  );
}

function Swatches() {
  const colors = Object.entries(TOKENS).filter(([p, t]) => t.tier === 'primitive' && t.type === 'color');
  const semantic = Object.entries(TOKENS).filter(([, t]) => t.tier === 'semantic' && t.type === 'color');
  return (
    <>
      <ul className="swatches" aria-label="Primitive colours">
        {colors.map(([p, t]) => (
          <li key={p}>
            <span className="chip" style={{ background: `var(${t.css})` }} aria-hidden="true" />
            <code>{p}</code>
            <span className="muted">{t.value}</span>
          </li>
        ))}
      </ul>
      <div className="table-wrap">
        <table>
          <caption>Semantic colour roles → the primitive each one resolves to</caption>
          <thead><tr><th scope="col">Token</th><th scope="col">Points at</th><th scope="col">Value</th></tr></thead>
          <tbody>{semantic.map(([p, t]) => <tr key={p}><th scope="row"><code>{t.css}</code></th><td><code>{t.ref}</code></td><td>{t.value}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}

function TypeScale() {
  const steps = ['display', 'headline', 'title', 'body', 'label', 'caption'];
  return (
    <ul className="type-scale flush">
      {steps.map((s) => {
        const t = TOKENS[`type.${s}`];
        return <li key={s} style={{ fontSize: `var(${t.css})` }}>{s} <span className="muted">{t.value}</span></li>;
      })}
    </ul>
  );
}

function SpaceScale() {
  const steps = Object.entries(TOKENS).filter(([p]) => p.startsWith('gap.'));
  return (
    <ul className="space-scale flush">
      {steps.map(([p, t]) => (
        <li key={p}><span className="bar" style={{ inlineSize: `var(${t.css})` }} aria-hidden="true" /><code>{p}</code> <span className="muted">{t.value}</span></li>
      ))}
    </ul>
  );
}

export function App() {
  const evidence = useJson<Evidence>('./evidence.json');
  const conformance = useJson<Conformance>('./conformance.json');
  const [backdrop, setBackdrop] = useState<string>('bauhaus');
  const tierCount = (tier: string) => Object.values(TOKENS).filter((t) => t.tier === tier).length;

  return (
    <div className="page bd-bauhaus">
      <a className="skip" href="#main">Skip to content</a>
      <header className="masthead">
        <Panel>
          <p className="flush eyebrow">kiln pilot · design system</p>
          <h1 className="flush display">Pane</h1>
          <p className="flush lede">
            Glass on a Dessau curtain-wall frame. The glass carries mood; the opaque mullions carry everything you need to read.
          </p>
          <ul className="stats flush" aria-label="Verification summary">
            <li>
              <Badge tone={evidence && evidence.summary.gatingFailures === 0 ? 'neutral' : 'accent'}>
                {evidence ? `${evidence.summary.gatingScenes - evidence.summary.gatingFailures}/${evidence.summary.gatingScenes} glass scenes pass, measured` : 'glass: UNVERIFIED'}
              </Badge>
            </li>
            <li>
              <Badge tone={conformance && conformance.passed === conformance.total ? 'neutral' : 'accent'}>
                {conformance ? `${conformance.passed}/${conformance.total} conformance checks` : 'conformance: UNVERIFIED'}
              </Badge>
            </li>
            <li><Badge>{`${tierCount('primitive')} primitive · ${tierCount('semantic')} semantic · ${tierCount('component')} component tokens`}</Badge></li>
            <li><Badge tone={OPEN_EXCEPTIONS ? 'accent' : 'neutral'}>{`${OPEN_EXCEPTIONS} open exception${OPEN_EXCEPTIONS === 1 ? '' : 's'}`}</Badge></li>
          </ul>
        </Panel>
        <nav aria-label="Sections">
          <Panel>
            <ul className="toc flush">
              <li><a href="#principles">Principles</a></li>
              <li><a href="#foundations">Foundations</a></li>
              {COMPONENTS.map((c) => <li key={c.name}><a href={`#${c.name.toLowerCase()}`}>{c.name}</a></li>)}
              <li><a href="#method">How it’s measured</a></li>
            </ul>
          </Panel>
        </nav>
      </header>

      <main id="main" className="content">
        <section id="principles" aria-labelledby="principles-h">
          <Panel>
            <h2 id="principles-h" className="flush">Principles</h2>
            <ol className="flush">
              <li><strong>Glass is infill, the frame is structure.</strong> Every pane has a double mullion: a dark line outside, a white line inside. On any backdrop one of the two has ≥3:1 (D-004).</li>
              <li><strong>Text sits on a pane.</strong> Never straight on a photo or gradient — the system can only guarantee contrast where it controls the surface.</li>
              <li><strong>Glass is optional.</strong> Reduced transparency, forced colours and browsers without backdrop-filter all get opaque paper, and pass the same measurements (D-005).</li>
              <li><strong>Measured, not predicted.</strong> Contrast is read from rendered pixels on six worst-case backdrops in three modes (D-003).</li>
            </ol>
          </Panel>
        </section>

        <section id="foundations" aria-labelledby="foundations-h">
          <Panel>
            <h2 id="foundations-h" className="flush">Foundations</h2>
            <p className="flush muted">Read from <code>pane-tokens/json</code> at build time — nothing on this page is retyped.</p>
          </Panel>
          <Panel title="Colour" headingLevel={3}><Swatches /></Panel>
          <div className="two-up">
            <Panel title="Type" headingLevel={3}><TypeScale /></Panel>
            <Panel title="Space" headingLevel={3}><SpaceScale /></Panel>
          </div>
        </section>

        <Panel title="Demo backdrop" headingLevel={2} description="Switch what sits behind every live demo below — the same six backdrops the evidence run uses.">
          <div className="demo-row" role="group" aria-label="Demo backdrop">
            {BACKDROPS.map((bd) => (
              <Button key={bd} size="sm" variant={bd === backdrop ? 'primary' : 'glass'} aria-pressed={bd === backdrop} onClick={() => setBackdrop(bd)}>
                {bd}
              </Button>
            ))}
          </div>
        </Panel>

        {COMPONENTS.map((doc) => (
          <ComponentSection key={doc.name} doc={doc} evidence={evidence} conformance={conformance} backdrop={backdrop} />
        ))}

        <section id="method" aria-labelledby="method-h">
          <Panel>
            <h2 id="method-h" className="flush">How it’s measured</h2>
            <ol className="flush">
              <li><code>tooling/glass-evidence.mjs</code> renders every glass surface on six backdrops (white, black, mid-grey, 8px black/white stripes, a saturated gradient, and this page’s own Bauhaus composition) in real Chromium.</li>
              <li>It hides the text, screenshots, and reads the real pixels under every glyph box — after blur and saturate. The text colour is opaque and known, so each pixel gives one WCAG ratio. The score is the worst pixel, not an average.</li>
              <li>Edges: at every point 2px outside a pane, the better of the two mullion lines must reach 3:1 against the pixel there. Focus rings: same rule 6px out.</li>
              <li>It repeats in reduced-transparency and forced-colours mode, and checks each emulation actually took effect before measuring.</li>
              <li>The tool is gate-proofed: thinning the regular glass from 0.72 to 0.30 alpha turns 8 scenes red; restoring it turns them green.</li>
            </ol>
            {evidence && <p className="flush muted">Last run {new Date(evidence.generatedAt).toLocaleString()} · {evidence.browser} · {evidence.summary.bareFailures} bare-backdrop scenes fail, as the “text sits on a pane” rule predicts.</p>}
            <p className="flush muted">Not covered: Safari and Firefox rendering, real photographs as backdrops, dark theme (D-001).</p>
          </Panel>
        </section>
      </main>
    </div>
  );
}
