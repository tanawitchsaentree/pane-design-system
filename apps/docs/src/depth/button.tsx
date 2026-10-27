// Button's Usage tab (component-depth.md U1–U14). Every pair and example below is a live Pane
// component. Carbon's Button page sets the depth bar only; the forms here come from Button.why.json.
import { Avatar, Button, Card, IconButton, Stack, Tag } from 'pane-react';
import { IconMore, IconShare, IconPencil } from '../icons';
import type { Depth } from './types';

const Foot = ({ children }: { children: React.ReactNode }) => <div className="demo-row">{children}</div>;
// text over a photo is only measured readable on glass, so a row shown on its own sits on a pane
const OnPane = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card"><div className="demo-row">{children}</div></Card>;

const Profile = ({ children }: { children: React.ReactNode }) => (
  <Card as="section" aria-label="Profile" className="demo-card">
    <Stack direction="row" gap="md" align="center">
      <Avatar name="Mara Lind" size="md" decorative />
      <div><h3 className="flush">Mara Lind</h3><p className="flush muted small">Landscape photographer · Bergen</p></div>
    </Stack>
    {children}
  </Card>
);

export const BUTTON: Depth = {
  overview: (
    <>
      <p>A button starts something on the spot. Following a person, saving a draft, sending a message and opening a player are all buttons, because each one changes state where the reader already is. Moving somewhere else is a link, even when it looks important. The test is what happens after the press. If the address bar changes, it was a link.</p>
      <p>On a pane the button is the part people reach for, so it carries most of the hierarchy. A pane should hold one loud button and as many quiet ones as it needs. That rule, from P5, decides more layouts than any spacing value does. When two actions feel equally important, the pane usually has two jobs and should be split into two panes.</p>
      <p>A button keeps no state of its own. Follow that turns into Following after the press is two buttons in turn, swapped by the app, each with its own label. When the control has to show on or off and keep showing it, such as a filter or a favourite, use a Chip, which carries <code>aria-pressed</code> and a check mark. A Button that changes colour to say it is on leaves screen reader users guessing.</p>
      <p>Pane has three weights. <code>light</code> is the solid pill that inverts with the theme. <code>accent</code> is the one blue in the system, kept for an action the product promotes. <code>glass</code> is the quiet fill for everything else. There are two heights, 44px for anything a thumb will press and 32px for rows where several actions share a line.</p>
    </>
  ),
  whenToUse: [
    'The main action a pane exists for, such as Follow on a profile or Send on a message.',
    'Secondary actions beside it, such as Message, Cancel or Not now, in the glass weight.',
    'Confirming or dismissing a choice inside a card, where the result happens on this screen.',
    'Submitting a form, with type="submit" set explicitly because Pane defaults to type="button".',
  ],
  whenNot: [
    { situation: 'The action goes to another page or opens a URL', to: '/foundations/typography', label: 'A text link' },
    { situation: 'The action is a familiar icon in a dense row (share, more, close)', to: '/components/icon-button', label: 'IconButton' },
    { situation: 'The choice switches between views of the same content', to: '/components/tabs', label: 'Tabs' },
    { situation: 'The choice turns a filter on and off and stays visible as selected', to: '/components/chip', label: 'Chip' },
    { situation: 'The thing only labels or counts and nothing happens on press', to: '/components/tag', label: 'Tag' },
  ],
  variants: {
    light: { purpose: 'The one main action of a pane. White with ink text in the dark theme and ink with white text in the light theme, so it stays the loudest mark on the pane in both.', pairing: 'At most one per pane. Pair it with any number of glass buttons. Never beside accent.' },
    accent: { purpose: 'An action the product promotes on purpose, such as Get verified or Go live. It is the only place the system spends its blue.', pairing: 'Replaces light on that pane rather than joining it. Glass buttons sit beside it as usual.' },
    glass: { purpose: 'Every secondary action. A translucent pill that reads as an object on the pane without competing with the loud one.', pairing: 'As many as the pane needs, beside one light or one accent, or alone when no action leads.' },
  },
  anatomy: {
    render: <OnPane><Button><IconShare className="btn-icon" />Share profile</Button></OnPane>,
    parts: [
      { part: 'Container', selector: '[data-component="Button"]', what: 'A full pill (corner.round) because a control is held. Height comes from the size, width from the label plus padding.' },
      { part: 'Leading icon', selector: '[data-component="Button"] svg', what: 'Optional and decorative. 16px, inherits the label colour, sits one gap (8px, gap.md) before the label.' },
      { part: 'Label', selector: '[data-component="Button"]', what: 'Semibold, 15px at md and 14px at sm. Solid fills drop the text halo because they already contrast with their own fill.' },
      { part: 'Shadow', selector: '[data-component="Button"]', what: 'light and accent cast elevation.lift. Glass casts none, since a quiet object does not rise off the pane.' },
    ],
    perVariant: 'All three variants share the same parts. Glass has no shadow, and only accent changes its fill on hover.',
  },
  sizes: {
    md: { use: 'The default for every action a finger might press, including every action on a phone. 44px tall, which is P6\'s minimum target.', pairs: 'Body text at 15px, Select md and Tabs. Two md buttons sit 8px apart.' },
    sm: { use: 'Dense rows such as a toolbar, a list row with its own action, or a card footer that already holds three actions. 32px tall, with no larger press area yet, which is below the 44px P6 asks for (see Limitations). Avoid it on phones.', pairs: 'Label text at 14px, Select sm, IconButton sm and Chip. Keep 8px between neighbours so each still reads as its own object.' },
  },
  emphasis: {
    text: (
      <>
        <p>A pane gets one loud button. The light variant is the default loud one. Accent takes its place when the action is something the product promotes, and then the pane has no light button at all. Everything else is glass.</p>
        <p>Two equal calls to action make the reader stop and compare. That pause is the cost P5 exists to avoid. If a pane really has two primary jobs, give each job its own pane so each can have its own loud button.</p>
        <p>The loud button is also the default focus when a pane opens as a dialog or sheet, so a keyboard user lands where a pointer user would look first.</p>
        <p>Destructive actions need care because Pane has no danger variant yet. A delete that is the reason the pane exists, such as Delete account on a confirmation pane, can be the light button, with the consequence written above it in plain words. A delete that sits among other actions stays glass. Red paint alone would not make the action safer, and the confirmation text is what stops a mistake.</p>
      </>
    ),
    pair: {
      do: <Profile><Foot><Button>Follow</Button><Button variant="glass">Message</Button></Foot></Profile>,
      doNote: 'One light button, and the secondary action in glass.',
      dont: <Profile><Foot><Button>Follow</Button><Button variant="accent">Message</Button></Foot></Profile>,
      dontNote: 'Light and accent side by side. Two loud marks cancel each other out.',
    },
  },
  placement: {
    rows: [
      ['Foot of a card', 'The default. The loud action comes first on the start side, quiet ones follow. Most panes end this way.'],
      ['Beside a title', 'An action about the whole pane, such as Edit on a profile header. Use sm so it does not outweigh the title.'],
      ['Inside a list row', 'An action on that one item, such as Remove on a member. Use sm glass at the end of the row.'],
      ['Full width at the bottom', 'One decisive action on a narrow pane, such as Continue on a phone sheet. Only when the pane has a single action.'],
      ['Toolbar', 'A row of related tools. Prefer IconButton for familiar icons and keep text buttons for actions with no clear icon.'],
      ['End of a form', 'Submit sits after the last field, on the start side, with Cancel beside it in glass. Set type="submit" so Enter in a field submits.'],
      ['Confirmation pane', 'The consequence is written first, then the action named after it, then the way out. Keep editing beats Cancel.'],
    ],
    examples: [
      { title: 'Foot of a card', render: <Card as="section" aria-label="Draft" className="demo-card"><h3 className="flush">Discard draft?</h3><p className="flush muted">Your changes to Lauterbrunnen trip will be lost.</p><Foot><Button>Keep editing</Button><Button variant="glass">Discard</Button></Foot></Card> },
      { title: 'Beside a title', render: <Card as="section" aria-label="About" className="demo-card"><div className="component-head"><h3 className="flush">About</h3><Button size="sm" variant="glass"><IconPencil className="btn-icon" />Edit</Button></div><p className="flush muted">Shoots fjords at blue hour. Prints on request.</p></Card> },
      { title: 'Inside a list row', render: <Card as="section" aria-label="Members" className="demo-card"><ul className="flush settings-list">{['Ada Park', 'Jonas Berg'].map((n) => <li key={n} className="settings-row"><span>{n}</span><Button size="sm" variant="glass">Remove</Button></li>)}</ul></Card> },
    ],
  },
  combinations: {
    good: [
      ['light + glass', 'The standard pair. Main action and its alternative, such as Follow and Message.'],
      ['light + glass + glass', 'A main action with two quiet alternatives. Past three actions, move the rest into a More menu.'],
      ['accent + glass', 'A promoted action with a way out, such as Get verified and Not now.'],
      ['glass + glass', 'A pane where no action leads, such as Share and Copy link on a post.'],
      ['Button + IconButton', 'A labelled main action with familiar tools beside it, such as Follow next to Share and More.'],
    ],
    avoid: [
      { title: 'light + light', why: 'Two loud buttons give the reader a choice with no answer. Make one of them glass.', render: <OnPane><Button>Save</Button><Button>Publish</Button></OnPane> },
      { title: 'light + accent', why: 'Accent replaces light. Shown together they compete and the blue looks like a mistake.', render: <OnPane><Button>Follow</Button><Button variant="accent">Subscribe</Button></OnPane> },
      { title: 'Four or more in a row', why: 'Past three the reader scans instead of choosing. Keep the main one and move the rest behind More.', render: <OnPane><Button size="sm">Save</Button><Button size="sm" variant="glass">Copy</Button><Button size="sm" variant="glass">Move</Button><Button size="sm" variant="glass">Rename</Button><Button size="sm" variant="glass">Archive</Button></OnPane> },
    ],
  },
  content: {
    formula: (
      <>
        <p>A label is a verb, or a verb and its object, in sentence case. One or two words is normal and four is the most. Name the result the reader gets (Delete post, Save changes) and leave out the gesture (Click here) and the obvious (Submit form).</p>
        <p>Order follows importance. The loud action comes first in reading order and the way out comes last, so in left-to-right layouts the main action is on the left, which is where a reader starts. Pane does not flip the order between platforms. One rule across every pane is easier to learn than two.</p>
        <p>Match the label to the question it answers. A dialog that asks Discard draft? gets Discard and Keep editing, so the reader never has to map OK and Cancel back to the question. Keep a brand name out of a label unless it is the object, as in Connect Spotify.</p>
      </>
    ),
    pair: {
      do: <OnPane><Button>Delete post</Button><Button variant="glass">Keep it</Button></OnPane>,
      doNote: 'The labels repeat the decision, so the reader can answer without rereading the question.',
      dont: <OnPane><Button>OK</Button><Button variant="glass">Cancel</Button></OnPane>,
      dontNote: 'OK and Cancel make the reader go back to the question to work out what each one does.',
    },
    overflow: { text: 'A button never truncates its label, because a cut verb can change the meaning. A long label wraps onto a second line inside the pill and the pill grows in height. If that happens often, the label is too long.', render: <div className="overflow-probe" data-overflow-demo=""><Card as="div" className="demo-card"><Button>Save changes to the shared Lauterbrunnen album</Button></Card></div> },
    rtl: { text: 'In right-to-left languages the whole row mirrors. The loud action moves to the right edge, which is the start side, and a leading icon moves to the right of its label. Pane uses logical properties, so nothing needs a separate stylesheet.', render: <div dir="rtl" lang="ar"><Card as="div" className="demo-card"><div className="demo-row"><Button><IconShare className="btn-icon" />مشاركة الملف</Button><Button variant="glass">إلغاء</Button></div></Card></div> },
    expansion: { text: 'Translated labels run about 30% longer than English on average, and German or Finnish often run longer still. The demo shows Follow and Message at their German length so you can see the row still fits.', render: <OnPane><Button>Folgen</Button><Button variant="glass">Nachricht senden</Button></OnPane> },
  },
  behaviours: {
    states: [
      ['Default', 'Pill at rest in its variant fill.', 'Nothing moves on its own (P4).'],
      ['Hover', 'Rises 2px over 420ms on the soft ease. Accent darkens at the same pace.', 'An object rising to meet the pointer, colour and lift as one event (P4).'],
      ['Pressed', 'Shrinks to 97% over 200ms.', 'A press is a reply, so it answers faster than an arrival (P4).'],
      ['Focus', '2px white ring 2px outside the pill with a dark halo.', 'Visible on any part of any scene (P2, P6).'],
      ['Disabled', 'Native disabled attribute, 50% opacity, no motion, not focusable.', 'Write the reason in text nearby, since nobody can focus it to find out (P6).'],
      ['Forced colours', 'Fills drop and a ButtonText border draws the shape.', 'Structure survives without glass (P6).'],
    ],
    interactions: [
      ['Mouse', 'Click', 'Runs the action on release, so a press can be cancelled by dragging off.', 'Native button'],
      ['Keyboard', 'Tab', 'Moves focus to the button.', 'Button: reachable with Tab'],
      ['Keyboard', 'Enter', 'Runs the action as soon as the key goes down.', 'Button: Enter and Space activate it'],
      ['Keyboard', 'Space', 'Runs the action when the key comes up.', 'Button: Enter and Space activate it'],
      ['Touch', 'Tap', 'Runs the action. md is 44px and meets the touch floor; sm is 32px and does not yet.', 'Native button'],
    ],
    loading: (
      <>
        <p>Pane has no built-in loading state yet. It is on the roadmap behind a derivation round, because a spinner inside a pill is exactly the kind of pattern-library default the concept asks us to question first.</p>
        <p>A press must never run twice. Pane leaves that to the app, because only the app knows when the action has finished. The simplest guard is to disable the button from the first press until the result comes back, which also stops a double tap on a slow phone from sending the same message twice.</p>
        <p>Until then, keep the label, set <code>aria-busy="true"</code> on the button and disable it while the action runs, and report the outcome in a live region or a Banner. Never swap the label for a spinner alone, because the button loses its name for screen readers and its width jumps.</p>
      </>
    ),
    focus: <p>When a pane opens as a dialog or sheet, focus goes to its loud button. Closing the pane sends focus back to the control that opened it. Nothing is lost. A button that removes its own row should move focus to the next row, or to the list heading when the list is empty.</p>,
  },
  deepDive: {
    light: {
      purpose: <p>The light button is the reason the pane exists. It inverts with the theme so it always carries the strongest contrast on the pane. Over dark glass it is white with ink text. Over light glass it turns ink with white text. It casts the lift shadow, the only shadow inside a pane, which says it sits on top of the glass.</p>,
      context: <Profile><Foot><Button>Follow</Button><Button variant="glass">Message</Button><IconButton aria-label="More options" variant="glass"><IconMore /></IconButton></Foot></Profile>,
      practices: ['Put it first in reading order, on the start side of the row.', 'Use it for the action most readers came to take, even when another action is more profitable.', 'Keep it on panes that have a clear next step. A pane of equal options gets glass buttons only.'],
      pair: {
        do: <Card as="div" className="demo-card"><h3 className="flush">Upload finished</h3><Foot><Button>View album</Button><Button variant="glass">Share</Button></Foot></Card>,
        doNote: 'The light button is the step most people take next.',
        dont: <Card as="div" className="demo-card"><h3 className="flush">Upload finished</h3><Foot><Button variant="glass">View album</Button><Button>Delete upload</Button></Foot></Card>,
        dontNote: 'The loudest button is the destructive one nobody came for.',
      },
    },
    accent: {
      purpose: <p>Accent is the only blue mark the system makes. It exists for one promoted action, such as Get verified or Go live, where the product wants the action to stand out from the ordinary main action. Blue is scarce in Pane. So it reads as deliberate, and used often it stops reading as anything.</p>,
      context: <Card as="section" aria-label="Verification" className="demo-card"><div className="component-head"><h3 className="flush">Get the blue check</h3><Tag>New</Tag></div><p className="flush muted">Verified accounts show up first in search and in replies.</p><Foot><Button variant="accent">Get verified</Button><Button variant="glass">Not now</Button></Foot></Card>,
      practices: ['Use at most one accent button on a screen, and not on every screen.', 'Let accent replace light on its pane. Never show the two together.', 'Keep accent away from destructive actions. Blue reads as encouragement.'],
      pair: {
        do: <Card as="div" className="demo-card"><Foot><Button variant="accent">Go live</Button><Button variant="glass">Schedule</Button></Foot></Card>,
        doNote: 'One promoted action with a quiet alternative.',
        dont: <Card as="div" className="demo-card"><Foot><Button variant="accent">Go live</Button><Button variant="accent">Schedule</Button></Foot></Card>,
        dontNote: 'Two accent buttons. Neither one is promoted any more.',
      },
    },
    glass: {
      purpose: <p>Glass is the working weight. It is a translucent pill with an 8% white fill, enough to read as an object on the pane while the photo still shows through. It casts no shadow and does not change colour on hover, so a row of glass buttons stays calm around the one loud action.</p>,
      context: <Card as="article" aria-label="Post" className="demo-card"><p className="flush">Blue hour over Bergen harbour, shot from Fløyen.</p><Foot><Button size="sm" variant="glass"><IconShare className="btn-icon" />Share</Button><Button size="sm" variant="glass">Copy link</Button><Button size="sm" variant="glass">Save</Button></Foot></Card>,
      practices: ['Use glass for Cancel, Not now and every other way out, so leaving never looks like the recommended path.', 'Use glass for every action that is not the main one.', 'A pane with no clear main action uses glass only.', 'Glass still needs a verb label. Quiet is about weight, never about vagueness.'],
      pair: {
        do: <Card as="div" className="demo-card"><Foot><Button>Save changes</Button><Button variant="glass">Cancel</Button></Foot></Card>,
        doNote: 'Cancel is glass, so Save is clearly the way forward.',
        dont: <Card as="div" className="demo-card"><Foot><Button variant="glass">Save changes</Button><Button variant="glass">Cancel</Button></Foot></Card>,
        dontNote: 'Both glass on a pane that has an obvious next step. The reader has to read both to find it.',
      },
    },
  },
  modifiers: [
    {
      name: 'Leading icon',
      rules: <p>Pass an icon as the first child with the <code>btn-icon</code> class. It is decorative, so it needs no label of its own, and the button's text stays its name. Use an icon only when it is the familiar one for that action (share, edit, download). If the action has no well-known icon, leave it out. An icon that has to be learned slows the reader down.</p>,
      pair: {
        do: <OnPane><Button variant="glass"><IconShare className="btn-icon" />Share</Button></OnPane>,
        doNote: 'The share icon is the familiar one and the label still says what happens.',
        dont: <OnPane><Button variant="glass"><IconPencil className="btn-icon" />Share</Button></OnPane>,
        dontNote: 'A pencil on a share button. The icon contradicts the label.',
      },
    },
    {
      name: 'Icon only',
      rules: <p>Button always has a text label. When the action is a single familiar icon, use IconButton, which requires an <code>aria-label</code> and gives the icon a 44px hit area.</p>,
      pair: {
        do: <OnPane><IconButton aria-label="Share" variant="glass"><IconShare /></IconButton></OnPane>,
        doNote: 'IconButton, with its accessible name from aria-label.',
        dont: <OnPane><Button variant="glass" aria-label="Share"><IconShare className="btn-icon" /></Button></OnPane>,
        dontNote: 'A Button emptied out to hold an icon. It loses its hit area and its visible name.',
      },
    },
    {
      name: 'Full width',
      rules: <p>Pane has no fullWidth prop yet. On a narrow pane with a single action, a layout wrapper can stretch the button across the full inline size of the pane. Only stretch a lone action. A stretched pair turns two choices into two bars and loses the start-side order.</p>,
      pair: {
        do: <Card as="div" className="demo-card"><h3 className="flush">Ready to post</h3><Button style={{ inlineSize: '100%' }}>Post</Button></Card>,
        doNote: 'One action on a narrow pane, stretched across it.',
        dont: <Card as="div" className="demo-card"><Button style={{ inlineSize: '100%' }}>Post</Button><Button variant="glass" style={{ inlineSize: '100%' }}>Save draft</Button></Card>,
        dontNote: 'Two stretched buttons stack into bars and the choice stops reading as a pair.',
      },
    },
    {
      name: 'Disabled',
      rules: <p>Use the native <code>disabled</code> attribute and write the reason next to the button. Prefer leaving a button enabled and explaining what is missing after the press, because a disabled button cannot be focused and so cannot explain itself to a keyboard or screen reader user.</p>,
      pair: {
        do: <Card as="div" className="demo-card"><Foot><Button disabled>Publish</Button></Foot><p className="flush muted small">Add a cover photo to publish.</p></Card>,
        doNote: 'Disabled, with the reason written right under it.',
        dont: <Card as="div" className="demo-card"><Foot><Button disabled>Publish</Button></Foot></Card>,
        dontNote: 'Disabled with no reason. Nobody can find out what is missing.',
      },
    },
  ],
  related: [
    ['/components/icon-button', 'IconButton', 'The action is a familiar icon in a dense row.'],
    ['/components/chip', 'Chip', 'The control toggles a filter and stays visibly selected.'],
    ['/components/tabs', 'Tabs', 'The choice switches views of the same content.'],
    ['/components/banner', 'Banner', 'Reporting the outcome of an action after it runs.'],
    ['/foundations/motion', 'Motion', 'The hover and press timings the button uses.'],
  ],
  references: [
    { title: 'Apple Human Interface Guidelines · Buttons', url: 'https://developer.apple.com/design/human-interface-guidelines/buttons', why: 'Pane\'s lineage. Sizes, roles and the advice to keep one prominent button.' },
    { title: 'WAI-ARIA Authoring Practices · Button pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'Keyboard behaviour Pane relies on from the native element.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'The floor under the sm size and the spacing rule between small buttons.' },
    { title: 'Nielsen Norman Group · OK and Cancel button order', url: 'https://www.nngroup.com/articles/ok-cancel-or-cancel-ok/', why: 'Research behind labelling buttons with the action instead of OK and Cancel.' },
  ],
};
