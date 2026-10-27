import { useState, type ReactElement, type ReactNode } from 'react';
import { Card, Environment, Select, Tag } from 'pane-react';
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
import GridBasic from '../examples/GridBasic';
import GridBasicSrc from '../examples/GridBasic.tsx?raw';
import SettingsPanel from '../examples/SettingsPanel';
import SettingsPanelSrc from '../examples/SettingsPanel.tsx?raw';
import TextOnImage from '../examples/TextOnImage';
import TextOnImageSrc from '../examples/TextOnImage.tsx?raw';
import * as Icons from '../icons';
import { ThemePlayground, GlassPlayground, ContrastPlayground, TypePlayground, SpacingPlayground, GridPlayground, ShapePlayground, MotionPlayground, IconBrowser, TouchTargetPlayground } from './playgrounds';
import { inline, useScene, Stage, PRINCIPLES, CONCEPT_INTRO, Callout, Code, CopyButton, ConformanceList, EvidenceTable, Example, Link, Markdown, Page, Section, TOKENS, TokenTable, VerifiedTags, useVerify } from './kit';
import { COMPONENTS } from './components-data';
import { GridLayoutPage } from './grid-page';
import { ComponentPage, EVIDENCE_GROUPS, HISTORY, STATUS_LABEL, TABS } from './ComponentPage';
import { TabRedirect } from './TabRedirect';
import { PATTERN_DEPTH } from '../patterns/content';
import { EXTRAS } from './foundation-extras';
import { AccessibilityFoundation, ContentFoundation, Contributing, Designing, Developing, Migrating } from './guides';
import { PatternDepthPage } from '../patterns/PatternDepth';
import { SCENES } from '../scenes';
import { PARTS } from './router';
import meta from './meta.json';

