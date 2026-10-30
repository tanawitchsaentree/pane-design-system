// Usage tabs for the W3 form family (component-depth.md U1–U14). The form language is D-020, the well in
// the pane, picked by the user from apps/lab/forms. Every pair below is live and sits on a glass card.
import { useState } from 'react';
import { Button, Card, Checkbox, Fieldset, FormField, HelperText, Input, InputGroup, Label, PinInput, Radio, RadioGroup, Stack, Switch, Textarea } from 'pane-react';
import type { Depth, NotApplicable } from './types';

const P = ({ children, title }: { children: React.ReactNode; title?: string }) => <Card as="div" className="demo-card">{title && <h3 className="flush">{title}</h3>}{children}</Card>;
const Row = ({ children }: { children: React.ReactNode }) => <div className="demo-row">{children}</div>;
const NO_EMPHASIS: NotApplicable = { na: 'A field carries no emphasis of its own. The pane’s loud Button submits it, and the field stays quiet so the reader can fill it in.' };
const REFS_FIELD = [
  { title: 'WAI · Forms tutorial', url: 'https://www.w3.org/WAI/tutorials/forms/', why: 'Labels, instructions, grouping and error messages, the basis for FormField.' },
  { title: 'Apple Human Interface Guidelines · Text fields', url: 'https://developer.apple.com/design/human-interface-guidelines/text-fields', why: 'Pane’s lineage for fields on glass.' },
  { title: 'Nielsen Norman Group · Placeholders in form fields are harmful', url: 'https://www.nngroup.com/articles/form-design-placeholders/', why: 'Why the label stays visible and examples go in the help text.' },
];

function OrderForm() {
  const [email, setEmail] = useState('mara.example.com');
  const bad = !email.includes('@');
  return (
    <P title="Order a print">
      <FormField label="Email" required error={bad ? 'Enter an email address with an @, such as mara@example.com.' : undefined} help="We send the receipt here.">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </FormField>
      <Row><Button disabled={bad}>Order print</Button></Row>
    </P>
  );
}

