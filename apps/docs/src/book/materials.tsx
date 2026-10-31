// The Materials chapter (M1): Pane's one choice between glass and solid, the journey that picks it, what it
// changes and what it never changes, and how a product, a page region or an AI sets it.
import { useState } from 'react';
import { Button, Card, Environment, SegmentedControl, Select, Switch, Text } from 'pane-react';
import { Code, Page, Section, Stage } from './kit';
import { SceneContext } from './kit-core';
import { SCENES } from '../scenes';

type Material = 'glass' | 'solid';

function Sample() {
  return (
    <Card as="div" className="demo-card">
      <Text as="p" weight="semibold">Trip to Lauterbrunnen</Text>
      <Text as="p" size="label" tone="secondary">Saturday · 3 people going</Text>
      <SegmentedControl label="View" defaultValue="plan" options={[{ value: 'plan', label: 'Plan' }, { value: 'people', label: 'People' }]} />
      <Switch label="Remind me" defaultChecked />
      <div className="demo-row"><Button>Join</Button><Button variant="glass">Share</Button></div>
    </Card>
  );
}

function On({ material, scene }: { material: Material; scene?: string }) {
  const body = <Stage><Environment material={material} brightness="bright"><Sample /></Environment></Stage>;
  return scene ? <SceneContext.Provider value={scene}>{body}</SceneContext.Provider> : body;
}

const CHANGES: Array<[string, string, string]> = [
  ['--ds-surface-glass', 'a translucent body over the blurred scene', 'the opaque reading surface, surface.solid'],
  ['--ds-glass-blur, --ds-glass-blur-small', 'the scene behind is blurred', '0px, and the backdrop filter is switched off'],
  ['--ds-glass-brightness, --ds-card-brightness', 'the scene behind is dimmed so text keeps 4.5:1', '1, nothing is dimmed because nothing shows through'],
  ['--ds-card-bg, --ds-card-blur', 'Card follows the glass values', 'Card follows the solid values'],
  ['--ds-overlay-blur, --ds-nav-blur, --ds-icon-button-blur', 'overlays, docks and round buttons blur what is under them', '0px'],
];
const SAME = ['the light from above, the lit top edge and the carved wells of fields', 'shapes, corners and how corners nest', 'the loud action, chosen glass for what is picked, and focus', 'type, spacing, touch targets and motion', 'text tones, status colours and their glyphs', 'themes and brands, which work the same on both'];

/** Pick a material and a backdrop: the card re-renders, and the code to set it follows the pick. */
function MaterialPlayground() {
  const [m, setM] = useState<Material>('glass');
  const [scene, setScene] = useState('forest');
  return (
    <div className="playground" data-playground="">
      <p className="flush pg-title">One card, one material</p>
      <div className="pg-body">
        <div className="pg-controls" data-controls="">
          <Select label="Backdrop" size="sm" value={scene} onValueChange={setScene} options={SCENES.map((s) => ({ value: s.id, label: s.label }))} />
          <SegmentedControl label="Material" value={m} onValueChange={(v) => setM(v as Material)} options={[{ value: 'glass', label: 'Glass' }, { value: 'solid', label: 'Solid' }]} />
        </div>
        <div className="pg-preview" data-preview="" data-material-pick={m}><On material={m} scene={scene} /></div>
      </div>
      <Code label="React">{`<Environment material="${m}" brightness="bright">\n  <App />\n</Environment>`}</Code>
    </div>
  );
}