const PART_BLURB: Record<string, string> = {
  Introduction: 'What Pane is, how to start, the rules behind every trade-off.',
  Foundations: 'Glass, colour, type, space, shape, motion and icons. Each with live values.',
  Components: 'Every component in depth, with demos, usage, a generated API, and tested keyboard and contrast.',
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
      lede={<p>Pane is a design system of clear, blurred glass panes floating over a real scene. It brings the look of visionOS to the browser and holds it to WCAG contrast at every pixel it can measure. Kiln built it from one anchor component you picked, the profile card below, and every part of that card is a Pane component.</p>}
    >
      <section className="hero" aria-label="The anchor card">
        <div className="hero-copy">
          <div className="panel" data-surface="">
            <h2 className="flush">What is in the box</h2>
            <ul>
              <li><b>pane-tokens</b>. {Object.keys(TOKENS).length} design tokens in three tiers (primitive → semantic → component), shipped as CSS, JS (+ types), SCSS and JSON.</li>
              <li><b>pane-react</b> has {Object.keys(meta.components).length} components, namely {Object.keys(meta.components).join(', ')}.</li>
              <li><b>This book</b>. Foundations, every component in depth, patterns, accessibility evidence and the full token reference.</li>
            </ul>
            <VerifiedTags />
          </div>
          <div className="panel" data-surface="">
            <h2 className="flush">Read this first</h2>
            <ol>
              <li><Link to="/getting-started">Getting started</Link>. Install, wrap a screen in an Environment, place your first Card.</li>
              <li><Link to="/foundations/glass">Glass & environment</Link>. Why glass needs to know what is behind it.</li>
              <li><Link to="/components/card">Card</Link>. The surface everything else sits on.</li>
            </ol>
          </div>
        </div>
        <Stage className="hero-card"><ProfileCard idPrefix="hero" /></Stage>
      </section>

      <Section id="chapters" title="The book" wide>
        <div className="category-grid">
          {PARTS.map((part) => (
            <div key={part.title} className="panel" data-surface="">
              <Link to={part.pages[0].path}><span className="card-link">{part.title}</span></Link>
              <p className="flush muted">{PART_BLURB[part.title]}</p>
              <p className="flush small muted">{part.pages.length} chapter{part.pages.length === 1 ? '' : 's'}: {part.pages.map((p) => p.title).join(' · ')}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="status" title="Status">
        <p>Pane is a <b>pilot</b> with {Object.keys(meta.components).length} components, verified in Chromium only. It can lay out a profile, a feed, a dashboard of cards and a settings screen. Text inputs, dialogs and menus are still missing, so it is short of a general application kit. What is and is not proven is listed plainly on the <Link to="/accessibility">accessibility page</Link>, and every open compromise is in the <Link to="/reference/exceptions">exceptions register</Link>, which has {OPEN_EXCEPTIONS} open today.</p>
        <Callout tone="note" title="How this book stays honest">
          <p>Numbers on these pages are not typed by hand. Token tables come from <code>pane-tokens/json</code>, “tokens used” lists from each component’s CSS, contrast tables from <code>evidence.json</code> and test results from <code>conformance.json</code>, all written by <code>pnpm run verify</code>. If a file is missing the page says UNVERIFIED instead of showing a number.</p>
        </Callout>
      </Section>
    </Page>
  );
}

function GettingStarted() {
  return (
    <Page eyebrow="Getting started" title="Getting started" lede={<p>Install the two packages and load the token stylesheet once. Then wrap the screen in an Environment that matches its backdrop and put your content on Cards.</p>}>
      <Section id="install" title="1 · Install">
        <p>One package and one import are enough. <code>pane-react</code> carries the tokens inside it, so a React app installs nothing else and loads one stylesheet. It needs React 18 or newer.</p>
        <Code label="Install">{'npm install pane-react'}</Code>
        <Code label="main.tsx">{"import 'pane-react/all.css';\nimport { Environment, Card, Button } from 'pane-react';"}</Code>
        <p>The tokens are also on their own as <code>pane-tokens</code>, for projects that are not React. The React package includes them as <code>pane-react/tokens.css</code> and <code>pane-react/tokens</code>, so you never need both.</p>
        <div className="pkg-grid">
          <div className="panel" data-surface="">
            <p className="flush"><b>pane-tokens</b> <span className="muted">v{meta.version}</span></p>
            <p className="flush muted">{Object.keys(TOKENS).length} tokens as CSS custom properties (<code>pane-tokens/css</code>) and resolved JSON (<code>pane-tokens/json</code>).</p>
            <Code>{'pnpm add pane-tokens'}</Code>
          </div>
          <div className="panel" data-surface="">
            <p className="flush"><b>pane-react</b> <span className="muted">v{meta.version}</span></p>
            <p className="flush muted">{Object.keys(meta.components).length} components, {(Object.values(meta.components).reduce((n, c) => n + c.bundle.gzip, 0) / 1024).toFixed(1)} kB min+gz all together (measured with esbuild; Tabs carries Radix).</p>
            <Code>{'pnpm add pane-react'}</Code>
          </div>
        </div>
      </Section>
      <Section id="other-project" title="Using Pane in another project">
        <p>Nothing is published to a registry (that stays your decision). Three ways to bring Pane into another codebase, from simplest:</p>
        <h3>A · Tarballs</h3>
        <Code>{`# in this repo
pnpm run release:pack            # → release/pane-tokens-${meta.version}.tgz, release/pane-react-${meta.version}.tgz

# in the other project
npm install /path/to/release/pane-react-${meta.version}.tgz`}</Code>
        <p>Every verify run installs exactly these tarballs into an empty project and imports, requires and server-renders them (<code>tooling/smoke-import.mjs</code>), so this path is tested on every run.</p>
        <h3>B · Workspace or file dependency</h3>
        <Code>{`// other-project/package.json
"dependencies": {
  "pane-tokens": "file:../pilot-glass/packages/tokens",
  "pane-react": "file:../pilot-glass/packages/react"
}`}</Code>
        <h3>C · Tokens only</h3>
        <p>For a non-React project, take <code>pane-tokens</code> alone. Every format is in the package:</p>
        <div className="table-wrap"><table>
          <thead><tr><th scope="col">Import</th><th scope="col">What you get</th></tr></thead>
          <tbody>
            <tr><th scope="row"><code>pane-tokens/css</code></th><td>All custom properties, environments, breakpoint blocks, fallbacks, reduced motion, grid span rules.</td></tr>
            <tr><th scope="row"><code>pane-tokens/js</code></th><td>An ES module with <code>tokens</code> (resolved values) and <code>cssVar</code> (var() references), typed by <code>TokenName</code>.</td></tr>
            <tr><th scope="row"><code>pane-tokens/scss</code></th><td><code>$ds-*</code> as var() references and <code>$ds-raw-*</code> resolved values (for media queries).</td></tr>
            <tr><th scope="row"><code>pane-tokens/json</code></th><td>Every token with tier, type, reference and resolved value. For build tools and Figma sync.</td></tr>
          </tbody>
        </table></div>
        <Code>{`import { tokens, cssVar } from 'pane-tokens/js';
tokens['layout.columns'];      // "4"  (resolved, base breakpoint)
cssVar['card.radius'];         // "var(--ds-card-radius)"

// SCSS
@use 'pane-tokens/scss' as *;
.sidebar { inline-size: $ds-layout-sidebar; }
@media (min-width: $ds-raw-breakpoint-lg) { .sidebar { display: block; } }`}</Code>
        <h3>Framework notes</h3>
        <ul>
          <li><b>Vite or Create React App</b>. Import both stylesheets in your entry file with <code>import 'pane-tokens/css'</code> and <code>import 'pane-react/styles.css'</code>.</li>
          <li><b>Next.js (app router)</b>. Import both in <code>app/layout.tsx</code>. Components are client components where they hold state (Tabs, Chip); wrap pages using them in <code>'use client'</code> boundaries as usual.</li>
          <li><b>Backgrounds</b>. Bring your own scene image and run <code>glass-sweep</code> on it to pick the Environment level.</li>
        </ul>
      </Section>

      <Section id="tokens" title="2 · Load the tokens once">
        <p>Import the generated stylesheet at your app’s entry point. It defines every <code>--ds-*</code> custom property, the three environment blocks, and the fallbacks for reduced transparency, forced colours, missing <code>backdrop-filter</code> and reduced motion. Nothing else needs configuring for those modes.</p>
        <Code>{`// main.tsx
import 'pane-tokens/css';
import 'pane-react/styles.css';`}</Code>
      </Section>
      <Section id="environment" title="3 · Declare the environment">
        <p>Glass only works if it knows how bright the scene behind it can get. Wrap the screen in an <Link to="/components/environment">Environment</Link> and choose the level for the brightest spot a card can land on while the user scrolls. If you are unsure, leave the default. <code>bright</code>. Which is the safe end.</p>
        <Callout tone="rule" title="New background, new measurement">
          <p>Every background image you ship should go through <code>tooling/glass-sweep.mjs</code>. The level belongs to the image you ship.</p>
        </Callout>
      </Section>
      <Section id="first-card" title="4 · Your first pane" wide>
        <Example title="A section card with one action" code={QuickStartSrc}><QuickStart /></Example>
        <p>That covers the whole pattern. An Environment sits at the top, each group of content gets a Card, and a light Button marks the one thing a card is for. The rest of this book explains each of those choices.</p>
      </Section>
      <Section id="checklist" title="Before you ship">
        <ul className="checklist">
          <li>Every piece of text sits on a Card. Never directly on the photo.</li>
          <li>The Environment level was measured for your background.</li>
          <li>Each card has at most one light (primary) button.</li>
          <li>Icon-only buttons have an aria-label (the type enforces it).</li>
          <li>Sections have headings; decorative avatars next to names are marked decorative.</li>
        </ul>
      </Section>
    </Page>
  );
}

function Principles() {
  return (
    <Page eyebrow="Introduction" title="Principles" lede={<p>{CONCEPT_INTRO}</p>}>
      <Section id="how" title="How the principles are used">
        <p>Every token, every part of a component, every state and every movement names one of these principles and says what it does for the reader. The build fails when something has no reason, or when the reason is only about how it looks. The Why column in every token table and the reasons section on every component page come from those records.</p>
      </Section>
      {PRINCIPLES.map((p) => (
        <Section key={p.id} id={p.id.toLowerCase()} title={`${p.id} · ${p.name}`}>
          <p>{p.claim}</p>
          <div className="table-wrap">
            <table>
              <caption>What follows from {p.id} on each axis</caption>
              <thead><tr><th scope="col">Axis</th><th scope="col">Therefore</th></tr></thead>
              <tbody>{p.therefore.map(([axis, text]) => <tr key={axis}><th scope="row">{axis}</th><td>{text}</td></tr>)}</tbody>
            </table>
          </div>
        </Section>
      ))}
    </Page>
  );
}

// ================================ Foundations ================================

function GlassPlaygroundWithScene() { return <GlassPlayground scene={useScene()} />; }

function Glass() {
  const { evidence } = useVerify();
  return (
    <Page eyebrow="Foundations" title="Glass & environment" lede={<p>The material is four operations applied to whatever is behind a pane. Blur, saturate, dim, tint. Plus a rim of light. This chapter explains each, how the numbers were chosen, and what happens when the user’s system says no to transparency.</p>}>
      <Section id="playground" title="Try the recipe" wide>
        <p>Move the sliders over the current scene and watch the card. Switch the demo backdrop in the top bar to see why one value has to hold over every photo.</p>
        <GlassPlaygroundWithScene />
      </Section>
      <Section id="recipe" title="The recipe">
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Layer</th><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Why</th></tr></thead>
            <tbody>
              <tr><th scope="row">Blur</th><td><code>glass.blur</code></td><td><code>{tok('glass.blur')}</code></td><td>Turns the scene into soft colour. Heavier blur also averages away small bright spots, which helps contrast (64px beat 40px in the sweep).</td></tr>
              <tr><th scope="row">Saturate</th><td><code>glass.saturate</code></td><td><code>{tok('glass.saturate')}</code></td><td>Dimming drains colour, and this puts it back so the glass looks lit.</td></tr>
              <tr><th scope="row">Dim</th><td><code>glass.brightness</code></td><td><code>{tok('glass.brightness')}</code></td><td>The legibility lever. Lowers the backdrop’s light while keeping hue and detail.</td></tr>
              <tr><th scope="row">Tint</th><td><code>surface.glass</code></td><td><code>{tok('surface.glass')}</code></td><td>Almost nothing. 6% white so the pane has a body.</td></tr>
              <tr><th scope="row">Sheen</th><td><code>surface.sheen-top → sheen-bottom</code></td><td><code>{tok('surface.sheen-top')} → {tok('surface.sheen-bottom')}</code></td><td>A top-lit gradient so the pane reads as a surface catching light.</td></tr>
              <tr><th scope="row">Rim</th><td><code>line.rim-hi / mid / lo</code></td><td><code>{tok('line.rim-hi')}</code></td><td>Takes the place of a border. It is bright at the top left and almost gone in the middle.</td></tr>
              <tr><th scope="row">Halo</th><td><code>elevation.halo</code></td><td><code>{tok('elevation.halo')}</code></td><td>A soft dark glow around white text. Counted by WCAG as the text’s background when it is there.</td></tr>
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
          <p>Each of the four scene photos has a sunlit or lamp-lit region somewhere in frame, so all four measure as “bright”. dim and mid stay pinned to the bright value until a genuinely dark photo is measured. Pane does not ship a number nobody has measured.</p>
        </Callout>
      </Section>
      <Section id="how-chosen" title="How the numbers were chosen">
        <ol>
          <li><b>Anchor round.</b> Four treatments of the same profile card; you picked A (visionOS grey glass).</li>
          <li><b>Tint sweep.</b> Alpha alone could not make A pass, because its grey caps white text at about 4.6:1 even fully opaque.</li>
          <li><b>Grey glass rejected.</b> A dark tint of 78–82% passed but looked like a grey slab.</li>
          <li><b>Dim instead of tint.</b> Switching to <code>brightness()</code> kept the scene’s colour. The test page alone passed at 0.4 to 0.5, but the whole docs page scrolled over the photos kept failing until 0.36.</li>
          <li><b>Thinner, on request.</b> You asked for thinner glass. Heavier blur (64px) and a text halo bought some room; 0.46 is the chosen compromise. 0.38 would pass every node, 0.46 leaves {evidence?.summary.excepted ?? 'a few'} nodes between 3.8 and 4.5:1, registered as <Link to="/reference/exceptions">E-001</Link>.</li>
        </ol>
      </Section>
      <Section id="fallbacks" title="Fallbacks">
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Condition</th><th scope="col">What Pane does</th><th scope="col">Verified by</th></tr></thead>
            <tbody>
              <tr><th scope="row">prefers-reduced-transparency</th><td>Glass → opaque {tok('surface.solid')}, blur 0, brightness 1.</td><td>evidence (every page and scene) + conformance</td></tr>
              <tr><th scope="row">forced-colors</th><td>Same opaque surface; rim becomes a CanvasText border; selected tab gets an underline.</td><td>evidence + axe in forced-colours mode</td></tr>
              <tr><th scope="row">no backdrop-filter</th><td>Same as reduced transparency (shared CSS block).</td><td>Not run directly. No test browser lacks backdrop-filter. UNVERIFIED.</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="scenes" title="The scenes" wide>
        <p>The four photos every measurement runs on. Switch between them with the scene control in the sidebar; the whole book re-renders on the new backdrop.</p>
        <div className="scene-grid">
          {SCENES.map((s) => <figure key={s.id} className="scene-thumb" data-theme="dark" style={{ backgroundImage: `url(/scenes/${s.id}-sm.jpg)` }}><figcaption><Tag>{s.label} · {s.brightness}</Tag></figcaption></figure>)}
        </div>
      </Section>
    </Page>
  );
}

function ColorPage() {
  const prim = Object.entries(TOKENS).filter(([, t]) => t.tier === 'primitive' && t.type === 'color');
  return (
    <Page eyebrow="Foundations" title="Colour" lede={<p>Pane has very little colour of its own on purpose, because the scene behind the glass supplies it. The palette is white at a handful of opacities plus one graphite for the opaque fallback, one ink for text on white and one blue.</p>}>
      <Section id="playground" title="Check a pair" wide>
        <p>Pick any two solid colours from the palette to see their contrast and which WCAG levels they meet.</p>
        <ContrastPlayground />
      </Section>
      <Section id="palette" title="Palette" wide>
        <ul className="swatches flush">
          {prim.map(([p, t]) => <li key={p}><span className="chip" style={{ background: `var(${t.css})` }} aria-hidden="true" /><code>{p}</code><span className="muted">{t.value}</span></li>)}
        </ul>
      </Section>
      <Section id="roles" title="Roles">
        <p>Components never use a primitive directly. They go through a semantic role. Change a role and every component that uses it follows.</p>
        <TokenTable prefix="text." />
        <TokenTable prefix="action." />
        <TokenTable prefix="surface." />
        <TokenTable prefix="line." />
      </Section>
      <Section id="rules" title="Rules">
        <ul>
          <li><b>Text follows the theme.</b> Dark glass carries white text and light glass carries ink. Secondary text is the same colour at a lower opacity, held at the lowest value that still passed on the bright photos.</li>
          <li><b>Two solid fills only.</b> The loud solid (<code>surface.light</code>, white in dark and ink in light) for the main action, and blue (<code>action.accent</code>) for promoted ones. Never both for equal actions. <Link to="/foundations/themes">Themes & backdrops</Link> shows both.</li>
          <li><b>Blue is #0071E3, not Twitter blue.</b> #1D9BF0 measured about 2.9:1 under white text on its own fill.</li>
          <li><b>Opaque pairs are computed, glass pairs are measured.</b> White on blue is 4.70:1 by formula; anything on glass is only what the evidence run reads from pixels.</li>
        </ul>
      </Section>
    </Page>
  );
}

function ThemeMatrixDemo() {
  const Hero = COMPONENTS.find((c) => c.name === 'Card')!.hero.Render;
  return (
    <div className="theme-matrix">
      {(['dark', 'light'] as const).map((th) => SCENES.map((sc) => (
        <figure key={`${th}-${sc.id}`} className="backdrop-cell env-tile" data-cell="" data-scene-kind={sc.id === "night" ? "dark" : "bright"} data-tile={sc.id} data-theme={th}>
          <figcaption className="backdrop-caption">{th} · {sc.label}</figcaption>
          <Environment brightness="bright"><Hero /></Environment>
        </figure>
      )))}
    </div>
  );
}

function Themes() {
  const themed = Object.entries(TOKENS).filter(([, t]) => t.themes);
  return (
    <Page eyebrow="Foundations" title="Themes & backdrops" lede={<p>Pane ships two themes. Dark glass dims the scene and sets white text on it. Light glass lifts and whitens the scene and sets ink text on it. Both run on the same components and the same tokens, and both are measured over all four photos.</p>}>
      <Section id="playground" title="Try a theme on a scene" wide>
        <p>Pick a theme and a backdrop. The night café is the hard case for light glass and the city is the hard case for dark glass.</p>
        <ThemePlayground />
      </Section>
      <Section id="switch" title="Switching themes">
        <p>Set <code>data-theme</code> on any element. The nearest one wins, so a light panel can sit inside a dark page and the other way round. With no attribute anywhere, the page follows the reader’s system setting through <code>prefers-color-scheme</code>.</p>
        <Code label="HTML">{`<html data-theme="light">   <!-- whole page -->\n<aside data-theme="dark">   <!-- one region -->`}</Code>
        <Code label="React">{`document.documentElement.dataset.theme = 'light';\n// remove the attribute to follow the system again\ndelete document.documentElement.dataset.theme;`}</Code>
        <p>The theme control at the top of the sidebar does exactly this and remembers the choice in <code>localStorage</code>.</p>
        <p>A nested region gets fresh token values, but CSS still hands it the colour and text shadow its parent already computed. Cards set both themselves. For plain text in a nested region, set them on the region too.</p>
        <Code label="CSS">{`[data-theme] [data-theme] {\n  color: var(--ds-text-primary);\n  text-shadow: var(--ds-card-text-halo);\n}`}</Code>
      </Section>
      <Section id="matrix" title="One card, both themes, every scene" wide>
        <p>The same card in each theme over each of the four photos. Look at the night café row first. That is where light glass works hardest, because ink text needs a pale surface and the photo behind is almost black.</p>
        <ThemeMatrixDemo />
      </Section>
      <Section id="changes" title="What changes between themes" wide>
        <p>Only these tokens have a second value. Everything else, from spacing to motion to the blue accent, is the same in both themes.</p>
        <div className="table-wrap">
          <table className="tokens">
            <thead><tr><th scope="col">Token</th><th scope="col">Dark</th><th scope="col">Light</th><th scope="col">Copy</th></tr></thead>
            <tbody>
              {themed.map(([p, t]) => (
                <tr key={p}>
                  <td><code>{p}</code></td>
                  <td><ThemeValue type={t.type} v={t.value} /></td>
                  <td><ThemeValue type={t.type} v={t.themes!.light.value} /></td>
                  <td><CopyButton text={`var(${t.css})`} label={`Copy var(${t.css})`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="bright-dark" title="Bright scenes and dark scenes">
        <p>The theme and the scene are two separate things. The theme is the reader’s choice. The scene is whatever photo, video or wallpaper sits behind the glass, and you rarely control it.</p>
        <ul>
          <li><b>Dark theme on a bright scene</b> is the hard case for dark glass. The Environment level decides how far the glass dims, and <code>bright</code> is the safe default.</li>
          <li><b>Dark theme on a dark scene</b> is easy. White text reads well and you can step down to <code>mid</code> or <code>dim</code> for a clearer pane if you know the scene.</li>
          <li><b>Light theme on a bright scene</b> is easy. The glass only has to whiten what is already pale.</li>
          <li><b>Light theme on a dark scene</b> is the hard case for light glass. The tint is set high enough that ink text still passes over the night café photo.</li>
        </ul>
        <Callout tone="caution" title="Text straight on the photo">Neither theme protects text that sits outside a pane. Put it on glass, or on a scrim, in both themes.</Callout>
      </Section>
      <Section id="solids" title="Solid fills flip">
        <p>The loud fill in each theme is the opposite of the text colour. Dark theme uses a white button with ink text. Light theme uses an ink button with white text. Code that asks for <code>surface.light</code> gets the right one in each theme, so the name means “the loud solid” and not literally white. Accent blue and the status colours stay the same in both, because their text pairs are worked out on the fill itself.</p>
      </Section>
      <Section id="evidence" title="Measured in both themes" wide>
        <p>Every check in the evidence run is repeated for each theme. The table shows how many text elements failed per theme and scene.</p>
        <EvidenceTable groups={['card', 'controls', 'status']} />
      </Section>
      <Section id="checklist" title="Before you ship a theme">
        <ul>
          <li>Run the evidence pass with the theme on and read the worst pixel for every scene you support.</li>
          <li>Give every new semantic colour a value for both themes, or leave it theme-free on purpose.</li>
          <li>Never pick a colour in component CSS by theme. Ask for a role and let the theme answer.</li>
          <li>Check reduced transparency in both themes. It swaps glass for an opaque surface that has its own pair.</li>
        </ul>
      </Section>
    </Page>
  );
}

function ThemeValue({ type, v }: { type: string; v: string }) {
  return type === 'color' ? <span className="tv"><span className="chip" style={{ background: v }} aria-hidden="true" /><code>{v}</code></span> : <code>{v}</code>;
}

function Typography() {
  const steps = ['display', 'headline', 'title', 'emphasis', 'body', 'label', 'caption', 'micro'];
  const use: Record<string, string> = { display: 'Hero headings only', headline: 'Page and section titles', title: 'Card titles, names', emphasis: 'Ledes, key numbers', body: 'Running text', label: 'Buttons, tabs, table text', caption: 'Meta, timestamps', micro: 'Tags, eyebrows (uppercase)' };
  return (
    <Page eyebrow="Foundations" title="Typography" lede={<p>The system font stack. SF Pro on Apple platforms. At eight sizes. White type on glass needs weight and a halo more than it needs size; that is why body text is 15px regular but labels are semibold.</p>}>
      <Section id="playground" title="Type tester" wide>
        <p>Type your own words and try each size, weight and line height. The snippet below always matches what you see.</p>
        <TypePlayground />
      </Section>
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
          <li><b>Halo.</b> All text on a Card inherits <code>elevation.halo</code>, a 14px soft dark glow plus a 1px drop. Solid-fill controls (light and accent buttons, the selected tab, avatars) reset it. Dark glow around dark text on white would be mud.</li>
          <li><b>Large text.</b> WCAG lets text ≥24px, or ≥18.66px bold, pass at 3:1. The evidence run applies that per text node from its computed size and weight.</li>
          <li><b>Line length.</b> Prose is capped at <code>type.measure</code> ({tok('type.measure')}).</li>
          <li><b>Uppercase is CSS.</b> Eyebrows and tags are written in normal case and uppercased with <code>text-transform</code>, so screen readers read words.</li>
        </ul>
      </Section>
    </Page>
  );
}

function Spacing() {
  const scale = Object.entries(TOKENS).filter(([p]) => p.startsWith('space.')).sort((a, b) => parseFloat(String(a[1].value)) - parseFloat(String(b[1].value)));
  return (
    <Page eyebrow="Foundations" title="Spacing" lede={<p>One 4px-base scale. A key times four is the size in pixels. <code>space.6</code> is 24px. With half steps where real layouts need them. Components never read the scale directly; they read named gaps that point at it.</p>}>
      <Section id="playground" title="Try a gap" wide>
        <SpacingPlayground />
      </Section>
      <Section id="scale" title="The scale" wide>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Specimen</th><th scope="col"><span className="visually-hidden">Copy</span></th></tr></thead>
            <tbody>{scale.map(([p, t]) => <tr key={p}><th scope="row"><code>{p}</code></th><td>{String(t.value)}</td><td><span className="bar" style={{ inlineSize: `var(${t.css})` }} aria-hidden="true" /></td><td><CopyButton text={`var(${t.css})`} label={`Copy var(${t.css})`} /></td></tr>)}</tbody>
          </table>
        </div>
      </Section>
      <Section id="gaps" title="Named gaps">
        <p>What components and layouts actually use. Each points at one step of the scale, so changing the scale moves everything consistently.</p>
        <TokenTable prefix="gap." />
      </Section>
      <Section id="rules" title="Rules">
        <ul>
          <li><b>Space belongs to the parent.</b> Components have no outer margins; use <Link to="/components/stack">Stack</Link> gaps or <Link to="/components/grid">Grid</Link> gutters.</li>
          <li><b>Closer means related.</b> Label → value 4px, rows in a group 14–16px, groups 24–32px, sections 48px.</li>
          <li><b>Logical properties only.</b> <code>padding-inline</code>, never <code>padding-left</code>. RTL works with no extra CSS; the lint rejects physical properties.</li>
        </ul>
      </Section>
    </Page>
  );
}


function Dimensions() {
  return (
    <Page eyebrow="Foundations" title="Dimensions" lede={<p>This chapter lists every fixed size in Pane, from breakpoints and container widths to control heights, touch targets and the stacking order. Use these instead of numbers in your own code so a consuming project stays in step with the system.</p>}>
      <Section id="playground" title="See the hit areas" wide>
        <TouchTargetPlayground />
      </Section>
      <Section id="breakpoints" title="Breakpoints"><TokenTable prefix="breakpoint." /></Section>
      <Section id="controls" title="Controls & targets">
        <TokenTable prefix="control." />
        <p><code>layout.touch</code> is {tok('layout.touch')}, the minimum hit area for anything tappable. WCAG 2.5.8 asks for 24px. Pane uses Apple’s 44pt, and the 32px tabs and chips still clear the WCAG floor.</p>
      </Section>
      <Section id="sizes" title="Sizes"><TokenTable prefix="size." /></Section>
      <Section id="layers" title="Stacking order">
        <TokenTable prefix="layer." />
        <p>Use the named layer (<code>var(--ds-layer-overlay)</code>) instead of a bare z-index. Two overlays from two teams then still stack predictably.</p>
      </Section>
    </Page>
  );
}

function Shape() {
  return (
    <Page eyebrow="Foundations" title="Shape & elevation" lede={<p>Big, soft corners and light instead of lines. Panes are rounded at 40px, things inside them at 24 and 18, and every control is a full pill.</p>}>
      <Section id="playground" title="Corner and shadow" wide>
        <ShapePlayground />
      </Section>
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
        <p>A 1px gradient ring is drawn with a mask. It is bright where light would hit at the top left, almost invisible along the middle and faint again at the bottom right, and it drifts on hover. In forced-colours mode it is replaced by a real CanvasText border so the pane edge never disappears.</p>
      </Section>
    </Page>
  );
}

function Motion() {
  return (
    <Page eyebrow="Foundations" title="Motion" lede={<p>Slow and soft. Movements in Pane are small and durations long, and every ease settles gently at the end without a bounce.</p>}>
      <Section id="playground" title="Motion player" wide>
        <p>Pick a duration and an easing, then press Play. The curve shows how the ease spends its time.</p>
        <MotionPlayground />
      </Section>
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
              <tr><th scope="row">Hover a card</th><td>motion.enter</td><td>The rim light drifts. The card itself stays still</td></tr>
            </tbody>
          </table>
        </div>
        <p>The ease is <code>easing.soft</code>, <code>{String(tok('easing.soft'))}</code>. It leaves quickly and lands slowly, with no overshoot.</p>
      </Section>
      <Section id="reduced" title="Reduced motion">
        <p>With <code>prefers-reduced-motion: reduce</code>, the token stylesheet sets every duration to 0ms, both distances to 0 and the press scale to 1. Components need no special case. They read the same tokens. The evidence and conformance runs use reduced motion, so every measurement sees the final frame.</p>
      </Section>
    </Page>
  );
}

function IconsPage() {
  const list = Object.entries(Icons).filter(([n]) => n.startsWith('Icon'));
  return (
    <Page eyebrow="Foundations" title="Iconography" lede={<p>A small set of 1.7px stroke icons on a 24px grid, drawn to match the system font’s weight. Icons inherit the text colour and therefore the halo.</p>}>
      <Section id="browser" title="Find and copy an icon" wide>
        <IconBrowser />
      </Section>
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
      lede={<p>This is the anchor card. It holds identity, a bio, stats, a view switcher, a nested post and one action, which puts most Pane components in a single card.</p>}
      example={<div className="pattern-narrow"><ProfileCard idPrefix="pattern" /></div>}
      code={ProfileCardSrc}
      notes={[
        ['Structure', <ol><li>CardCover. Decorative.</li><li>Large Avatar overlapping the cover by half its height, marked decorative because the name is printed beside it.</li><li>Name + verified badge as the card’s heading; handle in secondary text.</li><li>Bio, meta list with icons, stats.</li><li>Tabs switching the content below; the post lives in an inset Card. No second glass layer.</li><li>One light Button.</li></ol>],
        ['Why it is built this way', <ul><li>The edit action is an IconButton on the identity row, which keeps the card to one solid button.</li><li>Counts in the action row use tabular figures so they don’t jitter.</li><li>Text on the post image follows <Link to="/patterns/text-on-images">Text on images</Link>.</li></ul>],
      ]}
    />
  ),
  '/patterns/feed-post': () => (
    <PatternPage
      title="Feed post"
      lede={<p>A single post gets its own pane, with an author row, the body, media and actions.</p>}
      example={<div className="pattern-narrow"><FeedPost /></div>}
      code={FeedPostSrc}
      notes={[
        ['Rules', <ul><li>The author avatar is decorative; the author name is the visible label.</li><li>Media gets a real description through role="img" + aria-label (or a real &lt;img alt&gt;).</li><li>Overflow and share are ghost IconButtons with action labels (“More options”, “Share post”).</li><li>Counts are not buttons here. If they become actions, each needs its own label (“Reply, 268”).</li></ul>],
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
        ['Rules', <ul><li>The panel is a section with a heading; the tab list has its own label.</li><li>Setting rows are a &lt;dl&gt;. The setting name is the term, its current value the description.</li><li>Save is light and Cancel is glass, so the card keeps one loud thing.</li></ul>],
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
        ['What was measured', <p>The first version ran the caption across the whole image, and where it crossed the sunlit cream and orange blobs it measured 3.07:1. Two measured fixes followed. A horizontal scrim on the text side and a bottom scrim darkened the area, and the caption was capped at 52% width so it wraps inside the scrim. The numeral’s line box also overlapped the tag’s outline and the caption’s arrow until the media height was increased. The current result is <ImageNumbers />.</p>],
        ['Rules', <ul><li>Scrim first, text second. Never text first and hope.</li><li>Keep text in the scrimmed region; let it wrap rather than run into the bright side.</li><li>Leave space between text elements. The measurement reads the whole line box, and so does the eye.</li><li>Images you don’t control (user uploads) get no Pane guarantee. Put the text below the image on the card.</li></ul>],
      ]}
    />
  ),
};

function ImageNumbers() {
  const { evidence } = useVerify();
  const w = evidence ? Math.min(...SCENES.map((s) => (evidence.harness.normal?.[`dark/${s.id}`] ?? evidence.harness.normal?.[s.id])?.media?.worst ?? Infinity)) : null;
  return <>{w != null && Number.isFinite(w) ? <>worst image text across all scenes <b>{w.toFixed(2)}:1</b></> : 'UNVERIFIED'}</>;
}

// ================================ Accessibility ================================

function Accessibility() {
  const { evidence, conformance } = useVerify();
  const components = ['Environment', 'Card', 'Avatar', 'Button', 'IconButton', 'Tabs', 'Tag', 'Docs page'];
  return (
    <Page eyebrow="Accessibility" title="How Pane is verified" lede={<p>Two automated runs back every claim in this book. One measures contrast pixel by pixel over real photos, and the other tests behaviour in a real browser. Both run against the built site on every page in three display modes.</p>}>
      <Section id="contrast" title="Contrast, measured">
        <ol>
          <li>Load the page, or the test page, over each of the four scene photos.</li>
          <li>Wrap every visible text node in a background-less span, make only that span’s text transparent, screenshot.</li>
          <li>For each text node, score its colour against every pixel inside its boxes. Translucent text is blended with each pixel first. A halo with an explicit colour stays painted, so it counts. The WCAG rule for text with a halo.</li>
          <li>The node’s score is its worst pixel. Normal text needs 4.5:1; large text (≥24px, or ≥18.66px bold) needs 3:1.</li>
          <li>Repeat one viewport at a time down the whole page, in normal, reduced-transparency and forced-colours mode.</li>
        </ol>
        {evidence && <p>The last run made {evidence.summary.gatingChecks} text checks with {evidence.summary.gatingFailures} failures and {evidence.summary.excepted ?? 0} excepted under E-001, whose floor is {evidence.exceptionFloor ?? 'unset'} to 1. It ran in {evidence.browser} on {new Date(evidence.generatedAt).toLocaleString()}.</p>}
        <Callout tone="note" title="Gate-proofed">
          <p>A check that cannot fail proves nothing. Each tool is run once with a deliberate defect. Thinner glass, fainter text, a component token pointing at a primitive. And must turn red before it is trusted.</p>
        </Callout>
      </Section>
      <Section id="modes" title="Display modes">
        <ul>
          <li><b>Reduced transparency</b>. Opaque graphite, no blur, no dimming (emulated via the Chrome DevTools protocol; the run checks the media query actually matched).</li>
          <li><b>Forced colours</b>. System colours; rims become borders; the selected tab is underlined.</li>
          <li><b>Reduced motion</b>. Every duration 0ms at the token level.</li>
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
          <li>Safari and Firefox rendering. Every run is Chromium.</li>
          <li>A browser with no backdrop-filter support (the fallback shares its CSS with reduced transparency, which is tested).</li>
          <li>A genuinely dark backdrop, so the dim and mid levels are uncalibrated.</li>
          <li>Screen-reader output (roles and names are tested, but nobody has listened to the book with a screen reader yet).</li>
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
    <Page eyebrow="Reference" title="Tokens" lede={<p>Every token Pane ships, with the token it points at and its resolved value. Components only ever read component tokens; component tokens only point at semantic ones; only primitives hold raw values. The build fails otherwise.</p>}>
      <Section id="formats" title="Formats">
        <p>The same {Object.keys(TOKENS).length} tokens ship as <code>pane-tokens/css</code>, <code>/js</code> (+ types), <code>/scss</code> and <code>/json</code>. See <Link to="/getting-started#other-project">Using Pane in another project</Link>.</p>
      </Section>
      <Section id="all" title="All tokens" wide>
        <div className="token-filter">
          <label className="field"><span>Search</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. glass, accent, 40px" /></label>
          <Select label="Tier" size="md" value={tier || 'all'} onValueChange={(v) => setTier(v === 'all' ? '' : v)} options={[{ value: 'all', label: 'All' }, { value: 'primitive', label: 'Primitive' }, { value: 'semantic', label: 'Semantic' }, { value: 'component', label: 'Component' }]} />
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
        <li>Tab behaviour. Radix UI Tabs.</li>
        <li>Measurement. Playwright + Chromium, axe-core.</li>
        <li>Build. Vite, pnpm, a DTCG token build with tier enforcement.</li>
        <li>Produced with kiln, the design-system engine for Claude Code.</li>
      </ul>
    </Section>
  </Page>
);

// Lifecycle and the accessibility matrix (Carbon's accessibility status page, Atlassian and Primer
// lifecycle labels). Every cell is read from conformance.json and evidence.json; screen reader passes
// are not automated, so that column says so.
function StatusPage() {
  const { conformance, evidence } = useVerify();
  const cell = (ok: boolean | null, text?: string) => <td><span className={ok === null ? 'muted' : ok ? 'pass' : 'fail'}>{ok === null ? 'Not tested' : ok ? 'Pass' : 'Fail'}</span>{text && <span className="muted small"> {text}</span>}</td>;
  const groups = (n: string) => EVIDENCE_GROUPS[n] ?? [];
  const contrast = (n: string, theme: string | null, mode: string) => {
    if (!evidence) return null;
    const rows = Object.entries(evidence.harness[mode] ?? {}).filter(([k]) => theme === null || k.startsWith(`${theme}/`)).flatMap(([, g]) => groups(n).map((x) => g[x]).filter(Boolean));
    return rows.length ? rows.every((x) => x.failures === 0) : null;
  };
  return (
    <Page eyebrow="Reference" title="Status & accessibility matrix" lede={<p>Every component carries a status, and every status has written criteria. The matrix below shows which tests each component has passed, read from the last verify run.</p>}>
      <Section id="levels" title="What each status means">
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Status</th><th scope="col">Requires</th></tr></thead>
            <tbody>
              <tr><th scope="row">Alpha</th><td>Builds and has a page, but part of its behaviour is not measured yet. The API may change.</td></tr>
              <tr><th scope="row">Beta</th><td>Every automated check passes and contrast is measured in both themes on all four photos. The API is settled unless a test proves it wrong.</td></tr>
              <tr><th scope="row">Stable</th><td>Everything in Beta, plus recorded screen reader passes with VoiceOver and NVDA and one release without a breaking change.</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="matrix" title="Accessibility matrix" wide>
        <p>Each row is one component. Keyboard and behaviour come from the conformance run. Contrast comes from the evidence run, split by theme. Screen reader passes are done by hand and none have been recorded yet.</p>
        <div className="table-wrap">
          <table className="matrix">
            <thead><tr><th scope="col">Component</th><th scope="col">Status</th><th scope="col">Behaviour and keyboard</th><th scope="col">Contrast, dark</th><th scope="col">Contrast, light</th><th scope="col">Reduced transparency</th><th scope="col">Forced colours</th><th scope="col">Screen reader</th></tr></thead>
            <tbody>
              {COMPONENTS.map((c) => {
                const own = conformance?.checks.filter((x) => x.component === c.name) ?? [];
                return (
                  <tr key={c.name}>
                    <th scope="row"><Link to={`/components/${c.slug}`}>{c.name}</Link></th>
                    <td>{STATUS_LABEL[c.status]}</td>
                    {cell(own.length ? own.every((x) => x.ok) : null, own.length ? `${own.length} checks` : undefined)}
                    {cell(contrast(c.name, 'dark', 'normal'))}
                    {cell(contrast(c.name, 'light', 'normal'))}
                    {cell(contrast(c.name, null, 'reduced-transparency'))}
                    {cell(contrast(c.name, null, 'forced-colors'))}
                    {cell(null)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </Page>
  );
}

function ChangelogPage() {
  const versions = [...new Set(HISTORY.map((h) => h.version))];
  return (
    <Page eyebrow="Reference" title="Change history" lede={<p>Every change to pane-react, newest first, grouped by release. Each component page shows only its own rows.</p>}>
      {versions.map((v) => {
        const rows = HISTORY.filter((h) => h.version === v);
        return (
          <Section key={v} id={`v${v.replace(/\W/g, '-')}`} title={`${v} (${rows[0].date})`}>
            <div className="table-wrap">
              <table>
                <thead><tr><th scope="col">Component</th><th scope="col">Change</th></tr></thead>
                <tbody>{rows.map((h) => { const c = COMPONENTS.find((x) => x.name === h.component); return <tr key={h.text}><th scope="row">{c ? <Link to={`/components/${c.slug}`}>{h.component}</Link> : h.component}</th><td>{inline(h.text)}</td></tr>; })}</tbody>
              </table>
            </div>
          </Section>
        );
      })}
    </Page>
  );
}

// ================================ routing table ================================

const BASE_PAGES: Record<string, () => ReactElement> = {
  '/': Overview,
  '/getting-started': GettingStarted,
  '/getting-started/designing': Designing,
  '/getting-started/developing': Developing,
  '/getting-started/contributing': Contributing,
  '/getting-started/migrating': Migrating,
  '/foundations/content': ContentFoundation,
  '/foundations/accessibility': AccessibilityFoundation,
  '/principles': Principles,
  '/foundations/glass': Glass,
  '/foundations/color': ColorPage,
  '/foundations/themes': Themes,
  '/foundations/typography': Typography,
  '/foundations/spacing': Spacing,
  '/foundations/grid': GridLayoutPage,
  '/foundations/dimensions': Dimensions,
  '/foundations/shape': Shape,
  '/foundations/motion': Motion,
  '/foundations/icons': IconsPage,
  ...Object.fromEntries(COMPONENTS.flatMap((c) => [
    [`/components/${c.slug}`, () => <TabRedirect to={`/components/${c.slug}/usage`} />] as const,
    ...TABS.map((t) => [`/components/${c.slug}/${t}`, () => <ComponentPage c={c} tab={t} />] as const),
  ])),
  ...Object.fromEntries(Object.entries(PATTERN_DEPTH).map(([path, p]) => [path, () => <PatternDepthPage p={p} />])),
  ...PATTERNS,
  '/accessibility': Accessibility,
  '/reference/tokens': Tokens,
  '/reference/status': StatusPage,
  '/reference/changelog': ChangelogPage,
  '/reference/decisions': Decisions,
  '/reference/exceptions': Exceptions,
  '/reference/credits': Credits,
};

// Foundation pages carry the extra sections that cover the reference systems' topics (G-BT1).
export const PAGE_COMPONENTS: Record<string, () => ReactElement> = Object.fromEntries(Object.entries(BASE_PAGES).map(([route, Page]) => {
  const Extra = EXTRAS[route];
  return [route, Extra ? () => <><Page /><Extra /></> : Page];
}));
