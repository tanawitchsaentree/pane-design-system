// The white-label chapter (D-033, D-037): what a brand may change, nine sample brands and Pane side by side
// on the chosen backdrop, the three tiers of change, the file format, the checks and how a product loads one.
import { useState } from 'react';
import { Button, Card, SegmentedControl, Select, Switch, Text } from 'pane-react';
import BRANDS from '../../../../packages/tokens/build/css/brands/brands.json';
import { checkBrand, ratio, PAGE } from '../../../../packages/tokens/brand-check.mjs';
import { Code, Page, Section, Stage } from './kit';
import { smooth } from './kit-core';

type Brand = { id: string; name: string; description: string; tier?: string; density?: string; motion?: string; tokens: Record<string, string | { dark: string; light?: string }> };
const LIST = BRANDS as unknown as Brand[];

const WHAT: Array<[string, string]> = [
  ['action.loud-top, action.loud-foot, action.foot-solid', 'The fill of the one loud action on a pane (Button light, SplitButton, FAB), lit from above.'],
  ['text.on-light, text.on-accent', 'The words on that fill. The check holds them at 4.5:1 or more on both stops.'],
  ['action.accent, action.accent-hover, action.accent-foot', 'The promoted action that glows with its own light.'],
  ['focus.ring', 'The keyboard focus ring. The check holds it at 3:1 or more on the page.'],
  ['surface.chosen-top, surface.chosen-foot', 'The tint of chosen glass, as on the selected tab, the picked card or a toggle that is on.'],
  ['type.family', 'The typeface, given as a font stack the product already loads.'],
  ['corner.panel, corner.inner, corner.media', 'The three corner steps, from a reference to the radius scale or in pixels. Set the panel alone and the inner corner follows it, so nested corners stay concentric.'],
  ['type.weight-medium, type.weight-semibold, type.tracking-display', 'How heavy the labels and titles are (400 to 800) and how tight the display type is set.'],
  ['glass.saturate', 'How much of the scene’s colour the glass carries, from 1 (none added) to 2.'],
  ['mesh.a, mesh.b, mesh.c, mesh.d, mesh.base', 'The colours of the brand’s Mesh accents.'],
  ['motion.hover, motion.press, motion.enter, motion.scene, motion.easing', 'The tempo of the product, 80 to 1000ms. Reduced motion still turns every one of them to zero.'],
  ['density (compact, regular, roomy)', 'A preset. Moves every gap one step along the space scale, the card inset with it, and keeps the inner corner nested.'],
  ['motion (brisk, steady, calm)', 'A preset. Sets the four durations together.'],
];
const LOCKED = ['the glass material (blur, dimming, body) and the environments', 'the text tones and the status colours, which keep their glyphs and words', 'the type scale, sizes and touch targets, and spacing beyond one density step', 'the data palette for charts, which belongs to the data (D-031)'];

