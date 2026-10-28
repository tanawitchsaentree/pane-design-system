// Foundation playgrounds (USER-STANDARDS #6, docs-engine G-F1). Each one has real controls that change
// a live preview and a copy-ready snippet of the current setting. Values come from the token JSON, so a
// playground never offers a number the system doesn't have.
import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { Badge, Button, Card, Chip, Select as PaneSelect, Slider, Stack, Tag } from 'pane-react';
import * as Icons from '../icons';
import { CodeBlock, Stage, TOKENS } from './kit';

const byPrefix = (pre: string) => Object.entries(TOKENS).filter(([p]) => p.startsWith(pre));
const num = (v: string) => parseFloat(String(v));

// ---------- shared controls ----------
// Playground controls are Pane's own Select and Slider: the docs use the system, never browser defaults.
function Range({ label, min, max, step, value, onChange, unit = '' }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; unit?: string }) {
  return <Slider label={label} min={min} max={max} step={step} value={value} onValueChange={onChange} format={(v) => `${v}${unit}`} />;
}
function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<[T, string]>; onChange: (v: T) => void }) {
  return <PaneSelect label={label} size="sm" value={value} options={options.map(([v, l]) => ({ value: v, label: l }))} onValueChange={(v) => onChange(v as T)} />;
}
function Playground({ title, controls, preview, code, note, bare, backdrop }: { title: string; controls: ReactNode; preview: ReactNode; code: string; note?: ReactNode; bare?: boolean; backdrop?: 'scene' | 'field' }) {
  return (
    <div className="playground" data-playground="">
      <p className="flush pg-title">{title}</p>
      <div className="pg-body">
        <div className="pg-controls" data-controls="">{controls}</div>
        <div className="pg-preview" data-preview="">{bare ? preview : <Stage className="pg-stage" backdrop={backdrop}>{preview}</Stage>}</div>
      </div>
      {note && <div className="pg-note">{note}</div>}
      <CodeBlock code={code} />
    </div>
  );
}

// ---------- WCAG maths for the estimates ----------
const lin = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]: number[]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hex = (h: string) => { const m = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16)); };
const alphaOf = (h: string) => (h.replace('#', '').length === 8 ? parseInt(h.replace('#', '').slice(6, 8), 16) / 255 : 1);

