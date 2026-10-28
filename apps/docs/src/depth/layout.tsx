// Usage tabs for the layout primitives (Container, Grid, Stack) and Environment. They have no form
// of their own (identity: false in their why.json), so their pages are about structure, and their
// diagrams sit on the Field backdrop where labels are measured (D-019).
import { Card, Container, Environment, Grid, GridItem, Stack, Tag } from 'pane-react';
import type { Depth } from './types';

const Box = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card"><p className="flush">{children}</p></Card>;
const NO_EMPHASIS = { na: 'A layout primitive has no emphasis of its own. Hierarchy comes from what is placed inside it.' };
const NO_DIVE = { na: 'There is no variant prop, so there is nothing to compare one variant against.' };
const LAYOUT_BEHAVIOUR = (what: string) => ({
  states: [['Rest', what, 'Structure only. It paints nothing (P3).'], ['Forced colours', 'No change, because it draws nothing.', 'Structure survives by definition (P6).']] as Array<[string, string, string]>,
  interactions: [['Keyboard', 'Tab', 'Not focusable. Children keep their own order.', 'Renders a div'], ['Screen reader', 'Read', 'Not announced. It has no role.', 'Renders a div']] as Array<[string, string, string, string]>,
  loading: <p>It has no loading state. Keep placeholders the same size as the content they stand for, so the layout does not move when content arrives.</p>,
  focus: <p>It never takes focus. Reading and tab order follow the DOM order of its children.</p>,
});

export const CONTAINER: Depth = {
  overview: (
    <>
      <p>Container sets how wide a page or region may grow, and keeps the page margin on both sides. Content inside it never runs edge to edge on a wide screen, and never touches the edge on a phone.</p>
      <p>The margin comes from the layout tokens, 16px on phones and wider at larger breakpoints. The widths come from the same tokens as the Grid, so a Container and the Grid inside it agree about where the edges are.</p>
    </>
  ),
  whenToUse: ['Around the whole page, inside main.', 'Around a reading column, at sm or md.', 'Around a region that should line up with the page width.'],
  whenNot: [{ situation: 'Space between siblings', to: '/components/stack', label: 'Stack' }, { situation: 'Columns', to: '/components/grid', label: 'Grid' }],
  variants: { na: 'Container has no variant prop. It only sets a width and a margin.' },
  anatomy: { render: <Container size="sm"><Box>Content column</Box></Container>, parts: [{ part: 'Maximum width', selector: '[data-component="Container"]', what: 'From container.max-size, which points at the layout container tokens.' }, { part: 'Inline margin', selector: '[data-component="Container"]', what: 'container.margin, the page margin for the breakpoint.' }] },
  sizes: {
    sm: { use: '640px. A reading column or a single form.', pairs: 'Body text at about 70 characters a line (P7).' },
    md: { use: '768px. An article with images, or settings.', pairs: 'Two Grid columns at most.' },
    lg: { use: '1024px. A feed with a side panel.', pairs: 'A 12-column Grid.' },
    xl: { use: '1200px, the default. Most app screens.', pairs: 'A 12-column Grid with cards.' },
    '2xl': { use: '1440px. Galleries and wide media.', pairs: 'Grids of many small cards.' },
  },
  emphasis: NO_EMPHASIS,
  placement: { rows: [['Inside main', 'The default page frame.'], ['Inside a section', 'A narrower column within the page, such as a reading block.']], examples: [{ title: 'A reading column', render: <Container size="sm"><Box>Reading text sits at sm, about 70 characters a line.</Box></Container> }] },
  combinations: { good: [['Container + Grid', 'The usual page frame.'], ['Container sm + text', 'A reading page.']], avoid: [{ title: 'a container inside a container', why: 'Two margins stack and the content shrinks for no reason.', render: <Container size="md"><Container size="md"><Box>Double margin</Box></Container></Container> }] },
  content: { na: 'Container holds no text of its own. Its content follows the rules of the components inside it.' },
  behaviours: LAYOUT_BEHAVIOUR('A centred block at its maximum width with the page margin.'),
  deepDive: NO_DIVE,
  modifiers: { na: 'Container has no optional slots or booleans.' },
  related: [['/components/grid', 'Grid', 'Columns inside the container.'], ['/foundations/grid', 'Grid and layout', 'The breakpoints and margins.']],
  references: [{ title: 'Apple Human Interface Guidelines · Layout', url: 'https://developer.apple.com/design/human-interface-guidelines/layout', why: 'Pane’s lineage for margins around content.' }, { title: 'WCAG 2.2 · 1.4.10 Reflow', url: 'https://www.w3.org/WAI/WCAG22/Understanding/reflow.html', why: 'Why content must fit 320px without sideways scrolling.' }],
};

