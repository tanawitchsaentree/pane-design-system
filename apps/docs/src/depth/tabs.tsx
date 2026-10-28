// Tabs' Usage tab (component-depth.md U1–U14). Behaviour is Radix's; Pane adds the carved track and the sliding sheet.
import { Avatar, Badge, Button, Card, Stack, Tabs } from 'pane-react';
import type { Depth } from './types';

// values become element ids (aria-controls), so they are slugs; a label with spaces would make an invalid id
const slug = (l: string) => l.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-');
const Set = ({ labels, label = 'Profile sections', value }: { labels: string[]; label?: string; value?: string }) => (
  <Tabs.Root defaultValue={slug(value ?? labels[0])}>
    <Tabs.List aria-label={label}>{labels.map((l) => <Tabs.Trigger key={l} value={slug(l)}>{l}</Tabs.Trigger>)}</Tabs.List>
    {labels.map((l) => <Tabs.Content key={l} value={slug(l)}><p className="flush muted">{l} by Mara Lind</p></Tabs.Content>)}
  </Tabs.Root>
);
const Profile = ({ children }: { children: React.ReactNode }) => (
  <Card as="section" aria-label="Profile" className="demo-card">
    <Stack direction="row" gap="md" align="center"><Avatar name="Mara Lind" size="md" decorative /><h3 className="flush">Mara Lind</h3></Stack>
    {children}
  </Card>
);

