// Usage tabs for wave 1 (component-depth.md U1–U14): the layout primitives that draw nothing, and the
// Divider, which is the one with a form (an etched groove). Sections that cannot apply say why (G-K2).
import { AspectRatio, Badge, Box, Button, Card, Center, Chip, Divider, Flex, IconButton, Mesh, Spacer, Stack, Switch, VisuallyHidden } from 'pane-react';
import { IconHeart, IconPin, IconReply, IconShare } from '../icons';
import type { Depth } from './types';

const OnCard = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card">{children}</Card>;
const noKeys: Depth['behaviours']['interactions'] = [['Keyboard', 'Tab', 'Skips it. It is not focusable.', 'renders a plain element'], ['Mouse', 'Click', 'Nothing.', 'renders a plain element'], ['Touch', 'Tap', 'Nothing.', 'renders a plain element']];
const layoutBehaviours = (what: string): Depth['behaviours'] => ({
  states: [['Rest', `${what} has one state.`, 'Layout does not change on its own (P4).']],
  interactions: noKeys,
  loading: <p>It has no loading state. Keep the layout in place while content loads, so nothing shifts when it arrives.</p>,
  focus: <p>It never takes focus. Focus moves through the content inside it in reading order.</p>,
});
const ref = (title: string, url: string, why: string) => ({ title, url, why });
const CSSFLEX = ref('MDN · CSS flexible box layout', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout', 'The browser behaviour these primitives are thin names for.');
const SPACING = ref('Every Layout · Stack and spacing', 'https://every-layout.dev/layouts/stack/', 'Why space belongs to the container as a gap, not to the items as margins.');
const MDN_GAP = ref('MDN · gap', 'https://developer.mozilla.org/en-US/docs/Web/CSS/gap', 'The property every gap here sets.');

export const BOX: Depth = {
  overview: <><p>Box is padding and a corner and nothing else. Reach for it when content needs room around it but should not look like a surface: a note inside a card, a group of fields, a frame that clips media. When it should be seen, use Card, which brings the glass.</p></>,
  whenToUse: ['Padding around content that has no surface of its own.', 'A corner that clips media inside a pane.'],
  whenNot: [{ situation: 'Content that should look like a surface', to: '/components/card', label: 'Card' }, { situation: 'Space between siblings', to: '/components/stack', label: 'Stack' }],
  variants: { na: 'Box has no variant prop; padding and radius are scales, not looks.' },
  anatomy: { render: <OnCard><Box padding="lg" radius="inner" className="demo-box"><p className="flush">Padded note</p></Box></OnCard>, parts: [{ part: 'Box', selector: '[data-component="Box"]', what: 'Padding from the gap scale and a corner from the shape scale. No fill, rim or shadow.' }] },
  sizes: { na: 'Box has no size prop; its padding steps are the gap scale, from none to 2xl.' },
  emphasis: { na: 'Box draws nothing, so it carries no emphasis of its own.' },
  placement: { rows: [['Inside a Card', 'Around a note, a group or media.'], ['Around media', 'With radius="media" to clip an image.']], examples: [{ title: 'Inside a Card', render: <OnCard><Box padding="lg" className="demo-box"><p className="flush">A boxed note</p></Box></OnCard> }] },
  combinations: { good: [['Box + Mesh', 'A clipped cover.'], ['Box in a Card', 'A padded group inside a pane.']], avoid: [{ title: 'a box styled to look like a card', why: 'A border or fill on a Box invents a surface that Card already is.', render: <OnCard><Box padding="lg" radius="inner" className="demo-box"><p className="flush">Fake card</p></Box></OnCard> }] },
  content: { na: 'Box has no text of its own; the content inside follows its own rules.' },
  behaviours: layoutBehaviours('Box'),
  deepDive: { na: 'Box has no variant prop, so there is nothing to compare.' },
  modifiers: [
    { name: 'paddingInline and paddingBlock', rules: <p>Set the two axes apart when content needs more room at the sides than above and below. Each overrides padding on its axis only.</p>, pair: { do: <OnCard><Box paddingInline="xl" paddingBlock="xs" className="demo-box"><p className="flush">Roomy sides</p></Box></OnCard>, doNote: 'Wider at the sides.', dont: <OnCard><Box padding="2xl" className="demo-box"><p className="flush">Lost</p></Box></OnCard>, dontNote: 'Too much padding swallows a short label.' } },
    { name: 'radius', rules: <p>Use inner inside a pane, media around an image and round for a pill. A box inside a pane never takes the pane's own corner.</p>, pair: { do: <OnCard><Box radius="media" className="demo-box-media"><Mesh preset="tide" className="demo-fill" /></Box></OnCard>, doNote: 'The media corner on a cover.', dont: <OnCard><Box radius="none" className="demo-box-media"><Mesh preset="tide" className="demo-fill" /></Box></OnCard>, dontNote: 'A square image inside a round pane.' } },
  ],
  related: [['/components/card', 'Card', 'When the box should be seen.'], ['/components/stack', 'Stack', 'Space between items.']],
  references: [SPACING, ref('Every Layout · The Box', 'https://every-layout.dev/layouts/box/', 'The idea of a box as padding only.')],
};

export const FLEX: Depth = {
  overview: <><p>Flex is the browser's flexbox with the decisions made: the gap is a step from the scale, and the two alignments have plain names. Use it for a row whose ends matter, a title at the start and actions at the end, or a row of items that may wrap.</p></>,
  whenToUse: ['A title and actions on one row.', 'A row of chips or tags that may wrap.', 'A centred column of a few items.'],
  whenNot: [{ situation: 'A plain list of items one under another', to: '/components/stack', label: 'Stack' }, { situation: 'Columns across the page', to: '/components/grid', label: 'Grid' }],
  variants: { na: 'Flex has no variant prop; direction and alignment are layout, not looks.' },
  anatomy: { render: <OnCard><Flex justify="between"><h3 className="flush">Drafts</h3><Button size="sm">New</Button></Flex></OnCard>, parts: [{ part: 'Flex', selector: '[data-component="Flex"]', what: 'A flex container whose gap comes from the scale.' }] },
  sizes: { na: 'Flex has no size prop; its gap steps are the gap scale.' },
  emphasis: { na: 'Flex draws nothing, so it carries no emphasis of its own.' },
  placement: { rows: [['A card header', 'Title at the start, actions at the end.'], ['A filter row', 'Chips that wrap.']], examples: [{ title: 'A card header', render: <OnCard><Flex justify="between"><h3 className="flush">Drafts</h3><Button size="sm">New</Button></Flex></OnCard> }] },
  combinations: { good: [['Flex + Spacer', 'Push one item to the far end.'], ['Flex wrap + Chip', 'Filters that wrap.']], avoid: [{ title: 'a row that cannot wrap', why: 'Six chips in a no-wrap row overflow a narrow pane.', render: <OnCard><Flex gap="sm"><Chip>Fjords</Chip><Chip>Coast</Chip><Chip>Cities</Chip></Flex></OnCard> }] },
  content: { na: 'Flex has no text of its own; the items inside follow their own rules.' },
  behaviours: layoutBehaviours('Flex'),
  deepDive: { na: 'Flex has no variant prop, so there is nothing to compare.' },
  modifiers: [
    { name: 'justify', rules: <p>between puts the first item at the start and the last at the end. Use it for headers; centre only short groups.</p>, pair: { do: <OnCard><Flex justify="between"><h3 className="flush">Drafts</h3><Button size="sm">New</Button></Flex></OnCard>, doNote: 'Title and action at the two ends.', dont: <OnCard><Flex justify="center"><h3 className="flush">Drafts</h3><Button size="sm">New</Button></Flex></OnCard>, dontNote: 'A centred header loses its start edge.' } },
    { name: 'wrap', rules: <p>Turn wrap on for any row whose items might not fit at the narrowest width.</p>, pair: { do: <OnCard><Flex wrap gap="sm"><Chip>Fjords</Chip><Chip>Coast</Chip><Chip>Cities</Chip><Chip>Night</Chip></Flex></OnCard>, doNote: 'Chips move to a second line.', dont: <OnCard><Flex gap="sm"><Chip>Fjords</Chip><Chip>Coast</Chip></Flex></OnCard>, dontNote: 'Without wrap a longer list would overflow.' } },
  ],
  related: [['/components/stack', 'Stack', 'A plain list of items.'], ['/components/grid', 'Grid', 'Two dimensions.']],
  references: [CSSFLEX, SPACING, MDN_GAP],
};

export const CENTER: Depth = {
  overview: <><p>Center places content in the middle of the space it is given, across and down. Give it a height when the space should be taller than its content, as in an empty state.</p></>,
  whenToUse: ['Empty states.', 'An icon or a glyph in a tile.', 'A single action under a message.'],
  whenNot: [{ situation: 'A row of several items', to: '/components/flex', label: 'Flex' }, { situation: 'A page column', to: '/components/container', label: 'Container' }],
  variants: { na: 'Center has no variant prop; inline is a modifier, covered below.' },
  anatomy: { render: <OnCard><Center className="demo-center"><p className="flush">Centred</p></Center></OnCard>, parts: [{ part: 'Center', selector: '[data-component="Center"]', what: 'A grid that places its content in the middle both ways.' }] },
  sizes: { na: 'Center has no size prop; it takes the size of the space it is given.' },
  emphasis: { na: 'Center draws nothing, so it carries no emphasis of its own.' },
  placement: { rows: [['An empty card', 'Message and action in the middle.'], ['A tile', 'One icon in the middle.']], examples: [{ title: 'An empty card', render: <OnCard><Center className="demo-center"><Stack gap="sm" align="center"><h3 className="flush">No trips yet</h3><Button variant="glass" size="sm">Plan a trip</Button></Stack></Center></OnCard> }] },
  combinations: { good: [['Center + Stack', 'A centred message with its action.']], avoid: [{ title: 'centred body text', why: 'Long text in the middle is hard to read; centre only short lines.', render: <OnCard><Center><p className="flush">A long paragraph centred in the middle of a card reads badly because each line starts at a different place.</p></Center></OnCard> }] },
  content: { na: 'Center has no text of its own; keep centred text short.' },
  behaviours: layoutBehaviours('Center'),
  deepDive: { na: 'Center has no variant prop, so there is nothing to compare.' },
  modifiers: [{ name: 'inline', rules: <p>inline centres inside a line of text without breaking the line.</p>, pair: { do: <OnCard><p className="flush">Status <Center inline><Badge tone="positive">Synced</Badge></Center></p></OnCard>, doNote: 'Inline inside a sentence.', dont: <OnCard><p className="flush">Status</p><Center><Badge tone="positive">Synced</Badge></Center></OnCard>, dontNote: 'A block breaks the sentence apart.' } }],
  related: [['/components/flex', 'Flex', 'A row with named alignment.'], ['/components/stack', 'Stack', 'A centred list.']],
  references: [ref('MDN · place-items', 'https://developer.mozilla.org/en-US/docs/Web/CSS/place-items', 'The one property Center is.'), ref('Every Layout · The Center', 'https://every-layout.dev/layouts/center/', 'When to centre and when not to.')],
};

export const SPACER: Depth = {
  overview: <><p>A gap on the container is the first choice for space. Spacer is for the two cases a gap cannot do: pushing the next item to the far end of a row, and one larger break inside a row of evenly spaced items.</p></>,
  whenToUse: ['Pushing an action to the end of a row.', 'One larger break between two groups in a row.'],
  whenNot: [{ situation: 'Even space between every item', to: '/components/stack', label: 'Stack gap' }, { situation: 'Space around content', to: '/components/box', label: 'Box padding' }],
  variants: { na: 'Spacer has no variant prop; its only choice is its size.' },
  anatomy: { render: <OnCard><Flex><p className="flush">3 selected</p><Spacer /><Button size="sm">Move</Button></Flex></OnCard>, parts: [{ part: 'Spacer', selector: '[data-component="Spacer"]', what: 'An empty span hidden from assistive technology.' }] },
  sizes: { xs: { use: '4px, between a glyph and its label.', pairs: 'Icons beside text.' }, sm: { use: '8px, between related controls.', pairs: 'Buttons in a group.' }, md: { use: '16px, between groups in a row.', pairs: 'Toolbar groups.' }, lg: { use: '24px, a clear break.', pairs: 'Header sections.' }, xl: { use: '32px, a strong break.', pairs: 'Separate tool groups.' }, '2xl': { use: '48px, rarely, between regions.', pairs: 'Page-level rows.' } },
  emphasis: { na: 'Spacer is empty, so it carries no emphasis of its own.' },
  placement: { rows: [['In a row', 'Before the item that should sit at the end.'], ['In a column', 'Before a footer action.']], examples: [{ title: 'In a row', render: <OnCard><Flex><p className="flush">3 selected</p><Spacer /><Button size="sm">Move</Button></Flex></OnCard> }] },
  combinations: { good: [['Flex + Spacer', 'A row with a pushed end.']], avoid: [{ title: 'spacers instead of a gap', why: 'A spacer between every item is a gap done by hand; it drifts when items change.', render: <OnCard><Flex gap="none"><Button variant="glass" size="sm">A</Button><Spacer size="sm" /><Button variant="glass" size="sm">B</Button><Spacer size="sm" /><Button variant="glass" size="sm">C</Button></Flex></OnCard> }] },
  content: { na: 'Spacer has no content by definition.' },
  behaviours: layoutBehaviours('Spacer'),
  deepDive: { na: 'Spacer has no variant prop, so there is nothing to compare.' },
  modifiers: { na: 'Spacer has no optional slots or booleans; size is covered under Sizes.' },
  related: [['/components/flex', 'Flex', 'Where a Spacer usually sits.'], ['/foundations/spacing', 'Spacing', 'The scale.']],
  references: [SPACING, CSSFLEX, MDN_GAP],
};

export const DIVIDER: Depth = {
  overview: <><p>A Divider separates two groups that belong to the same pane. It is a groove, not a drawn line: a hairline of shade over a hairline of light, the way every recess in Pane is lit from above. If the two groups are different subjects, give them separate cards instead.</p><p>It is a separator for assistive technology. When headings already separate the groups, mark it decorative so a screen reader does not announce it.</p></>,
  whenToUse: ['Two groups of related settings in one pane.', 'Between groups of actions in a toolbar.'],
  whenNot: [{ situation: 'Two different subjects', to: '/components/card', label: 'a second Card' }, { situation: 'Every row of a list', to: '/foundations/spacing', label: 'spacing alone' }],
  variants: { na: 'Divider has one look on purpose, the etched groove; orientation and inset are modifiers.' },
  anatomy: { render: <OnCard><p className="flush">Above</p><Divider /><p className="flush">Below</p></OnCard>, parts: [{ part: 'Groove', selector: '[data-component="Divider"]', what: 'A hairline of shade with a hairline of light under it, 2px in all.' }] },
  sizes: { na: 'Divider has one size, two hairlines; a heavier line would read as a border.' },
  emphasis: { text: <p>A divider is the quietest mark in a pane. One between two groups is enough; a divider under every row turns a pane into a table.</p>, pair: { do: <OnCard><Stack gap="md"><Switch label="Mentions" defaultChecked /><Switch label="Followers" /></Stack><Divider /><Switch label="Summary" /></OnCard>, doNote: 'One divider between two groups.', dont: <OnCard><Switch label="Mentions" /><Divider /><Switch label="Followers" /><Divider /><Switch label="Summary" /></OnCard>, dontNote: 'A divider after every row.' } },
  placement: { rows: [['Between groups', 'Inside one pane.'], ['In a toolbar', 'Vertical, between action groups.']], examples: [{ title: 'In a toolbar', render: <OnCard><Flex gap="sm"><IconButton aria-label="Reply" variant="ghost" size="sm"><IconReply /></IconButton><IconButton aria-label="Like" variant="ghost" size="sm"><IconHeart /></IconButton><Divider orientation="vertical" /><IconButton aria-label="Share" variant="ghost" size="sm"><IconShare /></IconButton></Flex></OnCard> }] },
  combinations: { good: [['Divider + Switch groups', 'Settings in two sections.']], avoid: [{ title: 'a divider between cards', why: 'Cards are already separate surfaces; a line between them adds noise.', render: <Stack gap="sm"><OnCard><p className="flush">One</p></OnCard><Divider /><OnCard><p className="flush">Two</p></OnCard></Stack> }] },
  content: { na: 'Divider holds no text; put a heading above a group instead of a label in the line.' },
  behaviours: { states: [['Rest', 'The etched groove.', 'A separator does not change (P4).'], ['Forced colours', 'A plain CanvasText line.', 'Structure survives without the light model.']], interactions: noKeys, loading: <p>No loading state; draw it with the groups it separates.</p>, focus: <p>It never takes focus. A screen reader announces it as a separator unless it is decorative.</p> },
  deepDive: { na: 'Divider has no variant prop, so there is nothing to compare.' },
  modifiers: [
    { name: 'orientation', rules: <p>vertical stands between items in a row and is at least as tall as an icon.</p>, pair: { do: <OnCard><Flex gap="sm"><IconButton aria-label="Reply" variant="ghost" size="sm"><IconReply /></IconButton><Divider orientation="vertical" /><IconButton aria-label="Share" variant="ghost" size="sm"><IconShare /></IconButton></Flex></OnCard>, doNote: 'Between two groups of actions.', dont: <OnCard><Flex gap="sm"><IconButton aria-label="Reply" variant="ghost" size="sm"><IconReply /></IconButton><Divider orientation="vertical" /><IconButton aria-label="Like" variant="ghost" size="sm"><IconHeart /></IconButton><Divider orientation="vertical" /><IconButton aria-label="Share" variant="ghost" size="sm"><IconShare /></IconButton></Flex></OnCard>, dontNote: 'A divider between every icon.' } },
    { name: 'inset', rules: <p>inset stops the line at the content inset, so it lines up with the text above and below.</p>, pair: { do: <Card as="div" className="demo-card demo-flush"><p className="demo-row-pad flush">Lofoten</p><Divider inset decorative /><p className="demo-row-pad flush">Senja</p></Card>, doNote: 'In line with the text.', dont: <Card as="div" className="demo-card demo-flush"><p className="demo-row-pad flush">Lofoten</p><Divider decorative /><p className="demo-row-pad flush">Senja</p></Card>, dontNote: 'Edge to edge in a list of text.' } },
  ],
  related: [['/components/card', 'Card', 'Separate subjects.'], ['/foundations/shape', 'Shape', 'The light model the groove follows.']],
  references: [ref('WAI-ARIA 1.2 · separator', 'https://www.w3.org/TR/wai-aria-1.2/#separator', 'The role it carries.'), ref('NN/g · Proximity principle', 'https://www.nngroup.com/articles/gestalt-proximity/', 'Space groups things first; a line is the second tool.')],
};

export const ASPECT_RATIO: Depth = {
  overview: <><p>AspectRatio keeps media at its shape while the layout changes width, and keeps the space while the media loads. Its one child fills it; an image or a video inside it covers the frame.</p></>,
  whenToUse: ['Photos, video and covers.', 'Placeholders that must keep their shape before content arrives.'],
  whenNot: [{ situation: 'A profile picture', to: '/components/avatar', label: 'Avatar' }, { situation: 'Text', to: '/components/box', label: 'Box (let text grow)' }],
  variants: { na: 'AspectRatio has no look; its ratio is a modifier, covered below.' },
  anatomy: { render: <OnCard><AspectRatio ratio="video" className="demo-media"><Mesh preset="ember" /></AspectRatio></OnCard>, parts: [{ part: 'Frame', selector: '[data-component="AspectRatio"]', what: 'Holds the ratio and clips its child.' }] },
  sizes: { na: 'AspectRatio has no size; it takes the width it is given and the ratio sets the height.' },
  emphasis: { na: 'AspectRatio draws nothing, so its child carries the emphasis.' },
  placement: { rows: [['At the top of a card', 'A cover.'], ['In a grid of media', 'Square tiles.']], examples: [{ title: 'At the top of a card', render: <OnCard><AspectRatio ratio="video" className="demo-media"><Mesh preset="ember" /></AspectRatio><h3 className="flush">Field notes</h3></OnCard> }] },
  combinations: { good: [['AspectRatio + Mesh', 'A cover that keeps its shape.'], ['AspectRatio + img', 'A photo that never jumps.']], avoid: [{ title: 'text inside a ratio box', why: 'Text that grows gets cut off by the fixed height.', render: <OnCard><AspectRatio ratio="wide" className="demo-media"><p className="flush">A long caption that will not fit inside this short frame at narrow widths</p></AspectRatio></OnCard> }] },
  content: { na: 'AspectRatio has no text; an image inside needs alt text.' },
  behaviours: layoutBehaviours('AspectRatio'),
  deepDive: { na: 'AspectRatio has no variant prop, so there is nothing to compare.' },
  modifiers: [{ name: 'ratio', rules: <p>square for tiles, photo for camera images, video for covers and players, portrait for people and posters, wide for banners.</p>, pair: { do: <OnCard><AspectRatio ratio="square" className="demo-media"><Mesh preset="tide" /></AspectRatio></OnCard>, doNote: 'Square for a grid tile.', dont: <OnCard><AspectRatio ratio="wide" className="demo-media"><Mesh preset="tide" /></AspectRatio></OnCard>, dontNote: 'Wide in a narrow tile leaves a sliver.' } }],
  related: [['/components/mesh', 'Mesh', 'A cover without a photo.'], ['/components/card', 'Card', 'Where covers sit.']],
  references: [ref('MDN · aspect-ratio', 'https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio', 'The property behind it.'), ref('web.dev · Cumulative Layout Shift', 'https://web.dev/articles/cls', 'Why media keeps its space before it loads.')],
};

export const VISUALLY_HIDDEN: Depth = {
  overview: <><p>VisuallyHidden puts words in the accessibility tree without putting them on screen. Use it when the eye already gets the meaning from an icon, a colour or the layout, and a screen reader needs the same meaning in words.</p></>,
  whenToUse: ['A word for an icon that sits beside text.', 'What a bare count or a colour stands for.', 'Skip links (with focusable).'],
  whenNot: [{ situation: 'Naming an icon-only button', to: '/components/icon-button', label: 'aria-label on IconButton' }, { situation: 'Hiding from everyone', to: '/accessibility', label: 'the hidden attribute' }],
  variants: { na: 'VisuallyHidden has no look by definition.' },
  anatomy: { render: <OnCard><Flex gap="sm"><IconPin aria-hidden="true" /><VisuallyHidden>Location:</VisuallyHidden><span>Bergen</span></Flex></OnCard>, parts: [{ part: 'Text', selector: '[data-component="VisuallyHidden"]', what: 'Clipped to a pixel, off screen for the eye, read by a screen reader.' }] },
  sizes: { na: 'VisuallyHidden takes no space, so it has no size.' },
  emphasis: { na: 'It is never seen, so it carries no visual emphasis.' },
  placement: { rows: [['Beside an icon', 'Before the visible text it explains.'], ['Inside a badge', 'After the number.']], examples: [{ title: 'Inside a badge', render: <OnCard><Flex justify="between"><h3 className="flush">Inbox</h3><Badge>3<VisuallyHidden> unread messages</VisuallyHidden></Badge></Flex></OnCard> }] },
  combinations: { good: [['Badge + VisuallyHidden', 'A count with its meaning.']], avoid: [{ title: 'hiding a visible label', why: 'Sighted keyboard users then see a control with no name.', render: <OnCard><Button variant="glass"><VisuallyHidden>Save</VisuallyHidden>…</Button></OnCard> }] },
  content: { na: 'Hidden text follows the visible text it explains; keep it short.' },
  behaviours: { states: [['Hidden', 'Clipped to a pixel.', 'In the tree, not on screen (P6).'], ['Focused (focusable)', 'Shown in place.', 'A keyboard user sees where focus is.']], interactions: [['Keyboard', 'Tab', 'Reaches a focusable child, which then shows.', 'VisuallyHidden: focusable'], ['Mouse', 'Click', 'Nothing; it is not on screen.', 'renders a span'], ['Touch', 'Tap', 'Nothing; it is not on screen.', 'renders a span']], loading: <p>No loading state.</p>, focus: <p>Only a focusable child takes focus, and the content shows while it does.</p> },
  deepDive: { na: 'VisuallyHidden has no variant prop, so there is nothing to compare.' },
  modifiers: [{ name: 'focusable', rules: <p>Use it for skip links: hidden until a keyboard user reaches it, then shown in place.</p>, pair: { do: <OnCard><VisuallyHidden focusable><a href="#vh-1" className="demo-skip">Skip to photos</a></VisuallyHidden><p className="flush" id="vh-1">Photos</p></OnCard>, doNote: 'A skip link that shows on focus.', dont: <OnCard><VisuallyHidden><a href="#vh-2" className="demo-skip">Skip to photos</a></VisuallyHidden><p className="flush" id="vh-2">Photos</p></OnCard>, dontNote: 'A focusable link that never shows.' } }],
  related: [['/components/icon-button', 'IconButton', 'Its own aria-label.'], ['/accessibility', 'Accessibility', 'The evidence.']],
  references: [ref('WebAIM · Invisible content just for screen reader users', 'https://webaim.org/techniques/css/invisiblecontent/', 'The clip technique it uses.'), ref('WCAG 2.2 · 2.4.1 Bypass Blocks', 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html', 'Why skip links exist.')],
};
