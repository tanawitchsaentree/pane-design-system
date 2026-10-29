// Usage tab: renders a Depth object as sections U2–U14 (U1 is the live demo in the shared header).
// Markers follow docs-engine page-contract.md so kiln's G-K gates can read the page. Tables of
// options are driven by meta.json: an option with no row here renders as a visible gap.
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link, Section, Stage } from '../book/kit';
import { isNA, type Depth, type NotApplicable, type Pair } from './types';

function NA({ id, title, why }: { id: string; title: string; why: NotApplicable }) {
  return <Section id={id} title={title}><div data-registry={id.toUpperCase()} data-na={why.na}><p className="muted">Not applicable. {why.na}</p></div></Section>;
}

export function PairView({ pair }: { pair: Pair }) {
  return (
    <div className="gx-pair-row live-pair">
      <figure className="gx-pair-cell" data-do=""><Stage className="pair-stage">{pair.do}</Stage><figcaption><b>Do.</b> {pair.doNote}</figcaption></figure>
      <figure className="gx-pair-cell" data-dont=""><Stage className="pair-stage">{pair.dont}</Stage><figcaption><b>Don’t.</b> {pair.dontNote}</figcaption></figure>
    </div>
  );
}

/** Numbered callouts measured off the live component, so the component itself carries no docs hooks. */
function Anatomy({ render, parts }: { render: ReactNode; parts: Depth['anatomy']['parts'] }) {
  const box = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<Array<{ n: number; x: number; y: number; from: number; tx: number; ty: number } | null>>([]);
  useLayoutEffect(() => {
    const measure = () => {
      const host = box.current; if (!host) return;
      const o = host.getBoundingClientRect();
      // marks stand in a lane past the component's inline end, each on a leader to its part, so no mark
      // ever covers the content it names; parts at the same height fan out vertically
      const root = host.firstElementChild?.getBoundingClientRect(); if (!root) return;
      const lane = root.right - o.left + 40;
      const found = parts.map((p) => host.querySelector(p.selector)?.getBoundingClientRect() ?? null);
      // each leader ends on a pin inside its own part, so parts on one row (a channel, its range, its
      // thumb) never share a pointer (R-018). The pin is the point nearest the part's end that no smaller
      // listed part covers; when that end is text, the pin sits just past it so no dot lands on a letter.
      const inside = (r: DOMRect, x: number, y: number) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      const texts = [...host.querySelectorAll('*')].flatMap((el) => [...el.childNodes].filter((c) => c.nodeType === 3 && c.textContent!.trim()).map((c) => { const rg = document.createRange(); rg.selectNodeContents(c); return rg.getBoundingClientRect(); }));
      const pin = (i: number): [number, number, number?] => {
        const r = found[i]!;
        const others = found.filter((q, j) => j !== i && q && q.width * q.height < r.width * r.height) as DOMRect[];
        if (texts.some((t) => inside(t, r.right - 2, r.top + r.height / 2))) return [r.right + 8, r.top + r.height / 2];
        // a pin never sits on a letter or on a smaller listed part, and it prefers a column with no text
        // below it so its leader can drop clear; a container whose middle is all covered (a tab track
        // full of tabs) is pinned on its own inset, just inside its bottom or top edge
        const xs: number[] = []; for (let f = 0.94; f >= 0.06; f -= 0.02) xs.push(r.left + r.width * f);
        for (const y of [r.top + r.height / 2, r.bottom - 2.5, r.top + 2.5]) {
          const free = (x: number) => !others.some((q) => inside(q, x, y) || inside(q, x + 8, y) || inside(q, x - 8, y)) && !texts.some((t) => inside(t, x, y) || inside(t, x + 4, y) || inside(t, x - 4, y));
          const clear = (x: number) => !texts.some((t) => t.left - 4 < x && t.right + 4 > x && t.top > y);
          const clearUp = (x: number) => !texts.some((t) => t.left - 4 < x && t.right + 4 > x && t.bottom < y);
          const down = xs.find((x) => free(x) && clear(x)); if (down != null) return [down, y];
          const up = xs.find((x) => free(x) && clearUp(x)); if (up != null) return [up, y, 1];
          const any = xs.find(free); if (any != null) return [any, y];
        }
        return [r.left + r.width / 2, r.bottom - 2.5];
      };
      const pins = found.map((r, i) => (r ? pin(i) : null));
      // two parts that share a box (a surface and its sheen) still get two pins, a step apart
      pins.forEach((q, i) => { if (!q) return; let k = 0; for (let j = 0; j < i; j++) { const o2 = pins[j]; if (o2 && Math.hypot(o2[0] - q[0], o2[1] - q[1]) < 8) { k++; q[1] += (k % 2 ? -1 : 1) * 8 * Math.ceil(k / 2); } } });
      // leaders drop from the pin to a lane of their own and run out to the mark: the rightmost pin on a
      // row runs straight, each one further left drops one step lower, so no two leaders cross
      const order = pins.map((q, i) => [q, i] as const).filter(([q]) => q).sort((a, b) => (Math.abs(a[0]![1] - b[0]![1]) < 4 ? b[0]![0] - a[0]![0] : a[0]![1] - b[0]![1])).map(([, i]) => i);
      const bus: number[] = []; let last = -Infinity;
      // a leader's run out to the lane never crosses a line of text: it drops until it is clear
      const crosses = (x0: number, y: number) => texts.some((t) => t.right > x0 + 2 && t.left < o.left + lane && y > t.top - o.top - 3 && y < t.bottom - o.top + 3);
      for (const i of order.filter((j) => !pins[j]![2])) { let y = Math.max(pins[i]![1] - o.top, last + 28); for (let k = 0; k < 20 && crosses(pins[i]![0], y); k++) y += 6; bus[i] = y; last = y; }
      // a drop that would still cut through a line of text rises instead, when the way up is clear
      const cutsV = (x: number, y0: number, y1: number) => texts.some((t) => t.left - 3 < x && t.right + 3 > x && t.bottom - o.top > Math.min(y0, y1) + 3 && t.top - o.top < Math.max(y0, y1) - 3);
      for (const i of order) { const q = pins[i]!; if (!q[2] && cutsV(q[0], q[1] - o.top, bus[i]) && !cutsV(q[0], q[1] - o.top, root.top - o.top - 14)) q[2] = 1; }
      // rising leaders: the rightmost pin takes the lowest lane above, each one further left one higher
      const ups = order.filter((j) => pins[j]![2]).sort((a, b) => pins[b]![0] - pins[a]![0]);
      ups.forEach((i, k) => { bus[i] = root.top - o.top - 14 - 28 * k; });
      setMarks(found.map((r, i) => (r ? { n: i + 1, x: lane, y: bus[i], from: root.right - o.left + 4, tx: pins[i]![0] - o.left, ty: pins[i]![1] - o.top } : null)));
    };
    measure();
    // text moves once the web font lands and a placed indicator settles, so measure again then
    document.fonts?.ready.then(measure); const late = setTimeout(measure, 500);
    const ro = new ResizeObserver(measure); if (box.current) ro.observe(box.current);
    return () => { ro.disconnect(); clearTimeout(late); };
  }, [parts]);
  return (
    <figure className="anatomy-figure" data-example="">
      <Stage className="anatomy-stage"><div ref={box} className="anatomy-host">{render}{marks.map((m) => m && <span key={m.n} aria-hidden="true"><svg className="anatomy-lead" style={{ insetInlineStart: 0, insetBlockStart: 0 }} width="100%" height="100%"><path d={`M${m.tx} ${m.ty} V${m.y} H${m.x - 12}`} /><circle cx={m.tx} cy={m.ty} r="2.5" /></svg><span className="anatomy-mark" style={{ insetInlineStart: m.x, insetBlockStart: m.y }}>{m.n}</span></span>)}</div></Stage>
      <ol className="anatomy-legend">{parts.map((p) => <li key={p.part}><b>{p.part}.</b> {p.what}</li>)}</ol>
    </figure>
  );
}