export const GRID: Depth = {
  overview: (
    <>
      <p>Grid lays content on columns that follow the screen, with 4 on phones, 8 from 768px and 12 from 1024px. Each item says how many columns it spans at each breakpoint, so the same markup gives one column on a phone and three on a desktop.</p>
      <p>The gutters are wide enough to see the scene between the cards, because the scene is part of the interface (P1). Spans never change the DOM order, so reading order and tab order stay the same at every width.</p>
    </>
  ),
  whenToUse: ['A collection of cards, such as a feed or a gallery.', 'A page with a main column and a side column.', 'Any layout that changes column count with the screen.'],
  whenNot: [{ situation: 'One row or one column of things', to: '/components/stack', label: 'Stack' }, { situation: 'Rows of data with headers', to: '/reference/status', label: 'A real table' }],
  variants: { na: 'Grid has no variant prop. Its columns come from the layout tokens.' },
  anatomy: { render: <Grid><GridItem span={2}><Box>Span 2</Box></GridItem><GridItem span={2}><Box>Span 2</Box></GridItem></Grid>, parts: [{ part: 'Grid', selector: '[data-component="Grid"]', what: 'A CSS grid whose column count and gap come from the grid tokens.' }, { part: 'Item', selector: '[data-component="Grid"] > *', what: 'GridItem. Sets the span for each breakpoint.' }] },
  sizes: { na: 'Grid has no size prop. Its column count follows the breakpoint, and columns can be overridden with the columns prop.' },
  emphasis: NO_EMPHASIS,
  placement: { rows: [['Inside a Container', 'The default. The grid edges match the page margin.'], ['Inside a card', 'Rarely. A card’s own content is usually a Stack.']], examples: [{ title: 'Main and side', render: <Grid><GridItem span="full" lg={8}><Box>Main</Box></GridItem><GridItem span="full" lg={4}><Box>Side</Box></GridItem></Grid> }] },
  combinations: { good: [['Grid of Cards', 'A collection with the scene in the gutters.'], ['Container + Grid', 'A page frame.']], avoid: [{ title: 'spans that do not add up', why: 'Items wrap at odd places and leave holes. Make each row sum to the column count.', render: <Grid columns={4}><GridItem span={3}><Box>3</Box></GridItem><GridItem span={3}><Box>3</Box></GridItem></Grid> }] },
  content: { na: 'Grid holds no text of its own.' },
  behaviours: LAYOUT_BEHAVIOUR('Columns and gutters from the tokens at each breakpoint.'),
  deepDive: NO_DIVE,
  modifiers: [{ name: 'Responsive spans', rules: <p>Set <code>span</code> for phones, then <code>md</code> and <code>lg</code> for wider screens. An item with only <code>span</code> keeps it at every width.</p>, pair: { do: <Grid><GridItem span="full" md={4}><Box>Full, then half</Box></GridItem><GridItem span="full" md={4}><Box>Full, then half</Box></GridItem></Grid>, doNote: 'Full width on phones, halves from md.', dont: <Grid columns={4}><GridItem span={1}><Box>¼</Box></GridItem></Grid>, dontNote: 'A quarter of a phone is too narrow to read.' } }],
  related: [['/components/container', 'Container', 'The frame around the grid.'], ['/foundations/grid', 'Grid and layout', 'Columns, gutters and breakpoints.']],
  references: [{ title: 'Apple Human Interface Guidelines · Layout', url: 'https://developer.apple.com/design/human-interface-guidelines/layout', why: 'Pane’s lineage for adaptive columns.' }, { title: 'WCAG 2.2 · 1.3.2 Meaningful Sequence', url: 'https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html', why: 'Why spans must never reorder content.' }],
};

