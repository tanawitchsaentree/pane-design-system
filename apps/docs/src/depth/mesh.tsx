// Mesh's Usage tab (component-depth.md U1–U14). A mesh gradient for scenes, covers and icons (D-029).
import { Button, Card, Mesh, Stack } from 'pane-react';
import type { Depth } from './types';

const Cover = ({ preset = 'aurora' as const }: { preset?: 'aurora' | 'ember' | 'tide' | 'dusk' }) => (
  <Card as="article" aria-label="Album" className="demo-card"><Mesh preset={preset} className="mesh-demo-cover" label="Abstract album cover" /><h3 className="flush">Morning set</h3><p className="flush">Twelve tracks</p></Card>
);

export const MESH: Depth = {
  overview: (
    <>
      <p>A mesh gradient is colour pooled in several places and melted together. It is not a linear gradient, which moves along one line, or a radial one, which spreads from one point. Pane draws four soft pools on a pale ground, on a layer larger than the box, and blurs that layer until no pool keeps an edge. The box clips it.</p>
      <p>A mesh is a piece of the world, never part of a control. Use it as a cover, an app or folder icon, an illustration, or the light a coloured object casts on what is under it. Pane itself owns no hue (P1), so a Button, a Switch or a chosen tab never takes a mesh. Text goes on glass over the mesh, where Pane can measure it, never straight on the pools.</p>
      <p>Four presets ship measured: aurora (peach and coral over violet), ember, tide and dusk. A product brings its own colours through <code>colors</code>, or through the five <code>--ds-mesh-*</code> variables, which <code>npx pane-mesh --from brand.png</code> writes from a brand image.</p>
    </>
  ),
  whenToUse: ['A cover or thumbnail for content that has no photo yet.', 'An app, folder or feature icon with a brand’s colours.', 'A scene behind glass on a marketing or onboarding screen.', 'The ambient light under a coloured object (glow).'],
  whenNot: [
    { situation: 'The fill of a button or any control', to: '/components/button', label: 'Button (the lit solid)' },
    { situation: 'A photo is available', to: '/components/card', label: 'CardCover with src' },
    { situation: 'A status or a category', to: '/components/badge', label: 'Badge' },
  ],
  variants: {
    aurora: { purpose: 'The default: peach and coral at the top, where the light comes from, and violet low.', pairing: 'Any product without its own colours; the book’s Aurora backdrop.' },
    ember: { purpose: 'Warm: amber and rose over plum, for food, evening and firelight.', pairing: 'Warm photography and the dark theme.' },
    tide: { purpose: 'Cool: aqua and sky over indigo, for water, air and health.', pairing: 'Calm, informational products.' },
    dusk: { purpose: 'Evening: lilac and rose over deep navy, for media and night scenes.', pairing: 'Players and night modes.' },
  },
  anatomy: {
    render: <Card as="div" className="demo-card"><Mesh className="mesh-demo-icon" glow label="Folder art" /></Card>,
    parts: [
      { part: 'Ground', selector: '[data-component="Mesh"] [class*="paint"]', what: 'The pale base colour, clipped to the mesh’s corner.' },
      { part: 'Pools', selector: '[data-component="Mesh"]', what: 'Four radial pools at the top left, top right, low and bottom left, blurred 40px into each other.' },
      { part: 'Ambient glow', selector: '[data-component="Mesh"] [class*="glow"]', what: 'With glow: the same colours, blurred and set a little below, lighting what is under the mesh.' },
    ],
  },
  sizes: { na: 'Mesh has no size of its own. It fills the box it is given, so set its width, height and corner with a class, and the pools scale with it.' },
  emphasis: {
    text: <p>A mesh is the most colourful thing on a pane, so it takes the place a photo would: one per card, at the top. Two meshes side by side compete, and a mesh behind a mesh turns to mud.</p>,
    pair: { do: <Cover />, doNote: 'One mesh as the cover.', dont: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Mesh className="mesh-demo-icon" /><Mesh preset="ember" className="mesh-demo-icon" /></Stack></Card>, dontNote: 'Two meshes compete for the eye.' },
  },
  placement: {
    rows: [['At the top of a card', 'In place of a photo.'], ['As an icon', 'In a tile or a list row, with glow on a plain pane.'], ['Behind glass', 'As the scene of a whole screen.']],
    examples: [{ title: 'As a cover', render: <Cover /> }],
  },
  combinations: {
    good: [['Mesh + Card text', 'The title and details on the glass under the mesh.'], ['Mesh glow on a plain pane', 'An icon lights the pane in its own colour.']],
    avoid: [{ title: 'a mesh as a button', why: 'Controls own no hue (P1); the loud action is the lit solid.', render: <Card as="div" className="demo-card"><Mesh className="mesh-demo-icon"><Button variant="glass">Book a call</Button></Mesh></Card> }],
  },
  content: {
    formula: <p>Name a mesh with <code>label</code> only when it carries meaning, such as an illustration of a folder. A cover that only decorates stays unnamed, so a screen reader skips it.</p>,
    pair: { do: <Cover />, doNote: 'Decorative cover: no label needed beside a title.', dont: <Card as="div" className="demo-card"><Mesh className="mesh-demo-cover" label="Mesh" /><h3 className="flush">Morning set</h3></Card>, dontNote: 'A label that says Mesh tells a screen reader nothing; describe what it shows, or leave it out.' },
    overflow: { text: 'A mesh never overflows: it takes the box and its corner, and the pools scale with it.', render: <div data-overflow-demo="" className="overflow-probe"><Cover /></div> },
    rtl: { text: 'In right-to-left layouts the pools stay where they are, because the light still comes from the top left.', render: <div dir="rtl" lang="ar"><Cover /></div> },
    expansion: { text: 'A mesh has no text of its own, so translation does not change it.', render: <Cover preset="tide" /> },
  },
  behaviours: {
    states: [['Rest', 'Still. A mesh does not drift on its own.', 'Things settle (P4).'], ['Forced colours', 'The pools drop and the box shows the canvas colour.', 'Content on it stays readable.']],
    interactions: [['Keyboard', 'Tab', 'Skips it. A mesh is not focusable.', 'Mesh.tsx renders a div'], ['Mouse', 'Click', 'Nothing.', 'Mesh.tsx renders a div'], ['Touch', 'Tap', 'Nothing.', 'Mesh.tsx renders a div']],
    loading: <p>A mesh is drawn in CSS, so it has no loading state and makes a good placeholder while a photo loads.</p>,
    focus: <p>A mesh never takes focus. Content placed inside it keeps its own focus order.</p>,
  },
  deepDive: {
    aurora: { purpose: <p>Aurora is the reference read straight: warm light at the top, a violet low point, a pale ground. It is the book’s Aurora backdrop.</p>, context: <Cover />, practices: ['Use it when the product has no colours of its own.', 'Put a dark-theme Card over it; the glass dims it.'], pair: { do: <Cover />, doNote: 'Aurora as a cover.', dont: <Card as="div" className="demo-card"><Mesh className="mesh-demo-icon"><Button>Go</Button></Mesh></Card>, dontNote: 'A button sitting on the pools.' } },
    ember: { purpose: <p>Ember is warm: amber and rose over plum.</p>, context: <Cover preset="ember" />, practices: ['Pair it with warm photography.'], pair: { do: <Cover preset="ember" />, doNote: 'Ember as a cover.', dont: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Mesh preset="ember" className="mesh-demo-icon" /><Mesh preset="tide" className="mesh-demo-icon" /></Stack></Card>, dontNote: 'Warm beside cool on one pane.' } },
    tide: { purpose: <p>Tide is cool: aqua and sky over indigo.</p>, context: <Cover preset="tide" />, practices: ['Use it for calm, informational products.'], pair: { do: <Cover preset="tide" />, doNote: 'Tide as a cover.', dont: <Card as="div" className="demo-card"><Mesh preset="tide" className="mesh-demo-cover" /><Mesh preset="tide" className="mesh-demo-icon" /></Card>, dontNote: 'Tide twice on one card: the second adds nothing.' } },
    dusk: { purpose: <p>Dusk is evening: lilac and rose over deep navy.</p>, context: <Cover preset="dusk" />, practices: ['Use it for players and night scenes.'], pair: { do: <Cover preset="dusk" />, doNote: 'Dusk as a cover.', dont: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Mesh preset="dusk" className="mesh-demo-icon" /><Mesh preset="aurora" className="mesh-demo-icon" /></Stack></Card>, dontNote: 'Two meshes compete.' } },
  },
  modifiers: [
    { name: 'colors and base', rules: <p>Pass four colours for the top left, top right, low and bottom left pools, and optionally the ground. Keep the third the darkest so the mesh has a low point. <code>npx pane-mesh --from brand.png</code> picks them from a brand image and warns when the mesh would look flat.</p>, pair: { do: <Card as="div" className="demo-card"><Mesh colors={['#7FE0D1', '#F5B04C', '#2B3A9E', '#F09AB3']} className="mesh-demo-icon" /></Card>, doNote: 'A deep third pool gives the mesh depth.', dont: <Card as="div" className="demo-card"><Mesh colors={['#F7B27C', '#F2837B', '#F5B04C', '#F09AB3']} className="mesh-demo-icon" /></Card>, dontNote: 'Four light pools read as flat.' } },
    { name: 'rotate', rules: <p>Turns the pools around the centre in degrees, to move where the light seems to come from. Pane’s light falls from above, so keep the lightest pool in the upper half.</p>, pair: { do: <Card as="div" className="demo-card"><Mesh rotate={20} className="mesh-demo-icon" /></Card>, doNote: 'A small turn; the light stays above.', dont: <Card as="div" className="demo-card"><Mesh rotate={180} className="mesh-demo-icon" /></Card>, dontNote: 'Upside down: the light comes from below.' } },
    { name: 'glow', rules: <p>Lights what is under the mesh in its own colours, an ambient shadow. Use it for a mesh object such as an icon on a plain pane.</p>, pair: { do: <Card as="div" className="demo-card"><Mesh glow className="mesh-demo-icon" /></Card>, doNote: 'An icon that lights the pane.', dont: <Card as="div" className="demo-card"><Mesh glow className="mesh-demo-cover" /></Card>, dontNote: 'A whole cover glowing floods the card.' } },
  ],
  related: [['/foundations/color', 'Colour · Gradients', 'How the mesh is made and where it may go.'], ['/components/card', 'Card', 'Where a mesh usually sits.'], ['/foundations/shape', 'Shape · Glow', 'White glow in dark, which is separate from a mesh’s ambient light.']],
  references: [
    { title: 'SwiftUI · MeshGradient', url: 'https://developer.apple.com/documentation/swiftui/meshgradient', why: 'Apple’s name for the same thing, a grid of colour points blended together.' },
    { title: 'WCAG 2.2 · 1.4.3 Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', why: 'Why text goes on measured glass over a mesh, never on the pools.' },
  ],
};
