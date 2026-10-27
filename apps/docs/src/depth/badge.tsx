// Badge's Usage tab (component-depth.md U1–U14). A short status in words, colour as the second cue.
import { Avatar, Badge, Card, Stack, Tag } from 'pane-react';
import type { Depth } from './types';

const Row = ({ name, badge }: { name: string; badge: React.ReactNode }) => (
  <Stack direction="row" gap="md" align="center"><Avatar name={name} size="sm" decorative /><span>{name}</span>{badge}</Stack>
);
const OnCard = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card">{children}</Card>;

export const BADGE: Depth = {
  overview: (
    <>
      <p>A badge reports a state in one or two words, such as Live, 3 new, Failed or Beta. The word carries the meaning and the colour backs it up, so the badge still works for someone who cannot see the colour or reads the page with a screen reader (P6).</p>
      <p>The neutral badge is a quiet glass pill with a ring. The four status tones are solid fills, each with its text pair measured at 4.5:1 or more. A solid fill is unusual in Pane, where only the loud Button owns one, so status badges are kept small and rare. Used on every row they would compete with the pane’s main action (P5).</p>
      <p>Badges are not live regions. A count that changes while the reader is looking is not announced on its own. If the change matters, announce it through a Banner with <code>live</code> or the app’s own status message.</p>
    </>
  ),
  whenToUse: [
    'The state of an item, such as Live, Draft or Failed.',
    'A count of new things, such as 3 new on a tab or a list row.',
    'A version or a lifecycle stage, such as Beta.',
  ],
  whenNot: [
    { situation: 'A topic or category', to: '/components/tag', label: 'Tag' },
    { situation: 'Something the reader can press', to: '/components/chip', label: 'Chip or Button' },
    { situation: 'A message that needs a sentence', to: '/components/banner', label: 'Banner' },
  ],
  variants: {
    neutral: { purpose: 'A state with no good or bad reading, such as Beta or 2 of 5. A quiet glass pill with a ring.', pairing: 'Sits anywhere, including next to other badges.' },
    info: { purpose: 'News about the item, such as New or Updated.', pairing: 'One per item. Pairs with neutral.' },
    positive: { purpose: 'A good outcome, such as Paid or Verified.', pairing: 'One per item. Avoid beside critical on the same row.' },
    warning: { purpose: 'Something needs attention soon, such as Expiring.', pairing: 'Pair with the action that fixes it nearby.' },
    critical: { purpose: 'Something failed or is blocked, such as Failed or Declined.', pairing: 'Pair with a way to fix it. Never on every row.' },
  },
  anatomy: {
    render: <OnCard><Stack direction="row" gap="sm"><Badge tone="positive" dot>Live</Badge></Stack></OnCard>,
    parts: [
      { part: 'Pill', selector: '[data-component="Badge"]', what: '22px tall, full pill. A solid fill for status tones, a quiet fill and ring for neutral.' },
      { part: 'Dot', selector: '[data-component="Badge"] span', what: 'Optional 6px dot in the text colour, a shape cue on top of the colour.' },
      { part: 'Label', selector: '[data-component="Badge"]', what: '13px semibold. Solid fills drop the text halo.' },
    ],
    perVariant: 'Neutral has the quiet glass fill and a ring. The four status tones have a solid fill and no ring.',
  },
  sizes: { na: 'Badge has one size, 22px, so it fits on a line of 15px body text without changing the line height.' },
  emphasis: {
    text: <p>A status badge is a solid mark, and a pane should hold few of them. If most rows in a list carry the same badge, the badge has stopped carrying information. Badge the exceptions, such as the one failed upload, and leave the normal rows plain.</p>,
    pair: {
      do: <OnCard><Row name="Ada Park" badge={null} /><Row name="Jonas Berg" badge={<Badge tone="critical">Failed</Badge>} /><Row name="Mara Lind" badge={null} /></OnCard>,
      doNote: 'Only the exception is badged.',
      dont: <OnCard><Row name="Ada Park" badge={<Badge tone="positive">Sent</Badge>} /><Row name="Jonas Berg" badge={<Badge tone="critical">Failed</Badge>} /><Row name="Mara Lind" badge={<Badge tone="positive">Sent</Badge>} /></OnCard>,
      dontNote: 'Every row is badged, so the failure is just one more colour.',
    },
  },
  placement: {
    rows: [['After a name or title', 'The default. The state reads as part of the line.'], ['On a tab label', 'A count of new items in that view.'], ['At the end of a list row', 'A state per item, aligned so the eye can scan the column.']],
    examples: [
      { title: 'After a name', render: <OnCard><Row name="Mara Lind" badge={<Badge tone="info">New</Badge>} /></OnCard> },
      { title: 'In a list', render: <OnCard><Row name="Invoice 1042" badge={<Badge tone="positive">Paid</Badge>} /><Row name="Invoice 1043" badge={<Badge tone="warning">Due</Badge>} /></OnCard> },
    ],
  },
  combinations: {
    good: [['Badge + Tag', 'A state and a category on one item.'], ['neutral + one status badge', 'A stage and a state, such as Beta and Live.']],
    avoid: [{ title: 'two status tones side by side', why: 'Positive next to critical asks the reader which one is true.', render: <OnCard><Stack direction="row" gap="sm"><Badge tone="positive">Paid</Badge><Badge tone="critical">Failed</Badge></Stack></OnCard> }],
  },
  content: {
    formula: <p>One or two words, or a number and a word. Say the state, such as Failed, never the colour or a code. A count says what it counts when the context does not, such as 3 new. Keep the same word for the same state across the product.</p>,
    pair: { do: <OnCard><Stack direction="row" gap="sm"><Badge tone="critical">Failed</Badge></Stack></OnCard>, doNote: 'The state in a word.', dont: <OnCard><Stack direction="row" gap="sm"><Badge tone="critical">ERR_502</Badge></Stack></OnCard>, dontNote: 'A code nobody can act on.' },
    overflow: { text: 'A badge never wraps. Its label stays on one line, so keep it to two words.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><Stack direction="row" gap="sm"><Badge tone="warning">Expires soon</Badge></Stack></OnCard></div> },
    rtl: { text: 'In right-to-left languages the dot moves to the right of the label.', render: <div dir="rtl" lang="ar"><OnCard><Stack direction="row" gap="sm"><Badge tone="positive" dot>مباشر</Badge></Stack></OnCard></div> },
    expansion: { text: 'German states run longer. The badge grows with its label.', render: <OnCard><Stack direction="row" gap="sm"><Badge tone="warning">Läuft bald ab</Badge></Stack></OnCard> },
  },
  behaviours: {
    states: [['Rest', 'Fill or ring and a label.', 'A status, not a control (P3).'], ['Forced colours', 'The fill drops, a CanvasText border draws the pill and the dot takes CanvasText.', 'Structure survives without colour (P6).']],
    interactions: [['Keyboard', 'Tab', 'Skips it. A badge is not focusable.', 'Badge.tsx renders a span'], ['Screen reader', 'Read', 'Read in place as text, after the item it belongs to.', 'Badge.tsx renders a span']],
    loading: <p>Show Updating or a neutral badge while a state is being fetched, and replace it when the answer arrives.</p>,
    focus: <p>A badge never takes focus.</p>,
  },
  deepDive: {
    neutral: { purpose: <p>Neutral is a fact with no judgement, such as Beta or a version. It is a quiet glass pill with a ring, so it stays calm next to the pane’s content.</p>, context: <Card as="section" aria-label="Privacy" className="demo-card"><div className="component-head"><h3 className="flush">Privacy</h3><Badge>Beta</Badge></div></Card>, practices: ['Use it for stages and versions.'], pair: { do: <OnCard><Badge>v2.1</Badge></OnCard>, doNote: 'A version, neutral.', dont: <OnCard><Badge tone="positive">v2.1</Badge></OnCard>, dontNote: 'A version in green reads as good news.' } },
    info: { purpose: <p>Info marks something new or changed, such as New on a feature or Updated on a document.</p>, context: <OnCard><Row name="Lysefjord album" badge={<Badge tone="info">Updated</Badge>} /></OnCard>, practices: ['Remove it once the reader has seen the item.'], pair: { do: <OnCard><Badge tone="info">New</Badge></OnCard>, doNote: 'News.', dont: <OnCard><Badge tone="info">Failed</Badge></OnCard>, dontNote: 'A failure in the info tone.' } },
    positive: { purpose: <p>Positive confirms a good outcome that lasts, such as Paid or Verified.</p>, context: <OnCard><Row name="Invoice 1042" badge={<Badge tone="positive">Paid</Badge>} /></OnCard>, practices: ['Badge only when the good outcome is not the default.'], pair: { do: <OnCard><Badge tone="positive">Verified</Badge></OnCard>, doNote: 'A lasting good state.', dont: <OnCard><Badge tone="positive">OK</Badge></OnCard>, dontNote: 'OK says nothing about what is fine.' } },
    warning: { purpose: <p>Warning says something needs attention soon, such as Expiring or Due.</p>, context: <OnCard><Row name="Visa ending 4421" badge={<Badge tone="warning">Expiring</Badge>} /></OnCard>, practices: ['Put the fixing action nearby.'], pair: { do: <OnCard><Badge tone="warning">Due 1 Dec</Badge></OnCard>, doNote: 'A warning with its date.', dont: <OnCard><Badge tone="warning">!</Badge></OnCard>, dontNote: 'A symbol with no word.' } },
    critical: { purpose: <p>Critical says something failed or is blocked. It is the loudest badge, so use it only for real failures.</p>, context: <OnCard><Row name="Upload 3 of 5" badge={<Badge tone="critical">Failed</Badge>} /></OnCard>, practices: ['Pair it with Retry or a link to the cause.'], pair: { do: <OnCard><Badge tone="critical">Declined</Badge></OnCard>, doNote: 'A failure in a word.', dont: <OnCard><Badge tone="critical">Offline</Badge></OnCard>, dontNote: 'Offline is often expected. Use neutral.' } },
  },
  modifiers: [
    { name: 'Dot', rules: <p>Set <code>dot</code> to add a 6px dot before the label, a shape cue for states that change, such as Live. The dot is hidden from screen readers, so the word must still say the state.</p>, pair: { do: <OnCard><Badge tone="positive" dot>Live</Badge></OnCard>, doNote: 'A dot and a word.', dont: <OnCard><Stack direction="row" gap="sm"><Badge tone="positive" dot>Paid</Badge><Badge tone="info" dot>New</Badge><Tag>Landscape</Tag></Stack></OnCard>, dontNote: 'Dots on every badge stop meaning anything.' } },
  ],
  related: [['/components/tag', 'Tag', 'A topic or category.'], ['/components/banner', 'Banner', 'A state that needs a sentence.'], ['/components/tabs', 'Tabs', 'Where a count badge often sits.']],
  references: [
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the word carries the state and colour only backs it up.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why a changing badge needs a live region to be announced.' },
  ],
};
