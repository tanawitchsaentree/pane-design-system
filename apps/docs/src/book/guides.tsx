// Getting started guides (designing, developing, contributing, migrating) and the Content and
// Accessibility foundations (docs-engine component-depth.md, G-IA1). Facts here point at the files and
// gates that enforce them, so a reader can check every claim.
import { Banner, Button, Card } from 'pane-react';
import { Code, Link, Page, Section, Stage } from './kit';
import { PairView } from '../depth/UsageTab';
import meta from './meta.json';

const Pane = ({ title, children }: { title?: string; children: React.ReactNode }) => <Card as="section" aria-label={title ?? 'Example'} className="demo-card">{title && <h3 className="flush">{title}</h3>}{children}</Card>;
const Row = ({ children }: { children: React.ReactNode }) => <div className="demo-row">{children}</div>;

export function Designing() {
  return (
    <Page eyebrow="Getting started" title="Designing with Pane" lede={<p>How to lay out a screen so it reads like Pane, with panes of glass over a real scene, one loud action each, and ordinary surfaces where people read.</p>}>
      <Section id="start" title="Start from the scene">
        <p>A Pane screen begins with its backdrop. Pick the photo or video first, because the glass is tuned to it. Measure its brightest region with <code>tooling/glass-sweep.mjs</code> and set the Environment to that level. A mostly dark photo with one lit window counts as bright, because a card can scroll over the window.</p>
        <p>Then place panes on it. Each pane is one object with one job, such as a profile, a post or a player. Leave gutters between panes wide enough to see the scene through them (P1). Two panes that touch read as one sheet of glass.</p>
      </Section>
      <Section id="hierarchy" title="One loud thing per pane">
        <p>Give each pane one loud action, a light Button, and make every other action glass. If a pane seems to need two loud actions, it has two jobs and should be two panes (P5). The loud action goes first on the start side, and actions past three move behind More.</p>
        <PairView pair={{ do: <Pane title="Discard draft?"><Row><Button>Keep editing</Button><Button variant="glass">Discard</Button></Row></Pane>, doNote: 'One loud action, one way out.', dont: <Pane title="Discard draft?"><Row><Button>Keep editing</Button><Button variant="accent">Discard</Button></Row></Pane>, dontNote: 'Two loud actions on one pane.' }} />
      </Section>
      <Section id="reading" title="Where people read, drop the glass">
        <p>Settings, long articles and documentation are reading surfaces. P7 puts them on an opaque page with plain rectangles and hairlines, because a photo behind long text only competes with it. Use glass for short, glanceable panes, and an ordinary surface for anything people read for more than a few seconds.</p>
      </Section>
      <Section id="check" title="Check before handing off">
        <ul>
          <li>Every line of text sits on a Card, never straight on the photo.</li>
          <li>Each pane has at most one light or accent Button.</li>
          <li>Status is written in words, with colour as the second cue.</li>
          <li>Touch targets are at least 44px. Today the 32px and 36px sizes of Button, IconButton, Chip and Tabs fall short, so avoid them on phones.</li>
          <li>The screen works in both themes and over both a dark and a bright scene. The Themes page shows how.</li>
        </ul>
      </Section>
      <Section id="tools" title="Design files">
        <p>There is no Figma library yet. It is planned with variables that mirror the tokens in both themes and a parity check against this book. Until then, the Style tab of each component lists every measured value with its token name, which is the source a design file should copy.</p>
      </Section>
    </Page>
  );
}