export const STACK: Depth = {
  overview: (
    <>
      <p>Stack spaces its children in one direction with a gap from the token scale. Children never carry their own margins, so spacing is owned by the parent and stays consistent when items move.</p>
      <p>A column stack is the usual way to lay out the inside of a card. A row stack lays things out inline and wraps when it runs out of room, such as a row of tags or buttons.</p>
    </>
  ),
  whenToUse: ['The inside of a card, with its title, text and actions.', 'A row of tags, chips or buttons.', 'Any list of items with even spacing.'],
  whenNot: [{ situation: 'Items that must line up in columns', to: '/components/grid', label: 'Grid' }, { situation: 'A list with meaning, such as steps', to: '/foundations/typography', label: 'A real ul or ol' }],
  variants: { na: 'Stack has no variant prop. Direction, gap and alignment are layout choices, covered below.' },
  anatomy: { render: <Card as="div" className="demo-card"><Stack direction="row" gap="md"><Tag>One</Tag><Tag>Two</Tag><Tag>Three</Tag></Stack></Card>, parts: [{ part: 'Flex container', selector: '[data-component="Stack"]', what: 'A flex box in column or row direction. Row wraps.' }, { part: 'Gap', selector: '[data-component="Stack"] > *', what: 'stack.gap, xs 4px to xl 32px, between every pair of children.' }] },
  sizes: { na: 'Stack has no size prop. Its gap prop picks from the spacing scale, shown under Modifiers.' },
  emphasis: NO_EMPHASIS,
  placement: { rows: [['Inside a card', 'Column, gap md. The default card layout.'], ['A row of controls', 'Row, gap sm.']], examples: [{ title: 'Card content', render: <Card as="div" className="demo-card"><Stack gap="md"><b>Lysefjord</b><span className="muted">Saved to Trips</span></Stack></Card> }] },
  combinations: { good: [['Stack in a Card', 'Card content.'], ['Row stack of Tags', 'Labels under a title.']], avoid: [{ title: 'margins on children', why: 'Margins fight the gap and differ between items. Let the Stack own the space.', render: <Card as="div" className="demo-card"><Stack gap="md"><b style={{ marginBlockEnd: 24 }}>Title with its own margin</b><span className="muted">Text</span></Stack></Card> }] },
  content: { na: 'Stack holds no text of its own.' },
  behaviours: LAYOUT_BEHAVIOUR('Children in a line with an even gap.'),
  deepDive: NO_DIVE,
  modifiers: [{ name: 'Gap', rules: <p>Pick the gap by how related the children are. xs and sm for parts of one thing, such as an icon and its label. md for items in a card. lg and xl between groups.</p>, pair: { do: <Card as="div" className="demo-card"><Stack gap="xs"><b>Mara Lind</b><span className="muted small">Bergen</span></Stack></Card>, doNote: 'A name and its place, close together.', dont: <Card as="div" className="demo-card"><Stack gap="xl"><b>Mara Lind</b><span className="muted small">Bergen</span></Stack></Card>, dontNote: 'The same pair far apart reads as two separate things.' } }],
  related: [['/components/grid', 'Grid', 'Two-dimensional layout.'], ['/foundations/spacing', 'Spacing', 'The gap scale.']],
  references: [{ title: 'Every Layout · The Stack', url: 'https://every-layout.dev/layouts/stack/', why: 'The case for parent-owned spacing.' }, { title: 'Apple Human Interface Guidelines · Layout', url: 'https://developer.apple.com/design/human-interface-guidelines/layout', why: 'Pane’s lineage for grouping by proximity.' }],
};

