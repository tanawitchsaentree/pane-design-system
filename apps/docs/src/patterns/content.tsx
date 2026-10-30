// The twelve patterns every kiln book covers (component-depth.md, G-IA1). Each is composed from Pane's
// real components; where the catalog has not reached a component yet, the page says which one is missing.
import { useState } from 'react';
import { Avatar, Badge, Banner, Button, Card, Chip, IconButton, Select, Slider, Stack, Tag } from 'pane-react';
import { IconMore, IconShare } from '../icons';
import type { PatternDepth } from './PatternDepth';

const Pane = ({ title, children, label }: { title?: string; children: React.ReactNode; label?: string }) => (
  <Card as="section" aria-label={label ?? title ?? 'Example'} className="demo-card">{title && <h3 className="flush">{title}</h3>}{children}</Card>
);
const Row = ({ children }: { children: React.ReactNode }) => <div className="demo-row">{children}</div>;
const Line = ({ w = '100%' }: { w?: string }) => <span className="placeholder-line" style={{ inlineSize: w }} aria-hidden="true" />;
const SIZES = [{ value: 'a4', label: 'A4' }, { value: 'a3', label: 'A3' }, { value: 'a2', label: 'A2' }];

function Filters() {
  const [on, setOn] = useState<string[]>(['Photos']);
  const all = ['Photos', 'Videos', 'Prints'];
  const n = on.length ? on.length * 8 : 24;
  return (
    <Pane title="Library">
      <Stack direction="row" gap="sm" align="center">
        {all.map((f) => <Chip key={f} selected={on.includes(f)} onSelectedChange={(s) => setOn(s ? [...on, f] : on.filter((x) => x !== f))}>{f}</Chip>)}
        {on.length > 0 && <Button size="sm" variant="glass" onClick={() => setOn([])}>Clear</Button>}
      </Stack>
      <p className="flush muted" role="status">{n} results</p>
    </Pane>
  );
}

