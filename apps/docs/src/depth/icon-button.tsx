// IconButton's Usage tab (component-depth.md U1–U14). A familiar action from an icon alone.
import { Avatar, Button, Card, CardCover, IconButton, Stack } from 'pane-react';
import { IconHeart, IconMore, IconPencil, IconReply, IconRepost, IconShare } from '../icons';
import type { Depth } from './types';

const OnCard = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card"><div className="demo-row">{children}</div></Card>;
const Actions = ({ variant = 'ghost' as 'ghost' | 'glass', size = 'sm' as 'sm' | 'md' }) => (
  <div className="demo-row">
    <IconButton aria-label="Reply" variant={variant} size={size}><IconReply /></IconButton>
    <IconButton aria-label="Repost" variant={variant} size={size}><IconRepost /></IconButton>
    <IconButton aria-label="Like" variant={variant} size={size}><IconHeart /></IconButton>
    <IconButton aria-label="Share" variant={variant} size={size}><IconShare /></IconButton>
  </div>
);

export const ICON_BUTTON: Depth = {
  overview: (
    <>
      <p>An icon button runs an action that people know by its icon, such as share, reply, like or more. It saves room in rows where a text label on every action would crowd the pane, such as the foot of a post.</p>
      <p>The icon carries no words, so the button needs a name. The <code>aria-label</code> prop is required by the type, and the build fails without it. Conformance also checks every page of this book for icon-only buttons with no name.</p>
      <p>Use an icon button only when the icon is familiar. If people would have to hover to learn what it does, it needs a text label and should be a Button.</p>
    </>
  ),
  whenToUse: ['A row of familiar actions under a post, such as reply, repost, like and share.', 'More (the three dots) at the end of a header.', 'A single tool on a cover photo, such as Edit.'],
  whenNot: [
    { situation: 'The icon needs explaining', to: '/components/button', label: 'Button with a text label' },
    { situation: 'The main action of a pane', to: '/components/button', label: 'A light Button' },
    { situation: 'A filter that stays on', to: '/components/chip', label: 'Chip' },
  ],
  variants: {
    glass: { purpose: 'A round glass disc around the icon. For a single tool that has to read as an object, such as Edit on a cover.', pairing: 'Alone or beside a Button. Never in a long row.' },
    ghost: { purpose: 'The icon alone, no disc. For rows of actions where discs would crowd each other.', pairing: 'In rows of two to five ghost buttons.' },
  },
  anatomy: {
    render: <OnCard><IconButton aria-label="Share" variant="glass" size="md"><IconShare /></IconButton></OnCard>,
    parts: [
      { part: 'Disc', selector: '[data-component="IconButton"]', what: 'Only on glass, a quiet full circle with its own blur.' },
      { part: 'Icon', selector: '[data-component="IconButton"] svg', what: '18px outline in the current colour.' },
      { part: 'Name', selector: '[data-component="IconButton"]', what: 'aria-label, required. It is the button’s whole accessible name.' },
    ],
    perVariant: 'ghost drops the disc and brightens the icon on hover instead.',
  },
  sizes: {
    md: { use: '36px. A single tool on a cover or beside a title.', pairs: 'Button md beside it. Below the 44px P6 asks for, see Limitations.' },
    sm: { use: '32px. Rows of actions under a post.', pairs: 'Body text and other sm controls. Below the 44px P6 asks for, see Limitations.' },
  },
  emphasis: {
    text: <p>Icon buttons are always secondary. They sit beside the pane’s one loud Button or in a row of equal actions, and none of them leads. If one action matters more than the others, give it a text label as a Button.</p>,
    pair: {
      do: <Card as="div" className="demo-card"><div className="demo-row"><Button>Follow</Button><IconButton aria-label="More options" variant="glass"><IconMore /></IconButton></div></Card>,
      doNote: 'A labelled main action and a familiar icon beside it.',
      dont: <OnCard><IconButton aria-label="Follow" variant="glass"><IconHeart /></IconButton><IconButton aria-label="More options" variant="glass"><IconMore /></IconButton></OnCard>,
      dontNote: 'The main action as an icon. Nobody knows a heart means Follow.',
    },
  },
  placement: {
    rows: [['Foot of a post', 'A row of ghost sm buttons.'], ['End of a header', 'More, ghost or glass.'], ['On a cover', 'glass md, so it stays visible over the photo.']],
    examples: [
      { title: 'Foot of a post', render: <Card as="article" aria-label="Post" className="demo-card"><Stack direction="row" gap="md" align="center"><Avatar name="Mara Lind" size="sm" decorative /><b>Mara Lind</b></Stack><p className="flush">Blue hour over Bergen harbour.</p><Actions /></Card> },
      { title: 'On a cover', render: <Card as="div" className="demo-card"><div style={{ position: 'relative' }}><CardCover /><div style={{ position: 'absolute', insetBlockStart: 8, insetInlineEnd: 8 }}><IconButton aria-label="Edit cover" variant="glass"><IconPencil /></IconButton></div></div><b>Lysefjord</b></Card> },
    ],
  },
  combinations: {
    good: [['Row of ghost sm', 'Equal actions under a post.'], ['Button + glass More', 'A main action and its overflow.']],
    avoid: [{ title: 'glass discs in a long row', why: 'Five discs side by side read as five objects competing. Use ghost.', render: <Card as="div" className="demo-card"><Actions variant="glass" /></Card> }],
  },
  content: {
    formula: <p>The label names the action as a verb, the way a Button label would, such as Share or Reply. Name what it does to this item when the row holds several items, such as Like post. Use the icon people expect for that action and only that icon.</p>,
    pair: { do: <OnCard><IconButton aria-label="Share" variant="glass"><IconShare /></IconButton></OnCard>, doNote: 'Share icon, named Share.', dont: <OnCard><IconButton aria-label="Share icon button" variant="glass"><IconShare /></IconButton></OnCard>, dontNote: 'Named after the icon. A screen reader says Share icon button, button.' },
    overflow: { text: 'Icon buttons have no visible text, so nothing can overflow. A row of them wraps to a new line when the pane is narrow.', render: <div data-overflow-demo="" className="overflow-probe"><Card as="div" className="demo-card"><Actions /></Card></div> },
    rtl: { text: 'In right-to-left languages the row starts at the right. Icons with a direction, such as reply, should be mirrored by the app.', render: <div dir="rtl" lang="ar"><Card as="div" className="demo-card"><Actions /></Card></div> },
    expansion: { text: 'Only the accessible name gets longer in translation, and it is never shown. The row keeps its width.', render: <Card as="div" className="demo-card"><Actions /></Card> },
  },
  behaviours: {
    states: [
      ['Hover', 'Rises 2px; ghost brightens to the primary text colour.', 'An answer to the pointer (P4).'],
      ['Pressed', 'Shrinks to 97% over 200ms.', 'A press is a reply (P4).'],
      ['Focus', 'The shared 2px ring with its dark halo.', 'Visible on any scene (P2).'],
      ['Forced colours', 'A ButtonText border draws the shape.', 'Structure survives (P6).'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to it.', 'IconButton: reachable with Tab'],
      ['Keyboard', 'Enter / Space', 'Runs the action (native button).', 'Native button'],
      ['Mouse / touch', 'Click / tap', 'Runs the action.', 'Native button'],
    ],
    loading: <p>Like Button, IconButton has no loading state. Disable it while the action runs and report the outcome nearby, such as a like count that updates.</p>,
    focus: <p>When an icon button opens a menu or sheet, focus returns to it when that closes.</p>,
  },
  deepDive: {
    glass: { purpose: <p>The glass disc gives a single icon a body, so it reads as an object on a busy photo. It is the right choice when the icon stands alone.</p>, context: <Card as="div" className="demo-card"><div style={{ position: 'relative' }}><CardCover /><div style={{ position: 'absolute', insetBlockStart: 8, insetInlineEnd: 8 }}><IconButton aria-label="Edit cover" variant="glass"><IconPencil /></IconButton></div></div><b>Lysefjord</b></Card>, practices: ['Use glass for one tool on its own.', 'Keep it md unless it sits in a dense row.'], pair: { do: <OnCard><IconButton aria-label="More options" variant="glass"><IconMore /></IconButton></OnCard>, doNote: 'One glass tool.', dont: <Card as="div" className="demo-card"><Actions variant="glass" /></Card>, dontNote: 'A row of discs. Use ghost.' } },
    ghost: { purpose: <p>Ghost is the icon alone. It suits rows of actions, where discs would crowd each other and outweigh the content above them.</p>, context: <Card as="article" aria-label="Post" className="demo-card"><p className="flush">Blue hour over Bergen harbour.</p><Actions /></Card>, practices: ['Use ghost for rows of two to five actions.', 'Keep the icons the same weight and size.'], pair: { do: <Card as="div" className="demo-card"><Actions /></Card>, doNote: 'A calm row of ghost actions.', dont: <OnCard><IconButton aria-label="Share" variant="ghost" size="sm"><IconShare /></IconButton></OnCard>, dontNote: 'A lone ghost icon floats with no body. Use glass.' } },
  },
  modifiers: { na: 'IconButton has no optional slots. The icon is its child and the name is its required aria-label.' },
  related: [['/components/button', 'Button', 'When the action needs a word.'], ['/foundations/icons', 'Iconography', 'The icon set and its sizes.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Button pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'Naming a button that has no text.' },
    { title: 'Apple Human Interface Guidelines · SF Symbols', url: 'https://developer.apple.com/design/human-interface-guidelines/sf-symbols', why: 'Pane’s lineage for familiar action icons.' },
    { title: 'Nielsen Norman Group · Icon Usability', url: 'https://www.nngroup.com/articles/icon-usability/', why: 'Why only familiar icons work without a label.' },
  ],
};
