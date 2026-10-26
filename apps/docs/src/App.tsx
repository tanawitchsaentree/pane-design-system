import { useEffect, useState } from 'react';
import tokens from 'pane-tokens/json';
import { Button, Card, Environment, Tag } from 'pane-react';
import { AnchorCard } from './AnchorCard';
import { COMPONENTS, type ComponentDoc } from './content';
import { SCENES, sceneById } from './scenes';
// Counted from the registry itself, never typed: "### E-nnn: … — OPEN" headings in system/EXCEPTIONS.md.
import exceptionsMd from '../../../system/EXCEPTIONS.md?raw';

type Token = { tier: string; type: string; value: string; ref: string | null; css: string; description: string | null };
const TOKENS = tokens as Record<string, Token>;
const OPEN_EXCEPTIONS = (exceptionsMd.match(/^### E-\d{3}:.*— OPEN\s*$/gm) ?? []).length;

interface GroupResult { texts: number; worst: number | null; failures: number; unmeasurable: number }
interface Evidence {
  generatedAt: string;
  browser: string;
  threshold: number;
  modes: string[];
  harness: Record<string, Record<string, Record<string, GroupResult>>>; // mode -> scene -> group
  docsPage: Record<string, Record<string, { textElements: number; failures: number }>>; // mode -> scene
  summary: { gatingChecks: number; gatingFailures: number; informational: string[] };
}
interface Conformance { generatedAt: string; passed: number; total: number; checks: Array<{ component: string; name: string; ok: boolean; detail?: string }> }

function useJson<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    fetch(url).then((r) => (r.ok ? r.json() : null)).then(setData).catch(() => setData(null));
  }, [url]);
  return data;
}

