// Grid & layout, built to kiln's foundation-depth.md: every topic Carbon, Atlassian and Dell cover on
// their grid pages (benchmarks/topics/grid.json) has a section here, mapped in
// system/benchmark-coverage.json. Every number is read from the token build; diagrams are drawn from
// the same tokens at the size of each breakpoint, never screenshots.
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Card, Grid, GridItem, Select, Stack } from 'pane-react';
import { Callout, Code, Example, Link, Page, Section, Stage, TOKENS, TokenTable, WhyText } from './kit';
import GridBasic from '../examples/GridBasic';
import GridBasicSrc from '../examples/GridBasic.tsx?raw';
import { GridPlayground } from './playgrounds';

const px = (p: string) => parseFloat(String(TOKENS[p].value));
const at = (p: string, bp: 'base' | 'md' | 'lg') => (bp === 'base' ? TOKENS[p].value : TOKENS[p].breakpoints?.[bp]?.value ?? TOKENS[p].value);
type BP = { id: 'base' | 'md' | 'lg'; label: string; min: number; sample: number; columns: number; gutter: number; margin: number };
export const BPS: BP[] = (['base', 'md', 'lg'] as const).map((id) => ({
  id,
  label: id === 'base' ? 'Phone' : id === 'md' ? 'Tablet' : 'Desktop',
  min: id === 'base' ? 0 : px(`viewport.${id}`),
  sample: id === 'base' ? 390 : id === 'md' ? 834 : 1280,
  columns: Number(at('layout.columns', id)),
  gutter: parseFloat(String(at('layout.gutter', id))),
  margin: parseFloat(String(at('layout.margin', id))),
}));
const colWidth = (b: BP, w = b.sample) => (w - b.margin * 2 - b.gutter * (b.columns - 1)) / b.columns;

// ---------- annotated anatomy, drawn from the tokens at a breakpoint's sample width ----------
function Anatomy({ bp, labels = true, children }: { bp: BP; labels?: boolean; children?: ReactNode }) {
  const scale = 640 / Math.max(640, bp.sample);
  const frame: CSSProperties = { inlineSize: bp.sample * scale, '--m': `${bp.margin * scale}px`, '--g': `${bp.gutter * scale}px`, '--c': bp.columns } as CSSProperties;
  return (
    <figure className="gx-figure">
      <div className="gx-frame" data-graphic-ground="" style={frame} role="img" aria-label={`${bp.label} grid: ${bp.columns} columns, ${bp.gutter}px gutters, ${bp.margin}px margins at ${bp.sample}px wide`}>
        <span className="gx-margin start" data-graphic="margin" /><span className="gx-margin end" data-graphic="margin" />
        <div className="gx-cols">{Array.from({ length: bp.columns }, (_, i) => <span key={i} className="gx-col" data-graphic="column" />)}</div>
        {children && <div className="gx-content">{children}</div>}
        {labels && <>
          {/* 1 over the third column, 2 over the gutter after the sixth, 3 over the end margin */}
          <span className="gx-callout" style={{ insetInlineStart: `calc(var(--m) + ((100% - var(--m) * 2 - var(--g) * (var(--c) - 1)) / var(--c) + var(--g)) * 2 + (100% - var(--m) * 2 - var(--g) * (var(--c) - 1)) / var(--c) / 2)` }}>1</span>
          <span className="gx-callout" style={{ insetInlineStart: `calc(var(--m) + ((100% - var(--m) * 2 - var(--g) * (var(--c) - 1)) / var(--c) + var(--g)) * ${Math.ceil(bp.columns / 2)} - var(--g) / 2)` }}>2</span>
          <span className="gx-callout" style={{ insetInlineStart: `calc(100% - var(--m) / 2)` }}>3</span>
        </>}
      </div>
      {labels && <figcaption><ol className="gx-legend flush"><li><b>Columns</b> hold content. {bp.columns} at {bp.label.toLowerCase()} width, each about {Math.round(colWidth(bp))}px at {bp.sample}px.</li><li><b>Gutters</b> ({bp.gutter}px) are where the scene shows between panes.</li><li><b>Margins</b> ({bp.margin}px) keep panes off the screen edge.</li></ol></figcaption>}
    </figure>
  );
}

