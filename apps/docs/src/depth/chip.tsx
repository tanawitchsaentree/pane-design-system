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
      <p>A filter chip is a native button with <code>aria-pressed</code>. Selected chips turn solid white with ink text and show a check mark, so selection changes shape as well as colour (P6). Unselected chips are a quiet glass pill with a ring, so a row of them stays calm until the reader picks one.</p>
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
  variants: { na: 'Chip has no variant prop. Its two kinds come from behaviour. A filter chip toggles, and an input chip has onRemove. Both are covered under Modifiers.' },
  anatomy: {
    render: <OnCard><Chip defaultSelected>Photos</Chip></OnCard>,
    parts: [
      { part: 'Pill', selector: '[data-component="Chip"]', what: '32px tall, full pill. Quiet glass and a ring when off, solid white with ink text when on.' },
      { part: 'Check mark', selector: '[data-component="Chip"] svg', what: 'Shown when a filter chip is selected, so selection has a shape.' },
      { part: 'Label', selector: '[data-component="Chip"] button', what: 'The chip’s accessible name. 14px medium.' },
    ],
    perVariant: 'An input chip adds a remove button after the label, with its own focus stop and the name Remove followed by the label.',
  },
  sizes: { na: 'Chip has one size, 32px. That is below the 44px P6 asks for, and chips have no larger press area yet, which is listed under Limitations.' },
  emphasis: {
    text: <p>Chips are quiet until selected. The selected chip turns solid white, which is the same fill as the pane’s loud Button in the dark theme. Keep chips away from the pane’s main action so a selected filter is never mistaken for it.</p>,
    pair: {
      do: <Card as="div" className="demo-card"><Stack direction="row" gap="sm"><Chip defaultSelected>Photos</Chip><Chip>Videos</Chip></Stack><p className="flush muted">24 results</p></Card>,
      doNote: 'Filters above the results, apart from any action.',
      dont: <OnCard><Chip defaultSelected>Photos</Chip><Chip defaultSelected>Videos</Chip><Chip defaultSelected>Albums</Chip><Chip defaultSelected>Prints</Chip></OnCard>,
      dontNote: 'Every filter on. The row reads as four loud buttons and filters nothing.',
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
      ['Off', 'Quiet glass and a ring.', 'Calm until chosen (P5).'],
      ['On', 'Solid white, ink text, check mark, aria-pressed true.', 'Shape and colour change together (P6).'],
      ['Pressed', 'Shrinks to 97% over 200ms.', 'A press is a reply (P4).'],
      ['Focus', 'The shared 2px ring with its dark halo.', 'Visible on any scene (P2).'],
      ['Forced colours', 'The selected border takes Highlight.', 'Never colour alone (P6).'],
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
  deepDive: { na: 'Chip has no variant prop. Its two kinds, filter and input, are behaviours and are covered under Modifiers.' },
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