export const TABS: Depth = {
  overview: (
    <>
      <p>Tabs switch between a few views of the same thing. A profile has Posts, Replies and Media. A player has Up next and Lyrics. Everything under the tabs belongs to one object, and the tabs only change which part of it is showing. The reader stays on the same screen, and the address does not change.</p>
      <p>The tabs sit in one carved track, a recess in the pane with shade under its top lip and light on its bottom lip. The chosen tab is the blue accent sheet resting in the track, with white text. The other tabs are text alone, with no ring and no fill, because a row of rings reads as a row of buttons. When the reader picks a tab, the sheet slides to it over 420ms, so selection changes position and shape as well as colour (P4, P6). The panel rises 8px and settles over 640ms when it changes, like a new sheet placed on the pane (P3, P4).</p>
      <p>Tabs keep the reader in one place, so the address does not change when a tab does. If people need to share or bookmark a view, such as a profile’s Media tab, the app can mirror the value in the URL query and read it back on load. Keep that a choice the app makes, because most tab changes are a glance and do not deserve a history entry.</p>
      <p>Keyboard behaviour comes from Radix and is tested in a real browser. The whole list is one tab stop. Arrow keys move between tabs and select as they go, and Home and End jump to the ends. Pane writes none of that logic, which is why it can promise it works.</p>
    </>
  ),
  whenToUse: [
    'Two to five views of the same object, such as Posts, Replies and Media on a profile.',
    'Grouped settings on one pane, such as Privacy, Notifications and Display.',
    'Alternative views of the same data, such as Week and Month on a calendar card.',
  ],
  whenNot: [
    { situation: 'Each choice opens a different page or address', to: '/foundations/typography', label: 'Navigation links' },
    { situation: 'The choice runs an action', to: '/components/button', label: 'Button' },
    { situation: 'The choice filters a list and several can be on', to: '/components/chip', label: 'Chip' },
    { situation: 'More than five sections', to: '/components/stack', label: 'A list of links in a Stack' },
    { situation: 'Picking one value in a form', to: '/reference/status', label: 'SegmentedControl or Radio (planned)' },
  ],
  variants: { na: 'Tabs has one look. The blue sheet and the plain text are states of the same tab, so there is no variant prop.' },
  anatomy: {
    render: <Card as="div" className="demo-card"><Set labels={['Posts', 'Replies', 'Media']} /></Card>,
    parts: [
      { part: 'Track', selector: '[role="tablist"]', what: 'The tablist, named by aria-label. A carved recess with a 4px inset that holds two to five tabs on one line.' },
      { part: 'Selected tab', selector: '[role="tab"][aria-selected="true"]', what: 'The blue accent sheet with a white gloss on top, white text and no halo. It slides to whichever tab is chosen.' },
      { part: 'Other tabs', selector: '[role="tab"][aria-selected="false"]', what: 'Text in the track with no ring and no fill, so the blue sheet is the only mark.' },
      { part: 'Panel', selector: '[role="tabpanel"]', what: 'The tabpanel, labelled by its tab. It rises 8px and settles when it appears.' },
    ],
  },
  sizes: { na: 'Tabs have one size. Each tab is 32px tall (control.sm), which fits beside a title, and has a 44px tall press area around it.' },
  emphasis: {
    text: (
      <>
        <p>Tabs and the pane title work as a pair. The title names the object, such as Mara Lind, and the tabs name its parts. When a pane has tabs, keep its title short and leave out a subtitle that repeats the selected tab, because the blue sheet already says where the reader is.</p>
        <p>The selected tab is the only blue sheet on most panes, so a pane with tabs should not also carry an accent Button. The two would compete for the one blue the system owns.</p>
        <p>Tabs sit below the pane’s title and above its content. They are a way to read the pane, never its loud action. The pane’s main Button, if it has one, stays at the foot.</p>
      </>
    ),
    pair: {
      do: <Profile><Set labels={['Posts', 'Media']} /><div className="demo-row"><Button>Follow</Button></div></Profile>,
      doNote: 'Tabs to read the profile, and the loud action at the foot.',
      dont: <Profile><Set labels={['Posts', 'Media']} /><div className="demo-row"><Button variant="accent">Follow</Button></div></Profile>,
      dontNote: 'An accent Button next to the blue selected tab. Two blue marks compete.',
    },
  },
  placement: {
    rows: [
      ['Under the pane title', 'The default. The tabs read as the table of contents for this pane, and the panel starts right below them.'],
      ['Inside a sheet or dialog', 'Grouped options in a short sheet. Keep the sheet’s actions outside the panels so they stay put when the tab changes.'],
      ['Beside the title', 'When the pane is short and the title is one word, such as Library with Albums and Songs.'],
      ['Top of a settings pane', 'Grouped settings, each group in its own panel.'],
    ],
    examples: [
      { title: 'Under the title', render: <Profile><Set labels={['Posts', 'Replies', 'Media']} /></Profile> },
      { title: 'Settings groups', render: <Card as="section" aria-label="Settings" className="demo-card"><h3 className="flush">Settings</h3><Set label="Settings sections" labels={['Privacy', 'Alerts', 'Display']} /></Card> },
    ],
  },
  combinations: {
    good: [
      ['Tabs + Badge on a tab label', 'A count of new items in that view, such as Replies with 3.'],
      ['Tabs + Button at the foot', 'Read the pane in tabs, act on it with one Button.'],
      ['Tabs inside a Card', 'The usual home. One set of tabs per pane.'],
    ],
    avoid: [
      { title: 'two sets of tabs on one pane', why: 'Nested tabs make the reader track two selections. Split the pane.', render: <Card as="div" className="demo-card"><Set labels={['Posts', 'Media']} /><Set label="Post filters" labels={['Latest', 'Top']} /></Card> },
      { title: 'six tabs', why: 'Past five the list wraps or shrinks. Use a list of sections.', render: <div className="demo-scroll"><Card as="div" className="demo-card" style={{ flex: 'none', inlineSize: 'max-content', maxInlineSize: 'none' }}><Set labels={['Posts', 'Replies', 'Media', 'Likes', 'Lists', 'About']} /></Card></div> },
    ],
  },
  content: {
    formula: (
      <>
        <p>One short word per tab, in sentence case. Name what the panel shows, such as Posts, never what to do with it, such as View posts. Keep labels about the same length so the tabs read as a set.</p>
        <p>Each panel needs a heading or a first line that says what it holds, because a screen reader user who jumps into the panel may not have heard the tab name. The tab name and the panel’s first words should agree, so Media opens on media.</p>
        <p>Order tabs by how often they are used, most used first, and select the first one by default. Remember the reader’s last choice only when they come back to the same pane often.</p>
      </>
    ),
    pair: {
      do: <Card as="div" className="demo-card"><Set labels={['Posts', 'Replies', 'Media']} /></Card>,
      doNote: 'One word each, naming what is shown.',
      dont: <Card as="div" className="demo-card"><Set labels={['View my posts', 'Replies', 'See media']} /></Card>,
      dontNote: 'Verbs and uneven lengths. The set stops reading as a set.',
    },
    overflow: { text: 'The list never wraps. Labels stay on one line, and a set that does not fit at 375px has too many tabs or too long a label. Fix the content, because a wrapped tab list stops reading as one control.', render: <div data-overflow-demo="" className="overflow-probe" style={{ maxInlineSize: 340 }}><Card as="div" className="demo-card"><Set labels={['Posts', 'Replies', 'Media']} /></Card></div> },
    rtl: { text: 'In right-to-left languages the list starts at the right, and the arrow keys follow the reading direction, so the right arrow moves to the previous tab.', render: <div dir="rtl" lang="ar"><Card as="div" className="demo-card"><Set label="أقسام الملف" labels={['المنشورات', 'الردود', 'الوسائط']} /></Card></div> },
    expansion: { text: 'At German length the three tabs still fit on one line on a phone.', render: <Card as="div" className="demo-card"><Set label="Profilbereiche" labels={['Beiträge', 'Antworten', 'Medien']} /></Card> },
  },
  behaviours: {
    states: [
      ['Unselected', 'A white label in the carved track, with no ring and no fill.', 'Quiet, so the chosen sheet is the only mark (P5).'],
      ['Selected', 'The blue accent sheet behind a white label, no halo.', 'A filled shape against bare text, so colour is never the only cue (P6).'],
      ['Selection change', 'The sheet slides to the new tab over 420ms. It does not animate on first load.', 'Motion answers the reader’s choice (P4).'],
      ['Hover', 'No change of its own beyond the pointer cursor.', 'A gap against P4, which asks every control to answer the pointer. Listed under Limitations.'],
      ['Pressed', 'Shrinks slightly over 200ms.', 'A press is a reply (P4).'],
      ['Focus', 'The shared 2px ring with its dark halo.', 'Visible on any scene (P2).'],
      ['Panel change', 'The new panel rises 8px and settles over 640ms.', 'A sheet placed on the pane (P3, P4).'],
      ['Forced colours', 'The sliding sheet is dropped, the track gets a ButtonText border, and the selected tab gets a Highlight border and an underline.', 'Never colour alone (P6).'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Enters the list on the selected tab; the next Tab leaves the list.', 'Tabs: one tab stop, so Tab lands on the selected tab and the next Tab leaves the list'],
      ['Keyboard', '→ / ←', 'Moves to the next or previous tab and selects it, wrapping at the ends.', 'Tabs: arrow keys move focus and selection, and Home and End jump to the ends'],
      ['Keyboard', 'Home / End', 'Jumps to the first or last tab.', 'Tabs: arrow keys move focus and selection, and Home and End jump to the ends'],
      ['Mouse', 'Click', 'Selects the tab.', 'Radix Tabs'],
      ['Touch', 'Tap', 'Selects the tab. Each tab is 32px tall with a 44px tall press area.', 'Tabs.module.css'],
    ],
    loading: <p>Panels are mounted only when their tab is selected, so a heavy panel costs nothing until someone opens it. Use <code>forceMount</code> on Tabs.Content only when the panel must keep its state while hidden, such as a half-written reply. If a panel’s content loads when its tab is chosen, select the tab at once and show placeholders in the panel. Keep the tab list usable while the panel loads, so the reader can change their mind without waiting.</p>,
    focus: <p>On a phone the tab list sits at the top of the pane, within reach of a thumb only when the pane is short. For a long pane, keep the tabs visible by placing them above the scrolling content, so changing views never means scrolling back up first. The selected tab takes focus when the reader tabs into the list. Changing the tab does not move focus into the panel. A reader who wants the content presses Tab once more.</p>,
  },
  deepDive: { na: 'Tabs has no variant prop, so there is one tab and nothing to compare. The states above cover every look it has.' },

  modifiers: [
    { name: 'Controlled value', rules: <p>Pass <code>value</code> and <code>onValueChange</code> to Tabs.Root when something else on the screen depends on the current view, such as a count in the title. Leave it uncontrolled with <code>defaultValue</code> otherwise.</p>, pair: { do: <Card as="div" className="demo-card"><Set labels={['Week', 'Month']} /></Card>, doNote: 'Uncontrolled when nothing else needs to know.', dont: <Card as="div" className="demo-card"><Set labels={['Week', 'Month']} value="Month" /></Card>, dontNote: 'A default that is not the most used view. Start on Week, the first tab.' } },
    { name: 'Count on a tab', rules: <p>Put a Badge after the label when a view has new items. Keep it to a number, and let the tab’s name still make sense without it.</p>, pair: { do: <Card as="div" className="demo-card"><Tabs.Root defaultValue="a"><Tabs.List aria-label="Inbox"><Tabs.Trigger value="a">Mentions <Badge tone="info">3</Badge></Tabs.Trigger><Tabs.Trigger value="b">All</Tabs.Trigger></Tabs.List><Tabs.Content value="a"><p className="flush muted">3 new</p></Tabs.Content><Tabs.Content value="b"><p className="flush muted">Everything</p></Tabs.Content></Tabs.Root></Card>, doNote: 'A number after a one-word label.', dont: <Card as="div" className="demo-card"><Tabs.Root defaultValue="a"><Tabs.List aria-label="Inbox"><Tabs.Trigger value="a"><Badge tone="info">3</Badge></Tabs.Trigger><Tabs.Trigger value="b">All</Tabs.Trigger></Tabs.List><Tabs.Content value="a"><p className="flush muted">3 new</p></Tabs.Content><Tabs.Content value="b"><p className="flush muted">Everything</p></Tabs.Content></Tabs.Root></Card>, dontNote: 'A count with no label. The tab has no name.' } },
  ],
  related: [
    ['/reference/status', 'SegmentedControl (planned)', 'A value in a form, where the choice is data and not a view.'],
    ['/components/chip', 'Chip', 'Filters where several can be on.'],
    ['/components/button', 'Button', 'When the choice runs an action.'],
    ['/patterns/settings-panel', 'Settings panel', 'Tabs over grouped settings.'],
  ],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Tabs pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/', why: 'The keyboard model Radix implements and Pane tests.' },
    { title: 'Apple Human Interface Guidelines · Segmented controls', url: 'https://developer.apple.com/design/human-interface-guidelines/segmented-controls', why: 'Pane’s lineage for a short set of views on one surface.' },
    { title: 'Nielsen Norman Group · Tabs, Used Right', url: 'https://www.nngroup.com/articles/tabs-used-right/', why: 'Research on when tabs help and when a list works better.' },
  ],
};