function AnatomyPicker() {
  const [id, setId] = useState<BP['id']>('lg');
  const bp = BPS.find((b) => b.id === id)!;
  return (
    <Stack gap="lg">
      <div className="gx-pick"><Select label="Breakpoint" size="sm" value={id} onValueChange={(v) => setId(v as BP['id'])} options={BPS.map((b) => ({ value: b.id, label: `${b.label} · ${b.columns} columns` }))} /></div>
      <Stage className="gx-stage" backdrop="field"><Anatomy bp={bp} /></Stage>
    </Stack>
  );
}

// ---------- span gallery: real Grid + GridItem at 12 columns ----------
const SPLITS: Array<[string, number[], number?]> = [
  ['Full', [12]], ['Halves', [6, 6]], ['Thirds', [4, 4, 4]], ['Quarters', [3, 3, 3, 3]],
  ['Main and side', [8, 4]], ['Wide main', [9, 3]], ['Centred reading column', [8], 2],
];
function SpanGallery() {
  return (
    <Stage className="gx-stage" backdrop="field">
      <div className="gx-spans">
        {SPLITS.map(([name, spans, offset]) => (
          <div key={name} className="gx-span-row">
            <span className="gx-span-name">{name}</span>
            <Grid columns={12} className="gx-span-grid">
              {spans.map((s, i) => <GridItem key={i} span={s} style={offset && i === 0 ? { gridColumn: `${offset + 1} / span ${s}` } : undefined}><Card as="div" className="gx-cell"><span>{s} / 12</span></Card></GridItem>)}
            </Grid>
          </div>
        ))}
      </div>
    </Stage>
  );
}

// ---------- regions: a whole Pane screen with its regions numbered ----------
function Regions({ keyLines = false }: { keyLines?: boolean }) {
  return (
    <Stage className="gx-stage" backdrop="field">
      <div className={`gx-app${keyLines ? ' lines' : ''}`} role="img" aria-label="A Pane screen: top bar, side rail, panes on the grid, an ornament and a menu floating above">
        <div className="gx-r top"><span className="gx-n">1</span>Top bar</div>
        <div className="gx-r gx-rail"><span className="gx-n">2</span>Side rail</div>
        <div className="gx-r main">
          <div className="gx-r pane a"><span className="gx-n">3</span>Pane, 8 columns</div>
          <div className="gx-r pane b"><span className="gx-n">3</span>Pane, 4</div>
          <div className="gx-r pane c"><span className="gx-n">3</span>Pane, 4</div>
          <div className="gx-r pane d"><span className="gx-n">3</span>Pane, 8</div>
          <div className="gx-r orn"><span className="gx-n">4</span>Ornament</div>
          <div className="gx-r menu"><span className="gx-n">5</span>Menu</div>
        </div>
      </div>
    </Stage>
  );
}

// ---------- do / don't, rendered ----------
function Pair({ title, doLabel, dontLabel, good, bad }: { title: string; doLabel: string; dontLabel: string; good: ReactNode; bad: ReactNode }) {
  return (
    <div className="gx-pair">
      <h3>{title}</h3>
      <div className="gx-pair-row">
        <figure className="gx-pair-cell" data-do=""><Stage className="gx-mini" backdrop="field">{good}</Stage><figcaption><b>Do.</b> {doLabel}</figcaption></figure>
        <figure className="gx-pair-cell" data-dont=""><Stage className="gx-mini" backdrop="field">{bad}</Stage><figcaption><b>Don’t.</b> {dontLabel}</figcaption></figure>
      </div>
    </div>
  );
}
const box = (label: string) => <Card as="div" className="gx-cell"><span>{label}</span></Card>;