export const ENVIRONMENT: Depth = {
  overview: (
    <>
      <p>Environment tells the glass how bright the scene behind it can get. A web page cannot read the pixels behind its own elements, so the app declares the brightness and every Card inside dims the scene by the amount measured for that level (P2).</p>
      <p>It renders a plain div with no styles of its own and re-points the glass tokens for everything inside. One Environment at the top of the screen is usual. A nested one is for a region over a different backdrop, and the nearest one wins.</p>
      <p>Only bright is calibrated today. Dim and mid resolve to the bright value until darker photos are measured, which is exception E-001.</p>
    </>
  ),
  whenToUse: ['Once at the top of any screen with glass on it.', 'Around a region over a different backdrop, such as a media viewer.', 'Whenever the app ships a new background image, set to the level it measures.'],
  whenNot: [{ situation: 'Making one card darker for emphasis', to: '/foundations/typography', label: 'Type and placement' }, { situation: 'A screen with no glass', to: '/foundations/glass', label: 'Leave it out' }],
  variants: { na: 'Environment has no variant prop. Its brightness levels are covered under Modifiers.' },
  anatomy: { render: <Environment brightness="bright"><Box>Glass inside</Box></Environment>, parts: [{ part: 'Wrapper', selector: '[data-environment]', what: 'A div with data-environment and no styles of its own.' }, { part: 'Glass inside', selector: '[data-component="Card"]', what: 'Every Card inside reads its dimming from the wrapper.' }] },
  sizes: { na: 'Environment has no size. It wraps whatever it is given.' },
  emphasis: NO_EMPHASIS,
  placement: { rows: [['Top of the screen', 'The default, once.'], ['Around a region', 'Only where the backdrop really changes.']], examples: [{ title: 'Top of the screen', render: <Environment brightness="bright"><Grid><GridItem span={2}><Box>Feed</Box></GridItem><GridItem span={2}><Box>Profile</Box></GridItem></Grid></Environment> }] },
  combinations: { good: [['Environment + Cards', 'Glass that knows its backdrop.']], avoid: [{ title: 'an environment per card', why: 'Every card at its own level makes neighbours dim differently over the same photo.', render: <Grid><GridItem span={2}><Environment brightness="bright"><Box>Bright</Box></Environment></GridItem><GridItem span={2}><Environment brightness="dim"><Box>Dim</Box></Environment></GridItem></Grid> }] },
  content: { na: 'Environment holds no text of its own.' },
  behaviours: { ...LAYOUT_BEHAVIOUR('Re-points the glass tokens for everything inside.'), states: [['bright (default)', 'Measured on four sunlit photos.', 'The safest level (P2).'], ['dim, mid', 'Uncalibrated, equal to bright (E-001).', 'An open exception, never hidden (P2).'], ['Change of level', 'Dimming glides over 640ms.', 'The world changes, the interface does not jump (P1).']] },
  deepDive: NO_DIVE,
  modifiers: [{ name: 'Material', rules: <p>Set <code>material="solid"</code> when the scene behind is live, such as a 3D view or a video, and the device has to re-blur it every frame. Every pane inside switches to the opaque surface and the backdrop filter is turned off, with the same measured contrast as the reduced-transparency fallback. Switch back to <code>glass</code> when the scene stops moving, if the frame rate allows.</p>, pair: { do: <Environment material="solid"><Box>Solid over a live 3D view</Box></Environment>, doNote: 'Opaque, so nothing is re-blurred each frame.', dont: <Environment><Box>Glass over a scene redrawn every frame</Box></Environment>, dontNote: 'Every pane re-blurs the scene on every frame.' } }, { name: 'Brightness', rules: <p>Set <code>brightness</code> to the brightest spot a card can land on while scrolling. A mostly dark photo with one lit window counts as bright.</p>, pair: { do: <Environment brightness="bright"><Box>Bright, sized for the lit window</Box></Environment>, doNote: 'Sized for the brightest spot.', dont: <Environment brightness="dim"><Box>Dim, because the photo is mostly dark</Box></Environment>, dontNote: 'The card that lands on the window fails.' } }],
  related: [['/components/card', 'Card', 'The glass it configures.'], ['/foundations/glass', 'Glass and environment', 'How the dimming was measured.']],
  references: [{ title: 'Apple Human Interface Guidelines · Materials', url: 'https://developer.apple.com/design/human-interface-guidelines/materials', why: 'Pane’s lineage for glass that adapts to what is behind it.' }, { title: 'WCAG 2.2 · 1.4.3 Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', why: 'The 4.5:1 the dimming is tuned for.' }],
};