const hex = (v: string | undefined) => (v && /^#[0-9a-f]{6}$/i.test(v) ? [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16)) as [number, number, number] : null);
const at = (b: Brand, k: string, th: 'dark' | 'light') => { const v = b.tokens[k]; return typeof v === 'object' ? v[th] ?? v.dark : v; };

function Sample() {
  return (
    <Card as="div" className="demo-card">
      <Text as="p" weight="semibold">Appointment on Thursday</Text>
      <Text as="p" size="label" tone="secondary">Dr Lind · 10:40 · Room 4</Text>
      <SegmentedControl label="View" defaultValue="details" options={[{ value: 'details', label: 'Details' }, { value: 'notes', label: 'Notes' }]} />
      <Switch label="Text me a reminder" defaultChecked />
      <div className="demo-row"><Button>Confirm</Button><Button variant="glass">Reschedule</Button></div>
    </Card>
  );
}

/** Pick a brand and a theme: the card re-renders under them, and the two pairs the check measures are shown
 *  with their numbers, with the brand file to copy. */
function BrandPlayground() {
  const [id, setId] = useState(LIST[0]?.id ?? 'harbor');
  const [th, setTh] = useState<'dark' | 'light'>('dark');
  const b = LIST.find((x) => x.id === id) ?? LIST[0];
  const a = hex(at(b, 'action.loud-foot', th)), tx = hex(at(b, 'text.on-light', th)), r = hex(at(b, 'focus.ring', th));
  return (
    <div className="playground" data-playground="">
      <p className="flush pg-title">A brand on one card</p>
      <div className="pg-body">
        <div className="pg-controls" data-controls="">
          <Select label="Brand" size="sm" value={id} onValueChange={(v) => smooth(() => setId(v))} options={LIST.map((x) => ({ value: x.id, label: x.name }))} />
          <SegmentedControl label="Theme" value={th} onValueChange={(v) => smooth(() => setTh(v as 'dark' | 'light'))} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
        </div>
        <div className="pg-preview" data-preview="" data-brand={id} data-theme={th}><Stage className="pg-stage"><Sample /></Stage></div>
      </div>
      <div className="pg-note">Words on the action {a && tx ? ratio(a, tx).toFixed(2) : 'unchanged'}:1. Focus ring on the page {r ? ratio(r, PAGE[th]).toFixed(2) : 'unchanged'}:1.</div>
      <Code label={`${b.id}.json`}>{JSON.stringify({ name: b.name, description: b.description, ...(b.density && b.density !== 'regular' ? { density: b.density } : {}), ...(b.motion && b.motion !== 'steady' ? { motion: b.motion } : {}), tokens: b.tokens }, null, 2)}</Code>
    </div>
  );
}

export function Brands() {
  return (
    <Page eyebrow="Foundations" title="White-label brands" lede={<p>One Pane serves many client brands. A brand changes a list of semantic tokens, which covers the loud action, focus, chosen glass, the typeface and its weight, the corners, the spacing density, the tempo and how much colour the glass carries. Everything that makes Pane readable stays fixed, and a check proves each brand still clears WCAG before it ships.</p>}>
      <Section id="playground" title="Try a brand" wide>
        <p>Pick a sample brand and a theme. The card below takes them, and the line under it gives the two numbers the check holds.</p>
        <BrandPlayground />
      </Section>
      <Section id="compare" title="Ten brands on one product" wide>
        <p>The same appointment card under Pane and nine sample brands, on the backdrop chosen in the header. They differ in colour, typeface, weight, corners, spacing, tempo and how much colour the glass carries, so a trading desk, a children’s reading app and a fashion house each read as their own product. The glass, the text tones, the status colours and the touch targets stay the same in all ten. Use the Brand control in the header to see the whole book in one of them.</p>
        <div className="brand-grid">
          {[{ id: 'pane', name: 'Pane', description: 'The system as it ships.' }, ...LIST].map((b) => (
            <figure key={b.id} className="brand-cell" data-brand={b.id === 'pane' ? undefined : b.id}>
              <Stage><Sample /></Stage>
              <figcaption><b>{b.name}</b>. {b.description}{'density' in b && b.density !== 'regular' ? ` Density ${b.density}.` : ''}{'motion' in b && b.motion !== 'steady' ? ` Motion ${b.motion}.` : ''}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <Section id="brandable" title="What a brand may change">
        <div className="table-wrap"><table className="tokens"><thead><tr><th scope="col">Tokens</th><th scope="col">What they are</th></tr></thead>
          <tbody>{WHAT.map(([k, w]) => <tr key={k}><td><code>{k}</code></td><td>{w}</td></tr>)}</tbody></table></div>
        <p>A brand cannot change anything else. The build stops on a token that is not on this list, so a brand cannot reach the glass or the status colours by accident.</p>
        <ul>{LOCKED.map((x) => <li key={x}>It keeps {x}.</li>)}</ul>
      </Section>
      <Section id="tiers" title="How far a brand can go">
        <p>There are three levels of change. Most products stop at the first, and each level down hands more of the checking to you.</p>
        <div className="table-wrap"><table className="tokens"><thead><tr><th scope="col">Level</th><th scope="col">What it may change</th><th scope="col">What is checked</th></tr></thead>
          <tbody>
            <tr><td>Brand</td><td>The list above, and the density and motion presets.</td><td>Every token is on the list, the words on the loud action hold 4.5:1, the focus ring holds 3:1, and weights, tempo and saturation stay in range. The build stops on any failure.</td></tr>
            <tr><td>Expert brand</td><td>Any semantic token, with <code>"tier": "expert"</code> in the file. Text tones, surfaces, status colours and gaps open up.</td><td>The same contrast checks. Tokens outside the list are named in the build output as unchecked, and they are yours to measure.</td></tr>
            <tr><td>Your own system</td><td>Primitives and component tokens, such as the radius scale, the space scale and a component’s own numbers.</td><td>Nothing from Pane. Fork <code>pane-tokens</code>, and run the token build and the gates on your fork.</td></tr>
          </tbody></table></div>
        <p>The three tiers of tokens stay intact at every level. A brand changes semantic tokens, components read semantic tokens, and a component never reads a primitive, so a change made at the semantic tier reaches every component that should follow it and none that should not.</p>
      </Section>
      <Section id="file" title="A brand file">
        <p>A brand is one JSON file. Each token takes one value for both themes, or a value per theme. Colours are hex, and corners refer to the radius scale. Tools that write brand files can import the BrandFile type and the same check from pane-tokens/brand-check, so a generator fails in the editor before a build does.</p>
        <Code label="JSON">{`{
  "name": "Harbor",
  "description": "A calm clinical blue for a patient portal.",
  "density": "compact",
  "motion": "brisk",
  "tokens": {
    "action.loud-top": { "dark": "#A9D3FF", "light": "#2468B8" },
    "action.loud-foot": { "dark": "#7DB8F7", "light": "#1B559B" },
    "text.on-light": { "dark": "#0B1B2E", "light": "#FFFFFF" },
    "focus.ring": { "dark": "#A9D3FF", "light": "#1B559B" },
    "corner.panel": "{radius.lg}"
  }
}`}</Code>
      </Section>
      <Section id="check" title="The check every brand passes">
        <p>A brand can break two pairs, the words on the loud action and the focus ring on the page. Both are measured in dark and light. The numbers below are computed from the sample files in this build.</p>
        <div className="table-wrap"><table className="tokens"><thead><tr><th scope="col">Brand</th><th scope="col">Words on the action, dark</th><th scope="col">Words on the action, light</th><th scope="col">Focus ring, dark</th><th scope="col">Focus ring, light</th><th scope="col">Density</th><th scope="col">Motion</th><th scope="col">Result</th></tr></thead>
          <tbody>{LIST.map((b) => {
            const pair = (th: 'dark' | 'light') => { const a = hex(at(b, 'action.loud-foot', th)), t = hex(at(b, 'text.on-light', th)); return a && t ? ratio(a, t).toFixed(2) : 'unchanged'; };
            const ring = (th: 'dark' | 'light') => { const r = hex(at(b, 'focus.ring', th)); return r ? ratio(r, PAGE[th]).toFixed(2) : 'unchanged'; };
            const bad = checkBrand(b);
            return <tr key={b.id}><td>{b.name}</td><td>{pair('dark')}:1</td><td>{pair('light')}:1</td><td>{ring('dark')}:1</td><td>{ring('light')}:1</td><td>{b.density ?? 'regular'}</td><td>{b.motion ?? 'steady'}</td><td>{bad.length ? `Fails, ${bad.join('; ')}` : 'Passes'}</td></tr>;
          })}</tbody></table></div>
        <Code label="Terminal">{`npx pane-theme check my-brand.json   # brandable tokens only, contrast in dark and light
npx pane-theme css my-brand.json     # the sheet to load after the tokens
npx pane-theme list                  # the sample brands and what each changes`}</Code>
      </Section>
      <Section id="load" title="Loading a brand">
        <p>Load the brand sheet after the tokens and set <code>data-brand</code> on the root, or on one region for a preview. The sheet re-declares every component token that reads a brand token, so buttons, tabs and chosen glass follow inside that region. A brand set on a region inside another brand wins for that region, the way a nested theme does. Every brand value is a CSS custom property, so a component of your own reads it with var(--ds-action-loud-foot) and follows the brand too.</p>
        <Code label="CSS">{`@import 'pane-react/tokens.css';
@import 'pane-react/tokens/brands/harbor.css';`}</Code>
        <Code label="HTML">{`<html data-brand="harbor">`}</Code>
      </Section>
    </Page>
  );
}