export const INPUT: Depth = {
  overview: (
    <>
      <p>An input takes one line of text, such as a name, an email, a search or a price. In Pane it is a groove cut into the glass. Its floor is the surface dimmed, never an opaque box (P1); shade sits under its top lip and light runs along its bottom lip, the way a groove in glass catches light (P3). That lit lip is also the field’s edge, and it measures at least 3:1 against what is around it on glass and on plain pages, in both themes, so a search field never disappears into a white panel. It is a full pill because a control is held (P3).</p>
      <p>The label always sits above the field and stays there. A floating label that moves into the field when empty, the habit D-020 rejects, makes the reader guess whether the field is filled, and its shrunken text is hard to read on a busy photo.</p>
      <p>Input reads its id, its description and its invalid state from the FormField around it, so the label, help and error are wired for screen readers without the app passing ids. Used alone it needs an aria-label.</p>
      <p>Put the field in a FormField and the rest is wired for you. Its <code>required</code> prop sets the native required attribute and makes the label say (required) in words. Its <code>error</code> prop marks the input invalid, draws the 2px critical ring and puts the message under the field with a glyph. A screen reader hears the error before the help, starting with the word Error. The reader learns what is wrong before the hint.</p>
      <p>The field is 44px tall at md, with 12px of space inside each end and 15px text. At sm it is 32px with 14px text. It fills the width of its column. When the expected value is short, such as a postcode or a card’s expiry date, make the column narrower so the field’s length hints at the answer. A four-digit field stretched across a page invites a guess at what goes there.</p>
      <p>Pane draws no reveal button for a password and no clear button of its own. A password is a native input with <code>type="password"</code>. Anything inside the well, such as a unit or an icon, comes from InputGroup.</p>
    </>
  ),
  whenToUse: ['A single line of free text, such as a name, an email or a title.', 'A number people type exactly, with inputMode set for the phone keyboard.', 'A search field, inside an InputGroup with a search icon.', 'A number that is really a code, such as a postcode or a card number, with inputMode numeric and no spinner.', 'Details the reader may want to copy, such as an account ID, set read-only.'],
  whenNot: [
    { situation: 'More than one line of text', to: '/components/textarea', label: 'Textarea' },
    { situation: 'One of a few known values', to: '/components/radio', label: 'RadioGroup' },
    { situation: 'One of many known values', to: '/components/select', label: 'Select' },
    { situation: 'A short code', to: '/components/pin-input', label: 'PinInput' },
    { situation: 'A value along a range', to: '/components/slider', label: 'Slider' },
  ],
  variants: { na: 'Input has no variant prop. The same groove is used on glass and on plain pages, and its edge is measured in both.' },
  anatomy: {
    render: <P><FormField label="Display name" help="Shown on your profile."><Input defaultValue="Mara Lind" /></FormField></P>,
    parts: [
      { part: 'Label', selector: '[data-component="Label"]', what: 'From the FormField, above the field, semibold. It is the accessible name.' },
      { part: 'Well', selector: '[data-component="Input"]', what: 'A full-pill groove with a dimmed floor, shade under the top lip, a lit bottom lip and a ring, with the edge at 3:1 or more.' },
      { part: 'Help', selector: '[data-component="HelperText"]', what: 'Secondary text under the field, tied to it with aria-describedby.' },
    ],
  },
  sizes: {
    md: { use: '44px tall. The default and the only size for phones and forms.', pairs: 'Button md, Select md and 15px body text.' },
    sm: { use: '32px tall. Dense desktop toolbars and inline filters used with a pointer. It is the one control below the 44px press area P6 asks for, an open exception (E-002), so use md on touch screens.', pairs: 'Button sm, Select sm and Chip.' },
  },
  emphasis: NO_EMPHASIS,
  placement: {
    rows: [['In a form on a settings page', 'The default. One field per row, label above, full width of the column.'], ['On a glass card', 'Short forms only, such as a reply or a sign-in, two or three fields.'], ['In a toolbar', 'sm, inside an InputGroup with a search icon.'], ['Label above, start edges aligned', 'One field per row, its start edge in line with the fields above and below, so the eye runs straight down the form.'], ['Two fields on one row', 'Only on wide screens, and only when they are one value in two parts, such as a card’s expiry and its code.'], ['In a dense table or toolbar', 'sm with a pointer only. Never on a phone form.']],
    examples: [
      { title: 'A short form on glass', render: <OrderForm /> },
      { title: 'A reply', render: <P><FormField label="Reply to Mara"><Input placeholder="Write a reply" /></FormField><Row><Button size="sm">Send</Button></Row></P> },
    ],
  },
  combinations: {
    good: [['FormField + Input', 'Every text field.'], ['InputGroup + Input', 'A unit, icon or clear button inside the well.'], ['Fieldset + FormFields', 'Fields that belong together, such as an address.'], ['Input + Button', 'The field and the action that uses it, such as a search and its Go.']],
    avoid: [
      { title: 'a placeholder as the only label', why: 'The name disappears as soon as someone types, and screen readers may not read it.', render: <P><Input aria-label="Email" placeholder="Email" /></P> },
      { title: 'two fields on one row on a phone', why: 'Each gets too narrow to read its value. Stack them.', render: <P><Stack direction="row" gap="sm"><Input aria-label="First name" defaultValue="Mara" /><Input aria-label="Last name" defaultValue="Lind" /></Stack></P> },
      { title: 'the small size on a phone form', why: 'At 32px the field is below the 44px press area, the open exception E-002. A thumb aimed at it can easily miss. Use md.', render: <P><FormField label="Email"><Input size="sm" type="email" defaultValue="mara@example.com" /></FormField></P> },
    ],
  },
  content: {
    formula: (
      <>
        <p>The label is a noun or short phrase in sentence case, such as Email or Display name. Put instructions and examples in the help text, because placeholder text disappears as soon as the reader types and is too faint to rely on. Say Optional in the help when most fields are required, and mark the few required ones when most are optional.</p>
        <p>An error says how to fix the value, such as Enter an email address with an @. Show it when the reader leaves the field or submits, never while they are still typing their first character.</p>
        <p>Once a field has shown an error, check it again as the reader types, so the message goes away the moment the value is right. After a failed submit, show every error at once and move focus to the first.</p>
        <p>Set <code>autoComplete</code> on every field that asks for something the browser already knows, such as name, email, tel, postal-code or one-time-code. On a phone that turns a long form into a few taps.</p>
        <p>Email addresses, web addresses and phone numbers read left to right in every language. In a right-to-left form, set <code>dir="ltr"</code> on those fields so the value does not jump about as the reader types.</p>
      </>
    ),
    pair: { do: <P><FormField label="Email" help="For example, mara@example.com."><Input type="email" /></FormField></P>, doNote: 'A label above and the example in the help.', dont: <P><FormField label="Email"><Input type="email" placeholder="e.g. mara@example.com (required, no spaces)" /></FormField></P>, dontNote: 'Instructions in the placeholder vanish as soon as someone types.' },
    overflow: { text: 'A long value scrolls inside the field and never makes it wider. The full value is always there when the reader moves through it.', render: <div data-overflow-demo="" className="overflow-probe"><P><FormField label="Album"><Input defaultValue="Lysefjord at dawn, shared with family and friends" /></FormField></P></div> },
    rtl: { text: 'In right-to-left languages the text starts at the right and the label aligns right above it.', render: <div dir="rtl" lang="ar"><P><FormField label="الاسم"><Input defaultValue="مارا ليند" /></FormField></P></div> },
    expansion: { text: 'A German label wraps above the field. The field keeps its width.', render: <P><FormField label="Anzeigename auf deinem Profil"><Input defaultValue="Mara Lind" /></FormField></P> },
  },
  behaviours: {
    states: [
      ['Rest', 'A groove with a lit bottom lip.', 'A recess in the glass that reads as part of the pane (P1).'],
      ['Hover', 'A hairline ring joins the groove over 420ms.', 'An answer to the pointer that moves nothing (P4).'],
      ['Focus', 'The shared 2px ring and halo outside the well.', 'Visible on any part of any scene (P2).'],
      ['Invalid', 'A 2px ring in the critical mark colour, and the error under the field.', 'The glyph and the word Error carry it as well as the colour (P6).'],
      ['Read-only', 'The well empties to a hairline, the value stays readable and selectable.', 'The value is there to read and copy.'],
      ['Disabled', 'Faded to the disabled opacity.', 'Write the reason in the help (P6).'],
      ['On a page', 'The same groove, measured against the page.', 'One field everywhere, findable on white (P2).'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus into the field.', 'Input: reachable with Tab and labelled by its FormField'],
      ['Keyboard', 'Enter', 'Submits the form it is in.', 'Native input'],
      ['Touch', 'Tap', 'Focuses and opens the keyboard set by inputMode.', 'Native input'],
    ],
    loading: <p>While the app checks a value, such as whether a username is free, keep the field editable and say Checking in the help text. Replace it with the result, an error if it fails.</p>,
    focus: <p>After a failed submit, move focus to the first field with an error, so a keyboard or screen reader user lands on what needs fixing and hears the error.</p>,
  },
  deepDive: { na: 'Input has no variant prop, so there is nothing to compare. Sizes and states are covered above.' },
  modifiers: [
    { name: 'Type and inputMode', rules: <p>Set <code>type</code> to email, url, tel or search so browsers validate and fill it, and <code>inputMode</code> so phones show the right keyboard, such as numeric for a postcode.</p>, pair: { do: <P><FormField label="Postcode"><Input inputMode="numeric" autoComplete="postal-code" defaultValue="5003" /></FormField></P>, doNote: 'Numbers keyboard and autofill.', dont: <P><FormField label="Postcode"><Input defaultValue="5003" /></FormField></P>, dontNote: 'A plain text keyboard for a number.' } },
    { name: 'Read-only', rules: <p>Use <code>readOnly</code> for a value the reader can see and copy but not change. It drops the well so it does not invite typing.</p>, pair: { do: <P><FormField label="Username" help="Cannot be changed after 30 days."><Input readOnly defaultValue="maralind" /></FormField></P>, doNote: 'Read-only, with the reason.', dont: <P><FormField label="Username"><Input disabled defaultValue="maralind" /></FormField></P>, dontNote: 'Disabled hides the value from screen readers that skip disabled fields.' } },
  ],
  related: [['/components/form-field', 'FormField', 'The label, help and error.'], ['/components/textarea', 'Textarea', 'More than one line.'], ['/components/input-group', 'InputGroup', 'Units and icons.'], ['/patterns/forms', 'Forms', 'Putting fields together.']],
  references: REFS_FIELD,
};

export const TEXTAREA: Depth = {
  ...INPUT,
  overview: <><p>A textarea takes text that runs over several lines, such as a bio, a reply or a note to a printer. It is Input’s well with the media corner, because a field that grows cannot stay a pill, and the media corner nests inside the pane’s corner (P3).</p><p>Start it at three rows so it looks like room for more than a line. The reader can resize it taller.</p></>,
  whenToUse: ['A bio, a reply, a description or a note.', 'Any text the reader may want to break into lines.'],
  whenNot: [{ situation: 'One line', to: '/components/input', label: 'Input' }, { situation: 'Formatted text with links and lists', to: '/reference/status', label: 'RichTextEditor (planned, wave 10)' }],
  variants: { na: 'Textarea has no variant prop.' },
  anatomy: { render: <P><FormField label="Bio" help="Up to 160 characters."><Textarea defaultValue="Landscape photographer in Bergen." /></FormField></P>, parts: [{ part: 'Label', selector: '[data-component="Label"]', what: 'Above, from the FormField.' }, { part: 'Well', selector: '[data-component="Textarea"]', what: 'Dimmed recess with the media corner.' }, { part: 'Help', selector: '[data-component="HelperText"]', what: 'The limit, before the reader reaches it.' }] },
  sizes: { na: 'Textarea has one size. Set rows for its starting height.' },
  placement: { rows: [['In a form', 'Under the fields it relates to.'], ['On a post', 'A reply box under the post.']], examples: [{ title: 'A reply box', render: <P><FormField label="Reply"><Textarea rows={2} placeholder="Write a reply" /></FormField><Row><Button size="sm">Send</Button></Row></P> }] },
  combinations: { good: [['FormField + Textarea', 'Every multi-line field.']], avoid: [{ title: 'one row for a bio', why: 'It looks like an Input and invites a single line.', render: <P><FormField label="Bio"><Textarea rows={1} /></FormField></P> }] },
  content: {
    formula: <p>Say the limit in the help text before the reader reaches it, such as Up to 160 characters. When they pass it, the error says by how much, such as It is 174 now.</p>,
    pair: { do: <P><FormField label="Bio" help="Up to 160 characters."><Textarea /></FormField></P>, doNote: 'The limit is known up front.', dont: <P><FormField label="Bio"><Textarea /></FormField></P>, dontNote: 'The limit is a surprise at submit.' },
    overflow: { text: 'Long text wraps and the field scrolls once it is full. The reader can drag it taller.', render: <div data-overflow-demo="" className="overflow-probe"><P><Textarea aria-label="Note" defaultValue="Please print on cotton rag with a 10 mm border, and ship to the studio rather than the home address this time." /></P></div> },
    rtl: { text: 'Right-to-left text starts at the right and wraps leftwards.', render: <div dir="rtl" lang="ar"><P><Textarea aria-label="نبذة" defaultValue="مصورة مناظر طبيعية في بيرغن." /></P></div> },
    expansion: { text: 'German text simply wraps onto more lines.', render: <P><Textarea aria-label="Bio" defaultValue="Landschaftsfotografin in Bergen. Drucke auf Anfrage." /></P> },
  },
  behaviours: { ...INPUT.behaviours, interactions: [['Keyboard', 'Tab', 'Moves focus into the field.', 'Textarea: labelled by its FormField'], ['Keyboard', 'Enter', 'Adds a new line.', 'Native textarea']] },
  modifiers: { na: 'Textarea has no optional slots. Rows and resizing are native attributes.' },
};

const CheckRow = () => <P><Checkbox label="Show my email on my profile" description="Anyone who visits your profile can see it." defaultChecked /></P>;

export const CHECKBOX: Depth = {
  overview: (
    <>
      <p>A checkbox turns one choice on or off, and the choice takes effect when the form is saved. Several checkboxes in a list are independent, so any number can be on. The box is a 24px well with soft corners, square enough to read differently from a round radio.</p>
      <p>Checked holds a check and mixed holds a dash, so each of the three states has its own shape (P6). The label is a real label, so clicking the words toggles the box, and the row is at least 44px tall, so the whole line is the target.</p>
      <p>Use a Switch instead when the change takes effect at once. A checkbox promises nothing happens until Save.</p>
      <p>Pane does not link a parent to its children. The app counts the children and passes <code>checked="indeterminate"</code> to the parent when some are on. A click on a mixed box reports true, and the app then checks every child. Each child stays a checkbox of its own.</p>
      <p>Give the box a <code>name</code> and a <code>value</code> and it goes with a native form submit, sending on by default when it is checked. The <code>required</code> prop marks it required for the form and for assistive tech. There is no error state yet. If a box must be checked before the reader can go on, such as accepting terms, say so in its description and say near the submit button why it cannot go on yet.</p>
    </>
  ),
  whenToUse: ['A choice saved with a form, such as accepting terms.', 'Several independent choices from a list, such as which emails to receive.', 'A parent that checks or clears a set of children.'],
  whenNot: [
    { situation: 'A setting that applies at once', to: '/components/switch', label: 'Switch' },
    { situation: 'One answer from a few', to: '/components/radio', label: 'RadioGroup' },
    { situation: 'A filter above results', to: '/components/chip', label: 'Chip' },
  ],
  variants: { na: 'Checkbox has no variant prop. Its three states are covered under Behaviours.' },
  anatomy: { render: <CheckRow />, parts: [{ part: 'Box', selector: '[data-component="Checkbox"] button', what: 'A 24px well with soft corners, inside a 44px target.' }, { part: 'Label', selector: '[data-component="Checkbox"] label', what: 'The choice, which also toggles the box.' }, { part: 'Description', selector: '[data-component="Checkbox"] label + span', what: 'Optional secondary line.' }], perVariant: 'Checked adds a check inside the box; mixed swaps it for a dash.' },
  sizes: { na: 'Checkbox has one size, a 24px box in a 44px row.' },
  emphasis: NO_EMPHASIS,
  placement: { rows: [['In a form', 'Under the fields, before the submit action.'], ['In a Fieldset', 'A list of related choices under a legend.']], examples: [{ title: 'A list in a Fieldset', render: <P><Fieldset legend="Email me about"><Checkbox label="New followers" defaultChecked /><Checkbox label="Replies" /></Fieldset></P> }] },
  combinations: { good: [['Fieldset + Checkboxes', 'Related choices under one name.'], ['Checkbox + Button', 'A choice saved with the form.']], avoid: [{ title: 'a checkbox that applies at once', why: 'The reader expects to press Save. Use a Switch.', render: <P><Checkbox label="Dark theme" /></P> }, { title: 'a list of choices running across one row', why: 'Boxes and labels drift apart, so it is not clear which label belongs to which box, and long labels push the rest off a phone screen.', render: <P><Row><Checkbox label="New followers" defaultChecked /><Checkbox label="Replies" /><Checkbox label="Mentions" /></Row></P> }] },
  content: {
    formula: <><p>Write the label as the choice, in sentence case and without ending punctuation, such as Show my email on my profile. Keep it positive, so checking turns something on, and avoid negatives such as Do not show my email.</p><p>Never check a box for the reader when it gives something away, such as marketing emails or sharing data. A default is a decision made on their behalf. Pre-check only choices the reader would almost always want and can see clearly, such as keeping a copy of a receipt.</p><p>Stack checkboxes one per row. Past seven or eight choices, split them under two legends. A screen reader reads the description after the label and its state, so put the consequence of the choice in the description and keep the label to the choice itself.</p></>,
    pair: { do: <P><Checkbox label="Show my email" /></P>, doNote: 'Checking turns it on.', dont: <P><Checkbox label="Do not hide my email" /></P>, dontNote: 'A double negative the reader has to untangle.' },
    overflow: { text: 'A long label wraps beside the box, and the box stays at the top of the first line.', render: <div data-overflow-demo="" className="overflow-probe"><P><Checkbox label="Email me when someone I follow posts a new album or print" /></P></div> },
    rtl: { text: 'In right-to-left languages the box sits to the right of its label.', render: <div dir="rtl" lang="ar"><P><Checkbox label="إظهار بريدي الإلكتروني" defaultChecked /></P></div> },
    expansion: { text: 'German labels wrap, and the box keeps its place.', render: <P><Checkbox label="Meine E-Mail-Adresse im Profil anzeigen" defaultChecked /></P> },
  },
  behaviours: {
    states: [['Unchecked', 'An empty well.', 'A recess waiting for a mark (P1).'], ['Checked', 'A check arrives and settles.', 'A shape says on (P6, P4).'], ['Mixed', 'A dash.', 'A third shape for a mixed parent (P6).'], ['Pressed', 'Shrinks slightly over 200ms.', 'A press is a reply (P4).'], ['Focus', 'The shared ring and halo.', 'Visible on any scene (P2).'], ['Disabled', 'Faded.', 'Say why in the description (P6).']],
    interactions: [['Keyboard', 'Tab', 'Moves focus to the box.', 'Checkbox: Space toggles it and the label is its name'], ['Keyboard', 'Space', 'Toggles it.', 'Checkbox: Space toggles it and the label is its name'], ['Mouse / touch', 'Click / tap', 'The box or the label toggles it.', 'Native label']],
    loading: <p>A checkbox has no loading state, because nothing happens until the form is saved.</p>,
    focus: <p>Focus stays on the box when it toggles.</p>,
  },
  deepDive: { na: 'Checkbox has no variant prop, so there is nothing to compare.' },
  modifiers: [
    { name: 'Description', rules: <p>Add <code>description</code> for a line that explains the consequence. It is read after the label.</p>, pair: { do: <CheckRow />, doNote: 'The consequence under the choice.', dont: <P><Checkbox label="Show my email on my profile so that anyone who visits can see it" /></P>, dontNote: 'The consequence crammed into the label.' } },
    { name: 'Mixed', rules: <p>Pass <code>checked="indeterminate"</code> to a parent when some, not all, of its children are checked. Checking it checks them all.</p>, pair: { do: <P><Checkbox label="Download everything" checked="indeterminate" /></P>, doNote: 'A dash for a mixed set.', dont: <P><Checkbox label="Download everything" checked /></P>, dontNote: 'Checked while half the children are off.' } },
  ],
  related: [['/components/switch', 'Switch', 'Applies at once.'], ['/components/radio', 'Radio', 'One answer.'], ['/components/fieldset', 'Fieldset', 'Grouping.']],
  references: [{ title: 'WAI-ARIA Authoring Practices · Checkbox pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/', why: 'Including the mixed state.' }, { title: 'Apple Human Interface Guidelines · Toggles', url: 'https://developer.apple.com/design/human-interface-guidelines/toggles', why: 'Pane’s lineage for on and off controls.' }],
};

const Who = ({ value = 'following' }: { value?: string }) => (
  <P><RadioGroup label="Who can message you" defaultValue={value}><Radio value="everyone" label="Everyone" /><Radio value="following" label="People you follow" /><Radio value="nobody" label="No one" /></RadioGroup></P>
);

export const RADIO: Depth = {
  overview: (
    <>
      <p>A radio group asks one question and shows every answer at once, so the reader can compare them before choosing. Only one can be chosen. Each option is a round 24px well, round so it never reads as a checkbox, and the chosen one holds a 10px dot that grows in and settles (P6, P4).</p>
      <p>The group is one tab stop. Arrow keys move between options and choose as they go, which is how radio groups work everywhere. Radix supplies that behaviour and Pane tests it.</p>
      <p>Every arrow key moves and chooses. In a left-to-right layout Up and Left go back and Down and Right go forward, and the last option wraps round to the first. Disabled options are skipped. Space chooses the focused option when it is not chosen yet. A screen reader hears the question, then the option and whether it is chosen.</p>
      <p>Set a default when one answer is safe for most readers, such as the current setting or the most common choice. With no default the group starts empty, and Tab lands on the first option. Once an answer is chosen the group cannot go back to empty. If having no answer is valid, add it as an option of its own, such as No preference.</p>
      <p>The options always stack, one per row. Pane’s RadioGroup has no row layout, which keeps each circle beside its own label and the whole group readable on a phone. The <code>help</code> prop puts a line under the question, and the group reads it with the question. The <code>required</code> prop marks the answer as required. Disabled on the group turns off every option, and disabled on one option leaves the rest usable. There is no error state yet. If an answer is missing after submit, say so in the help line.</p>
    </>
  ),
  whenToUse: ['One answer from two to six options the reader should compare.', 'A setting with a few named levels, such as who can message you.', 'A choice that changes what else the form asks, such as delivery or collection, shown before the fields it controls.'],
  whenNot: [{ situation: 'Many options', to: '/components/select', label: 'Select' }, { situation: 'Several answers at once', to: '/components/checkbox', label: 'Checkbox' }, { situation: 'On or off', to: '/components/switch', label: 'Switch' }],
  variants: { na: 'Radio has no variant prop.' },
  anatomy: { render: <Who />, parts: [{ part: 'Question', selector: '[data-component="RadioGroup"] > span', what: 'The group label, read before the options.' }, { part: 'Circle', selector: '[data-component="Radio"] button', what: 'A round 24px well in a 44px row.' }, { part: 'Label', selector: '[data-component="Radio"] label', what: 'The option, which also chooses it.' }] },
  sizes: { na: 'Radio has one size, a 24px circle in a 44px row.' },
  emphasis: NO_EMPHASIS,
  placement: { rows: [['In a form', 'One question per group.'], ['In settings', 'A level for one setting.'], ['Above the fields it controls', 'The answer changes what comes next, so the reader meets it first.']], examples: [{ title: 'A privacy setting', render: <Who /> }] },
  combinations: { good: [['RadioGroup + Button', 'An answer saved with the form.'], ['RadioGroup + Fieldset', 'One question among several in a longer form, under the section’s legend.'], ['RadioGroup with no default + required', 'A question with no safe default. The reader has to answer, and the required prop says so.']], avoid: [{ title: 'seven options or more', why: 'The answers stop being easy to compare at a glance, and the group pushes the rest of the form down. Use a Select.', render: <P><RadioGroup label="Print size" defaultValue="a3">{['A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0'].map((s) => <Radio key={s} value={s.toLowerCase()} label={s} />)}</RadioGroup></P> },{ title: 'two options that mean on and off', why: 'That is a Switch.', render: <P><RadioGroup label="Notifications" defaultValue="on"><Radio value="on" label="On" /><Radio value="off" label="Off" /></RadioGroup></P> }] },
  content: {
    formula: <><p>Ask the question in the group label, such as Who can message you. Keep options short, parallel and mutually exclusive, and order them in a natural sequence, such as most open to most closed.</p><p>A yes or no question puts Yes first. Write each option so it answers the question on its own, so the reader never needs the option above it to make sense of it.</p></>,
    pair: { do: <Who />, doNote: 'A question and parallel answers in order.', dont: <P><RadioGroup label="Messages" defaultValue="a"><Radio value="a" label="Everyone can" /><Radio value="b" label="Only followers" /><Radio value="c" label="Turn off" /></RadioGroup></P>, dontNote: 'A label that is not a question and answers in three shapes.' },
    overflow: { text: 'Long options wrap beside their circle.', render: <div data-overflow-demo="" className="overflow-probe"><P><RadioGroup label="Paper" defaultValue="a"><Radio value="a" label="Cotton rag with a deckled edge and a 10 mm border" /></RadioGroup></P></div> },
    rtl: { text: 'Circles sit to the right of their labels in right-to-left languages.', render: <div dir="rtl" lang="ar"><P><RadioGroup label="من يمكنه مراسلتك" defaultValue="a"><Radio value="a" label="الجميع" /><Radio value="b" label="لا أحد" /></RadioGroup></P></div> },
    expansion: { text: 'German options wrap and stay aligned.', render: <P><RadioGroup label="Wer darf dir schreiben" defaultValue="a"><Radio value="a" label="Personen, denen du folgst" /><Radio value="b" label="Niemand" /></RadioGroup></P> },
  },
  behaviours: {
    states: [['Unselected', 'An empty circle.', 'A round well (P3).'], ['Selected', 'A dot grows in and settles.', 'A shape says chosen (P6, P4).'], ['Pressed', 'Shrinks slightly.', 'A press is a reply (P4).'], ['Focus', 'The shared ring and halo.', 'Visible on any scene (P2).'], ['Disabled', 'Faded, reason in the description.', 'Say why (P6).']],
    interactions: [['Keyboard', 'Tab', 'Moves into the group, on the chosen option.', 'Radio: one tab stop and arrow keys choose'], ['Keyboard', '↓ / ↑', 'Moves to the next or previous option and chooses it.', 'Radio: one tab stop and arrow keys choose'], ['Mouse / touch', 'Click / tap', 'The circle or the label chooses it.', 'Native label']],
    loading: <p>A radio group has no loading state.</p>,
    focus: <p>Focus lands on the chosen option when the reader tabs into the group.</p>,
  },
  deepDive: { na: 'Radio has no variant prop.' },
  modifiers: [{ name: 'Description and disabled option', rules: <p>Give an option a <code>description</code> for a line of detail, and set <code>disabled</code> on an option that cannot be chosen now, saying why in the description.</p>, pair: { do: <P><RadioGroup label="Paper" defaultValue="rag"><Radio value="rag" label="Cotton rag" /><Radio value="metal" label="Aluminium" description="Sold out until December." disabled /></RadioGroup></P>, doNote: 'Disabled with the reason.', dont: <P><RadioGroup label="Paper" defaultValue="rag"><Radio value="rag" label="Cotton rag" /><Radio value="metal" label="Aluminium" disabled /></RadioGroup></P>, dontNote: 'Disabled with no reason.' } }],
  related: [['/components/checkbox', 'Checkbox', 'Several answers.'], ['/components/select', 'Select', 'Many options.']],
  references: [{ title: 'WAI-ARIA Authoring Practices · Radio group pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/', why: 'The keyboard model.' }, { title: 'Nielsen Norman Group · Checkboxes vs. radio buttons', url: 'https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/', why: 'When to use which.' }],
};

export const SWITCH: Depth = {
  overview: (
    <>
      <p>A switch turns a setting on or off the moment it changes, such as making an account private. Nothing waits for a Save button. Off, the track is a recess carved into the glass, shaded under its top lip and lit along its bottom lip (P1). On, the track lights from within, bright white glass in the dark theme and ink in the light theme, with a dark mark that is ink in dark and white in light. The knob is a white bead lit on its top. It rolls across and the mark appears, so on reads by position and by mark as well as brightness (P6), and a press squashes the bead toward where it is going (P4).</p>
      <p>The label sits at the start of the row and the switch at the end, so a list of settings reads like a list.</p>
    </>
  ),
  whenToUse: ['A setting that applies at once, such as notifications or a private account.', 'A list of independent settings on a settings pane.'],
  whenNot: [{ situation: 'A choice saved with a form', to: '/components/checkbox', label: 'Checkbox' }, { situation: 'More than two states', to: '/components/radio', label: 'RadioGroup' }],
  variants: { na: 'Switch has no variant prop.' },
  anatomy: { render: <P><Switch label="Private account" description="Only followers see your posts." defaultChecked /></P>, parts: [{ part: 'Label', selector: '[data-component="Switch"] label', what: 'The setting, at the start of the row.' }, { part: 'Track', selector: '[data-component="Switch"] button', what: 'A carved recess when off. On, it lights from within, white in the dark theme and ink in the light theme.' }, { part: 'Knob', selector: '[data-component="Switch"] button > span:last-child', what: 'A white bead lit on its top, on a short shadow; it rolls across.' }] },
  sizes: { na: 'Switch has one size, a 52 by 32px track in a 44px row.' },
  emphasis: NO_EMPHASIS,
  placement: { rows: [['A settings pane', 'One setting per row, label first.'], ['A sheet of quick settings', 'Short labels.']], examples: [{ title: 'Settings', render: <P><Switch label="Push notifications" defaultChecked /><Switch label="Weekly summary" /></P> }] },
  combinations: { good: [['Switches in a list', 'Independent settings.']], avoid: [{ title: 'a switch with a Save button', why: 'A switch applies at once; a Save button makes the reader unsure whether it did.', render: <P><Switch label="Private account" /><Row><Button>Save</Button></Row></P> }] },
  content: {
    formula: <p>Name the setting, not the action, such as Private account rather than Make account private. Add a description when the effect is not obvious.</p>,
    pair: { do: <P><Switch label="Private account" /></P>, doNote: 'The setting’s name.', dont: <P><Switch label="Click to make private" /></P>, dontNote: 'An instruction instead of a name.' },
    overflow: { text: 'A long label wraps and the switch stays at the end of the row.', render: <div data-overflow-demo="" className="overflow-probe"><P><Switch label="Show when I am active to people I follow" /></P></div> },
    rtl: { text: 'In right-to-left languages the switch sits at the left end of the row, and on slides the knob to the left.', render: <div dir="rtl" lang="ar"><P><Switch label="حساب خاص" defaultChecked /></P></div> },
    expansion: { text: 'German labels wrap without moving the switch.', render: <P><Switch label="Privates Konto" defaultChecked /></P> },
  },
  behaviours: {
    states: [['Off', 'Carved recess, bead at the start.', 'A recess (P1).'], ['On', 'Lit track, knob at the end, mark.', 'Brightness, position and mark agree (P6).'], ['Press', 'The bead squashes toward its travel.', 'A press is a reply (P4).'], ['Change', 'The bead rolls over 420ms and settles.', 'Movement answers the press (P4).'], ['Focus', 'The shared ring and halo.', 'Visible on any scene (P2).'], ['Disabled', 'Faded.', 'Say why (P6).']],
    interactions: [['Keyboard', 'Tab', 'Moves focus to the switch.', 'Switch: Space toggles it'], ['Keyboard', 'Space / Enter', 'Toggles it.', 'Switch: Space toggles it'], ['Mouse / touch', 'Click / tap', 'The track or the label toggles it.', 'Native label']],
    loading: <p>If saving the change takes time, keep the new state and undo it with a Banner if saving fails.</p>,
    focus: <p>Focus stays on the switch when it toggles.</p>,
  },
  deepDive: { na: 'Switch has no variant prop.' },
  modifiers: [{ name: 'Description', rules: <p>Add <code>description</code> to say what the setting does, read after the label.</p>, pair: { do: <P><Switch label="Private account" description="Only followers see your posts." /></P>, doNote: 'The effect under the name.', dont: <P><Switch label="Private" /></P>, dontNote: 'Private what?' } }],
  related: [['/components/checkbox', 'Checkbox', 'Saved with a form.'], ['/patterns/forms', 'Forms', 'Settings pages.']],
  references: [{ title: 'WAI-ARIA Authoring Practices · Switch pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/', why: 'The switch role and keyboard.' }, { title: 'Apple Human Interface Guidelines · Toggles', url: 'https://developer.apple.com/design/human-interface-guidelines/toggles', why: 'Pane’s lineage for switches.' }],
};

const small = (d: Partial<Depth> & Pick<Depth, 'overview' | 'whenToUse' | 'whenNot' | 'anatomy' | 'content' | 'related'>): Depth => ({
  variants: { na: 'It has no variant prop.' },
  sizes: { na: 'It has one size, set by the controls around it.' },
  emphasis: NO_EMPHASIS,
  placement: { na: 'It sits wherever its field sits, so placement follows the field.' },
  combinations: { na: 'It is itself a combination of the field parts, shown in the examples above.' },
  behaviours: { states: [['Rest', 'Text in the theme colours.', 'Structure, not a control (P7).']], interactions: [['Keyboard', 'Tab', 'Skips it. It is not focusable.', 'Renders text']], loading: <p>It has no loading state.</p>, focus: <p>It never takes focus.</p> },
  deepDive: { na: 'It has no variant prop.' },
  modifiers: { na: 'It has no optional slots beyond its props.' },
  references: REFS_FIELD,
  ...d,
});

export const FORM_FIELD: Depth = small({
  overview: <><p>FormField is the frame of one field. It holds the label above, the control, then the error and the help. It hands the control its id, its description ids and its invalid state through context, so every Input, Textarea and PinInput inside is labelled and described for screen readers without any ids in the app.</p><p>The error comes before the help, closest to the control, because it is the thing the reader needs first.</p></>,
  whenToUse: ['Around every Input, Textarea and PinInput.'],
  whenNot: [{ situation: 'A checkbox, radio or switch', to: '/components/checkbox', label: 'They carry their own label' }, { situation: 'A group of fields', to: '/components/fieldset', label: 'Fieldset' }],
  anatomy: { render: <OrderForm />, parts: [{ part: 'Label', selector: '[data-component="Label"]', what: 'The field’s name.' }, { part: 'Control', selector: '[data-component="Input"]', what: 'One control.' }, { part: 'Error', selector: '[data-component="HelperText"]', what: 'Closest to the control.' }] },
  behaviours: { states: [['Default', 'Label, control, help.', 'Labels look like labels (P7).'], ['Error', 'The error shows above the help and the control turns invalid.', 'Glyph and word as well as colour (P6).']], interactions: [['Keyboard', 'Tab', 'Moves to the control inside.', 'Input: reachable with Tab and labelled by its FormField']], loading: <p>FormField has no loading state. Say Checking in the help while the app validates.</p>, focus: <p>After a failed submit, focus the first field with an error.</p> },
  content: { formula: <p>The label names the field. The help explains or gives an example. The error says how to fix the value, in a sentence.</p>, pair: { do: <P><FormField label="Email" error="Enter an email address with an @."><Input defaultValue="mara" /></FormField></P>, doNote: 'The fix in the error.', dont: <P><FormField label="Email" error="Invalid input"><Input defaultValue="mara" /></FormField></P>, dontNote: 'Says it is wrong, not how to fix it.' }, overflow: { text: 'A long error wraps under the field.', render: <div data-overflow-demo="" className="overflow-probe"><P><FormField label="Email" error="Enter an email address with an @ and a domain, such as mara@example.com."><Input defaultValue="mara" /></FormField></P></div> }, rtl: { text: 'Label, help and error align right in right-to-left languages.', render: <div dir="rtl" lang="ar"><P><FormField label="البريد" help="لن نشاركه."><Input /></FormField></P></div> }, expansion: { text: 'German help text wraps.', render: <P><FormField label="E-Mail" help="Wir teilen sie nie mit anderen."><Input /></FormField></P> } },
  related: [['/components/input', 'Input', 'The usual control.'], ['/components/helper-text', 'HelperText', 'Help and error lines.']],
});

export const LABEL: Depth = small({
  overview: <><p>Label is a field’s name. It is semibold, in the primary text colour, and the same size as the control text below it. It looks like a label and never like a link, as P7 asks. FormField renders it for you; use it on its own only where FormField cannot place it.</p><p>Required is written as the word required in secondary text, never only as a colour or an asterisk.</p></>,
  whenToUse: ['A field outside a FormField, with htmlFor pointing at the control.'],
  whenNot: [{ situation: 'A field in a FormField', to: '/components/form-field', label: 'FormField renders it' }, { situation: 'A group heading', to: '/components/fieldset', label: 'Fieldset legend' }],
  anatomy: { render: <P><Label htmlFor="lbl-a" required>Display name</Label><Input id="lbl-a" defaultValue="Mara Lind" /></P>, parts: [{ part: 'Text', selector: '[data-component="Label"]', what: 'Semibold, label size.' }, { part: 'Required', selector: '[data-component="Label"] span', what: 'The word required, secondary.' }] },
  content: { formula: <p>A noun or short phrase in sentence case, such as Display name, with no colon at the end.</p>, pair: { do: <P><Label htmlFor="lbl-b">Display name</Label><Input id="lbl-b" /></P>, doNote: 'A name.', dont: <P><Label htmlFor="lbl-c">Please enter your display name below</Label><Input id="lbl-c" /></P>, dontNote: 'An instruction.' }, overflow: { text: 'A long label wraps above its field.', render: <div data-overflow-demo="" className="overflow-probe"><P><Label htmlFor="lbl-d">Name shown on your public profile and posts</Label><Input id="lbl-d" /></P></div> }, rtl: { text: 'Labels align right in right-to-left languages.', render: <div dir="rtl" lang="ar"><P><Label htmlFor="lbl-e">الاسم</Label><Input id="lbl-e" /></P></div> }, expansion: { text: 'German labels wrap.', render: <P><Label htmlFor="lbl-f">Anzeigename</Label><Input id="lbl-f" /></P> } },
  related: [['/components/form-field', 'FormField', 'Renders the label.']],
});

export const HELPER_TEXT: Depth = small({
  overview: <><p>HelperText is the line under a control. Help is secondary text that explains or gives an example. An error keeps the primary text colour so it stays readable on glass, adds the octagon glyph Banner uses for critical, and speaks the word Error before the message, so the tone is never colour alone (P6).</p></>,
  whenToUse: ['Help or an error under one control. FormField renders it for you.'],
  whenNot: [{ situation: 'An error for the whole form', to: '/components/banner', label: 'Banner' }],
  anatomy: { render: <P><HelperText tone="error">Keep it under 40 characters.</HelperText></P>, parts: [{ part: 'Glyph', selector: '[data-component="HelperText"] svg', what: 'Errors only, the critical octagon.' }, { part: 'Text', selector: '[data-component="HelperText"] span:last-child', what: 'Label size.' }] },
  content: { formula: <p>Help explains or shows an example. An error says how to fix the value and never blames the reader.</p>, pair: { do: <P><HelperText tone="error">Use at least 8 characters.</HelperText></P>, doNote: 'How to fix it.', dont: <P><HelperText tone="error">You entered a bad password.</HelperText></P>, dontNote: 'Blames, and does not help.' }, overflow: { text: 'Long help wraps.', render: <div data-overflow-demo="" className="overflow-probe"><P><HelperText>Shown on your profile, your posts and every print you sell.</HelperText></P></div> }, rtl: { text: 'The glyph sits at the right in right-to-left languages.', render: <div dir="rtl" lang="ar"><P><HelperText tone="error">أقل من 40 حرفًا.</HelperText></P></div> }, expansion: { text: 'German help wraps.', render: <P><HelperText>Wird in deinem Profil angezeigt.</HelperText></P> } },
  variants: {
    help: { purpose: 'Secondary text that explains the field or gives an example, such as a format.', pairing: 'Under any control, and under an error when both are needed.' },
    error: { purpose: 'What is wrong with the value and how to fix it, with the octagon glyph and the spoken word Error.', pairing: 'Directly under the control, above any help, and only after the reader has left the field or submitted.' },
  },
  deepDive: {
    help: { purpose: <p>Help is read before typing, so it says what the field expects in the reader’s terms, such as the format of a date or what a code looks like. It uses the secondary text colour, which measured legible on glass in both themes.</p>, context: <P><FormField label="Display name" help="Shown on your profile and in replies."><Input defaultValue="Mara Lind" /></FormField></P>, practices: ['Keep it to one sentence.', 'Put examples here, never only in the placeholder.'], pair: { do: <P><HelperText>Use the name people know you by.</HelperText></P>, doNote: 'Says what to write.', dont: <P><HelperText>Required field. Max 40.</HelperText></P>, dontNote: 'Notes in shorthand.' } },
    error: { purpose: <p>An error is read after a mistake, so it says how to fix the value in one sentence. It keeps the primary text colour, adds the octagon glyph Banner uses for critical, and speaks the word Error first, so the tone never rests on colour.</p>, context: <P><FormField label="Email" error="Enter an email address with an @."><Input defaultValue="mara.lind" /></FormField></P>, practices: ['Say how to fix it, never only that it is wrong.', 'Show it after the reader leaves the field, never while typing.'], pair: { do: <P><HelperText tone="error">Enter an email address with an @.</HelperText></P>, doNote: 'How to fix it.', dont: <P><HelperText tone="error">Invalid input.</HelperText></P>, dontNote: 'Says nothing the reader can act on.' } },
  },
  related: [['/components/form-field', 'FormField', 'Renders it.'], ['/components/banner', 'Banner', 'Whole-form errors.']],
});

export const FIELDSET: Depth = small({
  overview: <><p>Fieldset groups fields that belong together under a legend, such as an address. It is a real fieldset and legend with no box of its own, and screen readers read the legend before each control inside, so Street becomes Shipping address, Street.</p></>,
  whenToUse: ['An address, a set of checkboxes, or any fields that only make sense together.'],
  whenNot: [{ situation: 'One field', to: '/components/form-field', label: 'FormField' }, { situation: 'One question with options', to: '/components/radio', label: 'RadioGroup' }],
  anatomy: { render: <P><Fieldset legend="Shipping address"><FormField label="Street"><Input defaultValue="Bryggen 12" /></FormField></Fieldset></P>, parts: [{ part: 'Legend', selector: '[data-component="Fieldset"] legend', what: 'The group’s name.' }, { part: 'Fields', selector: '[data-component="Fieldset"] > div', what: 'At the group gap.' }] },
  content: { formula: <p>A short noun phrase, such as Shipping address. Leave it out of each label inside, because it is read before them anyway.</p>, pair: { do: <P><Fieldset legend="Shipping address"><FormField label="Street"><Input /></FormField></Fieldset></P>, doNote: 'Street, under Shipping address.', dont: <P><Fieldset legend="Shipping address"><FormField label="Shipping address street"><Input /></FormField></Fieldset></P>, dontNote: 'The legend repeated in the label.' }, overflow: { text: 'A long legend wraps.', render: <div data-overflow-demo="" className="overflow-probe"><P><Fieldset legend="Where should we ship your prints"><FormField label="City"><Input /></FormField></Fieldset></P></div> }, rtl: { text: 'The legend aligns right.', render: <div dir="rtl" lang="ar"><P><Fieldset legend="عنوان الشحن"><FormField label="المدينة"><Input /></FormField></Fieldset></P></div> }, expansion: { text: 'German legends wrap.', render: <P><Fieldset legend="Lieferadresse"><FormField label="Stadt"><Input /></FormField></Fieldset></P> } },
  related: [['/components/form-field', 'FormField', 'Each field.'], ['/components/checkbox', 'Checkbox', 'A group of choices.']],
});

export const INPUT_GROUP: Depth = small({
  overview: <><p>InputGroup puts an Input and its adornments in one well, so a currency, a search icon or a clear button reads as part of the field. The group draws the well and the Input inside drops its own surface. The whole group takes the focus ring when the input is focused.</p></>,
  whenToUse: ['A unit such as NOK or mm.', 'A search icon, or one small action such as Clear.'],
  whenNot: [{ situation: 'A label', to: '/components/form-field', label: 'FormField' }],
  anatomy: { render: <P><FormField label="Print price"><InputGroup end="NOK"><Input defaultValue="950" /></InputGroup></FormField></P>, parts: [{ part: 'Well', selector: '[data-component="InputGroup"]', what: 'The group is the well.' }, { part: 'Input', selector: '[data-component="InputGroup"] [data-component="Input"]', what: 'Without its own surface.' }] },
  content: { formula: <p>Units are short and sit at the end. An icon at the start is decorative. A control inside, such as a clear button, has its own name.</p>, pair: { do: <P><FormField label="Price"><InputGroup end="NOK"><Input defaultValue="950" /></InputGroup></FormField></P>, doNote: 'The unit inside the well.', dont: <P><FormField label="Price (NOK)"><InputGroup end="NOK"><Input defaultValue="950" /></InputGroup></FormField></P>, dontNote: 'The unit twice.' }, overflow: { text: 'The input scrolls inside the group; adornments keep their width.', render: <div data-overflow-demo="" className="overflow-probe"><P><InputGroup end="NOK"><Input aria-label="Price" defaultValue="9 999 999 999" /></InputGroup></P></div> }, rtl: { text: 'Adornments swap sides in right-to-left languages.', render: <div dir="rtl" lang="ar"><P><InputGroup end="كرونة"><Input aria-label="السعر" defaultValue="950" /></InputGroup></P></div> }, expansion: { text: 'The input narrows; the unit stays whole.', render: <P><InputGroup end="Kronen"><Input aria-label="Preis" defaultValue="950" /></InputGroup></P> } },
  related: [['/components/input', 'Input', 'The field inside.'], ['/patterns/search', 'Search', 'A search field.']],
});

export const PIN_INPUT: Depth = small({
  overview: <><p>PinInput shows a short code as a row of 44px wells, one per character, so every cell meets the touch size (P6). Typing moves to the next cell, Backspace moves back, and pasting a whole code fills every cell. The first cell offers the code from a text message on phones.</p><p>Use it only for short codes the reader types from somewhere else. Long codes are easier in one Input.</p></>,
  whenToUse: ['A verification code of four to eight characters.'],
  whenNot: [{ situation: 'A password', to: '/components/input', label: 'Input type password' }, { situation: 'A long code', to: '/components/input', label: 'Input' }],
  anatomy: { render: <P><FormField label="Verification code"><PinInput length={6} defaultValue="48" /></FormField></P>, parts: [{ part: 'Cells', selector: '[data-component="PinInput"]', what: 'One 44px well per character.' }, { part: 'Name', selector: '[data-component="Label"]', what: 'The FormField label names the group.' }] },
  behaviours: { states: [['Empty cell', 'A well.', 'Room for one character (P1).'], ['Filled', 'The character in title size.', 'Easy to check at a glance.'], ['Invalid', 'Every cell rings in the critical mark colour.', 'With the error text (P6).']], interactions: [['Keyboard', 'Type', 'Fills the cell and moves on.', 'PinInput: typing moves on and paste fills every cell'], ['Keyboard', 'Backspace', 'Clears and moves back.', 'PinInput: typing moves on and paste fills every cell'], ['Keyboard', 'Paste', 'Fills every cell.', 'PinInput: typing moves on and paste fills every cell']], loading: <p>After the last character, show Checking in the help while the app verifies the code.</p>, focus: <p>Focus starts on the first empty cell.</p> },
  content: { formula: <p>The label says what the code is, such as Verification code. The help says where it was sent and how long it lasts.</p>, pair: { do: <P><FormField label="Verification code" help="Sent to +47 ••• •• 214."><PinInput length={4} /></FormField></P>, doNote: 'Where the code went.', dont: <P><FormField label="Code"><PinInput length={4} /></FormField></P>, dontNote: 'Which code?' }, overflow: { text: 'On a narrow pane the cells wrap to a second row.', render: <div data-overflow-demo="" className="overflow-probe"><P><PinInput aria-label="Code" length={6} /></P></div> }, rtl: { text: 'Codes are numbers and read left to right even in right-to-left layouts.', render: <div dir="rtl" lang="ar"><P><PinInput aria-label="الرمز" length={4} /></P></div> }, expansion: { text: 'Only the label grows in translation.', render: <P><FormField label="Bestätigungscode"><PinInput length={4} /></FormField></P> } },
  related: [['/components/input', 'Input', 'Long codes.'], ['/components/form-field', 'FormField', 'Label and help.']],
});
