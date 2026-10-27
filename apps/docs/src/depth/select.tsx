// Select's and Slider's Usage tabs (component-depth.md U1–U14). Both are Radix behaviour in Pane's look.
import { Button, Card, Select, Slider, Stack, Tabs } from 'pane-react';
import type { Depth } from './types';

const OnCard = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card">{children}</Card>;
const WHO = [{ value: 'everyone', label: 'Everyone' }, { value: 'following', label: 'People you follow' }, { value: 'nobody', label: 'No one' }];
const SIZES = [{ value: 'a4', label: 'A4' }, { value: 'a3', label: 'A3' }, { value: 'a2', label: 'A2' }, { value: 'a1', label: 'A1' }];

export const SELECT: Depth = {
  overview: (
    <>
      <p>A select holds one value from a list that is too long to show all at once, such as a print size, a language or who can message you. Closed, it is a pill that shows the current value, so the setting reads at a glance. Open, the list appears on its own popup with a check beside the chosen option.</p>
      <p>The popup is drawn from tokens. It never opens the operating system’s menu, which would look different on every device and could not follow the theme. The list is an opaque raised surface in both themes, because a menu is something people read, and P7 keeps reading surfaces ordinary.</p>
      <p>Radix supplies the behaviour and Pane tests it in a real browser. Enter, Space or the arrow keys open the list. Typing jumps to the first option that starts with those letters. Escape closes it and focus returns to the trigger, so the reader never loses their place.</p>
      <p>The label is required by the type. A select without a name is unusable with a screen reader, so even when the context already names the setting, the label stays in the markup and <code>hideLabel</code> only hides it visually.</p>
    </>
  ),
  whenToUse: [
    'One value from roughly four to fifteen options, such as a size or a language.',
    'A setting whose current value should read at a glance when closed.',
    'Forms and settings panes where space is short and the options are known.',
  ],
  whenNot: [
    { situation: 'Two or three options people should compare', to: '/reference/status', label: 'Radio (planned, wave 3)' },
    { situation: 'An on or off setting', to: '/reference/status', label: 'Switch (planned, wave 3)' },
    { situation: 'Switching between views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Many options people search by typing', to: '/reference/status', label: 'Combobox (planned, wave 5)' },
    { situation: 'Several values at once', to: '/components/chip', label: 'Chips, or MultiSelect (planned)' },
  ],
  variants: { na: 'Select has one look. Its size and states are covered in the size table and under Behaviours.' },
  anatomy: {
    render: <OnCard><Select label="Print size" defaultValue="a3" options={SIZES} /></OnCard>,
    parts: [
      { part: 'Label', selector: '[data-component="Select"] span', what: 'The setting’s name, visible by default and always the accessible name.' },
      { part: 'Trigger', selector: '[role="combobox"]', what: 'A quiet glass pill showing the current value, full width of its column.' },
      { part: 'Chevron', selector: '[role="combobox"] svg', what: '16px. It turns when the list opens.' },
    ],
    perVariant: 'The open list is a separate popup with a raised surface, a soft shadow and a check on the chosen option.',
  },
  sizes: {
    md: { use: '44px tall. The default for forms and settings, and the only size to use on phones.', pairs: 'Button md and body text at 15px.' },
    sm: { use: '32px tall. Toolbars and dense filter rows on desktop. Below the 44px P6 asks for.', pairs: 'Button sm, Chip and 14px labels.' },
  },
  emphasis: {
    text: <p>A select is a quiet control. It shows a value and waits, so it never competes with the pane’s loud Button. Place it with the fields it belongs to and keep the loud action at the foot of the pane, where it applies the settings above it.</p>,
    pair: {
      do: <OnCard><Select label="Print size" defaultValue="a3" options={SIZES} /><div className="demo-row"><Button>Order print</Button></div></OnCard>,
      doNote: 'The setting, then the one action that uses it.',
      dont: <OnCard><div className="demo-row"><Button>Order print</Button></div><Select label="Print size" defaultValue="a3" options={SIZES} /></OnCard>,
      dontNote: 'The action above the setting it depends on.',
    },
  },
  placement: {
    rows: [
      ['In a form or settings pane', 'The default. Label above, full width of its column.'],
      ['In a toolbar', 'sm, with hideLabel when a nearby heading names it.'],
      ['Beside a title', 'A view or sort choice for the pane, such as Sort by.'],
    ],
    examples: [
      { title: 'Settings pane', render: <Card as="section" aria-label="Messages" className="demo-card"><h3 className="flush">Messages</h3><Select label="Who can message you" defaultValue="following" options={WHO} /></Card> },
      { title: 'Beside a title', render: <Card as="section" aria-label="Albums" className="demo-card"><div className="component-head"><h3 className="flush">Albums</h3><Select label="Sort by" hideLabel size="sm" defaultValue="new" options={[{ value: 'new', label: 'Newest' }, { value: 'az', label: 'A to Z' }]} /></div></Card> },
    ],
  },
  combinations: {
    good: [['Select + Button', 'Settings above, the action that uses them at the foot.'], ['Several selects in a Stack', 'A short form, one setting per row.'], ['Select sm + heading', 'A sort or view choice next to the title it changes.']],
    avoid: [
      { title: 'a select for two options', why: 'Both choices are hidden behind a click. Show them side by side.', render: <OnCard><Select label="Notifications" defaultValue="on" options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} /></OnCard> },
      { title: 'a select instead of tabs', why: 'Switching views from a hidden list makes the views hard to find.', render: <OnCard><Select label="Show" defaultValue="posts" options={[{ value: 'posts', label: 'Posts' }, { value: 'media', label: 'Media' }]} /><Tabs.Root defaultValue="a"><Tabs.Content value="a"><p className="flush muted">Posts</p></Tabs.Content></Tabs.Root></OnCard> },
    ],
  },
  content: {
    formula: (
      <>
        <p>The label names the setting as a noun phrase, such as Print size or Who can message you. Option labels are short and parallel, in sentence case, and the most common one comes first unless the list has a natural order, such as sizes or months.</p>
        <p>Use a placeholder only when no value is a valid state, and word it as an instruction, such as Choose a size. When an option exists but cannot be picked now, show it disabled and say why in the label, such as A2 (sold out).</p>
      </>
    ),
    pair: { do: <OnCard><Select label="Print size" defaultValue="a3" options={SIZES} /></OnCard>, doNote: 'A noun label and short options in their natural order.', dont: <OnCard><Select label="Please select the size of print you want" defaultValue="a3" options={[{ value: 'a3', label: 'Size A3 (medium)' }, { value: 'a4', label: 'A4 small size' }]} /></OnCard>, dontNote: 'A sentence for a label and options in different shapes.' },
    overflow: { text: 'A long value is cut with an ellipsis inside the closed pill so the control keeps its height, and the full text is in the open list, where options wrap.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><Select label="Album" defaultValue="long" options={[{ value: 'long', label: 'Lysefjord at dawn, shared with family' }]} /></OnCard></div> },
    rtl: { text: 'In right-to-left languages the chevron moves to the left end of the pill and the list aligns to the right.', render: <div dir="rtl" lang="ar"><OnCard><Select label="مقاس الطباعة" defaultValue="a3" options={[{ value: 'a3', label: 'A3' }, { value: 'a4', label: 'A4' }]} /></OnCard></div> },
    expansion: { text: 'A German label wraps above the pill, and the pill keeps its width.', render: <OnCard><Select label="Wer darf dir Nachrichten senden" defaultValue="following" options={[{ value: 'following', label: 'Personen, denen du folgst' }]} /></OnCard> },
  },
  behaviours: {
    states: [
      ['Closed', 'Quiet glass pill with the current value and a chevron.', 'The value reads at a glance (P7).'],
      ['Hover', 'The ring thickens over 420ms.', 'An answer to the pointer (P4).'],
      ['Focus', 'The shared 2px ring with its dark halo.', 'Visible on any scene (P2).'],
      ['Open', 'The list opens below on a raised surface; the chevron turns.', 'A reading surface stays ordinary (P7).'],
      ['Chosen option', 'A check mark beside it in the accent.', 'Selection has a shape (P6).'],
      ['Disabled', 'Native disabled, half opacity, cannot open.', 'Write the reason nearby (P6).'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the trigger.', 'Select: reachable with Tab'],
      ['Keyboard', 'Enter / Space', 'Opens the list.', 'Select: Enter opens the list and Escape closes it'],
      ['Keyboard', '↓ / ↑ then Enter', 'Moves through the options and picks one.', 'Select: arrow keys and Enter choose a new value'],
      ['Keyboard', 'Escape', 'Closes the list and returns focus to the trigger.', 'Select: Enter opens the list and Escape closes it'],
      ['Keyboard', 'Letters', 'Jumps to the first option starting with them.', 'Radix Select'],
      ['Mouse / touch', 'Click / tap', 'Opens the list; a second click picks.', 'Radix Select'],
    ],
    loading: <p>If the options load from the network, disable the select with a placeholder such as Loading sizes until they arrive. Never open an empty list.</p>,
    focus: <p>Focus returns to the trigger when the list closes, whether the reader picked an option or pressed Escape. Changing the value does not move focus anywhere else.</p>,
  },
  deepDive: { na: 'Select has no variant prop, so there is nothing to compare. Sizes and states are covered above.' },
  modifiers: [
    { name: 'Hidden label', rules: <p>Set <code>hideLabel</code> only when something next to the control already names it, such as a heading. The label stays in the markup for screen readers.</p>, pair: { do: <Card as="section" aria-label="Albums" className="demo-card"><div className="component-head"><h3 className="flush">Albums</h3><Select label="Sort albums by" hideLabel size="sm" defaultValue="new" options={[{ value: 'new', label: 'Newest' }]} /></div></Card>, doNote: 'The heading names what is sorted.', dont: <OnCard><Select label="Sort albums by" hideLabel defaultValue="new" options={[{ value: 'new', label: 'Newest' }]} /></OnCard>, dontNote: 'A hidden label with nothing nearby. Newest of what?' } },
    { name: 'Disabled option', rules: <p>Set <code>disabled</code> on an option that exists but cannot be picked now, and say why in its label.</p>, pair: { do: <OnCard><Select label="Print size" placeholder="Choose a size" options={[{ value: 'a3', label: 'A3' }, { value: 'a2', label: 'A2 (sold out)', disabled: true }]} /></OnCard>, doNote: 'Sold out, and it says so.', dont: <OnCard><Select label="Print size" placeholder="Choose a size" options={[{ value: 'a3', label: 'A3' }, { value: 'a2', label: 'A2', disabled: true }]} /></OnCard>, dontNote: 'Greyed out with no reason.' } },
  ],
  related: [['/components/tabs', 'Tabs', 'Switching views.'], ['/components/chip', 'Chip', 'Several filters at once.'], ['/components/slider', 'Slider', 'A value along a range.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Select-only combobox', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/', why: 'The keyboard model Radix implements and Pane tests.' },
    { title: 'Apple Human Interface Guidelines · Pop-up buttons', url: 'https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons', why: 'Pane’s lineage for a control that shows its value and opens a list.' },
    { title: 'Nielsen Norman Group · Listboxes vs. dropdown lists', url: 'https://www.nngroup.com/articles/listbox-dropdown/', why: 'When a hidden list costs more than it saves.' },
  ],
};

export const SLIDER: Depth = {
  overview: (
    <>
      <p>A slider sets a value along a range where the feel matters more than the exact number, such as volume, a blur amount or a corner radius. The label sits above the track with the current value at the other end, formatted with its unit.</p>
      <p>The track is thin, but the press area around it is 44px tall, so a thumb lands on it easily (P6). The filled part is the accent blue and the knob is white with a shadow, so it reads as an object on both dark and light glass.</p>
      <p>Radix supplies the behaviour. Arrow keys move one step, Page Up and Page Down move a larger step, Home and End jump to the ends, and the formatted value is what a screen reader speaks.</p>
    </>
  ),
  whenToUse: ['Volume, brightness, blur or any value where people adjust by feel.', 'A setting with a live preview, so the reader sees the result while dragging.'],
  whenNot: [
    { situation: 'An exact number people type', to: '/reference/status', label: 'NumberInput (planned, wave 8)' },
    { situation: 'A few named levels', to: '/components/select', label: 'Select' },
    { situation: 'A range with two ends', to: '/reference/status', label: 'RangeSlider (planned, wave 8)' },
  ],
  variants: { na: 'Slider has one look. Its states are covered under Behaviours.' },
  anatomy: {
    render: <OnCard><Slider label="Volume" defaultValue={60} format={(v) => `${v}%`} /></OnCard>,
    parts: [
      { part: 'Label and value', selector: '[data-component="Slider"] > *:first-child', what: 'The setting’s name and the current value with its unit.' },
      { part: 'Track', selector: '[data-component="Slider"] [class*="track"]', what: 'A quiet glass rail with a ring.' },
      { part: 'Thumb', selector: '[role="slider"]', what: 'A white knob with a shadow, on a 44px press area.' },
    ],
  },
  sizes: { na: 'Slider has one size. Its track is thin and its press area is 44px tall.' },
  emphasis: { na: 'A slider carries no emphasis. It is a setting and sits with the content it changes.' },
  placement: {
    rows: [['On a player', 'Volume or progress under the title.'], ['In a settings pane', 'A value with a live preview nearby.']],
    examples: [{ title: 'On a player', render: <Card as="section" aria-label="Player" className="demo-card"><h3 className="flush">Northern Lights</h3><Slider label="Volume" defaultValue={60} format={(v) => `${v}%`} /></Card> }],
  },
  combinations: {
    good: [['Slider + live preview', 'The reader sees the result as they drag.'], ['Several sliders in a Stack', 'Related settings, one per row.']],
    avoid: [{ title: 'a slider for an exact value', why: 'Hitting 37 by dragging is hard. Offer a number field.', render: <OnCard><Slider label="Quantity" min={1} max={100} defaultValue={37} /></OnCard> }],
  },
  content: {
    formula: <p>The label names the setting, such as Volume. The value always carries its unit through <code>format</code>, such as 60% or 18px, because a bare number is spoken without meaning.</p>,
    pair: { do: <OnCard><Slider label="Volume" defaultValue={60} format={(v) => `${v}%`} /></OnCard>, doNote: 'The unit is shown and spoken.', dont: <OnCard><Slider label="Volume" defaultValue={60} /></OnCard>, dontNote: 'A bare 60. Sixty what?' },
    overflow: { text: 'A long label wraps above the track and the value stays at the end of the row.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><Slider label="Background blur behind the player" defaultValue={40} format={(v) => `${v}px`} /></OnCard></div> },
    rtl: { text: 'In right-to-left languages the track fills from the right and the arrow keys follow the reading direction.', render: <div dir="rtl" lang="ar"><OnCard><Slider label="مستوى الصوت" defaultValue={60} format={(v) => `${v}%`} /></OnCard></div> },
    expansion: { text: 'A German label wraps above the track without moving the value.', render: <OnCard><Slider label="Lautstärke" defaultValue={60} format={(v) => `${v} %`} /></OnCard> },
  },
  behaviours: {
    states: [['Rest', 'Thumb at the value.', 'Nothing moves on its own (P4).'], ['Dragging', 'The value and range follow the pointer.', 'A direct answer (P4).'], ['Focus', 'The shared ring on the thumb.', 'Visible on any scene (P2).'], ['Disabled', 'Half opacity, cannot move.', 'Write the reason nearby (P6).']],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the thumb.', 'Slider: reachable with Tab'],
      ['Keyboard', '→ / ←', 'Moves one step.', 'Slider: arrow keys, Home and End change the value'],
      ['Keyboard', 'Home / End', 'Jumps to the minimum or maximum.', 'Slider: arrow keys, Home and End change the value'],
      ['Mouse / touch', 'Drag', 'Moves the thumb; a tap on the track jumps to that point.', 'Slider: the press area is at least 44px tall'],
    ],
    loading: <p>A slider has no loading state. If the value it sets takes time to apply, keep the thumb where the reader left it and show the result when it is ready.</p>,
    focus: <p>Focus stays on the thumb while the value changes.</p>,
  },
  deepDive: { na: 'Slider has no variant prop, so there is nothing to compare.' },
  modifiers: [
    { name: 'Range and step', rules: <p>Set <code>min</code>, <code>max</code> and <code>step</code> to the values that make sense, such as 0 to 40 in steps of 2 for a radius.</p>, pair: { do: <OnCard><Slider label="Corner radius" min={0} max={40} step={2} defaultValue={18} format={(v) => `${v}px`} /></OnCard>, doNote: 'A range that matches the setting.', dont: <OnCard><Slider label="Corner radius" min={0} max={1000} defaultValue={18} format={(v) => `${v}px`} /></OnCard>, dontNote: 'A huge range where every useful value sits in the first few pixels.' } },
  ],
  related: [['/components/select', 'Select', 'A few named levels.'], ['/foundations/motion', 'Motion', 'Timing for the thumb.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Slider pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/', why: 'The keyboard model Radix implements and Pane tests.' },
    { title: 'Apple Human Interface Guidelines · Sliders', url: 'https://developer.apple.com/design/human-interface-guidelines/sliders', why: 'Pane’s lineage for a slider on glass.' },
  ],
};