const Rows = ({ id, options, rows, cols }: { id: string; options: string[]; rows: Record<string, [string, string]>; cols: [string, string, string] }) => (
  <div className="table-wrap">
    <table>
      <thead><tr>{cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
      <tbody>{options.map((o) => <tr key={o} data-option={o}><th scope="row"><code>{o}</code></th>{rows[o] ? <><td>{rows[o][0]}</td><td>{rows[o][1]}</td></> : <td colSpan={2} className="fail">No guidance written for {o} ({id}).</td>}</tr>)}</tbody>
    </table>
  </div>
);

export function UsageTab({ d, name, kinds, sizes }: { d: Depth; name: string; kinds: Record<string, string[]>; sizes: string[] }) {
  const kindOptions = Object.values(kinds).flat();
  const kindProp = Object.keys(kinds)[0];
  return (
    <>
      <Section id="u2" title="Overview"><div data-registry="U2">{d.overview}</div></Section>

      <Section id="u3" title="When to use it">
        <div data-registry="U3">
          <h3>Use {name} for</h3>
          <ul>{d.whenToUse.map((w) => <li key={w}>{w}</li>)}</ul>
          <h3>Use something else when</h3>
          <div className="table-wrap"><table><thead><tr><th scope="col">The situation</th><th scope="col">Use instead</th></tr></thead>
            <tbody>{d.whenNot.map((w) => <tr key={w.situation}><th scope="row">{w.situation}</th><td><Link to={w.to}>{w.label}</Link></td></tr>)}</tbody></table></div>
        </div>
      </Section>

      {isNA(d.variants) ? <NA id="u4" title="Variants" why={d.variants} /> : (
        <Section id="u4" title="Variants">
          <div data-registry="U4">
            <p>Every option of the <code>{kindProp}</code> prop, read from the TypeScript source, with what it is for and what it may sit next to.</p>
            <Rows id="U4" options={kindOptions} rows={Object.fromEntries(Object.entries(d.variants).map(([k, v]) => [k, [v.purpose, v.pairing]]))} cols={['Option', 'Purpose', 'Pairing rule']} />
          </div>
        </Section>
      )}

      <Section id="u5" title="Anatomy" wide>
        <div data-registry="U5">
          <Anatomy render={d.anatomy.render} parts={d.anatomy.parts} />
          {d.anatomy.perVariant && <p>{d.anatomy.perVariant}</p>}
        </div>
      </Section>

      {isNA(d.sizes) ? <NA id="u6" title="Sizes" why={d.sizes} /> : (
        <Section id="u6" title="Sizes">
          <div data-registry="U6">
            <Rows id="U6" options={sizes} rows={Object.fromEntries(Object.entries(d.sizes).map(([k, v]) => [k, [v.use, v.pairs]]))} cols={['Size', 'Use it for', 'Pairs with']} />
          </div>
        </Section>
      )}

      {isNA(d.emphasis) ? <NA id="u7" title="Emphasis and hierarchy" why={d.emphasis} /> : (
        <Section id="u7" title="Emphasis and hierarchy" wide><div data-registry="U7">{d.emphasis.text}<PairView pair={d.emphasis.pair} /></div></Section>
      )}

      {isNA(d.placement) ? <NA id="u8" title="Placement and alignment" why={d.placement} /> : (
        <Section id="u8" title="Placement and alignment" wide fold>
          <div data-registry="U8">
            <div className="table-wrap"><table><thead><tr><th scope="col">Placement</th><th scope="col">Use it when</th></tr></thead>
              <tbody>{d.placement.rows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table></div>
            <div className="in-context-grid">{d.placement.examples.map((e) => <figure key={e.title} className="in-context" data-example=""><Stage>{e.render}</Stage><figcaption>{e.title}</figcaption></figure>)}</div>
          </div>
        </Section>
      )}

      {isNA(d.combinations) ? <NA id="u9" title="Combinations" why={d.combinations} /> : (
        <Section id="u9" title="Combinations" wide fold>
          <div data-registry="U9">
            <h3>Recommended</h3>
            <div className="table-wrap"><table><thead><tr><th scope="col">Combination</th><th scope="col">When</th></tr></thead>
              <tbody>{d.combinations.good.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table></div>
            <h3>Avoid</h3>
            <div className="in-context-grid">{d.combinations.avoid.map((a) => <figure key={a.title} className="in-context" data-dont=""><Stage>{a.render}</Stage><figcaption><b>Avoid {a.title}.</b> {a.why}</figcaption></figure>)}</div>
          </div>
        </Section>
      )}

      {isNA(d.content) ? <NA id="u10" title="Content" why={d.content} /> : (
        <Section id="u10" title="Content" wide fold>
          <div data-registry="U10">
            {d.content.formula}
            <PairView pair={d.content.pair} />
            <div className="trio">
              <div><h3>Long labels</h3><p>{d.content.overflow.text}</p><Stage className="narrow-stage">{d.content.overflow.render}</Stage></div>
              <div><h3>Right-to-left</h3><p>{d.content.rtl.text}</p><Stage>{d.content.rtl.render}</Stage></div>
              <div><h3>Text expansion</h3><p>{d.content.expansion.text}</p><Stage>{d.content.expansion.render}</Stage></div>
            </div>
          </div>
        </Section>
      )}

      <Section id="u11" title="Behaviours" fold>
        <div data-registry="U11">
          <h3>States</h3>
          <div className="table-wrap"><table><thead><tr><th scope="col">State</th><th scope="col">What it does</th><th scope="col">Why</th></tr></thead>
            <tbody>{d.behaviours.states.map(([s, a, b]) => <tr key={s}><th scope="row">{s}</th><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div>
          <h3>Mouse, keyboard and touch</h3>
          <div className="table-wrap"><table><thead><tr><th scope="col">Input</th><th scope="col">Gesture</th><th scope="col">Result</th><th scope="col">Proven by</th></tr></thead>
            <tbody>{d.behaviours.interactions.map(([i, g, r, p]) => <tr key={i + g}><th scope="row">{i}</th><td><kbd>{g}</kbd></td><td>{r}</td><td className="muted small">{p.replace(/^\w+: /, '')}</td></tr>)}</tbody></table></div>
          <h3>Loading and feedback</h3>{d.behaviours.loading}
          <h3>Default focus</h3>{d.behaviours.focus}
        </div>
      </Section>

      {isNA(d.deepDive) ? <NA id="u12" title="Each variant in depth" why={d.deepDive} /> : (
        <Section id="u12" title="Each variant in depth" wide fold>
          <div data-registry="U12">
            {kindOptions.map((o) => { const v = (d.deepDive as Exclude<Depth['deepDive'], NotApplicable>)[o]; return v ? (
              <div key={o} className="deep-dive" data-deep-dive={o}>
                <div className="dd-text">
                  <h3><code>{o}</code></h3>
                  {v.purpose}
                  <h4>Best practices</h4>
                  <ul>{v.practices.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
                <figure className="in-context dd-media" data-in-context=""><Stage>{v.context}</Stage><figcaption>{o} in a real pane</figcaption></figure>
                <div className="dd-pair"><PairView pair={v.pair} /></div>
              </div>
            ) : <p key={o} className="fail" data-deep-dive={o}>No deep dive written for {o}.</p>; })}
          </div>
        </Section>
      )}

      {isNA(d.modifiers) ? <NA id="u13" title="Modifiers" why={d.modifiers} /> : (
        <Section id="u13" title="Modifiers" wide fold>
          <div data-registry="U13">{d.modifiers.map((m) => <div key={m.name} className="modifier"><div className="dd-text"><h3>{m.name}</h3>{m.rules}</div><div className="dd-media"><PairView pair={m.pair} /></div></div>)}</div>
        </Section>
      )}

      <Section id="u14" title="Related and references">
        <div data-registry="U14">
          <h3>Related</h3>
          <div className="table-wrap"><table><thead><tr><th scope="col">See</th><th scope="col">Choose it instead when</th></tr></thead>
            <tbody>{d.related.map(([to, label, why]) => <tr key={to}><th scope="row"><Link to={to}>{label}</Link></th><td>{why}</td></tr>)}</tbody></table></div>
          <h3>References</h3>
          <ul>{d.references.map((r) => <li key={r.url}><a href={r.url} data-reference="" rel="noreferrer">{r.title}</a>. {r.why}</li>)}</ul>
          <h3>Feedback</h3>
          <p>To report a mistake or a gap on this tab, open an issue that names <code>apps/docs/src/depth/{name.toLowerCase()}.tsx</code>. That one file holds everything written here.</p>
        </div>
      </Section>
    </>
  );
}