export function Developing() {
  return (
    <Page eyebrow="Getting started" title="Developing with Pane" lede={<p>The set-up details the install steps leave out, covering TypeScript, the Environment, scene images, themes and server rendering.</p>}>
      <Section id="css" title="Load the styles once">
        <p>Import one stylesheet once, at the root of the app. It holds the tokens and every component’s styles. It ships a type declaration, so <code>tsc</code> passes on TypeScript 6 and later, which check side-effect imports by default.</p>
        <Code label="main.tsx">{"import 'pane-react/all.css';"}</Code>
      </Section>
      <Section id="environment" title="Wrap the screen in an Environment">
        <p>Glass needs to know how bright the scene behind it can get. Put one Environment at the top of the screen with the level measured for its backdrop, and a nested one only where a region sits over a different backdrop. Without one, the glass falls back to the bright level, which is the safe choice.</p>
        <Code label="App.tsx">{"<Environment brightness=\"bright\">\n  <Container>\n    <Grid>…</Grid>\n  </Container>\n</Environment>"}</Code>
      </Section>
      <Section id="scene" title="Provide the scene">
        <p>Pane does not ship a backdrop. Put the app’s photo or video behind the Environment yourself, with <code>background-size: cover</code> on the page or a fixed media element. Keep a small, blurred version to show while the full image loads, so the glass has something to sample from the first frame.</p>
      </Section>
      <Section id="theme" title="Themes">
        <p>Set <code>data-theme="dark"</code> or <code>data-theme="light"</code> on the root element. Every token switches with it. A subtree can set its own theme the same way. Follow the reader’s system setting by default and store their choice.</p>
        <Code label="theme">{"document.documentElement.dataset.theme =\n  matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';"}</Code>
      </Section>
      <Section id="ssr" title="Server rendering">
        <p>Every component renders on the server. The smoke test server-renders Button, Tag, Card, Badge, Container and Stack from the packed tarballs on every verify run. Set the theme attribute in the HTML you send, so the first frame already has the right colours.</p>
      </Section>
      <Section id="versions" title="Versions">
        <p>The packages are at {meta.version}. Until 1.0 a minor version can change component APIs, and the change history lists every change per component. Every verify run tests React 18, and React 19 has been checked with a fresh Vite app.</p>
      </Section>
    </Page>
  );
}

export function Contributing() {
  return (
    <Page eyebrow="Getting started" title="Contributing" lede={<p>How a component gets into Pane, in the order the tooling enforces. Concept first, then derivation, a pick, the code, the docs and the gates.</p>}>
      <Section id="order" title="The order">
        <ol>
          <li>Read <code>system/CONCEPT.md</code>. Every form in Pane comes from its seven principles.</li>
          <li>Write <code>&lt;Name&gt;.why.json</code> first. Name the pattern-library default it must not become, cite a reference from Pane’s lineage (visionOS), and derive the form in at least three steps that quote the principles word for word.</li>
          <li>Render three variants in <code>apps/lab/&lt;name&gt;/</code>, all with the same content. The maintainer picks one.</li>
          <li>Only then write the CSS and TSX. The derivation guard blocks those files until the pick is recorded.</li>
          <li>Write the docs pages the same day, with a depth file for the Usage tab, examples for the Code tab and a subject for the Style tab.</li>
          <li>Run <code>pnpm run verify</code>. It must be green.</li>
        </ol>
      </Section>
      <Section id="rules" title="Rules the build enforces">
        <ul>
          <li>Component CSS holds no raw values. Every colour, size and duration is a token, checked by <code>tooling/no-hardcode-lint.mjs</code>.</li>
          <li>Every token and every part, state and motion of a component has a reason tied to a principle, checked by <code>tooling/kiln/rationale.mjs</code>.</li>
          <li>Text on glass is measured per pixel over four photos in both themes and three modes, checked by <code>tooling/kiln/evidence.mjs</code>.</li>
          <li>Keyboard and roles are tested in Chromium by <code>tooling/conformance.mjs</code>.</li>
          <li>Every page’s prose passes the human-tone lint, checked by <code>tooling/kiln/tone-gate.mjs</code>.</li>
        </ul>
      </Section>
      <Section id="machine" title="Keeping the machine usable">
        <p>Use <code>pnpm run verify:quick</code> while working. The full verify measures both themes and takes the better part of an hour, so run it before a commit that changes how things look.</p>
      </Section>
    </Page>
  );
}

export function Migrating() {
  return (
    <Page eyebrow="Getting started" title="Migrating" lede={<p>What changed between versions and what to do about it.</p>}>
      <Section id="v02" title="From 0.1 to 0.2">
        <ul>
          <li>Banner was redrawn as a line on the pane. Remove any wrapper styles that gave it a box, and move the removal of a dismissed banner into <code>onDismiss</code>, which now runs after the line has closed.</li>
          <li>Select and Slider are new. Replace native selects and range inputs on glass with them, because a native control opens the operating system’s look on top of the pane.</li>
          <li>The CSS exports ship type declarations. If you added a <code>declare module 'pane-tokens/css'</code> shim, you can delete it.</li>
          <li>From 0.3.0, install only <code>pane-react</code> and import <code>pane-react/all.css</code>. The two old imports still work, so nothing breaks if you keep them.</li>
          <li>In the light theme, <code>field.column</code> is now solid blue, so white labels on diagram columns pass 4.5:1.</li>
        </ul>
      </Section>
      <Section id="from-others" title="From another system">
        <p>Most systems put content on opaque cards. Moving to Pane means choosing a backdrop and an Environment first, then replacing cards with Pane Cards, and keeping one loud action per card. Status colour shrinks to small glyphs and badges, because the scene owns most of the colour.</p>
      </Section>
    </Page>
  );
}