// ---------- Glass ----------
export function GlassPlayground({ scene }: { scene: string }) {
  // Starts from the recipe of the theme the reader is in, and switching the text resets to that theme's recipe.
  const preset = (t: 'dark' | 'light') => (t === 'light' ? { bright: num(TOKENS['brightness.light'].value), tint: 0.62 } : { bright: num(TOKENS['brightness.bright'].value), tint: 0.06 });
  const start: 'dark' | 'light' = document.documentElement.dataset.theme === 'light' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  const [blur, setBlur] = useState(num(TOKENS['blur.lg'].value));
  const [bright, setBright] = useState(preset(start).bright);
  const [tint, setTint] = useState(preset(start).tint);
  const [sat, setSat] = useState(num(TOKENS['saturate.glass'].value));
  const [theme, setThemeRaw] = useState<'dark' | 'light'>(start);
  const setTheme = (t: 'dark' | 'light') => { setThemeRaw(t); setBright(preset(t).bright); setTint(preset(t).tint); };
  const [estimate, setEstimate] = useState<number | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  // Estimate: sample the scene image under the card, apply brightness and the tint, score the text
  // colour against the worst sample. Blur is ignored, which makes the estimate pessimistic.
  useEffect(() => {
    const img = new Image();
    img.src = `/scenes/${scene}.jpg`;
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = 160; c.height = 100;
      const ctx = c.getContext('2d', { willReadFrequently: true }); if (!ctx) return;
      ctx.drawImage(img, 0, 0, 160, 100);
      const d = ctx.getImageData(40, 25, 80, 50).data;
      const fg = theme === 'dark' ? [255, 255, 255] : [17, 18, 20];
      const tintRGB = [255, 255, 255];
      let worst = Infinity;
      for (let i = 0; i < d.length; i += 4 * 7) {
        const px = [d[i], d[i + 1], d[i + 2]].map((v, k) => Math.min(255, v * bright) * (1 - tint) + tintRGB[k] * tint);
        worst = Math.min(worst, ratio(fg, px));
      }
      setEstimate(Math.round(worst * 100) / 100);
    };
  }, [scene, bright, tint, theme]);
  const css = `.my-pane {\n  background: rgba(255, 255, 255, ${tint});\n  backdrop-filter: blur(${blur}px) saturate(${sat}) brightness(${bright});\n  color: ${theme === 'dark' ? 'var(--ds-text-primary) /* white in dark */' : 'var(--ds-text-primary) /* ink in light */'};\n}`;
  return (
    <Playground
      bare
      title="Glass recipe"
      controls={<>
        <Range label="Blur" min={0} max={96} step={4} value={blur} onChange={setBlur} unit="px" />
        <Range label="Brightness" min={0.2} max={1.4} step={0.02} value={bright} onChange={setBright} />
        <Range label="White tint" min={0} max={0.9} step={0.02} value={tint} onChange={setTint} />
        <Range label="Saturate" min={1} max={2.4} step={0.1} value={sat} onChange={setSat} />
        <Select label="Text" value={theme} options={[['dark', 'White text (dark theme)'], ['light', 'Ink text (light theme)']]} onChange={setTheme} />
      </>}
      preview={
        <div ref={frame} className="pg-scene" style={{ backgroundImage: `url(/scenes/${scene}.jpg)` }} data-theme={theme}>
          <div className="pg-glass" style={{ background: `rgba(255,255,255,${tint})`, backdropFilter: `blur(${blur}px) saturate(${sat}) brightness(${bright})`, WebkitBackdropFilter: `blur(${blur}px) saturate(${sat}) brightness(${bright})` }}>
            <p className="flush pg-glass-title">Max Fmz</p>
            <p className="flush">UX/UI designer. Coffee lover.</p>
          </div>
        </div>
      }
      note={<p className="flush"><Badge tone={estimate == null ? 'neutral' : estimate >= 4.5 ? 'positive' : estimate >= 3 ? 'warning' : 'critical'}>{estimate == null ? 'about …:1' : `about ${estimate}:1`}</Badge> estimated from the scene image under the card, before blur. The evidence run is the real measurement.</p>}
      code={css}
    />
  );
}

// ---------- Colour ----------
export function ContrastPlayground() {
  const solids = Object.entries(TOKENS).filter(([p, t]) => t.type === 'color' && t.tier === 'primitive' && alphaOf(String(t.value)) === 1);
  const [fg, setFg] = useState('color.white');
  const [bg, setBg] = useState('color.blue.600');
  const r = Math.round(ratio(hex(String(TOKENS[fg].value)), hex(String(TOKENS[bg].value))) * 100) / 100;
  return (
    <Playground
      title="Contrast between two solid colours"
      controls={<>
        <Select label="Text" value={fg} options={solids.map(([p]) => [p, p])} onChange={setFg} />
        <Select label="Fill" value={bg} options={solids.map(([p]) => [p, p])} onChange={setBg} />
      </>}
      preview={
        <div className="pg-swatch" style={{ background: `var(${TOKENS[bg].css})`, color: `var(${TOKENS[fg].css})` }}>
          <span className="pg-swatch-big">Aa</span>
          <span>{r}:1</span>
          <Stack direction="row" gap="xs"><Badge tone={r >= 4.5 ? 'positive' : 'critical'}>{r >= 4.5 ? 'AA text' : 'Fails AA text'}</Badge><Badge tone={r >= 3 ? 'positive' : 'critical'}>{r >= 3 ? 'AA large / UI' : 'Fails 3:1'}</Badge></Stack>
        </div>
      }
      note={<p className="flush">Opaque pairs like these can be computed. Anything on glass depends on the scene and is measured instead.</p>}
      code={`color: var(${TOKENS[fg].css});\nbackground: var(${TOKENS[bg].css});\n/* ${r}:1 */`}
    />
  );
}