export const PATTERN_DEPTH: Record<string, PatternDepth> = {
  '/patterns/common-actions': {
    title: 'Common actions',
    lede: 'Where actions go on a pane, how many may be loud, and what happens to the rest.',
    problem: <><p>Every pane offers a few things to do, and the reader should find the main one without comparing. When every action looks the same, people read all of them. When two look loud, people hesitate. Pane answers with one rule from P5: one loud action per pane, everything else quiet, and anything past three behind More.</p><p>The same rule decides order. The loud action comes first on the start side, quiet ones follow, and More comes last. A destructive action is never the loud one unless deleting is the reason the pane exists.</p></>,
    anatomy: [['Loud action', 'One light Button, or one accent Button when the product promotes the action.'], ['Quiet actions', 'Glass Buttons beside it, two at most.'], ['Familiar tools', 'IconButtons for share, reply and the like.'], ['More', 'A ghost or glass IconButton that holds everything else.']],
    example: { title: 'A profile with its actions', render: <Pane title="Mara Lind"><p className="flush muted">Landscape photographer · Bergen</p><Row><Button>Follow</Button><Button variant="glass">Message</Button><IconButton aria-label="Share profile" variant="glass"><IconShare /></IconButton><IconButton aria-label="More options" variant="glass"><IconMore /></IconButton></Row></Pane> },
    variations: [
      { title: 'No main action', text: 'A pane of equal options, such as sharing a post, uses glass only.', render: <Pane title="Share post"><Row><Button variant="glass">Copy link</Button><Button variant="glass">Email</Button></Row></Pane> },
      { title: 'A promoted action', text: 'Accent replaces light when the product wants this action to stand out, and the pane then has no light button.', render: <Pane title="Verify your account"><Row><Button variant="accent">Get verified</Button><Button variant="glass">Not now</Button></Row></Pane> },
    ],
    pairs: [
      { do: <Pane><Row><Button>Save</Button><Button variant="glass">Cancel</Button></Row></Pane>, doNote: 'One loud, one quiet, loud first.', dont: <Pane><Row><Button variant="glass">Cancel</Button><Button>Save</Button><Button variant="accent">Publish</Button></Row></Pane>, dontNote: 'Two loud actions, and the way out comes first.' },
    ],
    related: [['/components/button', 'Button', 'The loud and quiet actions.'], ['/components/icon-button', 'IconButton', 'Familiar tools and More.']],
  },
  '/patterns/dialogs': {
    title: 'Dialogs',
    lede: 'When to stop the reader for a decision, and what to do until Pane has a Dialog.',
    problem: <><p>Some decisions cannot wait, such as discarding a draft or deleting an account. The reader must answer before going on, so the question has to sit in front of everything else and keep focus until it is answered.</p><p>A dialog is the right tool only when the choice blocks the task. Information the reader can ignore belongs in a Banner, and a choice that can wait belongs on the pane itself.</p></>,
    gap: 'Pane has no Dialog component yet (planned for wave 4). Until then, ask the question as a confirmation pane in place of the content it affects, as below, and keep focus on its loud action.',
    anatomy: [['Question', 'A heading that names the decision, such as Discard draft?'], ['Consequence', 'One sentence saying what will happen.'], ['Answer', 'The action named after the decision, loud.'], ['Way out', 'A glass button that keeps things as they are.']],
    example: { title: 'A confirmation pane in place of the draft', render: <Pane title="Discard draft?"><p className="flush muted">Your changes to Lauterbrunnen trip will be lost.</p><Row><Button>Keep editing</Button><Button variant="glass">Discard</Button></Row></Pane> },
    variations: [
      { title: 'A destructive decision', text: 'When deleting is the reason the pane exists, the delete can be loud, with the consequence written above it.', render: <Pane title="Delete account?"><p className="flush muted">Your albums and prints are removed for good.</p><Row><Button>Delete account</Button><Button variant="glass">Keep account</Button></Row></Pane> },
    ],
    pairs: [
      { do: <Pane title="Discard draft?"><Row><Button>Keep editing</Button><Button variant="glass">Discard</Button></Row></Pane>, doNote: 'Answers named after the question.', dont: <Pane title="Are you sure?"><Row><Button>OK</Button><Button variant="glass">Cancel</Button></Row></Pane>, dontNote: 'A vague question and answers that need it reread.' },
    ],
    related: [['/components/card', 'Card', 'The confirmation pane.'], ['/components/button', 'Button', 'The answer and the way out.'], ['/components/banner', 'Banner', 'When the reader does not need to decide.']],
  },
  '/patterns/disabled-states': {
    title: 'Disabled states',
    lede: 'When to disable a control, when to hide it, and how to explain either.',
    problem: <><p>A disabled control cannot be focused, so a keyboard or screen reader user cannot find out why it is off. That makes disabling the least helpful way to say not now. Pane prefers leaving the control enabled and explaining after the press, and disables only when the reason is written right beside it.</p><p>Hide a control only when it can never apply to this reader, such as an admin action for a guest. Hiding something that is only temporarily off makes people think it does not exist.</p></>,
    anatomy: [['Control', 'Native disabled, half opacity, no motion.'], ['Reason', 'A line of secondary text next to it saying what is missing.'], ['Way forward', 'A link or action that fixes the reason, when there is one.']],
    example: { title: 'Disabled with the reason and the way forward', render: <Pane title="Publish album"><Row><Button disabled>Publish</Button></Row><p className="flush muted small">Add a cover photo to publish.</p></Pane> },
    variations: [
      { title: 'A disabled setting', text: 'The value stays visible, so the reader can still see what it is set to.', render: <Pane title="Player"><Slider label="Volume" disabled defaultValue={40} format={(v) => `${v}%`} /><p className="flush muted small">Volume follows the speaker while it is connected.</p></Pane> },
      { title: 'Enabled, explained after the press', text: 'Often better than disabling. The reader presses, and a Banner says what is missing.', render: <Pane title="Publish album"><Banner tone="warning" title="Add a cover photo first" /><Row><Button>Publish</Button></Row></Pane> },
    ],
    pairs: [
      { do: <Pane><Row><Button disabled>Publish</Button></Row><p className="flush muted small">Add a cover photo to publish.</p></Pane>, doNote: 'The reason is right there.', dont: <Pane><Row><Button disabled>Publish</Button></Row></Pane>, dontNote: 'Nobody can find out why.' },
    ],
    related: [['/components/button', 'Button', 'Disabled actions.'], ['/components/select', 'Select', 'Disabled settings and options.'], ['/patterns/read-only-states', 'Read-only states', 'When the value is shown but not changeable.']],
  },
  '/patterns/empty-states': {
    title: 'Empty states',
    lede: 'What a pane shows when it has nothing in it yet, nothing matches, or everything is done.',
    problem: <><p>An empty pane is a moment the reader did not expect, and a blank area reads as broken. The pane should say why it is empty and offer the next step, in the same place the content would be.</p><p>There are three kinds. First use, where nothing exists yet. No results, where a search or filter matched nothing. Done, where the reader cleared everything. Each needs different words, and only the first needs a loud action.</p></>,
    gap: 'Pane has no EmptyState component yet (planned for wave 7). The example composes it from a Card, text and a Button.',
    anatomy: [['Statement', 'One line saying what is empty and why.'], ['Next step', 'One action that fills it, or a way to widen the search.'], ['Same place', 'The empty state sits where the content would be.']],
    example: { title: 'First use', render: <Pane title="Albums"><p className="flush">No albums yet.</p><p className="flush muted">Albums group photos you want to share together.</p><Row><Button>Create album</Button></Row></Pane> },
    variations: [
      { title: 'No results', text: 'Say what matched nothing and offer to clear the filters, quietly.', render: <Pane title="Library"><p className="flush">No videos match Prints.</p><Row><Button variant="glass">Clear filters</Button></Row></Pane> },
      { title: 'All done', text: 'Confirm the good news and stop. No action is needed.', render: <Pane title="Inbox"><p className="flush">You are all caught up.</p></Pane> },
    ],
    pairs: [
      { do: <Pane title="Albums"><p className="flush">No albums yet.</p><Row><Button>Create album</Button></Row></Pane>, doNote: 'Why it is empty and how to fill it.', dont: <Pane title="Albums"><p className="flush muted">Nothing here.</p></Pane>, dontNote: 'No reason and no way forward.' },
    ],
    related: [['/components/card', 'Card', 'The pane that stays in place.'], ['/patterns/filtering', 'Filtering', 'Where no-results states come from.']],
  },
  '/patterns/filtering': {
    title: 'Filtering',
    lede: 'Narrowing a list with filters that stay visible, a result count and a way to clear them.',
    problem: <><p>People filter to find something faster, so the filters should be one press away and show what is on. Hidden filters make results look incomplete. Pane uses filter Chips above the results, which keep their state visible with a check mark, and a live count of results.</p></>,
    anatomy: [['Filter chips', 'One per filter, several can be on.'], ['Clear', 'A quiet action that turns all filters off, shown only when one is on.'], ['Result count', 'In text, announced politely when it changes.'], ['Sort', 'A small Select when the order can change.']],
    example: { title: 'Filters with a live count', render: <Filters /> },
    variations: [
      { title: 'Filter and sort', text: 'A sort Select sits at the end of the row, labelled for screen readers.', render: <Pane title="Library"><Stack direction="row" gap="sm" align="center"><Chip defaultSelected>Photos</Chip><Chip>Videos</Chip><Select label="Sort by" hideLabel size="sm" defaultValue="new" options={[{ value: 'new', label: 'Newest' }, { value: 'old', label: 'Oldest' }]} /></Stack></Pane> },
    ],
    pairs: [
      { do: <Pane><Stack direction="row" gap="sm"><Chip defaultSelected>Photos</Chip><Chip>Videos</Chip></Stack><p className="flush muted">8 results</p></Pane>, doNote: 'The filter shows it is on, and the count follows.', dont: <Pane><Stack direction="row" gap="sm"><Tag>Photos</Tag><Tag>Videos</Tag></Stack></Pane>, dontNote: 'Static tags used as filters. Nothing says which is on.' },
    ],
    related: [['/components/chip', 'Chip', 'The filters.'], ['/components/select', 'Select', 'Sorting.'], ['/patterns/empty-states', 'Empty states', 'When nothing matches.']],
  },
  '/patterns/forms': {
    title: 'Forms',
    lede: 'Labels, layout, errors and the submit action, for the parts of a form Pane can build today.',
    problem: <><p>A form asks the reader for information, and every field is a small cost. Keep forms short, put one field per row with its label above it, and say what went wrong next to the field that caused it. Forms are a reading surface, so on a settings page they sit on an opaque surface (P7). On glass they are short, such as a reply.</p></>,
    gap: 'Pane has no text Input, Checkbox, Radio or Switch yet. They are wave 3, and their look is waiting on a derivation round in apps/lab/forms. Until then this page shows the layout rules with Select and Slider.',
    anatomy: [['Label', 'Above the field, always the accessible name.'], ['Field', 'Full width of its column.'], ['Help', 'Optional secondary text under the field.'], ['Error', 'Next to the field, with a glyph and the word Error.'], ['Submit', 'The pane’s one loud action, after the last field.']],
    example: { title: 'A short order form', render: <Pane title="Order a print"><Select label="Print size" defaultValue="a3" options={SIZES} /><Slider label="Border" min={0} max={40} step={2} defaultValue={10} format={(v) => `${v} mm`} /><Row><Button type="submit">Order print</Button><Button variant="glass">Cancel</Button></Row></Pane> },
    variations: [
      { title: 'An error for the whole form', text: 'When the problem is not one field, say so in a Banner at the top of the pane.', render: <Pane title="Order a print"><Banner tone="critical" title="Payment failed">Your bank declined the charge. Try another card.</Banner><Row><Button>Try again</Button></Row></Pane> },
    ],
    pairs: [
      { do: <Pane><Select label="Print size" defaultValue="a3" options={SIZES} /><Row><Button>Order print</Button></Row></Pane>, doNote: 'Field first, then the action that submits it.', dont: <Pane><Row><Button>Order print</Button></Row><Select label="Print size" defaultValue="a3" options={SIZES} /></Pane>, dontNote: 'The action above the field it needs.' },
    ],
    related: [['/components/select', 'Select', 'Choices.'], ['/components/slider', 'Slider', 'Values in a range.'], ['/components/button', 'Button', 'Submit and cancel.'], ['/components/banner', 'Banner', 'Errors for the whole form.']],
  },
  '/patterns/loading': {
    title: 'Loading',
    lede: 'Keeping the layout still while content arrives, and telling the reader something is happening.',
    problem: <><p>Content that pops in late moves everything below it, and the reader loses their place. Pane keeps each pane at its final size while it loads and shows quiet placeholders where the content will be, so nothing moves when it arrives (P4).</p><p>Actions that take time keep their label, are disabled from the first press and report the outcome when it is done.</p></>,
    gap: 'Pane has no Skeleton or Spinner component yet. The placeholders here are drawn from the surface.placeholder tokens.',
    anatomy: [['Placeholder', 'Quiet bars the size of the text they stand for.'], ['Same frame', 'The pane keeps its final size.'], ['Busy action', 'The button stays labelled, disabled and aria-busy.'], ['Outcome', 'A polite announcement when the content or result is ready.']],
    example: { title: 'A post loading', render: <Pane label="Loading post"><Stack direction="row" gap="md" align="center"><Avatar name="?" size="sm" decorative /><Line w="40%" /></Stack><Line /><Line w="80%" /></Pane> },
    variations: [
      { title: 'A busy action', text: 'The label stays, the button is disabled and busy, and the result arrives as a Banner.', render: <Pane title="Upload"><Row><Button disabled aria-busy="true">Uploading…</Button></Row></Pane> },
    ],
    pairs: [
      { do: <Pane label="Loading"><Line /><Line w="70%" /></Pane>, doNote: 'Placeholders at the size of the content.', dont: <Pane label="Loading"><p className="flush muted">Loading…</p></Pane>, dontNote: 'A word that is replaced by content of a different height.' },
    ],
    related: [['/components/card', 'Card', 'The frame that keeps its size.'], ['/components/button', 'Button', 'Busy actions.'], ['/patterns/notifications', 'Notifications', 'Announcing the outcome.']],
  },
  '/patterns/notifications': {
    title: 'Notifications',
    lede: 'Telling the reader something happened, in the place it happened.',
    problem: <><p>A message is only useful if the reader can tell what it is about. Pane writes messages on the pane they concern, as a Banner line, so the context is never in doubt. Messages that appear after an action are announced, politely for news and assertively for errors that stop the task.</p></>,
    gap: 'Pane has no Toast or notification centre yet (planned for waves 4 and 10). App-wide messages such as a lost connection need one.',
    anatomy: [['Banner', 'The message as the first line of its pane.'], ['Tone', 'A glyph shape and a spoken word, coloured only on the glyph.'], ['Action', 'Optional, at the end of the line.'], ['Announcement', 'live polite or assertive, only for messages that appear after load.']],
    example: { title: 'A result on the pane it concerns', render: <Pane title="Profile"><Banner tone="positive" title="Profile saved" live="polite" /><p className="flush muted">Mara Lind · Bergen</p></Pane> },
    variations: [
      { title: 'An error that stops the task', text: 'Critical, assertive, and the fix as the pane’s loud action.', render: <Pane title="Billing"><Banner tone="critical" title="Payment failed" action={<Button size="sm">Retry payment</Button>} /></Pane> },
    ],
    pairs: [
      { do: <Pane title="Billing"><Banner tone="warning" title="Card expires next month" /></Pane>, doNote: 'The message on the pane it is about.', dont: <Pane title="Billing"><Banner tone="warning" title="Something needs your attention" /></Pane>, dontNote: 'A vague message the reader has to investigate.' },
    ],
    related: [['/components/banner', 'Banner', 'The message line.'], ['/components/badge', 'Badge', 'A state on an item.']],
  },
  '/patterns/overflow-content': {
    title: 'Overflow content',
    lede: 'What happens when text, actions or lists are longer than the space for them.',
    problem: <><p>Real content is longer than design content. Names run long, translations grow by a third, and lists grow past what a pane can show. Pane wraps text instead of cutting it, moves extra actions behind More, and shows the first items of a long list with a way to see the rest.</p><p>Truncation is allowed only where the full text is one step away, such as a value in a closed Select, whose full label is in the open list.</p></>,
    anatomy: [['Wrap', 'Titles, labels and messages wrap onto more lines.'], ['More', 'Actions past three go behind a More IconButton.'], ['Show more', 'Long lists show the first items and a quiet action for the rest.']],
    example: { title: 'A long name, wrapped', render: <Pane><Stack direction="row" gap="md" align="center"><Avatar name="Marianne Lindqvist-Haugen" size="sm" decorative /><b>Marianne Lindqvist-Haugen</b></Stack><p className="flush">Landscape and field-recording artist working between Bergen, Tromsø and the Lofoten islands.</p></Pane> },
    variations: [
      { title: 'A long list', text: 'Show the first items, say how many more there are, and offer to show them.', render: <Pane title="Members"><Stack gap="sm"><span>Ada Park</span><span>Jonas Berg</span><span>Mara Lind</span></Stack><Row><Button size="sm" variant="glass">Show 12 more</Button></Row></Pane> },
    ],
    pairs: [
      { do: <Pane><Row><Button>Follow</Button><Button variant="glass">Message</Button><IconButton aria-label="More options" variant="glass"><IconMore /></IconButton></Row></Pane>, doNote: 'Two actions and More.', dont: <Pane><Row><Button size="sm">Follow</Button><Button size="sm" variant="glass">Message</Button><Button size="sm" variant="glass">Mute</Button><Button size="sm" variant="glass">Block</Button><Button size="sm" variant="glass">Report</Button></Row></Pane>, dontNote: 'Five actions in a row.' },
    ],
    related: [['/components/icon-button', 'IconButton', 'More.'], ['/components/button', 'Button', 'Show more.']],
  },
  '/patterns/read-only-states': {
    title: 'Read-only states',
    lede: 'Showing a value the reader can see but not change, without making it look broken.',
    problem: <><p>A value the reader cannot change is information, so show it as text. A disabled control looks broken and cannot be focused, so screen reader users may never hear the value. Read-only values in Pane are plain text in a definition list, with a note when someone else controls them.</p></>,
    anatomy: [['Term', 'The setting’s name.'], ['Value', 'Its current value as plain text.'], ['Owner', 'Optional, who can change it.']],
    example: { title: 'Settings someone else controls', render: <Pane title="Workspace"><dl className="settings-list"><div className="settings-row"><dt>Plan</dt><dd className="muted">Pro, managed by Ada Park</dd></div><div className="settings-row"><dt>Storage</dt><dd className="muted">64 GB</dd></div></dl></Pane> },
    variations: [
      { title: 'With a status', text: 'A Badge can mark a read-only value’s state.', render: <Pane title="Account"><Stack direction="row" gap="sm" align="center"><span>Verified</span><Badge tone="positive">Yes</Badge></Stack></Pane> },
    ],
    pairs: [
      { do: <Pane><dl className="settings-list"><div className="settings-row"><dt>Plan</dt><dd className="muted">Pro</dd></div></dl></Pane>, doNote: 'The value as text.', dont: <Pane><Select label="Plan" disabled defaultValue="pro" options={[{ value: 'pro', label: 'Pro' }]} /></Pane>, dontNote: 'A disabled select for a value nobody here can change.' },
    ],
    related: [['/patterns/disabled-states', 'Disabled states', 'When the value can change later.'], ['/components/badge', 'Badge', 'A state on a value.']],
  },
  '/patterns/search': {
    title: 'Search',
    lede: 'Finding something by typing, with results that update and a clear way out.',
    problem: <><p>Search is for readers who know what they want. They type, results narrow, and the best match comes first. The pattern needs a search field, a result count, results in the same panes as the rest of the product, and an empty state when nothing matches.</p></>,
    gap: 'Pane has no text Input or SearchInput yet (waves 3 and 8), so a search field cannot be built with Pane today. The parts below are the results side, which can.',
    anatomy: [['Field', 'A search input with a visible label (planned).'], ['Count', 'How many results, announced politely.'], ['Results', 'Panes like everywhere else.'], ['No results', 'An empty state that offers to widen the search.']],
    example: { title: 'Results for “fjord”', render: <Pane title="Results for fjord"><p className="flush muted" role="status">2 results</p><Stack gap="sm"><span>Lysefjord at dawn</span><span>Geirangerfjord prints</span></Stack></Pane> },
    variations: [
      { title: 'No results', text: 'Say what was searched and offer something broader.', render: <Pane title="Results for fjrod"><p className="flush">No results for fjrod.</p><Row><Button variant="glass">Search all albums</Button></Row></Pane> },
    ],
    pairs: [
      { do: <Pane title="Results for fjord"><p className="flush muted">2 results</p></Pane>, doNote: 'The query and the count.', dont: <Pane title="Results"><p className="flush muted">Nothing found.</p></Pane>, dontNote: 'No query shown and no way forward.' },
    ],
    related: [['/patterns/empty-states', 'Empty states', 'No results.'], ['/patterns/filtering', 'Filtering', 'Narrowing results further.']],
  },
  '/patterns/status-indicators': {
    title: 'Status indicators',
    lede: 'Showing the state of things with words first, shape second and colour third.',
    problem: <><p>Colour alone fails for anyone who cannot see it and for every screen reader. Pane shows status in words, adds a shape (a glyph or a dot), and only then a colour (P6). The scene owns most of the colour, so status colour stays small (P1).</p></>,
    anatomy: [['Word', 'The state, such as Failed or Live.'], ['Shape', 'A glyph per tone, or a dot for live states.'], ['Colour', 'The tone, on the shape or the badge fill.']],
    example: { title: 'States in a list', render: <Pane title="Uploads"><Stack gap="sm"><Stack direction="row" gap="sm" align="center"><span>Lysefjord.jpg</span><Badge tone="positive">Done</Badge></Stack><Stack direction="row" gap="sm" align="center"><span>Fløyen.jpg</span><Badge tone="critical">Failed</Badge></Stack><Stack direction="row" gap="sm" align="center"><span>Stream</span><Badge tone="positive" dot>Live</Badge></Stack></Stack></Pane> },
    variations: [
      { title: 'A state with a sentence', text: 'When the state needs explaining, use a Banner on the pane.', render: <Pane title="Uploads"><Banner tone="critical" title="1 upload failed">The file is larger than 25 MB.</Banner></Pane> },
    ],
    pairs: [
      { do: <Pane><Stack direction="row" gap="sm" align="center"><span>Upload</span><Badge tone="critical">Failed</Badge></Stack></Pane>, doNote: 'The word says it, the colour backs it up.', dont: <Pane><Stack direction="row" gap="sm" align="center"><span>Upload</span><Badge tone="critical"> </Badge></Stack></Pane>, dontNote: 'A red pill with no word.' },
    ],
    related: [['/components/badge', 'Badge', 'A state on an item.'], ['/components/banner', 'Banner', 'A state that needs a sentence.']],
  },
};