export function ContentFoundation() {
  return (
    <Page eyebrow="Foundations" title="Content" lede={<p>How Pane writes, with plain words, labels that say what happens, and messages that tell people what to do next.</p>}>
      <Section id="voice" title="Voice">
        <p>Pane talks like a helpful colleague. Short sentences, common words, and the reader addressed as you. It never jokes in an error and never blames the reader. Every page of this book is checked by the human-tone lint, which rejects dashes used as pauses, label colons in prose and stacked contrasts.</p>
      </Section>
      <Section id="labels" title="Labels">
        <p>Buttons are verbs, or a verb and its object, in sentence case, such as Follow, Save changes or Delete post. Name the result the reader gets and leave out the gesture. Tabs, tags and filters are nouns. A label that answers a question repeats the question’s decision, so Discard draft? gets Discard and Keep editing.</p>
      </Section>
      <Section id="messages" title="Messages">
        <p>A message says what happened, then why, then what to do next. Upload failed, because the file is larger than 25 MB, so try a smaller photo. Leave codes and blame out of it.</p>
        <PairView pair={{ do: <Pane><Banner tone="critical" title="Upload failed">The file is larger than 25 MB. Try a smaller photo.</Banner></Pane>, doNote: 'What happened, why and what next.', dont: <Pane><Banner tone="critical" title="Error 413" /></Pane>, dontNote: 'A code nobody can act on.' }} />
      </Section>
      <Section id="numbers" title="Numbers, dates and units">
        <p>Write numbers as digits and keep the unit with them, such as 25 MB or 60%. Use the reader’s locale for dates and long numbers. A count says what it counts unless the context does, such as 3 new.</p>
      </Section>
      <Section id="length" title="Length and translation">
        <p>Translations run about a third longer than English. Every component page that holds text shows a German version and a right-to-left Arabic version, so you can see where text wraps before it ships.</p>
      </Section>
    </Page>
  );
}

export function AccessibilityFoundation() {
  return (
    <Page eyebrow="Foundations" title="Accessibility" lede={<p>What Pane guarantees for people using a keyboard, a screen reader, high contrast or reduced motion, and what is still missing.</p>}>
      <Section id="principle" title="The principle">
        <p>P6 says glass is a mood, never the carrier of meaning. Everything works without the glass and without sight of it. That decides five rules, each tied to a check that runs on every build.</p>
      </Section>
      <Section id="contrast" title="Contrast over photos">
        <p>Text on glass has to reach 4.5:1 over whatever photo is behind it. Pane measures it per pixel over four test photos in both themes and three modes. A few text nodes on the brightest photo stop between 3.8 and 4.5:1 in the dark theme; they are exception E-001, listed on the Exceptions page with a floor.</p>
      </Section>
      <Section id="focus" title="Focus and keyboard">
        <p>Every control can be reached and used from the keyboard, and keyboard focus draws a 2px ring with a dark halo that is visible on any part of any scene. The keyboard behaviour of Tabs, Select and Slider comes from Radix and is tested in Chromium on every run.</p>
      </Section>
      <Section id="targets" title="Touch targets">
        <p>P6 asks for at least 44px in the smaller dimension or a 44px press area. Slider and Banner’s dismiss meet it. The 32px and 36px sizes of Button, IconButton, Chip and Tabs do not yet, which each component page states under Limitations.</p>
      </Section>
      <Section id="modes" title="High contrast, reduced transparency and reduced motion">
        <p>With reduced transparency the glass turns opaque and stops dimming. In forced colours, fills give way to system colours and borders keep each shape visible. Under reduced motion every duration token is zero. Avatar has no forced-colours rule yet.</p>
      </Section>
      <Section id="names" title="Names and announcements">
        <p>Every control has a name. IconButton requires one at the type level, and Select and Slider require a label. Status is spoken in words, and messages that appear after an action are announced through live regions.</p>
      </Section>
      <Section id="verified" title="How it is verified">
        <p>The checks, their results and the full matrix per component are on <Link to="/accessibility">How Pane is verified</Link> and <Link to="/reference/status">Status and accessibility matrix</Link>. Screen reader passes with VoiceOver and NVDA have not been recorded yet, so no component is marked Stable.</p>
        <Stage><Pane title="Keyboard focus"><Row><Button>Focus me with Tab</Button></Row></Pane></Stage>
      </Section>
    </Page>
  );
}
