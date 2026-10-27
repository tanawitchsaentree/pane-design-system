// A component chapter, built to docs-engine's content model (references/content-model.md): header with
// a verb-first purpose, badge row from real sources, import, hero demo, demo ladder at or above the
// computed floor, usage, do/don't, generated props, verified keyboard table, accessibility,
// generated CSS API, related with reasons, footer with source.
import { Card, Environment, Tag } from 'pane-react';
import meta from './meta.json';
import { inline, Code, ConformanceList, DoDont, EvidenceTable, Example, Link, Page, Section, TokensUsed, useVerify } from './kit';
import type { ComponentChapter } from './components-data';
import changelog from '../../../../packages/react/CHANGELOG.md?raw';

// History per component, parsed from the package changelog: "## version (date)" then "- Name: text".
export const HISTORY: Array<{ version: string; date: string; component: string; text: string }> = changelog.split(/^## /m).slice(1).flatMap((block) => {
  const [, version, date] = block.match(/^(\S+) \((\d{4}-\d{2}-\d{2})\)/) ?? [];
  return [...block.matchAll(/^- (\w+): (.*)$/gm)].map((m) => ({ version, date, component: m[1], text: m[2] }));
});
export const STATUS_LABEL = { alpha: 'Alpha', beta: 'Beta', stable: 'Stable' } as const;

type Meta = typeof meta.components[keyof typeof meta.components];

// Which evidence-harness groups hold this component's text.
export const EVIDENCE_GROUPS: Record<string, string[]> = { Container: ['layout'], Grid: ['layout'], Stack: ['layout'], Badge: ['status'], Chip: ['status'], Banner: ['status'], Environment: ['environment'], Card: ['card'], Avatar: ['card'], Button: ['controls'], IconButton: ['controls'], Tabs: ['controls'], Tag: ['controls', 'media'] };