export function GridLayoutPage() {
  const unit = TOKENS['space.1'];
  return (
    <Page eyebrow="Foundations" title="Grid & layout" lede={<p>Pane lays panes out on a column grid that has 4, 8 or 12 columns depending on the screen. The gaps between columns are where the scene shows through, so the grid decides how much of the world the reader sees as much as where things go. Every number on this page is read from the layout tokens.</p>}>
      <Section id="scope" title="What the grid governs">
        <p>The grid places top-level panes in the main content area, such as cards, feeds, players and settings groups. It does not place anything inside a pane, where the gap tokens take over, and it does not place the top bar, the side rail or anything that floats above the content, such as menus, ornaments and dialogs. Those sit in their own regions, described under screen regions below.</p>
        <p>The reason is the concept. A pane is an object in space (<Link to="/principles#p3">P3</Link>). Objects line up with each other on shared edges, and what is drawn on an object follows the object itself.</p>
      </Section>

      <Section id="unit" title="The unit everything is built from">
        <p>Every size in Pane is a multiple of <code>{unit.css}</code>, which is {unit.value}. Gutters, margins, padding, control heights and the gaps inside panes all come from that one step, so edges that are not supposed to meet never miss each other by a pixel or two. Where 4px is too coarse, the scale has a few half steps (2, 6, 10 and 14px) for borders and tight icon spacing.</p>
        <p className="why-line"><WhyText w={TOKENS['space.4'].why} /></p>
      </Section>

      <Section id="anatomy" title="Columns, gutters and margins" wide>
        <p>The grid has three parts. Pick a breakpoint to see it drawn at a typical screen width from that range, using the same tokens the code reads.</p>
        <AnatomyPicker />
      </Section>

      <Section id="breakpoints" title="Breakpoints" wide>
        <p>The grid changes at two breakpoints. Below the first one it is a phone grid; above the second it is a desktop grid.</p>
        <div className="table-wrap">
          <table>
            <caption>Generated from <code>layout.columns</code>, <code>layout.gutter</code>, <code>layout.margin</code> and the viewport tokens</caption>
            <thead><tr><th scope="col">Range</th><th scope="col">From</th><th scope="col">Columns</th><th scope="col">Gutter</th><th scope="col">Margin</th><th scope="col">Column at a typical width</th></tr></thead>
            <tbody>{BPS.map((b, i) => (
              <tr key={b.id}><th scope="row">{b.label}</th><td>{b.min ? `${b.min}px` : '0'}{BPS[i + 1] ? ` to ${BPS[i + 1].min - 1}px` : ' and up'}</td><td>{b.columns}</td><td>{b.gutter}px</td><td>{b.margin}px</td><td>{Math.round(colWidth(b))}px at {b.sample}px</td></tr>
            ))}</tbody>
          </table>
        </div>
        <p>Larger viewport tokens exist (<code>viewport.xl</code> {TOKENS['viewport.xl'].value}, <code>viewport.2xl</code> {TOKENS['viewport.2xl'].value}) for container widths and component changes, but the grid itself stops changing at desktop width. Wider screens get a wider container, never more columns, so a pane keeps its proportions.</p>
      </Section>

      <Section id="breakpoint-basis" title="Breakpoints follow the screen" fold>
        <p>Breakpoints measure the viewport, not the content area. Opening the side rail does not turn a desktop grid into a tablet grid; the content area narrows and the columns narrow with it. Designs are drawn for the phone grid first and grow upwards, because the phone is where every pane has the least room and the scene the least space around it.</p>
      </Section>

      <Section id="column-width" title="Column width" fold>
        <p>Columns are equal and fluid. Inside a breakpoint their width is the available width, minus margins and gutters, divided by the column count, so content scales with the screen. Gutters and margins stay fixed inside a breakpoint, which keeps the space between panes the same size wherever you are on the page.</p>
        <Code label="CSS">{`grid-template-columns: repeat(var(--ds-grid-columns), minmax(0, 1fr));\ngap: var(--ds-grid-gutter);\npadding-inline: var(--ds-grid-margin);`}</Code>
      </Section>

      <Section id="spans" title="Spans and common splits" wide>
        <p>A pane spans a whole number of columns. These are the splits that come up most, drawn with the real <Link to="/components/grid">Grid</Link> and <code>GridItem</code> at 12 columns. On a phone every pane spans the full width unless it says otherwise.</p>
        <SpanGallery />
        <Code label="React">{`<Grid>\n  <GridItem span="full" lg={8}>…</GridItem>\n  <GridItem span="full" lg={4}>…</GridItem>\n</Grid>`}</Code>
      </Section>

      <Section id="types" title="Fluid, fixed and hybrid" fold>
        <ul>
          <li><b>Fluid.</b> Columns divide the width, so things get bigger as the screen grows. Use it when people want to see more of each item, such as a photo, a post or a player.</li>
          <li><b>Fixed.</b> Boxes have a size from the scale and tile, so more of them fit as the screen grows. Use it when people want to see more items, such as a grid of avatars, album covers or chips.</li>
          <li><b>Hybrid.</b> One dimension is fixed and the other fluid, such as a top bar that is fluid in width and fixed in height. Most components are hybrid.</li>
        </ul>
        <p>Pane's default is fluid for panes, because a pane is an object that should grow with the room, and fixed for small things placed on a pane.</p>
      </Section>

      <Section id="max-width" title="Maximum widths" fold>
        <p>Panes stop growing at a container width. Choose it from what the reader does on the screen.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Container</th><th scope="col">Width</th><th scope="col">Use for</th></tr></thead>
            <tbody>
              <tr><th scope="row"><code>sm</code></th><td>{TOKENS['container.sm'].value}</td><td>Forms and single-column reading.</td></tr>
              <tr><th scope="row"><code>md</code></th><td>{TOKENS['container.md'].value}</td><td>A feed or a settings column.</td></tr>
              <tr><th scope="row"><code>lg</code></th><td>{TOKENS['container.lg'].value}</td><td>Two panes side by side, such as a profile and its feed.</td></tr>
              <tr><th scope="row"><code>xl</code></th><td>{TOKENS['container.xl'].value}</td><td>Dashboards of several panes. The default.</td></tr>
              <tr><th scope="row"><code>2xl</code></th><td>{TOKENS['container.2xl'].value}</td><td>Full app layouts on large screens.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Reading text has its own cap on top of this, about 70 characters per line (<code>type.measure</code>), so a wide pane never makes a line too long to read (<Link to="/principles#p7">P7</Link>).</p>
      </Section>

      <Section id="gutters" title="Gutters" fold>
        <p>Gutters are fixed inside a breakpoint, at {BPS.map((b) => `${b.gutter}px on ${b.label.toLowerCase()}`).join(', ')}. In most systems a gutter only separates content. In Pane it is also the gap through which the reader sees the scene (<Link to="/principles#p1">P1</Link>), which is why Pane never uses a gutterless grid for panes. Two panes that touch read as one sheet of glass, and nothing in the system can tell them apart again.</p>
        <p>Content stays inside its columns. Shadows and the rim light of a pane may fall into the gutter; text and controls never do.</p>
      </Section>

      <Section id="margins" title="Margins" fold>
        <p>Margins are the space between the outermost columns and the edge of the screen, at {BPS.map((b) => `${b.margin}px on ${b.label.toLowerCase()}`).join(', ')}. They are fixed per breakpoint and always come from <code>layout.margin</code>. Leaving an empty column at each side to make a margin breaks as soon as the column count changes.</p>
      </Section>

      <Section id="padding" title="Padding and the type edge" fold>
        <p>Inside a pane the padding is <code>gap.inset</code> ({TOKENS['gap.inset'].value}), always larger than any gap between items in that pane, so the edge of the pane reads as the edge of the object (<Link to="/principles#p3">P3</Link>). Text sits against the padding edge. A pane's title, its body and its buttons all start on the same line, which is the key line the eye follows down the pane.</p>
        <p>Corners nest by the same numbers. The pane corner minus the padding gives the corner of anything inside it. See <Link to="/foundations/shape">Shape & elevation</Link>.</p>
      </Section>

      <Section id="what-aligns" title="What aligns to the grid" fold>
        <ul>
          <li><b>Panes do.</b> Cards, feeds, players and settings groups span columns.</li>
          <li><b>Things on a pane don't.</b> Buttons, avatars, tags and the parts of a card are spaced with the gap tokens inside the pane's padding.</li>
          <li><b>Floating things don't.</b> Menus, ornaments and dialogs float above the grid on their own layer (<code>layer.overlay</code>) and are placed relative to what opened them.</li>
        </ul>
      </Section>

      <Section id="nested" title="Nested grids" fold>
        <p>A large pane can hold its own grid, for example a gallery inside a profile. The inner grid uses the gap tokens instead of the page gutter, because it is spacing on one object. Nested panes get the inner corner and add no second blur, since one sheet of glass is one layer.</p>
      </Section>

      <Section id="behaviours" title="More things, or bigger things" fold>
        <p>When the screen grows, decide what the reader wants. If they want to see more items, keep the item size and let more columns of items fit (fixed boxes). If they want to see more of each item, keep the count and let each one grow (fluid columns). A feed of photos is the second case; a list of people to follow is the first.</p>
        <Example title="Column count follows the screen" code={GridBasicSrc} plain backdrop="field"><GridBasic /></Example>
      </Section>

      <Section id="ui-behaviours" title="How each region scales" wide fold>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Region</th><th scope="col">Width</th><th scope="col">Height</th></tr></thead>
            <tbody>
              <tr><th scope="row">Top bar</th><td>Fluid, the full screen</td><td>Fixed</td></tr>
              <tr><th scope="row">Side rail</th><td>Fixed (<code>layout.sidebar</code>, {TOKENS['layout.sidebar'].value})</td><td>Fluid, the full screen</td></tr>
              <tr><th scope="row">Pane</th><td>Fluid, a column span</td><td>Its content</td></tr>
              <tr><th scope="row">Menu or list popup</th><td>The control that opened it, at least <code>control.menu-min</code></td><td>Its content, up to the space available</td></tr>
              <tr><th scope="row">Ornament</th><td>Its content</td><td>Fixed</td></tr>
              <tr><th scope="row">Banner</th><td>The pane it is on</td><td>Its content</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="regions" title="Screen regions" wide fold>
        <p>People expect the same things in the same places on every screen. The top bar (1) and side rail (2) sit outside the grid; panes (3) sit on it; ornaments (4) and menus (5) float above it and do not move the grid when they appear.</p>
        <Regions />
        <ul>
          <li><b>Side rail.</b> On desktop it is a fixed panel that narrows the content area. Below desktop it becomes a drawer that floats over the content and does not push it.</li>
          <li><b>Floating panels.</b> Menus, dialogs and ornaments cover what is below them, so they are always dismissible with Escape and a visible control.</li>
        </ul>
      </Section>

      <Section id="key-lines" title="Key lines" wide fold>
        <p>Whatever the layout, the edges of panes should form lines the eye can follow, vertically and horizontally. Here the same screen is drawn with its key lines. Every pane edge lands on a column edge, and every row of panes starts on the same line.</p>
        <Regions keyLines />
      </Section>

      <Section id="density" title="Density" fold>
        <p>Pane has one density. Touch targets are 44px in every layout (<Link to="/principles#p6">P6</Link>) and the gutters are what let the scene show between panes (<Link to="/principles#p1">P1</Link>), so a compact mode would shrink exactly the two things the concept depends on. Dense data belongs on an ordinary reading surface (<Link to="/principles#p7">P7</Link>), where a table can be as compact as it needs.</p>
      </Section>

      <Section id="sizing-scale" title="Sizing scale" fold>
        <p>Fixed boxes take their sizes from the space scale and the control sizes, so tiles line up without a grid being drawn. The fluid base unit is the column width at the current breakpoint.</p>
        <TokenTable prefix="control." />
      </Section>

      <Section id="aspect-ratios" title="Aspect ratios" fold>
        <p>Avatars are square. Covers and post media are cropped to the pane by height, so the pane decides the shape and the photo fills it (<code>background-size: cover</code>). Pane does not fix a ratio for media, because the scene behind the glass already sets the mood and a fixed ratio would crop people's photos to fit the system instead of the pane.</p>
      </Section>

      <Section id="vertical-rhythm" title="Vertical rhythm" fold>
        <p>Vertical space comes from the same scale. Between panes in a column the gap is the gutter of the current breakpoint, so horizontal and vertical gaps match. Between sections of a page it is <code>gap.section</code> ({TOKENS['gap.section'].value}), and between whole regions <code>gap.page</code> ({TOKENS['gap.page'].value}).</p>
      </Section>

      <Section id="components" title="How components size" wide fold>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Component</th><th scope="col">Width</th><th scope="col">Height</th></tr></thead>
            <tbody>
              <tr><th scope="row"><Link to="/components/card">Card</Link></th><td>Fluid, its column span</td><td>Its content</td></tr>
              <tr><th scope="row"><Link to="/components/button">Button</Link></th><td>Its label</td><td>Fixed, {TOKENS['control.lg'].value} or {TOKENS['control.sm'].value}</td></tr>
              <tr><th scope="row">Select</th><td>Fluid, the field it sits in</td><td>Fixed, {TOKENS['control.lg'].value} or {TOKENS['control.sm'].value}</td></tr>
              <tr><th scope="row">Slider</th><td>Fluid</td><td>Fixed, a {TOKENS['layout.touch'].value} hit area</td></tr>
              <tr><th scope="row"><Link to="/components/avatar">Avatar</Link></th><td colSpan={2}>Fixed and square, three sizes</td></tr>
              <tr><th scope="row"><Link to="/components/banner">Banner</Link></th><td>The pane it is on</td><td>Its content</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="dodont" title="Do and don’t" wide fold>
        <Pair title="Keep the scene between panes" doLabel="Leave the gutter between panes, so each one is its own object and the scene shows between them." dontLabel="Butt panes together. They merge into one sheet and the scene disappears." good={<div className="gx-two">{box('Pane')}{box('Pane')}</div>} bad={<div className="gx-two touch">{box('Pane')}{box('Pane')}</div>} />
        <Pair title="Margins come from the margin token" doLabel="Let panes start at the margin." dontLabel="Leave an empty column as a margin. It breaks when the column count changes." good={<div className="gx-margin-demo">{box('Pane')}</div>} bad={<div className="gx-margin-demo inset">{box('Pane')}</div>} />
        <Pair title="Cap reading width" doLabel="Put long text in a reading-width pane." dontLabel="Run text across all 12 columns." good={<Card as="div" className="gx-read narrow"><p className="flush">A paragraph that stays near seventy characters per line is easy to follow from one line to the next.</p></Card>} bad={<Card as="div" className="gx-read"><p className="flush">A paragraph stretched across every column of a wide screen is hard to follow, because the eye loses its place on the way back to the start of the next line.</p></Card>} />
      </Section>

      <Section id="tools" title="Using the grid in code and design tools" fold>
        <Code label="React">{`import { Container, Grid, GridItem } from 'pane-react';\n\n<Container size="xl">\n  <Grid>\n    <GridItem span="full" lg={8}>…</GridItem>\n    <GridItem span="full" lg={4}>…</GridItem>\n  </Grid>\n</Container>`}</Code>
        <Code label="CSS">{`.layout {\n  display: grid;\n  grid-template-columns: repeat(var(--ds-grid-columns), minmax(0, 1fr));\n  gap: var(--ds-grid-gutter);\n  padding-inline: var(--ds-grid-margin);\n}`}</Code>
        <Code label="SCSS">{`@media (min-width: $ds-raw-breakpoint-lg) { … }`}</Code>
        <p>In a design tool, set a layout grid with the column count, gutter and margin from the breakpoint table for each frame width you draw, and use auto layout with the gap tokens inside panes.</p>
      </Section>

      <Section id="demos" title="Try it" wide>
        <p>Change the column count, the gutter and the highlighted span. Real pages leave the column count to the breakpoints and only set spans.</p>
        <GridPlayground />
      </Section>

      <Section id="tokens" title="Layout tokens" fold>
        <TokenTable prefix="layout." />
        <TokenTable prefix="container." />
      </Section>

      <Section id="further-reading" title="Further reading" fold>
        <ul>
          <li><a href="https://www.nngroup.com/articles/using-grids-in-interface-designs/" data-reference="">Using grids in interface designs</a>, Nielsen Norman Group.</li>
          <li><a href="https://developer.apple.com/design/human-interface-guidelines/layout" data-reference="">Layout</a>, Apple Human Interface Guidelines, including visionOS windows and ornaments.</li>
          <li><a href="https://carbondesignsystem.com/elements/2x-grid/overview/" data-reference="">2x Grid</a>, Carbon, for fluid, fixed and hybrid boxes.</li>
          <li>Josef Müller-Brockmann, <i>Grid Systems in Graphic Design</i> (1981), for the idea of key lines.</li>
        </ul>
        <Callout tone="note" title="How this page was scoped"><p>Its sections come from the topics Carbon, Atlassian and Dell cover on their grid pages. Each topic is covered here or declined with a reason; the mapping lives in <code>system/benchmark-coverage.json</code> and kiln checks it on every build.</p></Callout>
      </Section>
    </Page>
  );
}
