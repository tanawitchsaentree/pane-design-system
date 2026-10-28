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
      <p>A badge has no fill. It is a status written on the glass, in the same language as Banner. The four status tones each draw their own glyph in the tone’s mark colour, a circle with an i for info, a circle with a check for positive, a triangle for warning and an octagon for critical. The word stays in the text colour. Neutral is the word alone, with an optional dot in the secondary text colour. Because the shape differs per tone, the badge reads in greyscale and in forced colours as well (P1, P6).</p>
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
    neutral: { purpose: 'A state with no good or bad reading, such as Beta or 2 of 5. The word alone, with an optional dot.', pairing: 'Sits anywhere, including next to other badges.' },
    info: { purpose: 'News about the item, such as New or Updated. A blue circle with an i before the word.', pairing: 'One per item. Pairs with neutral.' },
    positive: { purpose: 'A good outcome, such as Paid or Verified. A green circle with a check before the word.', pairing: 'One per item. Avoid beside critical on the same row.' },
    warning: { purpose: 'Something needs attention soon, such as Expiring. An amber triangle before the word.', pairing: 'Pair with the action that fixes it nearby.' },
    critical: { purpose: 'Something failed or is blocked, such as Failed or Declined. A red octagon before the word.', pairing: 'Pair with a way to fix it. Never on every row.' },
  },
  anatomy: {
    render: <OnCard><Stack direction="row" gap="md"><Badge tone="positive">Live</Badge><Badge dot>Draft</Badge></Stack></OnCard>,
    parts: [
      { part: 'Glyph', selector: '[data-component="Badge"] svg', what: 'Status tones only. A 16px outline, a different shape per tone, in the tone’s mark colour.' },
      { part: 'Dot', selector: '[data-component="Badge"] span', what: 'Neutral only, when dot is set. A 6px dot in the secondary text colour.' },
      { part: 'Label', selector: '[data-component="Badge"]', what: '13px semibold in the text colour, on a line at least 22px tall. There is no fill behind it.' },
    ],
    perVariant: 'Neutral is the word alone, or the word after a dot. The four status tones put their own glyph before the word.',
  },
  sizes: { na: 'Badge has one size. Its line is at least 22px tall, so it fits on a line of 15px body text without changing the line height.' },
  emphasis: {
    text: <p>A status badge spends its colour on a small glyph, and a pane should still hold few of them. If most rows in a list carry the same badge, the badge has stopped carrying information. Badge the exceptions, such as the one failed upload, and leave the normal rows plain.</p>,
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
    rtl: { text: 'In right-to-left languages the glyph or dot moves to the right of the label.', render: <div dir="rtl" lang="ar"><OnCard><Stack direction="row" gap="sm"><Badge tone="positive">مباشر</Badge></Stack></OnCard></div> },
    expansion: { text: 'German states run longer. The badge grows with its label.', render: <OnCard><Stack direction="row" gap="sm"><Badge tone="warning">Läuft bald ab</Badge></Stack></OnCard> },
  },
  behaviours: {
    states: [['Rest', 'A glyph or dot and a word, with no fill.', 'A status written on the glass, so it never reads as a control (P3).'], ['Forced colours', 'The glyph is drawn in CanvasText and the dot takes CanvasText.', 'The glyph shapes still tell the tones apart (P6).']],
    interactions: [['Keyboard', 'Tab', 'Skips it. A badge is not focusable.', 'Badge.tsx renders a span'], ['Screen reader', 'Read', 'Read in place as text, after the item it belongs to.', 'Badge.tsx renders a span']],
    loading: <p>Show Updating or a neutral badge while a state is being fetched, and replace it when the answer arrives.</p>,
    focus: <p>A badge never takes focus.</p>,
  },
  deepDive: {
    neutral: { purpose: <p>Neutral is a fact with no judgement, such as Beta or a version. It is the word alone, so it stays calm next to the pane’s content.</p>, context: <Card as="section" aria-label="Privacy" className="demo-card"><div className="component-head"><h3 className="flush">Privacy</h3><Badge>Beta</Badge></div></Card>, practices: ['Use it for stages and versions.'], pair: { do: <OnCard><Badge>v2.1</Badge></OnCard>, doNote: 'A version, neutral.', dont: <OnCard><Badge tone="positive">v2.1</Badge></OnCard>, dontNote: 'A version in green reads as good news.' } },
    info: { purpose: <p>Info marks something new or changed, such as New on a feature or Updated on a document.</p>, context: <OnCard><Row name="Lysefjord album" badge={<Badge tone="info">Updated</Badge>} /></OnCard>, practices: ['Remove it once the reader has seen the item.'], pair: { do: <OnCard><Badge tone="info">New</Badge></OnCard>, doNote: 'News.', dont: <OnCard><Badge tone="info">Failed</Badge></OnCard>, dontNote: 'A failure in the info tone.' } },
    positive: { purpose: <p>Positive confirms a good outcome that lasts, such as Paid or Verified.</p>, context: <OnCard><Row name="Invoice 1042" badge={<Badge tone="positive">Paid</Badge>} /></OnCard>, practices: ['Badge only when the good outcome is not the default.'], pair: { do: <OnCard><Badge tone="positive">Verified</Badge></OnCard>, doNote: 'A lasting good state.', dont: <OnCard><Badge tone="positive">OK</Badge></OnCard>, dontNote: 'OK says nothing about what is fine.' } },
    warning: { purpose: <p>Warning says something needs attention soon, such as Expiring or Due.</p>, context: <OnCard><Row name="Visa ending 4421" badge={<Badge tone="warning">Expiring</Badge>} /></OnCard>, practices: ['Put the fixing action nearby.'], pair: { do: <OnCard><Badge tone="warning">Due 1 Dec</Badge></OnCard>, doNote: 'A warning with its date.', dont: <OnCard><Badge tone="warning">!</Badge></OnCard>, dontNote: 'A symbol with no word.' } },
    critical: { purpose: <p>Critical says something failed or is blocked. It is the loudest badge, so use it only for real failures.</p>, context: <OnCard><Row name="Upload 3 of 5" badge={<Badge tone="critical">Failed</Badge>} /></OnCard>, practices: ['Pair it with Retry or a link to the cause.'], pair: { do: <OnCard><Badge tone="critical">Declined</Badge></OnCard>, doNote: 'A failure in a word.', dont: <OnCard><Badge tone="critical">Offline</Badge></OnCard>, dontNote: 'Offline is often expected. Use neutral.' } },
  },
  modifiers: [
    { name: 'Dot', rules: <p>Set <code>dot</code> on a neutral badge to add a 6px dot before the label in the secondary text colour, a shape cue for a status with no tone, such as Draft or Offline. The status tones ignore it, because their glyph already marks them. The dot is hidden from screen readers, so the word must still say the state.</p>, pair: { do: <OnCard><Badge dot>Draft</Badge></OnCard>, doNote: 'A dot and a word.', dont: <OnCard><Stack direction="row" gap="sm"><Badge dot>Paid</Badge><Badge dot>New</Badge><Badge dot>Shared</Badge><Tag>Landscape</Tag></Stack></OnCard>, dontNote: 'Dots on every badge stop meaning anything.' } },
  ],
  related: [['/components/tag', 'Tag', 'A topic or category.'], ['/components/banner', 'Banner', 'A state that needs a sentence.'], ['/components/tabs', 'Tabs', 'Where a count badge often sits.']],
  references: [
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the word carries the state and colour only backs it up.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why a changing badge needs a live region to be announced.' },
  ],
};