export function Materials() {
  return (
    <Page eyebrow="Foundations" title="Materials" lede={<p>Every Pane surface is a physical object, lit from above, with fields carved into it and panes raised off it. A product makes one choice about what those objects are made of. Glass lets the scene behind show through, blurred and dimmed. Solid keeps the same shapes and makes them opaque. Pick one material for a screen and Pane takes care of the rest.</p>}>
      <Section id="choose" title="Which material to pick">
        <p>Answer these in order and stop at the first that fits.</p>
        <ol>
          <li>Is there a live backdrop behind the interface, such as video, a map or a 3D scene? Pick solid, because blurring a moving picture every frame costs the frame rate.</li>
          <li>Is the screen mostly reading or data, such as a long form, a table or a report? Pick solid, because a quiet opaque surface is easier to read for a long time.</li>
          <li>Does the product have a scene that is part of the experience, such as a photo, a wallpaper or a place? Pick glass, because the scene is the reason to use it.</li>
          <li>Does the brand ask for depth and light over a picture? Pick glass. Otherwise solid is the safe default for a business tool.</li>
        </ol>
        <p>A reader who has asked their system for reduced transparency gets solid wherever glass was chosen, without the product doing anything.</p>
      </Section>
      <Section id="playground" title="Try both" wide>
        <p>Pick a backdrop and a material. On a photo the difference is the scene showing through. On the studio backdrop glass and solid look close, because there is nothing behind to show.</p>
        <MaterialPlayground />
      </Section>
      <Section id="compare" title="Glass and solid side by side" wide>
        <p>The same card in each material over a photo and over the plain studio. The shapes, the light and the controls are the same in every cell. Only what the panes are made of changes.</p>
        <div className="material-grid" data-material-compare="">
          {['forest', 'studio'].map((sc) => (['glass', 'solid'] as Material[]).map((m) => (
            <figure key={`${sc}-${m}`} className="brand-cell"><On material={m} scene={sc} /><figcaption><b>{m === 'glass' ? 'Glass' : 'Solid'}</b> on {SCENES.find((s) => s.id === sc)?.label ?? sc}</figcaption></figure>
          )))}
        </div>
      </Section>
      <Section id="changes" title="What the material changes">
        <div className="table-wrap"><table className="tokens"><thead><tr><th scope="col">Tokens</th><th scope="col">Glass</th><th scope="col">Solid</th></tr></thead>
          <tbody>{CHANGES.map(([k, g, s]) => <tr key={k}><td><code>{k}</code></td><td>{g}</td><td>{s}</td></tr>)}</tbody></table></div>
        <p>That is the whole list. Every component reads these tokens, so none of them has a material prop of its own.</p>
      </Section>
      <Section id="same" title="What stays the same">
        <ul>{SAME.map((x) => <li key={x}>It keeps {x}.</li>)}</ul>
        <p>This is why Pane can look skeuomorphic and glassy at once without being a mix. The light and the carving are the shape language and belong to both. Translucency is the material, and a screen has one.</p>
      </Section>
      <Section id="rules" title="Rules for a screen">
        <ul>
          <li>Set the material once, on the Environment at the root of a screen. Do not set it on single cards.</li>
          <li>Do not put glass panes and solid panes side by side on one screen. A reader cannot tell which surface is which, and the depth stops making sense.</li>
          <li>An overlay takes the material of the screen it opens over, so a Dialog over a solid screen is solid. Behind a Dialog or a Sheet a scrim dims the screen in both materials, so the overlay is the one thing in front.</li>
          <li>A region may change material only when it is a different place, such as a full-screen video player inside a glass app, and then the whole region changes.</li>
        </ul>
      </Section>
      <Section id="api" title="Setting it">
        <p>In React, the Environment that wraps a screen takes the material. In plain HTML, the same attribute works on any element that holds the panes.</p>
        <Code label="React">{`import { Environment } from 'pane-react';\n\n<Environment material="solid" brightness="bright">\n  <App />\n</Environment>`}</Code>
        <Code label="HTML">{`<div data-environment="bright" data-material="solid">…</div>`}</Code>
        <p>Glass is the default when nothing is set. A product that ships both can store the reader's choice and pass it to the Environment, the way this book does in its Appearance control.</p>
      </Section>
      <Section id="ai" title="Telling an AI">
        <p>The MCP server has a choose_appearance tool. Describe the product and it returns the material, theme, brand and environment to use, with the code. The Claude Code skill gives the same order of questions, so an agent asks about a live backdrop before it reaches for glass.</p>
        <Code label="Claude Code">{`claude mcp add pane -- npx pane-mcp\n# then ask: which Pane material for a dashboard over a live map?`}</Code>
      </Section>
    </Page>
  );
}
