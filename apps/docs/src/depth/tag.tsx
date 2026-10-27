// Tag's Usage tab (component-depth.md U1–U14). A static category label in outlined small caps.
import { Badge, Card, CardCover, Chip, Stack, Tag } from 'pane-react';
import type { Depth } from './types';

const Album = ({ tags }: { tags: string[] }) => (
  <Card as="article" aria-label="Album" className="demo-card"><CardCover /><h3 className="flush">Lysefjord at dawn</h3><Stack direction="row" gap="sm">{tags.map((t) => <Tag key={t}>{t}</Tag>)}</Stack></Card>
);

export const TAG: Depth = {
  overview: (
    <>
      <p>A tag names what something is about. An album is Landscape, a post is Travel, an asset is 05. Tags describe content that does not change while the reader looks at it. They never report a state, and nothing happens when you press one.</p>
      <p>A tag is a thin ring with an 11px label in small caps, so it reads as a label on the object and never as a control. It has no fill, which keeps the scene visible through it and keeps it quieter than any Badge or Button on the same pane (P1, P5).</p>
      <p>Show tags only when they help the reader choose or understand. A gallery where every album says Photo does not need a tag at all. A feed mixing photos, prints and field recordings does, because the tag tells the reader what kind of thing each card is before they read it.</p>
      <p>The small caps come from CSS. The text stays in normal case in the markup, so a screen reader says the words instead of spelling out letters, and copied text keeps its original case.</p>
    </>
  ),
  whenToUse: [
    'Categories and topics on a piece of content, such as Landscape or Travel.',
    'Short metadata that describes the object, such as an asset number or a format.',
    'A small set of labels under a title, two or three at most.',
  ],
  whenNot: [
    { situation: 'A state that can change, such as Live or Failed', to: '/components/badge', label: 'Badge' },
    { situation: 'A filter the reader turns on and off', to: '/components/chip', label: 'Chip' },
    { situation: 'A value the reader can remove', to: '/components/chip', label: 'Chip with onRemove' },
    { situation: 'A link to all items in that category', to: '/foundations/typography', label: 'A text link' },
  ],
  variants: { na: 'Tag has one look on purpose. A second weight would turn a label into a status, which is what Badge is for.' },
  anatomy: {
    render: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Tag>Landscape</Tag></Stack></Card>,
    parts: [
      { part: 'Ring', selector: '[data-component="Tag"]', what: 'A thin ring in the text colour, full pill, no fill.' },
      { part: 'Label', selector: '[data-component="Tag"]', what: '11px small caps with 0.08em tracking. Normal case in the markup.' },
    ],
  },
  sizes: { na: 'Tag has one size, 11px type in a ring sized to it, so it always reads as a label beside 15px body text.' },
  emphasis: {
    text: <p>A tag is metadata, so it sits after the title and never before it. Readers scan the title first and the tag answers the second question, which is what kind of thing this is. Tags are the quietest marks on a pane. Two or three tags sit under a title without competing with it. Past three they turn into a list the reader has to scan, and the important one gets lost.</p>,
    pair: {
      do: <Album tags={['Landscape', 'Norway']} />,
      doNote: 'Two tags, both about the album.',
      dont: <Album tags={['Landscape', 'Norway', 'Dawn', 'Fjord', 'Travel', 'Print']} />,
      dontNote: 'Six tags. None of them stands out.',
    },
  },
  placement: {
    rows: [
      ['Under a title', 'The default. The tags describe what the title names.'],
      ['Beside a title', 'One tag that qualifies the whole pane, such as Beta.'],
      ['On a cover', 'Only on a dark scrim, because a tag has no fill of its own.'],
    ],
    examples: [
      { title: 'Under a title', render: <Album tags={['Landscape', 'Norway']} /> },
      { title: 'Beside a title', render: <Card as="section" aria-label="Privacy" className="demo-card"><div className="component-head"><h3 className="flush">Privacy</h3><Tag>Beta</Tag></div><p className="flush muted">Encrypted messages are on.</p></Card> },
    ],
  },
  combinations: {
    good: [['Tag + Badge', 'A category and a state on the same item, such as Landscape and New.'], ['Tags in a Stack', 'Two or three tags with the small gap between them.']],
    avoid: [
      { title: 'a tag used as status', why: 'Live is a state. A Badge says it with colour and a shape.', render: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Tag>Live</Tag></Stack></Card> },
      { title: 'tags that look pressable next to chips', why: 'Mixed in a row the reader cannot tell which ones do something.', render: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Tag>Landscape</Tag><Chip>Photos</Chip><Tag>Norway</Tag></Stack></Card> },
    ],
  },
  content: {
    formula: <p>Keep a short list of allowed tags per product and reuse it, so filtering and search can rely on them later. Free-form tags drift into near duplicates within weeks. One or two words, a noun, in normal case in the markup. Use the same word for the same category everywhere, so Landscape is never also Landscapes or Scenery. Leave out the hash sign. The ring already says it is a tag.</p>,
    pair: { do: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Tag>Landscape</Tag></Stack></Card>, doNote: 'A noun in normal case.', dont: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Tag>#LANDSCAPE PHOTOS</Tag></Stack></Card>, dontNote: 'A hash, capitals in the markup and two words where one does.' },
    overflow: { text: 'A tag never wraps or truncates. Its label stays on one line, and a long label makes the tag wider, so keep labels short.', render: <div data-overflow-demo="" className="overflow-probe"><Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Tag>Long exposure</Tag></Stack></Card></div> },
    rtl: { text: 'In right-to-left languages a row of tags starts at the right. Arabic has no small caps, so the label shows as written.', render: <div dir="rtl" lang="ar"><Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Tag>طبيعة</Tag><Tag>النرويج</Tag></Stack></Card></div> },
    expansion: { text: 'German labels run longer, so a row of tags may wrap to a second line. Each tag stays whole.', render: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Tag>Landschaft</Tag><Tag>Norwegen</Tag></Stack></Card> },
  },
  behaviours: {
    states: [['Rest', 'Ring and label, no fill.', 'A label is not a control, so it has no other state (P3).'], ['Forced colours', 'The ring takes CanvasText.', 'Structure survives without glass (P6).']],
    interactions: [['Keyboard', 'Tab', 'Skips it. A tag is not focusable.', 'Tag.tsx renders a span'], ['Mouse', 'Click', 'Nothing.', 'Tag.tsx renders a span'], ['Touch', 'Tap', 'Nothing.', 'Tag.tsx renders a span']],
    loading: <p>Tag has no loading state. Render tags with the content they describe, so a card never shows its tags before its title or after a delay that shifts the layout.</p>,
    focus: <p>A tag never takes focus. In a list of cards a screen reader reads each card’s tags as plain words after its title, so keep them in the same place on every card and keep their number small. Ten cards with five tags each is fifty extra words before the reader reaches the next title.</p>,
  },
  deepDive: { na: 'Tag has no variant prop, so there is nothing to compare.' },
  modifiers: { na: 'Tag has no optional slots or booleans. It is a ring around a word. A tag that links to all items in its category is planned, and until then a text link beside the title does that job.' },
  related: [['/components/badge', 'Badge', 'A state such as Live or 3 new.'], ['/components/chip', 'Chip', 'A label the reader can toggle or remove.'], ['/foundations/typography', 'Typography', 'The caption size and caps tracking tags use.']],
  references: [
    { title: 'Apple Human Interface Guidelines · Typography', url: 'https://developer.apple.com/design/human-interface-guidelines/typography', why: 'Pane’s lineage for small labels next to body text.' },
    { title: 'WCAG 2.2 · 1.4.12 Text Spacing', url: 'https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html', why: 'Why tracking comes from a token that a reader’s override can replace.' },
  ],
};
