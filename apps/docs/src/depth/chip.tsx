// Chip's Usage tab (component-depth.md U1–U14). A filter toggle or a removable value.
import { useState } from 'react';
import { Card, Chip, Stack, Tag } from 'pane-react';
import type { Depth } from './types';

const OnCard = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card"><Stack direction="row" gap="sm" align="center">{children}</Stack></Card>;

function Recipients() {
  const [people, setPeople] = useState(['Ada Park', 'Jonas Berg']);
  return <OnCard>{people.map((p) => <Chip key={p} onRemove={() => setPeople(people.filter((x) => x !== p))}>{p}</Chip>)}{!people.length && <span className="muted small">No recipients</span>}</OnCard>;
}

export const CHIP: Depth = {
  overview: (
    <>
      <p>A chip is a small control for a choice that stays visible. There are two kinds. A filter chip turns a filter on and off, such as Photos or Videos above a gallery, and several can be on at once. An input chip holds a value the reader added, such as a recipient, and has its own remove button.</p>
      <p>A filter chip is a native button with <code>aria-pressed</code>. An unselected chip is a small glass pane lit from above, with the pane’s rim of light brightest along its top edge, something to press. A selected chip is a lighter pane of glass with a check mark and semibold text, the same chosen glass as Tabs. In the light theme it is a slightly darker tinted glass, because a white chip on white glass would differ only by its check. Selection changes shape and weight as well as brightness (P6). Because the chosen state stays glass instead of turning solid, three filters on add no loud marks to the pane (P5).</p>
      <p>An input chip keeps its label as plain text and puts removal on a separate button named Remove followed by the label. The two are separate tab stops, so a keyboard user can read the value without removing it by accident.</p>
    </>
  ),
  whenToUse: [
    'Filters above a list or gallery where several can be on at once.',
    'Values the reader added and can remove, such as recipients or tags on a draft.',
    'Quick suggestions the reader can toggle, such as Wi-Fi or Pets on a search.',
  ],
  whenNot: [
    { situation: 'One setting that is on or off', to: '/reference/status', label: 'Switch (planned, wave 3)' },
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'A static label nobody can press', to: '/components/tag', label: 'Tag' },
    { situation: 'An action that happens once', to: '/components/button', label: 'Button' },
  ],
  variants: {
    neutral: { purpose: 'Chosen, the chip becomes a grey crystal, for filters about a category with no colour of its own, such as Studio or Draft.', pairing: 'The default when colour would add nothing.' },
    info: { purpose: 'Chosen, the chip becomes a blue crystal, for filters about water, travel or information, such as Coast or Ferries.', pairing: 'One meaning per hue across the product.' },
    positive: { purpose: 'Chosen, the chip becomes a green crystal, for filters about growth, nature or something open, such as Forest or Open now.', pairing: 'Keep green for good news in the same view.' },
    warning: { purpose: 'Chosen, the chip becomes a amber crystal, for filters about warmth or something to watch, such as Desert or Few seats left.', pairing: 'Do not use amber for a category beside real warnings.' },
    critical: { purpose: 'Chosen, the chip becomes a red crystal, for filters about urgency, such as Closing soon.', pairing: 'Red reads as a problem, so use it for categories sparingly.' },
    accent: { purpose: 'Chosen, the chip becomes a violet crystal, for filters about new or featured, such as Night or New this week.', pairing: 'One accent per row, so it still stands out.' },
  },
  anatomy: {
    render: <OnCard><Chip defaultSelected>Photos</Chip></OnCard>,
    parts: [
      { part: 'Pane', selector: '[data-component="Chip"]', what: '32px tall, full round. Off, quiet glass lit at its top with the rim of light. On, a lighter pane of glass with a short shadow, or a slightly darker tint in the light theme.' },
      { part: 'Check mark', selector: '[data-component="Chip"] svg', what: 'A 16px check shown when a filter chip is selected, so selection has a shape.' },
      { part: 'Label', selector: '[data-component="Chip"] button', what: 'The chip’s accessible name. 14px medium when off, semibold when on. The button has a 44px tall press area.' },
    ],
    perVariant: 'An input chip adds a remove button after the label, with its own focus stop and the name Remove followed by the label.',
  },
  sizes: { na: 'Chip has one size, 32px tall. The chip and its remove button each keep a 44px tall press area.' },
  emphasis: {
    text: <p>Chips are quiet in both states. Off, a chip is a small glass pane. On, it becomes a lighter pane of glass. Neither looks like the pane’s solid Button, so a selected filter is never mistaken for the main action. Keep chips apart from that action all the same, so the reader knows which marks filter and which one acts.</p>,
    pair: {
      do: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Chip defaultSelected>Photos</Chip><Chip>Videos</Chip></Stack><p className="flush muted">24 results</p></Card>,
      doNote: 'Filters above the results, apart from any action.',
      dont: <OnCard><Chip defaultSelected>Photos</Chip><Chip defaultSelected>Videos</Chip><Chip defaultSelected>Albums</Chip><Chip defaultSelected>Prints</Chip></OnCard>,
      dontNote: 'Every filter on. The whole row lights up and filters nothing.',
    },
  },
  placement: {
    rows: [['Above a list or gallery', 'Filters. The results update as chips change.'], ['Inside a field or under it', 'Input chips for values the reader added.'], ['Under a search box', 'Suggestions the reader can toggle.']],
    examples: [
      { title: 'Filters above results', render: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Chip defaultSelected>Photos</Chip><Chip>Videos</Chip><Chip>Albums</Chip></Stack><p className="flush muted">24 results</p></Card> },
      { title: 'Recipients', render: <Recipients /> },
    ],
  },
  combinations: {
    good: [['Several filter chips', 'Independent filters, any combination allowed.'], ['Input chips in a row', 'Values the reader added, each removable.']],
    avoid: [
      { title: 'chips as tabs', why: 'Only one can be on and each shows a different view. That is Tabs.', render: <OnCard><Chip defaultSelected>Posts</Chip><Chip>Replies</Chip></OnCard> },
      { title: 'chips mixed with tags', why: 'Pressable and static labels look alike and the reader cannot tell which do something.', render: <OnCard><Chip>Photos</Chip><Tag>Landscape</Tag></OnCard> },
    ],
  },
  content: {
    formula: <p>One or two words naming the filter, in sentence case, such as Photos or Under 1 MB. An input chip shows the value itself, such as a name. Keep the order of filter chips stable so readers find them by position.</p>,
    pair: { do: <OnCard><Chip>Photos</Chip><Chip>Videos</Chip></OnCard>, doNote: 'Short nouns naming the filter.', dont: <OnCard><Chip>Show only photos</Chip><Chip>Show only videos</Chip></OnCard>, dontNote: 'Repeated words make every chip longer and harder to scan.' },
    overflow: { text: 'A chip never wraps its label. A row of chips wraps to a new line, and each chip stays whole.', render: <div data-overflow-demo="" className="overflow-probe"><Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Chip>Under 1 MB</Chip></Stack></Card></div> },
    rtl: { text: 'In right-to-left languages the check mark moves to the right of the label and the remove button to its left.', render: <div dir="rtl" lang="ar"><OnCard><Chip defaultSelected>صور</Chip><Chip>فيديو</Chip></OnCard></div> },
    expansion: { text: 'German filter names run longer, so the row wraps sooner. Each chip stays on one line.', render: <OnCard><Chip>Fotos</Chip><Chip>Videos</Chip><Chip>Alben</Chip></OnCard> },
  },
  behaviours: {
    states: [
      ['Off', 'A small glass pane lit from above with the rim of light.', 'Something to press (P3).'],
      ['On', 'A lighter pane of glass, semibold, check mark, aria-pressed true.', 'Brightness, weight and shape change together, and nothing turns loud (P5, P6).'],
      ['Pressed', 'Shrinks to 97% over 200ms.', 'A press is a reply (P4).'],
      ['Focus', 'The shared 2px ring with its dark halo.', 'Visible on any scene (P2).'],
      ['Forced colours', 'Rim and carve drop, a ButtonText border draws each chip and the selected border takes Highlight.', 'Never colour alone (P6).'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the chip, then to its remove button if it has one.', 'Chip: reachable with Tab'],
      ['Keyboard', 'Space / Enter', 'Toggles a filter chip.', 'Chip: Space and Enter toggle aria-pressed'],
      ['Keyboard', 'Enter on Remove', 'Removes an input chip.', 'Chip: an input chip’s remove button is named after the chip and removes it'],
      ['Mouse / touch', 'Click / tap', 'Toggles, or removes from the remove button.', 'Native button'],
    ],
    loading: <p>When a filter changes the results, update them in place and keep the chips usable. Report the new count in text, such as 24 results, and announce it politely if the list is long.</p>,
    focus: <p>After an input chip is removed, move focus to the next chip, or to the field when none are left, so focus is never lost.</p>,
  },
  deepDive: {
    neutral: { purpose: <p>A grey chip, once chosen, is a small crystal of that colour with its check, for a filter about a category with no colour of its own, such as Studio or Draft.</p>, context: <OnCard><Chip defaultSelected>All</Chip></OnCard>, practices: ['Give the tone a meaning and keep it for that filter.'], pair: { do: <OnCard><Chip defaultSelected>All</Chip></OnCard>, doNote: 'The tone and the word say the same thing.', dont: <OnCard><Chip>All</Chip><Chip>All again</Chip></OnCard>, dontNote: 'Two chips with one meaning confuse the filter.' } },
    info: { purpose: <p>A blue chip, once chosen, is a small crystal of that colour with its check, for a filter about water, travel or information, such as Coast or Ferries.</p>, context: <OnCard><Chip tone="info" defaultSelected>Ferries</Chip></OnCard>, practices: ['Give the tone a meaning and keep it for that filter.'], pair: { do: <OnCard><Chip tone="info" defaultSelected>Ferries</Chip></OnCard>, doNote: 'The tone and the word say the same thing.', dont: <OnCard><Chip tone="info">Ferries</Chip><Chip tone="info">Ferries again</Chip></OnCard>, dontNote: 'Two chips with one meaning confuse the filter.' } },
    positive: { purpose: <p>A green chip, once chosen, is a small crystal of that colour with its check, for a filter about growth, nature or something open, such as Forest or Open now.</p>, context: <OnCard><Chip tone="positive" defaultSelected>Open now</Chip></OnCard>, practices: ['Give the tone a meaning and keep it for that filter.'], pair: { do: <OnCard><Chip tone="positive" defaultSelected>Open now</Chip></OnCard>, doNote: 'The tone and the word say the same thing.', dont: <OnCard><Chip tone="positive">Open now</Chip><Chip tone="positive">Open now again</Chip></OnCard>, dontNote: 'Two chips with one meaning confuse the filter.' } },
    warning: { purpose: <p>A amber chip, once chosen, is a small crystal of that colour with its check, for a filter about warmth or something to watch, such as Desert or Few seats left.</p>, context: <OnCard><Chip tone="warning" defaultSelected>Few seats left</Chip></OnCard>, practices: ['Give the tone a meaning and keep it for that filter.'], pair: { do: <OnCard><Chip tone="warning" defaultSelected>Few seats left</Chip></OnCard>, doNote: 'The tone and the word say the same thing.', dont: <OnCard><Chip tone="warning">Few seats left</Chip><Chip tone="warning">Few seats left again</Chip></OnCard>, dontNote: 'Two chips with one meaning confuse the filter.' } },
    critical: { purpose: <p>A red chip, once chosen, is a small crystal of that colour with its check, for a filter about urgency, such as Closing soon.</p>, context: <OnCard><Chip tone="critical" defaultSelected>Closing soon</Chip></OnCard>, practices: ['Give the tone a meaning and keep it for that filter.'], pair: { do: <OnCard><Chip tone="critical" defaultSelected>Closing soon</Chip></OnCard>, doNote: 'The tone and the word say the same thing.', dont: <OnCard><Chip tone="critical">Closing soon</Chip><Chip tone="critical">Closing soon again</Chip></OnCard>, dontNote: 'Two chips with one meaning confuse the filter.' } },
    accent: { purpose: <p>A violet chip, once chosen, is a small crystal of that colour with its check, for a filter about new or featured, such as Night or New this week.</p>, context: <OnCard><Chip tone="accent" defaultSelected>New this week</Chip></OnCard>, practices: ['Give the tone a meaning and keep it for that filter.'], pair: { do: <OnCard><Chip tone="accent" defaultSelected>New this week</Chip></OnCard>, doNote: 'The tone and the word say the same thing.', dont: <OnCard><Chip tone="accent">New this week</Chip><Chip tone="accent">New this week again</Chip></OnCard>, dontNote: 'Two chips with one meaning confuse the filter.' } },
  },
  modifiers: [
    { name: 'Selected (filter chip)', rules: <p>Use <code>defaultSelected</code> for an uncontrolled chip or <code>selected</code> with <code>onSelectedChange</code> when the results depend on it. Selection is announced through <code>aria-pressed</code>.</p>, pair: { do: <OnCard><Chip defaultSelected>Photos</Chip><Chip>Videos</Chip></OnCard>, doNote: 'One filter on, with its check mark.', dont: <OnCard><Chip>Photos</Chip><Chip>Videos</Chip></OnCard>, dontNote: 'Results already filtered to photos, but no chip shows it.' } },
    { name: 'Removable (input chip)', rules: <p>Pass <code>onRemove</code> to add a remove button named Remove followed by the label. Set <code>removeLabel</code> when the label is not plain text.</p>, pair: { do: <Recipients />, doNote: 'Each recipient has its own remove button.', dont: <OnCard><Chip defaultSelected>Ada Park</Chip></OnCard>, dontNote: 'A recipient as a filter chip. Pressing it toggles instead of removing.' } },
  ],
  related: [['/components/tag', 'Tag', 'A label that does nothing.'], ['/components/tabs', 'Tabs', 'One view at a time.'], ['/components/button', 'Button', 'An action that runs once.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Button pattern (toggle)', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'aria-pressed for a button that stays on.' },
    { title: 'Apple Human Interface Guidelines · Toggles', url: 'https://developer.apple.com/design/human-interface-guidelines/toggles', why: 'Pane’s lineage for controls that keep their state visible.' },
  ],
};