const twoCol = (rows: Array<[string, string]>, a: string, b: string) => (
  <div className="table-wrap">
    <table>
      <thead><tr><th scope="col">{a}</th><th scope="col">{b}</th></tr></thead>
      <tbody>{rows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
    </table>
  </div>
);

function BadgeRow({ c, m }: { c: ComponentChapter; m: Meta }) {
  const { conformance } = useVerify();
  const checks = conformance?.checks.filter((x) => x.component === c.name) ?? [];
  const a11y = !conformance ? 'a11y: unverified (no run)' : checks.length === 0 ? 'a11y: unverified. No test' : checks.every((x) => x.ok) ? `a11y: verified · ${checks.length} checks` : `a11y: ${checks.filter((x) => !x.ok).length} failing`;
  return (
    <ul className="stats flush" aria-label="Component facts">
      <li><Tag>{`${(m.bundle.gzip / 1024).toFixed(1)} kB min+gz`}</Tag></li>
      <li><Tag>{a11y}</Tag></li>
      <li><Link to="/reference/status"><Tag>{`status: ${STATUS_LABEL[c.status]}`}</Tag></Link></li>
      <li><Tag>{`since v${HISTORY.filter((h) => h.component === c.name).at(-1)?.version ?? meta.version}`}</Tag></li>
      <li><Tag>{`updated ${HISTORY.find((h) => h.component === c.name)?.date ?? 'never'}`}</Tag></li>
    </ul>
  );
}

const SourceLine = ({ m }: { m: Meta }) => <p className="flush small muted source-line">Source file <code>{m.source}</code></p>;

function GeneratedProps({ m, inherits }: { m: Meta; inherits?: string }) {
  return (
    <>
      {m.exports.map((e) => (
        <div key={e.displayName}>
          <h3><code>{e.displayName}</code></h3>
          {e.props.length ? (
            <div className="table-wrap">
              <table>
                <caption>Generated from the TypeScript source by react-docgen-typescript</caption>
                <thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead>
                <tbody>{e.props.map((p) => <tr key={p.name}><th scope="row"><code>{p.name}{p.required ? '' : '?'}</code></th><td><code>{p.type}</code></td><td>{p.default != null ? <code>{String(p.default)}</code> : '—'}</td><td>{p.description ? inline(p.description) : <span className="muted">UNDOCUMENTED</span>}</td></tr>)}</tbody>
              </table>
            </div>
          ) : <p className="muted">No props of its own. Everything is passed through.</p>}
        </div>
      ))}
      {inherits && <p className="muted">It also passes through every prop of <code>{inherits}</code>.</p>}
    </>
  );
}

function VerifiedKeyboard({ rows }: { rows: Array<[string, string, string]> }) {
  const { conformance } = useVerify();
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th scope="col">Key</th><th scope="col">Does</th><th scope="col">Verified by</th></tr></thead>
        <tbody>
          {rows.map(([k, does, check]) => {
            const c = conformance?.checks.find((x) => `${x.component}: ${x.name}` === check);
            return (
              <tr key={k}>
                <th scope="row"><kbd>{k}</kbd></th>
                <td>{does}</td>
                <td>{c ? <><span className={c.ok ? 'pass' : 'fail'}>{c.ok ? 'PASS' : 'FAIL'}</span> <span className="muted">{c.name}</span></> : <span className="fail">UNVERIFIED. No test</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ComponentPage({ c }: { c: ComponentChapter }) {
  const m = (meta.components as Record<string, Meta>)[c.name];
  const demos = 1 + c.ladder.length;
  return (
    <Page eyebrow={`Components · ${c.name}`} title={c.name} lede={<><p className="purpose">{c.purpose}</p><BadgeRow c={c} m={m} /><SourceLine m={m} /></>}>
      <Section id="overview" title="Overview">{c.overview}</Section>

      <Section id="import" title="Import and use">
        <Code label="Import">{c.importLine}</Code>
        <Code label="Usage">{c.usage}</Code>
      </Section>

      <Section id="hero" title="In use" wide>
        <p>{c.hero.intro}</p>
        <Example title={c.hero.title} code={c.hero.code} plain={c.hero.plain}><c.hero.Render /></Example>
      </Section>

      <Section id="demos" title="Variants, states & compositions" wide>
        <p className="muted">{demos} demos on this page; the content-model floor for {c.name} is {m.demoFloor} ({m.variantCount} variant dimension{m.variantCount === 1 ? '' : 's'}{m.variantDimensions.length ? `: ${m.variantDimensions.join(', ')}` : ''} + 3), computed from its TypeScript props.</p>
        {c.ladder.map((ex) => (
          <div key={ex.file} className="ladder-step">
            <h3>{ex.title}</h3>
            <p>{ex.intro}</p>
            <Example title={ex.title} code={ex.code} plain={ex.plain}><ex.Render /></Example>
          </div>
        ))}
      </Section>

      <Section id="backdrops" title="On bright and dark backdrops" wide>
        <p>{c.backdrops}</p>
        <div className="backdrop-matrix" data-backdrops="">
          {(['dark', 'light'] as const).flatMap((th) => (['night', 'city'] as const).map((sc) => (
            <figure key={`${th}-${sc}`} className="backdrop-cell env-tile" data-cell="" data-scene-kind={sc === "night" ? "dark" : "bright"} data-tile={sc} data-theme={th}>
              <figcaption className="backdrop-caption">{th} theme · {sc === 'night' ? 'dark scene' : 'bright scene'}</figcaption>
              <Environment brightness="bright"><c.hero.Render /></Environment>
            </figure>
          )))}
        </div>
      </Section>

      <Section id="usage" title="Usage">
        <h3>Use it for</h3>
        <ul>{c.whenToUse.map((w) => <li key={w}>{w}</li>)}</ul>
        <h3>Use something else for</h3>
        {twoCol(c.whenNotToUse, 'Situation', 'Use instead')}
      </Section>

      <Section id="anatomy" title="Anatomy">
        <ol className="anatomy">{c.anatomy.map(([part, what]) => <li key={part}><b>{part}</b>. {what}</li>)}</ol>
      </Section>

      {c.states && <Section id="states" title="States & motion">{twoCol(c.states, 'State', 'Behaviour')}</Section>}

      <Section id="guidelines" title="Do & don’t">
        <DoDont items={c.dodont} />
        <h3>Writing for it</h3>
        <ul>{c.content.map((x) => <li key={x}>{x}</li>)}</ul>
      </Section>

      <Section id="api" title="Props" wide><GeneratedProps m={m} inherits={c.inherits} /></Section>

      <Section id="accessibility" title="Accessibility">
        <h3>What you get</h3>
        <ul>{c.a11y.map((x) => <li key={x}>{x}</li>)}</ul>
        <h3>What you still have to do</h3>
        <ul className="checklist">{c.youMust.map((x) => <li key={x}>{x}</li>)}</ul>
        {c.keyboard && <><h3>Keyboard</h3><VerifiedKeyboard rows={c.keyboard} /></>}
        <h3>How it is tested</h3>
        <p>Automated checks run on every build. Screen reader passes with VoiceOver and NVDA have not been recorded yet, which is why no component is marked Stable.</p>
        <p className="muted">Executed against this built site in real Chromium by <code>tooling/conformance.mjs</code>.</p>
        <ConformanceList component={c.name} />
      </Section>

      <Section id="css" title="CSS API" wide>
        <p className="muted">Custom properties this component reads, parsed from its CSS module at build time, with the CSS property each one drives.</p>
        <TokensUsed component={c.name} />
      </Section>

      <Section id="evidence" title="Measured contrast" wide>
        <p className="muted">Each text node of this component on the test page, scored at its worst pixel on every scene photo and in every mode.</p>
        <EvidenceTable groups={EVIDENCE_GROUPS[c.name] ?? []} />
      </Section>

      <Section id="limitations" title="Limitations">
        <ul>{c.limitations.map((x) => <li key={x}>{x}</li>)}</ul>
      </Section>

      <Section id="history" title="Change history">
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Version</th><th scope="col">Date</th><th scope="col">Change</th></tr></thead>
            <tbody>{HISTORY.filter((h) => h.component === c.name).map((h) => <tr key={h.text}><th scope="row">{h.version}</th><td>{h.date}</td><td>{inline(h.text)}</td></tr>)}</tbody>
          </table>
        </div>
      </Section>

      <Section id="related" title="Related">
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">See</th><th scope="col">Choose it instead when</th></tr></thead>
            <tbody>{c.related.map(([to, label, why]) => <tr key={to}><th scope="row"><Link to={to}>{label}</Link></th><td>{why}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="muted small">The source is <code>{m.source}</code> and its styles are in <code>{m.source.replace('.tsx', '.module.css')}</code>.</p>
      </Section>
    </Page>
  );
}