// ---------- Typography ----------
export function TypePlayground() {
  const steps = ['display', 'headline', 'title', 'emphasis', 'body', 'label', 'caption', 'micro'];
  const [step, setStep] = useState('title');
  const [weight, setWeight] = useState('weight-semibold');
  const [leading, setLeading] = useState('leading-tight');
  const [text, setText] = useState('Glass over the room');
  return (
    <Playground
      title="Type tester"
      controls={<>
        <Select label="Size" value={step} options={steps.map((s) => [s, `${s} · ${TOKENS[`type.${s}`].value}`])} onChange={setStep} />
        <Select label="Weight" value={weight} options={['weight-regular', 'weight-medium', 'weight-semibold'].map((w) => [w, `${w.replace('weight-', '')} · ${TOKENS[`type.${w}`].value}`])} onChange={setWeight} />
        <Select label="Leading" value={leading} options={['leading-tight', 'leading-body'].map((l) => [l, `${l.replace('leading-', '')} · ${TOKENS[`type.${l}`].value}`])} onChange={setLeading} />
        <label className="pg-control"><span className="pg-label">Sample</span><input value={text} onChange={(e) => setText(e.target.value)} /></label>
      </>}
      preview={<Card as="div"><p className="flush" style={{ fontSize: `var(--ds-type-${step})`, fontWeight: `var(--ds-type-${weight})` as never, lineHeight: `var(--ds-type-${leading})` }}>{text}</p></Card>}
      code={`font-family: var(--ds-type-family);\nfont-size: var(--ds-type-${step});\nfont-weight: var(--ds-type-${weight});\nline-height: var(--ds-type-${leading});`}
    />
  );
}

// ---------- Spacing ----------
export function SpacingPlayground() {
  const gaps = byPrefix('gap.');
  const [gap, setGap] = useState('gap.2xl');
  const [count, setCount] = useState(4);
  const [row, setRow] = useState<'row' | 'column'>('row');
  const t = TOKENS[gap];
  return (
    <Playground
      title="Gap between items"
      controls={<>
        <Select label="Gap token" value={gap} options={gaps.map(([p, v]) => [p, `${p} · ${v.value}`])} onChange={setGap} />
        <Range label="Items" min={2} max={8} step={1} value={count} onChange={setCount} />
        <Select label="Direction" value={row} options={[['row', 'Row'], ['column', 'Column']]} onChange={setRow} />
      </>}
      preview={<Card as="div"><div style={{ display: 'flex', flexDirection: row, flexWrap: 'wrap', gap: `var(${t.css})` }}>{Array.from({ length: count }, (_, i) => <span key={i} className="pg-box">{i + 1}</span>)}</div></Card>}
      code={`<div style={{ display: 'flex', flexDirection: '${row}', gap: 'var(${t.css})' }}>…</div>\n/* ${t.value} */`}
    />
  );
}

// ---------- Grid ----------
export function GridPlayground() {
  const [cols, setCols] = useState(12);
  const [span, setSpan] = useState(4);
  const [gutter, setGutter] = useState('space.8');
  const g = TOKENS[gutter];
  const s = Math.min(span, cols);
  return (
    <Playground
      backdrop="field"
      title="Columns, gutter and span"
      controls={<>
        <Range label="Columns" min={1} max={12} step={1} value={cols} onChange={setCols} />
        <Range label="Highlighted span" min={1} max={12} step={1} value={span} onChange={setSpan} />
        <Select label="Gutter" value={gutter} options={['space.4', 'space.6', 'space.8'].map((p) => [p, `${p} · ${TOKENS[p].value}`])} onChange={setGutter} />
      </>}
      preview={
        <div className="pg-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: `var(${g.css})` }}>
          <div className="pg-cell on" style={{ gridColumn: `span ${s}` }}>span {s}</div>
          {Array.from({ length: Math.max(0, cols * 2 - s) }, (_, i) => <div key={i} className="pg-cell">{''}</div>)}
        </div>
      }
      code={`<Grid columns={${cols}}>\n  <GridItem span={${s}}>…</GridItem>\n</Grid>\n/* gutter: var(${g.css}) = ${g.value} */`}
    />
  );
}