function EvidenceTable({ doc, evidence }: { doc: ComponentDoc; evidence: Evidence | null }) {
  if (!evidence) return <p className="flush muted">UNVERIFIED — evidence.json not found. Run <code>pnpm run verify</code>.</p>;
  return (
    <div className="table-wrap">
      <table>
        <caption>Worst-pixel text contrast, measured in {evidence.browser}. Text needs ≥ {evidence.threshold}:1.</caption>
        <thead>
          <tr><th scope="col">Group · scene</th>{evidence.modes.map((m) => <th scope="col" key={m}>{m}</th>)}</tr>
        </thead>
        <tbody>
          {doc.groups.flatMap((g) =>
            SCENES.map((s) => (
              <tr key={`${g}/${s.id}`}>
                <th scope="row">{g} · {s.label} <span className="muted">({s.brightness})</span></th>
                {evidence.modes.map((m) => {
                  const r = evidence.harness[m]?.[s.id]?.[g];
                  if (!r) return <td key={m}>—</td>;
                  const pass = r.failures === 0;
                  return (
                    <td key={m}>
                      <span className={pass ? 'pass' : 'fail'}>{pass ? 'PASS' : g === 'media' ? 'FAIL (on image)' : 'FAIL'}</span>{' '}
                      {r.worst != null ? `${r.worst.toFixed(2)}:1` : ''}{!pass ? ` · ${r.failures}/${r.texts}` : ''}
                    </td>
                  );
                })}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}

function ComponentSection({ doc, evidence, conformance }: { doc: ComponentDoc; evidence: Evidence | null; conformance: Conformance | null }) {
  const checks = conformance?.checks.filter((c) => c.component === doc.name) ?? null;
  return (
    <section id={doc.name.toLowerCase()} className="component" aria-labelledby={`${doc.name}-h`}>
      <Card as="div">
        <div className="component-head">
          <h2 id={`${doc.name}-h`} className="flush">{doc.name}</h2>
          {checks && <Tag>{checks.filter((c) => c.ok).length}/{checks.length} checks pass</Tag>}
        </div>
        <p className="flush lede">{doc.summary}</p>
      </Card>
      <div className="stage">{doc.demo()}</div>
      <div className="two-up">
        <Card as="section" aria-labelledby={`${doc.name}-do`}><h3 id={`${doc.name}-do`} className="flush">Do</h3><p className="flush muted">{doc.do}</p></Card>
        <Card as="section" aria-labelledby={`${doc.name}-dont`}><h3 id={`${doc.name}-dont`} className="flush">Don’t</h3><p className="flush muted">{doc.dont}</p></Card>
      </div>
      <Card as="section" aria-labelledby={`${doc.name}-props`}>
        <h3 id={`${doc.name}-props`} className="flush">Props</h3>
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
      </Card>
      {doc.keyboard && (
        <Card as="section" aria-labelledby={`${doc.name}-kbd`}>
          <h3 id={`${doc.name}-kbd`} className="flush">Keyboard</h3>
          <table>
            <thead><tr><th scope="col">Key</th><th scope="col">Action</th></tr></thead>
            <tbody>{doc.keyboard.map(([k, a]) => <tr key={k}><th scope="row"><kbd>{k}</kbd></th><td>{a}</td></tr>)}</tbody>
          </table>
        </Card>
      )}
      <Card as="section" aria-labelledby={`${doc.name}-a11y`}>
        <h3 id={`${doc.name}-a11y`} className="flush">Accessibility</h3>
        <ul className="flush">{doc.a11y.map((a) => <li key={a}>{a}</li>)}</ul>
        {checks && (
          <>
            <h4 className="flush">Conformance run (real Chromium)</h4>
            <ul className="flush checks">
              {checks.map((c) => <li key={c.name}><span className={c.ok ? 'pass' : 'fail'}>{c.ok ? 'PASS' : 'FAIL'}</span> {c.name}{c.detail ? ` — ${c.detail}` : ''}</li>)}
            </ul>
          </>
        )}
      </Card>
      <Card as="section" aria-labelledby={`${doc.name}-ev`}>
        <h3 id={`${doc.name}-ev`} className="flush">Glass evidence</h3>
        <p className="flush muted">Read from rendered pixels on every scene and mode (D-003), not computed from tokens.</p>
        <EvidenceTable doc={doc} evidence={evidence} />
      </Card>
    </section>
  );
}

function Foundations() {
  const colors = Object.entries(TOKENS).filter(([, t]) => t.tier === 'primitive' && t.type === 'color');
  const type = ['display', 'headline', 'title', 'emphasis', 'body', 'label', 'caption', 'micro'];
  const radii = Object.entries(TOKENS).filter(([p]) => p.startsWith('corner.'));
  return (
    <>
      <Card as="section" aria-labelledby="f-color">
        <h3 id="f-color" className="flush">Colour</h3>
        <ul className="swatches flush">
          {colors.map(([p, t]) => (
            <li key={p}><span className="chip" style={{ background: `var(${t.css})` }} aria-hidden="true" /><code>{p}</code><span className="muted">{t.value}</span></li>
          ))}
        </ul>
      </Card>
      <Card as="section" aria-labelledby="f-env">
        <h3 id="f-env" className="flush">Glass per environment (D-009)</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Environment</th><th scope="col">Glass token</th><th scope="col">Value</th><th scope="col">Scenes here</th></tr></thead>
            <tbody>
              {(['dim', 'mid', 'bright'] as const).map((b) => (
                <tr key={b}>
                  <th scope="row">{b}</th>
                  <td><code>color.graphite.{b}</code></td>
                  <td>{TOKENS[`color.graphite.${b}`]?.description ?? TOKENS[`color.graphite.${b}`]?.value}</td>
                  <td>{SCENES.filter((s) => s.brightness === b).map((s) => s.label).join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="two-up">
        <Card as="section" aria-labelledby="f-type">
          <h3 id="f-type" className="flush">Type</h3>
          <ul className="type-scale flush">
            {type.map((s) => { const t = TOKENS[`type.${s}`]; return <li key={s} style={{ fontSize: `var(${t.css})` }}>{s} <span className="muted small">{t.value}</span></li>; })}
          </ul>
        </Card>
        <Card as="section" aria-labelledby="f-radius">
          <h3 id="f-radius" className="flush">Corners</h3>
          <ul className="radius-scale flush">
            {radii.map(([p, t]) => <li key={p}><span className="radius-chip" style={{ borderRadius: `var(${t.css})` }} aria-hidden="true" /><code>{p}</code> <span className="muted">{t.value}</span></li>)}
          </ul>
        </Card>
      </div>
    </>
  );
}

// A stale or older-format file must read as "unverified", never crash the page or show wrong numbers.
const validEvidence = (e: Evidence | null) => (e && Array.isArray(e.modes) && e.harness && e.docsPage && Array.isArray(e.summary?.informational) ? e : null);
const validConformance = (c: Conformance | null) => (c && Array.isArray(c.checks) ? c : null);

export function App() {
  const evidence = validEvidence(useJson<Evidence>('./evidence.json'));
  const conformance = validConformance(useJson<Conformance>('./conformance.json'));
  const initial = new URLSearchParams(location.search).get('scene') ?? 'room';
  const [scene, setScene] = useState(sceneById(initial).id);
  useEffect(() => { document.body.dataset.scene = scene; }, [scene]);
  const tier = (t: string) => Object.values(TOKENS).filter((x) => x.tier === t).length;

  return (
    <Environment brightness={sceneById(scene).brightness} className="page">
      <div className="env" aria-hidden="true"><i className="e1" /><i className="e2" /><i className="e3" /><i className="e4" /><i className="e5" /></div>
      <a className="skip" href="#main">Skip to content</a>

      <aside className="rail">
        <Card as="section" aria-labelledby="brand">
          <p className="flush eyebrow">kiln pilot · design system</p>
          <h1 id="brand" className="flush display">Pane</h1>
          <p className="flush muted">Spatial glass, built from the anchor card you picked.</p>
        </Card>
        <Card as="div">
          <p className="flush eyebrow" id="scene-label">Scene behind the glass</p>
          <div className="scene-picker" role="group" aria-labelledby="scene-label">
            {SCENES.map((s) => (
              <Button key={s.id} size="sm" variant={s.id === scene ? 'accent' : 'glass'} aria-pressed={s.id === scene} onClick={() => setScene(s.id)}>{s.label}</Button>
            ))}
          </div>
        </Card>
        <nav aria-label="Sections">
          <Card as="div">
            <ul className="toc flush">
              <li><a href="#overview">Overview</a></li>
              <li><a href="#foundations">Foundations</a></li>
              {COMPONENTS.map((c) => <li key={c.name}><a href={`#${c.name.toLowerCase()}`}>{c.name}</a></li>)}
              <li><a href="#method">How it’s measured</a></li>
            </ul>
          </Card>
        </nav>
      </aside>

      <main id="main" className="content">
        <section id="overview" aria-labelledby="overview-h" className="hero">
          <Card as="div" className="hero-copy">
            <h2 id="overview-h" className="flush headline">One card, taken apart.</h2>
            <p className="flush lede">
              The profile card on the right is the anchor you picked (A). Every part of it is a Pane component — Card, Avatar, Tabs, Button, IconButton, Tag — and the glass under it darkens with the scene so its text stays readable.
            </p>
            <ul className="stats flush" aria-label="Verification summary">
              <li><Tag>{evidence ? `${evidence.summary.gatingChecks - evidence.summary.gatingFailures}/${evidence.summary.gatingChecks} glass checks pass` : 'glass: unverified'}</Tag></li>
              <li><Tag>{conformance ? `${conformance.passed}/${conformance.total} conformance` : 'conformance: unverified'}</Tag></li>
              <li><Tag>{`${tier('primitive')} · ${tier('semantic')} · ${tier('component')} tokens`}</Tag></li>
              <li><Tag>{`${OPEN_EXCEPTIONS} open exception${OPEN_EXCEPTIONS === 1 ? '' : 's'}`}</Tag></li>
            </ul>
          </Card>
          <div className="hero-card"><AnchorCard idPrefix="hero" /></div>
        </section>

        <section id="foundations" aria-labelledby="foundations-h" className="component">
          <Card as="div">
            <h2 id="foundations-h" className="flush">Foundations</h2>
            <p className="flush muted">Read from <code>pane-tokens/json</code> at build time — nothing here is retyped.</p>
          </Card>
          <Foundations />
        </section>

        {COMPONENTS.map((doc) => <ComponentSection key={doc.name} doc={doc} evidence={evidence} conformance={conformance} />)}

        <section id="method" aria-labelledby="method-h">
          <Card as="div">
            <h2 id="method-h" className="flush">How it’s measured</h2>
            <ol className="flush">
              <li><code>tooling/glass-evidence.mjs</code> renders the harness (the anchor card plus every component variant) on four scenes in real Chromium, in normal, reduced-transparency and forced-colours mode.</li>
              <li>It hides each text node, screenshots, and scores the text colour against every real pixel under it, after blur and saturate. Translucent text is blended per pixel. The score is the worst pixel.</li>
              <li>It does the same for every text node on this page, on every scene.</li>
              <li>Text on the post image is reported, not gated: it depends on the picture, which the system doesn’t control.</li>
              <li>The glass tint per environment came from <code>tooling/anchor-sweep.mjs</code>: tint alpha alone could not pass — the anchor’s grey caps white text at ~4.6:1 even fully opaque.</li>
            </ol>
            {evidence && <p className="flush muted">Last run {new Date(evidence.generatedAt).toLocaleString()} · {evidence.browser}{evidence.summary.informational.length ? ` · reported only: ${evidence.summary.informational.join('; ')}` : ''}</p>}
            <p className="flush muted">Not covered: Safari and Firefox rendering, real photographs, light (white-text-free) theme.</p>
          </Card>
        </section>
      </main>
    </Environment>
  );
}
