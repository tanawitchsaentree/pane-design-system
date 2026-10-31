// Card's Usage tab (component-depth.md U1–U14). Card is the pane every other component sits on.
import { Avatar, Button, Card, CardCover, Grid, GridItem, Stack, Tag } from 'pane-react';
import type { Depth } from './types';

const Post = ({ quote }: { quote?: React.ReactNode }) => (
  <Card as="article" aria-label="Post by Mara Lind" className="demo-card">
    <Stack direction="row" gap="md" align="center"><Avatar name="Mara Lind" size="sm" decorative /><b>Mara Lind</b><span className="muted small">2h</span></Stack>
    <p className="flush">Blue hour over Bergen harbour, shot from Fløyen.</p>
    {quote}
  </Card>
);

export const CARD: Depth = {
  overview: (
    <>
      <p>A card is a pane of glass. It holds a group of things that belong together, such as a profile, a post or a settings section, and it is the surface every other Pane component sits on. Text in Pane is only measured readable on a card, so anything a person has to read goes on one.</p>
      <p>The glass dims and blurs the scene behind it by the amount measured for the backdrop, set by the nearest Environment. It has no border. One light falls from above, so a rim of light runs brightest along the top edge, faint down the sides and a little stronger at the foot, and a soft shadow below says where it floats (P3). Gaps between cards are wide enough to see the scene through, because the scene is part of the interface (P1).</p>
      <p>Cards are not buttons. A whole card that opens something on click hides its action from keyboard and screen reader users and leaves no room for a second action. Put a Button or a link inside the card instead.</p>
    </>
  ),
  whenToUse: [
    'Any group of related content, such as a profile, a post, a player or a settings section.',
    'Under every block of text over a photo, because Pane guarantees contrast only on its own glass.',
    'The inset variant for content nested inside a pane, such as a quoted post.',
  ],
  whenNot: [
    { situation: 'A card inside a card', to: '/components/card/usage#u12', label: 'Card variant="inset"' },
    { situation: 'Laying out several cards in columns', to: '/components/grid', label: 'Grid' },
    { situation: 'Spacing items inside a card', to: '/components/stack', label: 'Stack' },
    { situation: 'A message about the card', to: '/components/banner', label: 'Banner' },
  ],
  variants: {
    glass: { purpose: 'A floating pane over the scene. Blur, dimming, rim light and the float shadow.', pairing: 'Sits directly on the scene or in a Grid. Never inside another glass card.' },
    inset: { purpose: 'Content nested inside a pane. No second layer of glass, a divider above and inner padding.', pairing: 'Only inside a glass card, one level deep.' },
  },
  anatomy: {
    render: <Card as="article" aria-label="Fjord" className="demo-card"><CardCover /><h3 className="flush">Lysefjord</h3><p className="flush muted">Saved to Trips</p><div className="demo-row"><Button size="sm">Open</Button></div></Card>,
    parts: [
      { part: 'Glass', selector: '[data-component="Card"]', what: 'A thin body, 32px blur, saturation lift and the Environment’s dimming. Legibility comes from dimming, never from an opaque fill (P1).' },
      { part: 'Cover', selector: '[data-component="Card"] > div', what: 'Optional CardCover. Full bleed to the card’s edges and decorative, so meaning stays in the text.' },
      { part: 'Content', selector: '[data-component="Card"] h3', what: 'Padding inside is larger than the gaps between items, so the edge reads as the object’s boundary (P3).' },
      { part: 'Rim and shadow', selector: '[data-component="Card"]', what: 'A 1px light rim brightest along the top edge, faint down the sides and a little stronger at the foot, with the float shadow below.' },
    ],
    perVariant: 'Inset keeps the content and padding but drops the glass, rim and shadow, and adds a divider above.',
  },
  sizes: { na: 'Card has no size prop. Its width comes from the layout around it, usually a Grid, and its height from its content.' },
  emphasis: { na: 'A card carries no emphasis of its own. Hierarchy inside it comes from type and from its one loud Button.' },
  placement: {
    rows: [
      ['Alone on the scene', 'A focused task such as a sign-in or a player.'],
      ['In a Grid', 'A collection such as a feed or a gallery, with the scene visible in the gutters.'],
      ['Inset inside a card', 'A quoted post, an attachment or a sub-section.'],
    ],
    examples: [
      { title: 'Two cards in a Grid', render: <Grid><GridItem span={6}><Card as="div" className="demo-card"><b>Trips</b><p className="flush muted">4 saved</p></Card></GridItem><GridItem span={6}><Card as="div" className="demo-card"><b>Albums</b><p className="flush muted">12 shared</p></Card></GridItem></Grid> },
      { title: 'Inset inside a post', render: <Post quote={<Card as="div" variant="inset"><p className="flush muted small">Quoting Jonas Berg</p><p className="flush">Fløyen at 6am is worth the climb.</p></Card>} /> },
    ],
  },
  combinations: {
    good: [
      ['Card + CardCover', 'An item with a picture, such as a trip or an album.'],
      ['Card + inset Card', 'Content quoted or attached inside a pane.'],
      ['Card + Banner', 'A message about this pane, as its first line.'],
      ['Grid of Cards', 'A collection, with the scene showing in the gaps.'],
    ],
    avoid: [
      { title: 'glass inside glass', why: 'The second blur samples the first and text loses its edge. Use inset.', render: <Card as="div" className="demo-card"><Card as="div" className="demo-card"><p className="flush">Nested glass</p></Card></Card> },
      { title: 'cards that touch', why: 'Without a gap the scene disappears and two panes read as one.', render: <div className="demo-row" style={{ gap: 0 }}><Card as="div" className="demo-card">One</Card><Card as="div" className="demo-card">Two</Card></div> },
    ],
  },
  content: {
    formula: <p>A card that is a titled region is a <code>section</code> with a heading, and <code>aria-labelledby</code> points at the heading. A self-contained item such as a post is an <code>article</code>; give it an <code>aria-label</code> when it has no heading. Keep every line of text on the card. Text laid over the cover photo needs its own scrim.</p>,
    pair: {
      do: <Card as="section" aria-labelledby="cd-h" className="demo-card"><h3 id="cd-h" className="flush">Storage</h3><p className="flush muted">41 GB of 64 GB used</p></Card>,
      doNote: 'A section card named by its heading.',
      dont: <Card as="div" className="demo-card"><p className="flush muted">41 GB of 64 GB used</p></Card>,
      dontNote: 'A plain div with no name. A screen reader user cannot tell where it starts.',
    },
    overflow: { text: 'Long words and URLs break inside the card instead of pushing it wider. The card never scrolls sideways.', render: <div data-overflow-demo="" className="overflow-probe"><Card as="div" className="demo-card"><p className="flush" style={{ overflowWrap: 'anywhere' }}>bergen-harbour-blue-hour-from-floyen-2026-10-27-final-edit.jpg</p></Card></div> },
    rtl: { text: 'In right-to-left languages the content mirrors and the rim light stays on the top start corner.', render: <div dir="rtl" lang="ar"><Card as="div" className="demo-card"><b>مارا ليند</b><p className="flush muted">مصورة مناظر طبيعية</p></Card></div> },
    expansion: { text: 'The card grows with its content, so translated text only makes it taller.', render: <Card as="div" className="demo-card"><b>Landschaftsfotografin aus Bergen</b><p className="flush muted">Gespeichert unter Reisen</p></Card> },
  },
  behaviours: {
    states: [
      ['Rest', 'Rim light along the top edge.', 'Light catching an edge (P3).'],
      ['Hover', 'The rim light drifts toward the centre over 640ms. The card does not move.', 'Nothing moves on its own; the light answers the pointer (P4).'],
      ['Environment change', 'The dimming glides over 640ms.', 'The world changes, the interface does not jump (P1).'],
      ['Reduced transparency', 'Opaque graphite, no blur.', 'Structure survives without glass (P6).'],
      ['Forced colours', 'A solid CanvasText border replaces the rim.', 'Structure survives without glass (P6).'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Passes through to the controls inside. The card itself takes no focus.', 'Card.tsx sets no tabindex'],
      ['Mouse', 'Hover', 'Moves the rim light only.', 'Card.why.json'],
      ['Touch', 'Tap', 'Nothing. Actions are Buttons inside the card.', 'Card.why.json'],
    ],
    loading: <p>Card has no loading state. While content loads, keep the card at its final size and show placeholders inside it, so the layout does not jump when the content arrives.</p>,
    focus: <p>A card never takes focus. When a card is removed, move focus to the next card or to the list heading.</p>,
  },
  deepDive: {
    glass: {
      purpose: <p>The glass card is the pane. It floats over the scene, dims it by the measured amount and casts the float shadow. It is the only surface in Pane with a blur.</p>,
      context: <Card as="section" aria-label="Player" className="demo-card"><CardCover /><h3 className="flush">Northern Lights</h3><p className="flush muted">Field recording · 42 min</p><div className="demo-row"><Button size="sm">Play</Button><Tag>Ambient</Tag></div></Card>,
      practices: ['Leave a gap of at least the Grid gutter between glass cards.', 'Let one card hold one task.', 'Keep every line of text on the glass. Text laid straight on the photo has nothing measured under it.'],
      pair: { do: <Card as="div" className="demo-card"><b>Albums</b><p className="flush muted">12 shared</p></Card>, doNote: 'One job per pane.', dont: <Card as="div" className="demo-card"><b>Albums</b><p className="flush muted">12 shared</p><b>Sign out</b><p className="flush muted">Ends this session</p></Card>, dontNote: 'Two unrelated jobs on one pane. Albums and signing out each get their own card.' },
    },
    inset: {
      purpose: <p>Inset nests content inside a pane without a second layer of glass. It keeps the padding and adds a divider above, so the nested part reads as inside the pane, with an inner radius equal to the outer radius minus the padding (P3).</p>,
      context: <Post quote={<Card as="div" variant="inset"><p className="flush muted small">Quoting Jonas Berg</p><p className="flush">Fløyen at 6am is worth the climb.</p></Card>} />,
      practices: ['Use inset only inside a glass card. On its own it has no glass, so nothing makes its text readable over a photo.', 'Keep it one level deep.'],
      pair: { do: <Card as="div" className="demo-card"><b>Order</b><Card as="div" variant="inset"><p className="flush">2 prints, A3</p></Card></Card>, doNote: 'Inset inside glass.', dont: <Card as="div" className="demo-card"><b>Order</b><Card as="div" variant="inset"><Card as="div" variant="inset"><p className="flush">2 prints, A3</p></Card></Card></Card>, dontNote: 'Inset inside inset. Each level adds padding and a divider until the content is a sliver.' },
    },
  },
  modifiers: [
    { name: 'Cover', rules: <p>Put <code>CardCover</code> first in the card. It bleeds to the card’s edges and takes the card’s top corners. It is decorative, so the title and any meaning live in text below it.</p>, pair: { do: <Card as="div" className="demo-card"><CardCover /><b>Lysefjord</b></Card>, doNote: 'Cover first, title below.', dont: <Card as="div" className="demo-card"><b>Lysefjord</b><CardCover /></Card>, dontNote: 'A cover in the middle loses its full-bleed edge.' } },
    { name: 'Element', rules: <p>Choose <code>as</code> by meaning. <code>article</code> for a self-contained item, <code>section</code> for a titled region, <code>aside</code> for related content and <code>header</code> for a page head.</p>, pair: { do: <Card as="article" aria-label="Post" className="demo-card"><p className="flush">A post</p></Card>, doNote: 'A post is an article.', dont: <Card as="header" className="demo-card"><p className="flush">A post</p></Card>, dontNote: 'A post marked as a header confuses landmark navigation.' } },
  ],
  related: [
    ['/components/environment', 'Environment', 'Sets how much the glass dims for a backdrop.'],
    ['/components/grid', 'Grid', 'Lays cards out in columns with gutters.'],
    ['/foundations/shape', 'Shape and elevation', 'Corner and shadow rules for nesting.'],
    ['/patterns/profile-card', 'Profile card', 'A full card built from every component.'],
  ],
  references: [
    { title: 'Apple Human Interface Guidelines · Materials', url: 'https://developer.apple.com/design/human-interface-guidelines/materials', why: 'Pane’s lineage for glass that keeps content legible over any background.' },
    { title: 'WCAG 2.2 · 1.4.3 Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', why: 'The 4.5:1 floor the glass is measured against.' },
    { title: 'HTML Living Standard · The article element', url: 'https://html.spec.whatwg.org/multipage/sections.html#the-article-element', why: 'When a card should be an article.' },
  ],
};