// ---------- Shape ----------
export function ShapePlayground() {
  const corners = byPrefix('corner.');
  const elev = byPrefix('elevation.').filter(([p]) => !p.endsWith('halo'));
  const [corner, setCorner] = useState('corner.panel');
  const [shadow, setShadow] = useState('elevation.float');
  return (
    <Playground
      title="Corner and elevation"
      controls={<>
        <Select label="Corner" value={corner} options={corners.map(([p, t]) => [p, `${p} · ${t.value}`])} onChange={setCorner} />
        <Select label="Shadow" value={shadow} options={elev.map(([p]) => [p, p])} onChange={setShadow} />
      </>}
      preview={<Card as="div" className="pg-shape" style={{ borderRadius: `var(${TOKENS[corner].css})`, boxShadow: `var(${TOKENS[shadow].css})` }}>Pane</Card>}
      code={`border-radius: var(${TOKENS[corner].css});\nbox-shadow: var(${TOKENS[shadow].css});`}
    />
  );
}

// ---------- Motion ----------
export function MotionPlayground() {
  const durs = byPrefix('duration.').filter(([p]) => !p.endsWith('stagger'));
  const eases = byPrefix('easing.');
  const [dur, setDur] = useState('duration.slow');
  const [ease, setEase] = useState('easing.soft');
  const [on, setOn] = useState(false);
  const bez = String(TOKENS[ease].value).match(/[\d.]+/g)?.map(Number) ?? [0.2, 0, 0, 1];
  const path = `M0,100 C${bez[0] * 100},${100 - bez[1] * 100} ${bez[2] * 100},${100 - bez[3] * 100} 100,0`;
  return (
    <Playground
      title="Duration and easing"
      controls={<>
        <Select label="Duration" value={dur} options={durs.map(([p, t]) => [p, `${p} · ${t.value}`])} onChange={setDur} />
        <Select label="Easing" value={ease} options={eases.map(([p]) => [p, p])} onChange={setEase} />
        <Button size="sm" onClick={() => setOn(!on)}>Play</Button>
      </>}
      preview={
        <div className="pg-motion">
          <svg viewBox="-4 -4 108 108" className="pg-curve" aria-label={`Easing curve ${String(TOKENS[ease].value)}`} role="img"><path d={path} fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          <div className="pg-track"><span className="pg-dot" style={{ transform: on ? 'translateX(calc(100% * 6))' : 'none', transition: `transform var(${TOKENS[dur].css}) var(${TOKENS[ease].css})` }} /></div>
        </div>
      }
      note={<p className="flush">With reduced motion on, the dot jumps instead of sliding, because every duration token is 0ms.</p>}
      code={`transition: transform var(${TOKENS[dur].css}) var(${TOKENS[ease].css});\n/* ${TOKENS[dur].value}, ${String(TOKENS[ease].value)} */`}
    />
  );
}

// ---------- Icons ----------
export function IconBrowser() {
  const all = Object.entries(Icons).filter(([n]) => n.startsWith('Icon'));
  const [q, setQ] = useState('');
  const [size, setSize] = useState('control.icon-md');
  const [picked, setPicked] = useState('IconShare');
  const list = useMemo(() => all.filter(([n]) => n.toLowerCase().includes(q.toLowerCase())), [q]);
  const P = (Icons as Record<string, (p: { className?: string; style?: object }) => ReactElement>)[picked];
  return (
    <Playground
      title="Icon browser"
      controls={<>
        <label className="pg-control"><span className="pg-label">Search</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="share, heart…" /></label>
        <Select label="Size" value={size} options={[['control.icon-sm', `small · ${TOKENS['control.icon-sm'].value}`], ['control.icon-md', `medium · ${TOKENS['control.icon-md'].value}`]]} onChange={setSize} />
      </>}
      preview={
        <ul className="pg-icons flush">
          {list.map(([n, I]) => { const C = I as (p: { style?: object }) => ReactElement; return <li key={n}><button type="button" className={n === picked ? 'pg-icon on' : 'pg-icon'} aria-pressed={n === picked} aria-label={n} onClick={() => setPicked(n)}><C style={{ inlineSize: `var(${TOKENS[size].css})`, blockSize: `var(${TOKENS[size].css})` }} /></button></li>; })}
        </ul>
      }
      note={<p className="flush">Selected {picked}. Click any icon to change the snippet below.</p>}
      code={`import { ${picked} } from './icons';\n<${picked} style={{ inlineSize: 'var(${TOKENS[size].css})', blockSize: 'var(${TOKENS[size].css})' }} />`}
    />
  );
}

