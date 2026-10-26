import { useState, type ReactElement, type ReactNode } from 'react';
import { Card, Tag } from 'pane-react';
import decisionsMd from '../../../../system/DECISIONS.md?raw';
import exceptionsMd from '../../../../system/EXCEPTIONS.md?raw';
import creditsMd from '../../public/scenes/CREDITS.md?raw';
import FeedPost from '../examples/FeedPost';
import FeedPostSrc from '../examples/FeedPost.tsx?raw';
import MotionDemo from '../examples/MotionDemo';
import MotionDemoSrc from '../examples/MotionDemo.tsx?raw';
import ProfileCard from '../examples/ProfileCard';
import ProfileCardSrc from '../examples/ProfileCard.tsx?raw';
import QuickStart from '../examples/QuickStart';
import QuickStartSrc from '../examples/QuickStart.tsx?raw';
import SettingsPanel from '../examples/SettingsPanel';
import SettingsPanelSrc from '../examples/SettingsPanel.tsx?raw';
import TextOnImage from '../examples/TextOnImage';
import TextOnImageSrc from '../examples/TextOnImage.tsx?raw';
import * as Icons from '../icons';
import { Callout, Code, ConformanceList, EvidenceTable, Example, Link, Markdown, Page, Section, TOKENS, TokenTable, VerifiedTags, useVerify } from './kit';
import { COMPONENTS } from './components-data';
import { ComponentPage } from './ComponentPage';
import { SCENES } from '../scenes';
import { PARTS } from './router';
import meta from './meta.json';

const PART_BLURB: Record<string, string> = {
  Introduction: 'What Pane is, how to start, the rules behind every trade-off.',
  Foundations: 'Glass, colour, type, space, shape, motion and icons — each with live values.',
  Components: 'Every component in depth: demos, usage, generated API, verified keyboard and contrast.',
  Patterns: 'Whole screens assembled from the components, with the reasoning.',
  Accessibility: 'How every claim in this book is measured and tested.',
  Reference: 'All tokens, the decision log, the exceptions register, credits.',
};