// ---------- Dimensions ----------
export function TouchTargetPlayground() {
  const [show, setShow] = useState(true);
  return (
    <Playground
      title="Touch targets"
      controls={<Select label="Show hit areas" value={show ? 'on' : 'off'} options={[['on', 'On'], ['off', 'Off']]} onChange={(v) => setShow(v === 'on')} />}
      preview={
        <Card as="div" className={show ? 'pg-targets on' : 'pg-targets'}>
          <Stack direction="row" gap="sm" align="center"><Button>Follow</Button><Button size="sm" variant="glass">Small</Button><Chip>Photos</Chip><Tag>Tag</Tag></Stack>
        </Card>
      }
      note={<p className="flush">The outline is {TOKENS['layout.touch'].value} square, centred on each control. Tags are labels and need no hit area.</p>}
      code={`min-block-size: var(--ds-layout-touch);\nmin-inline-size: var(--ds-layout-touch);`}
    />
  );
}

// ---------- Themes ----------
export function ThemePlayground() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [scene, setScene] = useState('night');
  return (
    <Playground
      title="One card, any theme, any scene"
      controls={<>
        <Select label="Theme" value={theme} options={[['dark', 'Dark'], ['light', 'Light']]} onChange={setTheme} />
        <Select label="Scene" value={scene} options={[['room', 'Room'], ['forest', 'Forest'], ['night', 'Night café (dark)'], ['city', 'City (bright)']]} onChange={setScene} />
      </>}
      preview={
        <div className="pg-scene" data-theme={theme} style={{ backgroundImage: `url(/scenes/${scene}-sm.jpg)` }}>
          <Card as="div"><Stack gap="sm"><p className="flush pg-glass-title">Trip to Lauterbrunnen</p><p className="flush">Saturday · 3 people going</p><Stack direction="row" gap="sm"><Button>Join</Button><Button variant="glass">Later</Button></Stack></Stack></Card>
        </div>
      }
      code={`<section data-theme="${theme}">\n  <Card>…</Card>\n</section>`}
    />
  );
}

// ---------- Content ----------
export function LabelPlayground() {
  const LABELS: Array<[string, string]> = [['verb', 'Follow'], ['verb-noun', 'Save changes'], ['sentence', 'Click here to save all of your changes']];
  const [which, setWhich] = useState('verb-noun');
  const text = LABELS.find(([k]) => k === which)?.[1] ?? '';
  return (
    <Playground
      title="A button label"
      controls={<Select label="Label" value={which} options={LABELS.map(([k, t]) => [k, t.length > 20 ? `${t.slice(0, 20)}…` : t])} onChange={setWhich} />}
      preview={<Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Button>{text}</Button></Stack><p className="flush muted">{text.split(/\s+/).length} words</p></Card>}
      note={<p className="flush">A verb, or a verb and a noun, fits one pill and says what happens. A sentence describes the gesture and wraps.</p>}
      code={`<Button>${text}</Button>`}
    />
  );
}

// ---------- Accessibility ----------
export function FocusPlayground() {
  const [ring, setRing] = useState<'on' | 'off'>('on');
  return (
    <Playground
      title="Keyboard focus you can see"
      controls={<Select label="Focus ring" value={ring} options={[['on', 'Drawn'], ['off', 'Removed']]} onChange={setRing} />}
      preview={<Card as="div" className="demo-card"><Stack direction="row" gap="sm"><span className={ring === 'on' ? 'pg-focus on' : 'pg-focus'}>Focused button</span></Stack><p className="flush muted">{ring === 'on' ? 'A keyboard user can see where they are.' : 'A keyboard user is lost (fails WCAG 2.4.7).'}</p></Card>}
      note={<p className="flush">The ring comes from the focus-ring tokens, a white ring with a dark halo, so it shows on every scene.</p>}
      code={ring === 'on' ? ':focus-visible {\n  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);\n}' : '/* never: */\n:focus-visible { outline: none; }'}
    />
  );
}