const tok = (p: string) => TOKENS[p]?.value ?? '—';
const OPEN_EXCEPTIONS = (exceptionsMd.match(/^### E-\d{3}:.*— OPEN\s*$/gm) ?? []).length;

// ================================ Introduction ================================

function Overview() {
  return (
    <Page
      eyebrow="Pane · design system"
      title="Spatial glass for the web"
      lede={<p>Pane is a design system of clear, blurred glass panes floating over a real scene — the look of visionOS, rebuilt for the browser and held to WCAG contrast at every pixel it can measure. It was produced by kiln from one anchor component you picked: the profile card below. Every part of that card is a Pane component.</p>}
    >
      <section className="hero reveal" aria-label="The anchor card">
        <div className="hero-copy">
          <Card as="div">
            <h2 className="flush">What is in the box</h2>
            <ul>
              <li><b>pane-tokens</b> — {Object.keys(TOKENS).length} design tokens in three tiers (primitive → semantic → component), shipped as CSS custom properties and JSON.</li>
              <li><b>pane-react</b> — seven components: Environment, Card, Avatar, Button, IconButton, Tabs, Tag.</li>
              <li><b>This book</b> — foundations, every component in depth, patterns, accessibility evidence and the full token reference.</li>
            </ul>
            <VerifiedTags />
          </Card>
          <Card as="div">
            <h2 className="flush">Read this first</h2>
            <ol>
              <li><Link to="/getting-started">Getting started</Link> — install, wrap a screen in an Environment, place your first Card.</li>
              <li><Link to="/foundations/glass">Glass & environment</Link> — why glass needs to know what is behind it.</li>
              <li><Link to="/components/card">Card</Link> — the surface everything else sits on.</li>
            </ol>
          </Card>
        </div>
        <div className="hero-card"><ProfileCard idPrefix="hero" /></div>
      </section>

      <Section id="chapters" title="The book" wide>
        <div className="category-grid">
          {PARTS.map((part) => (
            <Card key={part.title} as="div">
              <Link to={part.pages[0].path}><span className="card-link">{part.title}</span></Link>
              <p className="flush muted">{PART_BLURB[part.title]}</p>
              <p className="flush small muted">{part.pages.length} chapter{part.pages.length === 1 ? '' : 's'}: {part.pages.map((p) => p.title).join(' · ')}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="status" title="Status">
        <p>Pane is a <b>pilot</b>: seven components, verified in Chromium only. It is complete enough to build a profile, a feed and a settings screen; it is not yet a general application kit (no inputs, dialogs or navigation shells). What is and is not proven is listed plainly on the <Link to="/accessibility">accessibility page</Link>, and every open compromise is in the <Link to="/reference/exceptions">exceptions register</Link> — currently {OPEN_EXCEPTIONS} open.</p>
        <Callout tone="note" title="How this book stays honest">
          <p>Numbers on these pages are not typed by hand. Token tables come from <code>pane-tokens/json</code>, “tokens used” lists from each component’s CSS, contrast tables from <code>evidence.json</code> and test results from <code>conformance.json</code>, all written by <code>pnpm run verify</code>. If a file is missing the page says UNVERIFIED instead of showing a number.</p>
        </Callout>
      </Section>
    </Page>
  );
}

function GettingStarted() {
  return (
    <Page eyebrow="Introduction" title="Getting started" lede={<p>Four steps: install the two packages, load the token stylesheet once, wrap the screen in an Environment that matches its backdrop, and put your content on Cards.</p>}>
      <Section id="install" title="1 · Install">
        <p>Pane ships as two packages. The tokens package has no dependencies; the React package needs React 18 or newer.</p>
        <div className="pkg-grid">
          <Card as="div">
            <p className="flush"><b>pane-tokens</b> <span className="muted">v{meta.version}</span></p>
            <p className="flush muted">{Object.keys(TOKENS).length} tokens as CSS custom properties (<code>pane-tokens/css</code>) and resolved JSON (<code>pane-tokens/json</code>).</p>
            <Code>{'pnpm add pane-tokens'}</Code>
          </Card>
          <Card as="div">
            <p className="flush"><b>pane-react</b> <span className="muted">v{meta.version}</span></p>
            <p className="flush muted">{Object.keys(meta.components).length} components, {(Object.values(meta.components).reduce((n, c) => n + c.bundle.gzip, 0) / 1024).toFixed(1)} kB min+gz all together (measured with esbuild; Tabs carries Radix).</p>
            <Code>{'pnpm add pane-react'}</Code>
          </Card>
        </div>
      </Section>
      <Section id="tokens" title="2 · Load the tokens once">
        <p>Import the generated stylesheet at your app’s entry point. It defines every <code>--ds-*</code> custom property, the three environment blocks, and the fallbacks for reduced transparency, forced colours, missing <code>backdrop-filter</code> and reduced motion. Nothing else needs configuring for those modes.</p>
        <Code>{`// main.tsx
import 'pane-tokens/css';`}</Code>
      </Section>
      <Section id="environment" title="3 · Declare the environment">
        <p>Glass only works if it knows how bright the scene behind it can get. Wrap the screen in an <Link to="/components/environment">Environment</Link> and choose the level for the brightest spot a card can land on while the user scrolls. If you are unsure, leave the default — <code>bright</code> — which is the safe end.</p>
        <Callout tone="rule" title="New background, new measurement">
          <p>Every background image you ship should go through <code>tooling/glass-sweep.mjs</code>. The level is a property of the image, not of the component.</p>
        </Callout>
      </Section>
      <Section id="first-card" title="4 · Your first pane" wide>
        <Example title="A section card with one action" code={QuickStartSrc}><QuickStart /></Example>
        <p>That is the whole pattern: an Environment at the top, a Card per group of content, a light Button for the one thing the card is for. The rest of this book explains why each of those choices is what it is.</p>
      </Section>
      <Section id="checklist" title="Before you ship">
        <ul className="checklist">
          <li>Every piece of text sits on a Card — never directly on the photo.</li>
          <li>The Environment level was measured for your background, not guessed.</li>
          <li>Each card has at most one light (primary) button.</li>
          <li>Icon-only buttons have an aria-label (the type enforces it).</li>
          <li>Sections have headings; decorative avatars next to names are marked decorative.</li>
        </ul>
      </Section>
    </Page>
  );
}

function Principles() {
  const items: Array<[string, string, ReactNode]> = [
    ['clear', 'Glass is clear, not grey', <p>A pane shows the scene through it — colour and soft shapes. It does not wash the scene out with a grey tint. Readability comes from dimming the backdrop (<code>backdrop-filter: brightness()</code>), which keeps hue and detail, not from painting over it. An earlier round used an 80% graphite tint; it was rejected as “grey, not blurred, not clear”.</p>],
    ['measured', 'Measured, not predicted', <p>Contrast on glass depends on what is behind it, so it cannot be computed from tokens. Pane renders every surface over real photographs in a real browser, hides the text, and scores the text colour against every pixel under it. The worst pixel is the score, not the average.</p>],
    ['text-on-glass', 'Text lives on glass', <p>Pane guarantees contrast only where it controls the surface. Body text straight on a photo is not a Pane pattern; it fails, measurably, on the first bright patch.</p>],
    ['optional', 'Glass is optional', <p>Reduced transparency, forced colours and browsers without <code>backdrop-filter</code> all get opaque graphite with no dimming. The same content must work there — glass carries mood, never information.</p>],
    ['soft', 'Motion is soft', <p>Things settle rather than snap: 420–640ms with a long ease-out, small distances (2px lift, 8–16px rise). Reduced motion turns every duration to zero at the token level.</p>],
    ['one-loud', 'One loud thing per pane', <p>White (light) and blue (accent) are the only solid fills. A card has at most one of them; everything else is glass.</p>],
  ];
  return (
    <Page eyebrow="Introduction" title="Principles" lede={<p>Six rules decide every trade-off in Pane. When a guideline elsewhere seems arbitrary, it comes from one of these.</p>}>
      {items.map(([id, title, body], i) => (
        <Section key={id} id={id} title={`${i + 1}. ${title}`}>{body}</Section>
      ))}
    </Page>
  );
}

// ================================ Foundations ================================

function Glass() {
  const { evidence } = useVerify();
  return (
    <Page eyebrow="Foundations" title="Glass & environment" lede={<p>The material is four operations applied to whatever is behind a pane — blur, saturate, dim, tint — plus a rim of light. This chapter explains each, how the numbers were chosen, and what happens when the user’s system says no to transparency.</p>}>
      <Section id="recipe" title="The recipe">
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Layer</th><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Why</th></tr></thead>
            <tbody>
              <tr><th scope="row">Blur</th><td><code>glass.blur</code></td><td><code>{tok('glass.blur')}</code></td><td>Turns the scene into soft colour. Heavier blur also averages away small bright spots, which helps contrast (64px beat 40px in the sweep).</td></tr>
              <tr><th scope="row">Saturate</th><td><code>glass.saturate</code></td><td><code>{tok('glass.saturate')}</code></td><td>Dimming desaturates; this puts the colour back so the glass looks lit, not muddy.</td></tr>
              <tr><th scope="row">Dim</th><td><code>glass.brightness</code></td><td><code>{tok('glass.brightness')}</code></td><td>The legibility lever. Lowers the backdrop’s light while keeping hue and detail.</td></tr>
              <tr><th scope="row">Tint</th><td><code>surface.glass</code></td><td><code>{tok('surface.glass')}</code></td><td>Almost nothing — 6% white so the pane has a body.</td></tr>
              <tr><th scope="row">Sheen</th><td><code>surface.sheen-top → sheen-bottom</code></td><td><code>{tok('surface.sheen-top')} → {tok('surface.sheen-bottom')}</code></td><td>A top-lit gradient so the pane reads as a surface catching light.</td></tr>
              <tr><th scope="row">Rim</th><td><code>line.rim-hi / mid / lo</code></td><td><code>{tok('line.rim-hi')}</code></td><td>Replaces a border: bright at the top-left, almost gone in the middle.</td></tr>
              <tr><th scope="row">Halo</th><td><code>elevation.halo</code></td><td><code>{tok('elevation.halo')}</code></td><td>A soft dark glow around white text — counted by WCAG as the text’s background when it is there.</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="environments" title="Environments">
        <p>A web page cannot read the pixels behind its own glass. So the app declares how bright the backdrop can get, and Pane picks the dimming for that level. Levels are named after the backdrop’s <i>brightest</i> region, because that is where a card fails.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Level</th><th scope="col">brightness</th><th scope="col">Status</th></tr></thead>
            <tbody>{(['dim', 'mid', 'bright'] as const).map((b) => <tr key={b}><th scope="row">{b}</th><td><code>{tok(`brightness.${b}`)}</code></td><td>{TOKENS[`brightness.${b}`]?.description}</td></tr>)}</tbody>
          </table>
        </div>
        <Callout tone="caution" title="All three levels share one value today">
          <p>Each of the four scene photos has a sunlit or lamp-lit region somewhere in frame, so all four measure as “bright”. dim and mid stay pinned to the bright value until a genuinely dark photo is measured — Pane does not ship a number nobody has measured.</p>
        </Callout>
      </Section>
      <Section id="how-chosen" title="How the numbers were chosen">
        <ol>
          <li><b>Anchor round.</b> Four treatments of the same profile card; you picked A (visionOS grey glass).</li>
          <li><b>Tint sweep.</b> Alpha alone could not make A pass: its grey caps white text at about 4.6:1 even fully opaque.</li>
          <li><b>Grey glass rejected.</b> A dark tint of 78–82% passed but looked like a grey slab.</li>
          <li><b>Dim instead of tint.</b> Switching to <code>brightness()</code> kept the scene’s colour. On the harness alone 0.4–0.5 passed; scrolling the whole docs page over the photos failed until 0.36.</li>
          <li><b>Thinner, on request.</b> You asked for thinner glass. Heavier blur (64px) and a text halo bought some room; 0.46 is the chosen compromise — 0.38 would pass every node, 0.46 leaves {evidence?.summary.excepted ?? 'a few'} nodes between 3.8 and 4.5:1, registered as <Link to="/reference/exceptions">E-001</Link>.</li>
        </ol>
      </Section>
      <Section id="fallbacks" title="Fallbacks">
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Condition</th><th scope="col">What Pane does</th><th scope="col">Verified by</th></tr></thead>
            <tbody>
              <tr><th scope="row">prefers-reduced-transparency</th><td>Glass → opaque {tok('surface.solid')}, blur 0, brightness 1.</td><td>evidence (every page and scene) + conformance</td></tr>
              <tr><th scope="row">forced-colors</th><td>Same opaque surface; rim becomes a CanvasText border; selected tab gets an underline.</td><td>evidence + axe in forced-colours mode</td></tr>
              <tr><th scope="row">no backdrop-filter</th><td>Same as reduced transparency (shared CSS block).</td><td>Not run directly — no test browser lacks backdrop-filter. UNVERIFIED.</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="scenes" title="The scenes" wide>
        <p>The four photos every measurement runs on. Switch between them with the scene control in the sidebar; the whole book re-renders on the new backdrop.</p>
        <div className="scene-grid">
          {SCENES.map((s) => <figure key={s.id} className="scene-thumb" style={{ backgroundImage: `url(/scenes/${s.id}.jpg)` }}><figcaption><Tag>{s.label} · {s.brightness}</Tag></figcaption></figure>)}
        </div>
      </Section>
    </Page>
  );
}

function ColorPage() {
  const prim = Object.entries(TOKENS).filter(([, t]) => t.tier === 'primitive' && t.type === 'color');
  return (
    <Page eyebrow="Foundations" title="Colour" lede={<p>Pane has very little colour of its own on purpose: the scene behind the glass supplies it. The palette is white at a handful of opacities, one graphite for the opaque fallback, one ink for text on white, and one blue.</p>}>
      <Section id="palette" title="Palette" wide>
        <ul className="swatches flush">
          {prim.map(([p, t]) => <li key={p}><span className="chip" style={{ background: `var(${t.css})` }} aria-hidden="true" /><code>{p}</code><span className="muted">{t.value}</span></li>)}
        </ul>
      </Section>
      <Section id="roles" title="Roles">
        <p>Components never use a primitive directly — they go through a semantic role. Change a role and every component that uses it follows.</p>
        <TokenTable prefix="text." />
        <TokenTable prefix="action." />
        <TokenTable prefix="surface." />
        <TokenTable prefix="line." />
      </Section>
      <Section id="rules" title="Rules">
        <ul>
          <li><b>Text is white on glass.</b> Primary text is pure white; secondary is white at 85%. Lower than 85% failed on the bright photos.</li>
          <li><b>Two solid fills only.</b> White (<code>surface.light</code>) for the main action, blue (<code>action.accent</code>) for promoted ones. Never both for equal actions.</li>
          <li><b>Blue is #0071E3, not Twitter blue.</b> #1D9BF0 measured about 2.9:1 under white text on its own fill.</li>
          <li><b>Opaque pairs are computed, glass pairs are measured.</b> White on blue is 4.70:1 by formula; anything on glass is only what the evidence run reads from pixels.</li>
        </ul>
      </Section>
    </Page>
  );
}

function Typography() {
  const steps = ['display', 'headline', 'title', 'emphasis', 'body', 'label', 'caption', 'micro'];
  const use: Record<string, string> = { display: 'Hero headings only', headline: 'Page and section titles', title: 'Card titles, names', emphasis: 'Ledes, key numbers', body: 'Running text', label: 'Buttons, tabs, table text', caption: 'Meta, timestamps', micro: 'Tags, eyebrows (uppercase)' };
  return (
    <Page eyebrow="Foundations" title="Typography" lede={<p>The system font stack — SF Pro on Apple platforms — at eight sizes. White type on glass needs weight and a halo more than it needs size; that is why body text is 15px regular but labels are semibold.</p>}>
      <Section id="scale" title="Scale" wide>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Step</th><th scope="col">Size</th><th scope="col">Use</th><th scope="col">Sample</th></tr></thead>
            <tbody>{steps.map((s) => <tr key={s}><th scope="row"><code>type.{s}</code></th><td>{tok(`type.${s}`)}</td><td>{use[s]}</td><td style={{ fontSize: `var(--ds-type-${s})`, lineHeight: 1.15 }}>Glass over the room</td></tr>)}</tbody>
          </table>
        </div>
      </Section>
      <Section id="weights" title="Weights, leading, tracking">
        <TokenTable prefix="type.weight" />
        <TokenTable prefix="type.leading" />
        <TokenTable prefix="type.tracking" />
      </Section>
      <Section id="legibility" title="Legibility on glass">
        <ul>
          <li><b>Halo.</b> All text on a Card inherits <code>elevation.halo</code>, a 14px soft dark glow plus a 1px drop. Solid-fill controls (light and accent buttons, the selected tab, avatars) reset it — dark glow around dark text on white would be mud.</li>
          <li><b>Large text.</b> WCAG lets text ≥24px, or ≥18.66px bold, pass at 3:1. The evidence run applies that per text node from its computed size and weight.</li>
          <li><b>Line length.</b> Prose is capped at <code>type.measure</code> ({tok('type.measure')}).</li>
          <li><b>Uppercase is CSS.</b> Eyebrows and tags are written in normal case and uppercased with <code>text-transform</code>, so screen readers read words.</li>
        </ul>
      </Section>
    </Page>
  );
}

function Spacing() {
  return (
    <Page eyebrow="Foundations" title="Spacing & layout" lede={<p>One scale of nine steps, named for intent rather than size. Cards breathe — 22px of padding and 14px between rows — because glass needs room for the backdrop to show around the content.</p>}>
      <Section id="scale" title="Scale" wide>
        <ul className="space-scale flush">
          {Object.entries(TOKENS).filter(([p]) => p.startsWith('gap.')).map(([p, t]) => <li key={p}><span className="bar" style={{ inlineSize: `var(${t.css})` }} aria-hidden="true" /><code>{p}</code> <span className="muted">{t.value}</span></li>)}
        </ul>
      </Section>
      <Section id="card-rhythm" title="Inside a card">
        <ul>
          <li>Padding: <code>card.padding</code> = {tok('card.padding')} on every side; the cover ignores it and bleeds to the edges.</li>
          <li>Between rows: <code>card.gap</code> = {tok('card.gap')}.</li>
          <li>Inside a row of controls: <code>gap.lg</code> ({tok('gap.lg')}); between tabs <code>tabs.gap</code> ({tok('tabs.gap')}).</li>
          <li>The large avatar overlaps the cover by half its height ({tok('control.avatar-lg')} ÷ 2).</li>
        </ul>
      </Section>
      <Section id="page" title="On the page">
        <ul>
          <li>Between cards: <code>gap.2xl</code> ({tok('gap.2xl')}); between sections of a page: <code>gap.page</code> ({tok('gap.page')}).</li>
          <li>Logical properties only — <code>padding-inline</code>, never <code>padding-left</code> — so right-to-left layouts need nothing extra. The no-hardcode lint rejects physical properties in components.</li>
        </ul>
      </Section>
    </Page>
  );
}

function Shape() {
  return (
    <Page eyebrow="Foundations" title="Shape & elevation" lede={<p>Big, soft corners and light instead of lines. Panes are rounded at 40px, things inside them at 24 and 18, and every control is a full pill.</p>}>
      <Section id="corners" title="Corners">
        <ul className="radius-scale flush">
          {Object.entries(TOKENS).filter(([p]) => p.startsWith('corner.')).map(([p, t]) => <li key={p}><span className="radius-chip" style={{ borderRadius: `var(${t.css})` }} aria-hidden="true" /><code>{p}</code> <span className="muted">{t.value}</span></li>)}
        </ul>
        <p>Nested corners shrink by about the padding between them, so inner shapes look concentric with the pane.</p>
      </Section>
      <Section id="elevation" title="Elevation">
        <TokenTable prefix="elevation." />
        <p>There are only two shadows. <b>float</b> lifts a pane off the scene; <b>lift</b> sits under solid buttons. Glass never stacks shadows on shadows.</p>
      </Section>
      <Section id="rim" title="The rim instead of a border">
        <p>A 1px gradient ring drawn with a mask: bright where light would hit (top-left), almost invisible along the middle, faint again at the bottom-right. It drifts on hover. In forced-colours mode it is replaced by a real CanvasText border so the pane edge never disappears.</p>
      </Section>
    </Page>
  );
}

function Motion() {
  return (
    <Page eyebrow="Foundations" title="Motion" lede={<p>Slow and soft. Nothing in Pane snaps or bounces: movements are small, durations are long, and every ease settles gently at the end.</p>}>
      <Section id="try" title="Try it" wide>
        <Example title="Hover, press and a view change" code={MotionDemoSrc}><MotionDemo /></Example>
      </Section>
      <Section id="tokens" title="Tokens">
        <TokenTable prefix="motion." />
        <TokenTable prefix="duration." />
        <TokenTable prefix="easing." />
      </Section>
      <Section id="choreography" title="Choreography">
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Moment</th><th scope="col">Duration</th><th scope="col">Movement</th></tr></thead>
            <tbody>
              <tr><th scope="row">Hover a control</th><td>motion.hover ({tok('motion.hover')})</td><td>Rise {tok('motion.lift')}, fill fades</td></tr>
              <tr><th scope="row">Press</th><td>motion.press ({tok('motion.press')})</td><td>Scale to {tok('motion.press-scale')}</td></tr>
              <tr><th scope="row">Panel / section enters</th><td>motion.enter ({tok('motion.enter')})</td><td>Rise {tok('motion.rise')} + fade, siblings staggered by {tok('motion.stagger')}</td></tr>
              <tr><th scope="row">Scene or environment changes</th><td>motion.scene ({tok('motion.scene')})</td><td>Backdrop crossfades; glass dimming glides</td></tr>
              <tr><th scope="row">Hover a card</th><td>motion.enter</td><td>The rim light drifts — the card itself stays still</td></tr>
            </tbody>
          </table>
        </div>
        <p>The ease is <code>easing.soft</code> = cubic-bezier({String(tok('easing.soft'))}): fast out of the gate, a long gentle landing, no overshoot.</p>
      </Section>
      <Section id="reduced" title="Reduced motion">
        <p>With <code>prefers-reduced-motion: reduce</code>, the token stylesheet sets every duration to 0ms, both distances to 0 and the press scale to 1. Components need no special case — they read the same tokens. The evidence and conformance runs execute with reduced motion so measurements are never taken mid-animation.</p>
      </Section>
    </Page>
  );
}

function IconsPage() {
  const list = Object.entries(Icons).filter(([n]) => n.startsWith('Icon'));
  return (
    <Page eyebrow="Foundations" title="Iconography" lede={<p>A small set of 1.7px stroke icons on a 24px grid, drawn to match the system font’s weight. Icons inherit the text colour and therefore the halo.</p>}>
      <Section id="set" title="The set" wide>
        <ul className="icon-grid flush">
          {list.map(([name, Icon]) => { const I = Icon as (p: { className?: string }) => ReactElement; return <li key={name}><I className="icon-cell" /><code>{name}</code></li>; })}
        </ul>
      </Section>
      <Section id="sizes" title="Sizes and rules">
        <ul>
          <li><code>control.icon-md</code> ({tok('control.icon-md')}) inside icon buttons and names; <code>control.icon-sm</code> ({tok('control.icon-sm')}) in meta rows.</li>
          <li>Decorative icons are <code>aria-hidden</code>; meaning goes in an IconButton label or in adjacent text.</li>
          <li>The verified badge is the one filled icon, and it carries its own label (“Verified”).</li>
        </ul>
      </Section>
    </Page>
  );
}

// ================================ Patterns ================================

function PatternPage({ title, lede, example, code, notes }: { title: string; lede: ReactNode; example: ReactNode; code: string; notes: Array<[string, ReactNode]> }) {
  return (
    <Page eyebrow="Pattern" title={title} lede={lede}>
      <Section id="example" title="Example" wide>
        <Example title={title} code={code} plain>{example}</Example>
      </Section>
      {notes.map(([t, body], i) => <Section key={t} id={`note-${i}`} title={t}>{body}</Section>)}
    </Page>
  );
}

const PATTERNS: Record<string, () => ReactElement> = {
  '/patterns/profile-card': () => (
    <PatternPage
      title="Profile card"
      lede={<p>The anchor: identity, bio, stats, view switcher, a nested post and one action — every Pane component in a single card.</p>}
      example={<div className="pattern-narrow"><ProfileCard idPrefix="pattern" /></div>}
      code={ProfileCardSrc}
      notes={[
        ['Structure', <ol><li>CardCover — decorative.</li><li>Large Avatar overlapping the cover by half its height, marked decorative because the name is printed beside it.</li><li>Name + verified badge as the card’s heading; handle in secondary text.</li><li>Bio, meta list with icons, stats.</li><li>Tabs switching the content below; the post lives in an inset Card — no second glass layer.</li><li>One light Button.</li></ol>],
        ['Why it is built this way', <ul><li>The edit action is an IconButton on the identity row, not a second solid button — one loud thing per pane.</li><li>Counts in the action row use tabular figures so they don’t jitter.</li><li>Text on the post image follows <Link to="/patterns/text-on-images">Text on images</Link>.</li></ul>],
      ]}
    />
  ),
  '/patterns/feed-post': () => (
    <PatternPage
      title="Feed post"
      lede={<p>A single post as its own pane: author row, body, media, actions.</p>}
      example={<div className="pattern-narrow"><FeedPost /></div>}
      code={FeedPostSrc}
      notes={[
        ['Rules', <ul><li>The author avatar is decorative; the author name is the visible label.</li><li>Media gets a real description through role="img" + aria-label (or a real &lt;img alt&gt;).</li><li>Overflow and share are ghost IconButtons with action labels (“More options”, “Share post”).</li><li>Counts are not buttons here — if they become actions, each needs its own label (“Reply, 268”).</li></ul>],
      ]}
    />
  ),
  '/patterns/settings-panel': () => (
    <PatternPage
      title="Settings panel"
      lede={<p>A titled section with tabs, a definition list of settings and a primary + secondary action pair.</p>}
      example={<SettingsPanel />}
      code={SettingsPanelSrc}
      notes={[
        ['Rules', <ul><li>The panel is a section with a heading; the tab list has its own label.</li><li>Setting rows are a &lt;dl&gt; — the setting name is the term, its current value the description.</li><li>Save is light, Cancel is glass: one loud thing.</li></ul>],
      ]}
    />
  ),
  '/patterns/text-on-images': () => (
    <PatternPage
      title="Text on images"
      lede={<p>The only place Pane puts text on something it does not control. It works only with a scrim on the text side and the text kept inside it.</p>}
      example={<div className="pattern-narrow"><TextOnImage /></div>}
      code={TextOnImageSrc}
      notes={[
        ['What was measured', <p>The first version put the caption across the whole image; where it crossed the sunlit cream and orange blobs it measured 3.07:1. Two fixes, both measured: a horizontal scrim on the text side plus a bottom scrim, and a caption capped at 52% width so it wraps inside the scrim. The numeral’s line box also overlapped the tag’s outline and the caption’s arrow until the media height was increased. Now: <ImageNumbers />.</p>],
        ['Rules', <ul><li>Scrim first, text second — never text first and hope.</li><li>Keep text in the scrimmed region; let it wrap rather than run into the bright side.</li><li>Leave space between text elements: the measurement reads the whole line box, and so does the eye.</li><li>Images you don’t control (user uploads) get no Pane guarantee — put the text below the image on the card.</li></ul>],
      ]}
    />
  ),
};

function ImageNumbers() {
  const { evidence } = useVerify();
  const w = evidence ? Math.min(...SCENES.map((s) => evidence.harness.normal?.[s.id]?.media?.worst ?? Infinity)) : null;
  return <>{w != null && Number.isFinite(w) ? <>worst image text across all scenes <b>{w.toFixed(2)}:1</b></> : 'UNVERIFIED'}</>;
}

// ================================ Accessibility ================================

function Accessibility() {
  const { evidence, conformance } = useVerify();
  const components = ['Environment', 'Card', 'Avatar', 'Button', 'IconButton', 'Tabs', 'Tag', 'Docs page'];
  return (
    <Page eyebrow="Accessibility" title="How Pane is verified" lede={<p>Two automated runs back every claim in this book: a pixel-level contrast run over real photos, and a behaviour run in a real browser. Both run against the built site, in three display modes, on every page.</p>}>
      <Section id="contrast" title="Contrast, measured">
        <ol>
          <li>Load the page (or the evidence harness) over each of the four scene photos.</li>
          <li>Wrap every visible text node in a background-less span, make only that span’s text transparent, screenshot.</li>
          <li>For each text node, score its colour against every pixel inside its boxes. Translucent text is blended with each pixel first. A halo with an explicit colour stays painted, so it counts — the WCAG rule for text with a halo.</li>
          <li>The node’s score is its worst pixel. Normal text needs 4.5:1; large text (≥24px, or ≥18.66px bold) needs 3:1.</li>
          <li>Repeat one viewport at a time down the whole page, in normal, reduced-transparency and forced-colours mode.</li>
        </ol>
        {evidence && <p><b>Last run:</b> {evidence.summary.gatingChecks} text checks, {evidence.summary.gatingFailures} failures, {evidence.summary.excepted ?? 0} excepted under E-001 (floor {evidence.exceptionFloor ?? '—'}:1) — {evidence.browser}, {new Date(evidence.generatedAt).toLocaleString()}.</p>}
        <Callout tone="note" title="Gate-proofed">
          <p>A check that cannot fail proves nothing. Each tool is run once with a deliberate defect — thinner glass, fainter text, a component token pointing at a primitive — and must turn red before it is trusted.</p>
        </Callout>
      </Section>
      <Section id="modes" title="Display modes">
        <ul>
          <li><b>Reduced transparency</b> — opaque graphite, no blur, no dimming (emulated via the Chrome DevTools protocol; the run checks the media query actually matched).</li>
          <li><b>Forced colours</b> — system colours; rims become borders; the selected tab is underlined.</li>
          <li><b>Reduced motion</b> — every duration 0ms at the token level.</li>
        </ul>
      </Section>
      <Section id="behaviour" title="Behaviour, tested" wide>
        {conformance && <p><b>{conformance.passed}/{conformance.total}</b> checks pass ({new Date(conformance.generatedAt).toLocaleString()}).</p>}
        {components.map((c) => <div key={c}><h3>{c}</h3><ConformanceList component={c} /></div>)}
      </Section>
      <Section id="evidence" title="All measured groups" wide>
        <EvidenceTable groups={['card', 'controls', 'environment', 'media']} />
      </Section>
      <Section id="not-covered" title="Not covered yet">
        <ul>
          <li>Safari and Firefox rendering — every run is Chromium.</li>
          <li>A browser with no backdrop-filter support (the fallback shares its CSS with reduced transparency, which is tested).</li>
          <li>A genuinely dark backdrop, so the dim and mid levels are uncalibrated.</li>
          <li>Screen-reader output (structure is tested via roles and names, not by listening).</li>
        </ul>
      </Section>
    </Page>
  );
}

// ================================ Reference ================================

function Tokens() {
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('');
  return (
    <Page eyebrow="Reference" title="Tokens" lede={<p>Every token Pane ships, with the token it points at and its resolved value. Components only ever read component tokens; component tokens only point at semantic ones; only primitives hold raw values — the build fails otherwise.</p>}>
      <Section id="all" title="All tokens" wide>
        <div className="token-filter">
          <label className="field"><span>Search</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. glass, accent, 40px" /></label>
          <label className="field"><span>Tier</span>
            <select value={tier} onChange={(e) => setTier(e.target.value)}><option value="">All</option><option value="primitive">Primitive</option><option value="semantic">Semantic</option><option value="component">Component</option></select>
          </label>
        </div>
        <TokenTable tier={tier || undefined} query={q} />
      </Section>
    </Page>
  );
}

const Decisions = () => (
  <Page eyebrow="Reference" title="Decisions" lede={<p>The system’s long-term memory, rendered straight from <code>system/DECISIONS.md</code>. Append-only: a changed decision is a new entry that supersedes the old one.</p>}>
    <Section id="log" title="Decision log" wide><Markdown source={decisionsMd} skipUntil={/^### D-001/} /></Section>
  </Page>
);
const Exceptions = () => (
  <Page eyebrow="Reference" title="Exceptions" lede={<p>Every accepted shortfall, with the narrowest scope it may be applied to, rendered from <code>system/EXCEPTIONS.md</code>. Currently {OPEN_EXCEPTIONS} open.</p>}>
    <Section id="register" title="Register" wide><Markdown source={exceptionsMd} skipUntil={/^### E-001/} /></Section>
  </Page>
);
const Credits = () => (
  <Page eyebrow="Reference" title="Credits" lede={<p>Photography, engines and tools Pane stands on.</p>}>
    <Section id="photos" title="Scene photos" wide><Markdown source={creditsMd} /></Section>
    <Section id="engines" title="Engines and tools">
      <ul>
        <li>Tab behaviour — Radix UI Tabs.</li>
        <li>Measurement — Playwright + Chromium, axe-core.</li>
        <li>Build — Vite, pnpm, a DTCG token build with tier enforcement.</li>
        <li>Produced with kiln, the design-system engine for Claude Code.</li>
      </ul>
    </Section>
  </Page>
);

// ================================ routing table ================================

export const PAGE_COMPONENTS: Record<string, () => ReactElement> = {
  '/': Overview,
  '/getting-started': GettingStarted,
  '/principles': Principles,
  '/foundations/glass': Glass,
  '/foundations/color': ColorPage,
  '/foundations/typography': Typography,
  '/foundations/spacing': Spacing,
  '/foundations/shape': Shape,
  '/foundations/motion': Motion,
  '/foundations/icons': IconsPage,
  ...Object.fromEntries(COMPONENTS.map((c) => [`/components/${c.slug}`, () => <ComponentPage c={c} />])),
  ...PATTERNS,
  '/accessibility': Accessibility,
  '/reference/tokens': Tokens,
  '/reference/decisions': Decisions,
  '/reference/exceptions': Exceptions,
  '/reference/credits': Credits,
};
