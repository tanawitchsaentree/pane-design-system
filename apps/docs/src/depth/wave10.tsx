// Usage tabs for wave 10 (component-depth.md U1–U14): patterns, built from the waves before them.
import { AppShell, AuthForm, BottomNav, Button, Card, CoachMark, CommandPalette, Feed, Form, FormField, Input, KanbanBoard, NotificationCenter, RichTextEditor, SettingsGroup, SettingsLayout, SettingsRow, Sidebar, Switch, Text, VisuallyHidden, Wizard } from 'pane-react';
import type { Depth } from './types';

const OnCard = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card">{children}</Card>;
const Wide = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card demo-wide">{children}</Card>;
const ref = (title: string, url: string, why: string) => ({ title, url, why });
const noop = () => {};
const NA_V = (n: string) => ({ na: `${n} has one look; it has no kind prop to choose between.` });
const NA_D = (n: string) => ({ na: `${n} has no variant prop, so there is nothing to compare.` });
const NA_S = (n: string) => ({ na: `${n} has no size prop; its parts keep their own sizes.` });
const RTL = (n: string) => `${n} mirrors with the page; its parts flip their own icons.`;
const CMDS = [{ id: 'new', label: 'New print', group: 'Prints', shortcut: ['⌘', 'N'], onSelect: noop }, { id: 'find', label: 'Find an order', group: 'Orders', onSelect: noop }, { id: 'ship', label: 'Mark as shipped', group: 'Orders', onSelect: noop }];
const NOTES = [{ id: '1', title: 'Mara commented on Lofoten, March', time: '2 min ago', group: 'Today', unread: true }, { id: '2', title: 'Jon saved Senja at night', time: 'Yesterday', group: 'Earlier' }];
const COLS = [{ id: 'todo', title: 'To print', cards: [{ id: 'a', title: 'Lofoten, March' }] }, { id: 'done', title: 'Ready to ship', cards: [{ id: 'b', title: 'Senja at night' }] }];
const STEPS = [{ label: 'Size', content: <Text>40 × 50 cm, €120.</Text> }, { label: 'Address', content: <FormField label="Street address"><Input /></FormField> }, { label: 'Pay', content: <Text>You pay on the next screen.</Text> }];
const POSTS = [{ id: 1, t: 'Mara posted Lofoten, March' }, { id: 2, t: 'Jon saved Senja at night' }];
const post = (x: { t: string }) => <OnCard><Text>{x.t}</Text></OnCard>;
const SIDE = <Sidebar current="#orders" sections={[{ items: [{ href: '#orders', label: 'Orders' }, { href: '#prints', label: 'Prints' }] }]} />;
const hidden = (t: string) => <VisuallyHidden>{t}</VisuallyHidden>;
const plain = (n: string, check: string, keys: Array<[string, string, string, string]>) => ({ states: [['Rest', `${n} as it is laid out.`, 'P3.']] as Array<[string, string, string]>, interactions: keys.length ? keys : [['Keyboard', 'Tab', 'Moves through its parts in reading order.', `${n}: ${check}`], ['Mouse', 'Click', 'Each part does its own job.', n], ['Touch', 'Tap', 'Each part does its own job.', n]] as Array<[string, string, string, string]>, loading: <p>Show the frame at once and fill its parts as their data arrives.</p>, focus: <p>Focus moves through the parts in reading order; nothing takes focus on load.</p> });

export const FORM: Depth = {
  overview: (
    <>
      <p>A Form lays out its fields in one column at the field rhythm, keeps its buttons together after the last field, and on a failed submit puts an error summary at the top. The summary is a level-2 pane ringed in the critical mark that takes focus and lists each error as a link to its field, as GOV.UK does. Errors are said in words, the same words each field shows, never only in red.</p>
      <p>Check the values on submit, not as the reader types, and pass the problems back in errors. Nothing takes focus when the page opens; focus moves to the summary only after a submit fails. Keep one loud button, the submit, last in the row.</p>
    </>
  ),
  whenToUse: ['Any set of fields the reader fills in and sends.'],
  whenNot: [{ situation: 'One value changed in place', to: '/components/editable', label: 'Editable' }, { situation: 'A long task in steps', to: '/components/wizard', label: 'Wizard' }],
  variants: NA_V('Form'),
  anatomy: { render: <OnCard><Form errors={[{ field: 'f1', message: 'Enter a postcode' }]} actions={<Button type="submit">Save</Button>}><FormField id="f1" label="Postcode" error="Enter a postcode"><Input /></FormField></Form></OnCard>, parts: [{ part: 'Summary', selector: '[data-component="Form"] [role="alert"]', what: 'Every error, linked to its field.' }, { part: 'Fields', selector: '[data-component="Form"] > div:nth-child(2)', what: 'One column.' }, { part: 'Actions', selector: '[data-component="Form"] > div:last-child', what: 'The submit last.' }] },
  sizes: NA_S('Form'),
  emphasis: { text: <p>One loud button per form, the submit.</p>, pair: { do: <OnCard><Form actions={<><Button type="submit">Save</Button><Button variant="glass">Cancel</Button></>}><FormField label="Name"><Input /></FormField></Form></OnCard>, doNote: 'One loud submit.', dont: <OnCard><Form actions={<><Button type="submit">Save</Button><Button>Save and close</Button></>}><FormField label="Name"><Input /></FormField></Form></OnCard>, dontNote: 'Two loud buttons.' } },
  placement: { rows: [['A page or a dialog', 'The fields and their actions together.']], examples: [{ title: 'With sections', render: <OnCard><Form actions={<Button type="submit">Save</Button>}><FormField label="Shop name"><Input /></FormField></Form></OnCard> }] },
  combinations: { good: [['Form + Fieldset', 'Sections of a long form.'], ['Form + FormField', 'Labels, help and errors.']], avoid: [{ title: 'two columns of fields', why: 'The eye zig-zags and fields are missed; keep one column.', render: <OnCard><Form><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ds-gap-md)' }}><FormField label="First"><Input /></FormField><FormField label="Last"><Input /></FormField></div></Form></OnCard> }] },
  content: { formula: <p>Each error says what is wrong and how to put it right, Enter a postcode, such as 8390.</p>, pair: { do: <OnCard><Form errors={[{ field: 'f2', message: 'Enter a postcode, such as 8390' }]}><FormField id="f2" label="Postcode" error="Enter a postcode, such as 8390"><Input /></FormField></Form></OnCard>, doNote: 'What to do.', dont: <OnCard><Form errors={[{ field: 'f3', message: 'Invalid input' }]}><FormField id="f3" label="Postcode" error="Invalid input"><Input /></FormField></Form></OnCard>, dontNote: 'What is wrong, not how to fix it.' }, overflow: { text: 'Long errors wrap in the summary.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><Form errors={[{ field: 'f4', message: 'Enter the street address where the courier can leave the parcel' }]}><FormField id="f4" label="Street"><Input /></FormField></Form></OnCard></div> }, rtl: { text: 'The summary and fields run from the right.', render: <div dir="rtl" lang="ar"><OnCard><Form errors={[{ field: 'f5', message: 'أدخل الرمز البريدي' }]} errorTitle="هناك مشكلة"><FormField id="f5" label="الرمز البريدي"><Input /></FormField></Form></OnCard></div> }, expansion: { text: 'Longer words wrap.', render: <OnCard><Form errors={[{ field: 'f6', message: 'Geben Sie eine Postleitzahl ein' }]} errorTitle="Es gibt ein Problem"><FormField id="f6" label="Postleitzahl"><Input /></FormField></Form></OnCard> } },
  behaviours: { states: [['Rest', 'One column of fields.', 'P3.'], ['Failed submit', 'The summary takes focus.', 'P6.']], interactions: [['Keyboard', 'Enter in a field', 'Submits.', 'Form: a failed submit shows a summary that takes focus and links to each field'], ['Keyboard', 'Enter on an error link', 'Moves to its field.', 'Form: a failed submit shows a summary that takes focus and links to each field'], ['Mouse', 'Click submit', 'Submits.', 'Form: nothing in a form takes focus when the page opens'], ['Touch', 'Tap submit', 'Submits.', 'Form']], loading: <p>Lock the submit while sending and say what is happening on it, such as Saving.</p>, focus: <p>Nothing on load; the summary after a failed submit.</p> },
  deepDive: NA_D('Form'),
  modifiers: [{ name: 'errors', rules: <p>Pass every problem after a submit; clear them when the reader fixes a field.</p>, pair: { do: <OnCard><Form errors={[{ field: 'f7', message: 'Enter an email address' }]}><FormField id="f7" label="Email" error="Enter an email address"><Input /></FormField></Form></OnCard>, doNote: 'Listed and shown at the field.', dont: <OnCard><Form><FormField label="Email" error="Enter an email address"><Input /></FormField></Form></OnCard>, dontNote: 'Only at the field, easy to miss.' } }],
  related: [['/components/form-field', 'FormField', 'One field.'], ['/components/wizard', 'Wizard', 'A task in steps.']],
  references: [ref('GOV.UK · Error summary', 'https://design-system.service.gov.uk/components/error-summary/', 'Focus and links.'), ref('WAI · Form notifications', 'https://www.w3.org/WAI/tutorials/forms/notifications/', 'Errors after submit.')],
};

export const WIZARD: Depth = {
  overview: (
    <>
      <p>A Wizard is a task in steps, with Stepper on top, one step’s panel at a time under a heading that takes focus as it changes, and Back and Next at the end with the loud one always last. A step can check itself before the reader moves on; going back never loses what was typed, because every panel stays in the page.</p>
      <p>Use it when a task has clear stages that depend on each other, such as an order. Keep it to three to five steps, and show the review of everything before the last button.</p>
    </>
  ),
  whenToUse: ['An order, an export or setting up a shop.'],
  whenNot: [{ situation: 'A short form', to: '/components/form', label: 'Form' }, { situation: 'Showing progress only', to: '/components/stepper', label: 'Stepper' }],
  variants: NA_V('Wizard'),
  anatomy: { render: <Wide><Wizard label="Order a print" onFinish={noop} steps={STEPS} /></Wide>, parts: [{ part: 'Stepper', selector: '[data-component="Wizard"] [data-component="Stepper"]', what: 'Where the reader is.' }, { part: 'Step heading', selector: '[data-component="Wizard"] h2', what: 'Takes focus as it changes.' }, { part: 'Actions', selector: '[data-component="Wizard"] > div:last-child', what: 'Back, then the loud Next.' }] },
  sizes: NA_S('Wizard'),
  emphasis: { na: 'Next or Finish is the one loud button, always last.' },
  placement: { rows: [['A full page', 'The task and nothing else.'], ['A Sheet', 'A short task over the page.']], examples: [{ title: 'Two steps', render: <Wide><Wizard label="Export" finishLabel="Export" onFinish={noop} steps={STEPS.slice(0, 2)} /></Wide> }] },
  combinations: { good: [['Wizard + Form fields', 'Each step a few fields.']], avoid: [{ title: 'one step', why: 'A wizard of one step is a form with extra chrome.', render: <Wide><Wizard label="Rename" onFinish={noop} steps={[STEPS[1]]} /></Wide> }] },
  content: { formula: <p>Each step is a noun for what it asks, Size, Address, Pay.</p>, pair: { do: <Wide><Wizard label="Order" onFinish={noop} steps={STEPS} /></Wide>, doNote: 'Says what each asks.', dont: <Wide><Wizard label="Order" onFinish={noop} steps={STEPS.map((s, i) => ({ ...s, label: `Step ${i + 1}` }))} /></Wide>, dontNote: 'Numbers only.' }, overflow: { text: 'Long step names wrap.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><Wizard label="Order" onFinish={noop} steps={STEPS.map((s) => ({ ...s, label: `${s.label} for the framed print` }))} /></OnCard></div> }, rtl: { text: RTL('Wizard'), render: <div dir="rtl" lang="ar"><Wide><Wizard label="طلب" onFinish={noop} steps={[{ label: 'الحجم', content: <Text>٤٠ × ٥٠</Text> }, { label: 'العنوان', content: <Text>…</Text> }]} /></Wide></div> }, expansion: { text: 'Longer names wrap.', render: <Wide><Wizard label="Bestellung" onFinish={noop} steps={[{ label: 'Größe', content: <Text>40 × 50 cm</Text> }, { label: 'Lieferadresse', content: <Text>…</Text> }]} /></Wide> } },
  behaviours: { states: [['First step', 'No Back.', 'P5.'], ['Last step', 'Finish.', 'P5.'], ['Check failed', 'The step stays with its error.', 'P6.']], interactions: [['Keyboard', 'Enter on Next', 'Moves on; the heading takes focus.', 'Wizard: Next moves on and the step heading takes focus'], ['Keyboard', 'Enter on Back', 'Goes back, keeping what was typed.', 'Wizard: Back keeps what was typed'], ['Mouse', 'Click Next', 'Checks the step first.', 'Wizard: a step that fails its check stays'], ['Touch', 'Tap Next', 'Moves on.', 'Wizard']], loading: <p>While a step checks itself, Next is locked.</p>, focus: <p>The step heading takes focus after each move.</p> },
  deepDive: NA_D('Wizard'),
  modifiers: [{ name: 'onCancel', rules: <p>Give a way out of long tasks; it sits apart at the start.</p>, pair: { do: <Wide><Wizard label="Order" onFinish={noop} onCancel={noop} steps={STEPS} /></Wide>, doNote: 'Cancel apart from Back.', dont: <Wide><Wizard label="Order" onFinish={noop} steps={STEPS} /></Wide>, dontNote: 'No way out but closing the page.' } }],
  related: [['/components/stepper', 'Stepper', 'Progress only.'], ['/components/form', 'Form', 'One page.']],
  references: [ref('NN/g · Wizards', 'https://www.nngroup.com/articles/wizards/', 'When steps help.'), ref('GOV.UK · Question pages', 'https://design-system.service.gov.uk/patterns/question-pages/', 'One thing per page.')],
};

export const AUTH_FORM: Depth = {
  overview: (
    <>
      <p>An AuthForm puts sign in, sign up and reset in one place, built from Form, FormField, Input and PasswordInput with the autocomplete names password managers need. Errors go to Form’s summary and under each field. The one loud button is the submit, at full width; other ways in, such as Continue with Apple, sit under a divider so they never compete with it.</p>
      <p>Sign-in asks for the email as username and the current password; sign-up adds a name and asks for a new password with its rule in help; reset asks only for the email. Never say which of email or password was wrong; say that the pair did not match.</p>
    </>
  ),
  whenToUse: ['Signing in, signing up or resetting a password.'],
  whenNot: [{ situation: 'A code after sign-in', to: '/components/otp-flow', label: 'OTPFlow' }],
  variants: NA_V('AuthForm'),
  anatomy: { render: <OnCard><AuthForm onSubmit={noop} onForgot={noop} onSwitch={noop} /></OnCard>, parts: [{ part: 'Heading', selector: '[data-component="AuthForm"] h1', what: 'Sign in.' }, { part: 'Submit', selector: '[data-component="AuthForm"] button[type="submit"]', what: 'The one loud button.' }, { part: 'Switch', selector: '[data-component="AuthForm"] > p:last-child', what: 'To the other mode.' }] },
  sizes: NA_S('AuthForm'),
  emphasis: { na: 'The submit is the one loud button; providers are glass.' },
  placement: { rows: [['A page of its own', 'Centred on a narrow measure.']], examples: [{ title: 'Sign up', render: <OnCard><AuthForm mode="sign-up" onSubmit={noop} passwordHint="At least 12 characters." /></OnCard> }] },
  combinations: { good: [['AuthForm + OTPFlow', 'A code after the password.']], avoid: [{ title: 'a loud provider button', why: 'Two loud buttons split the reader’s attention.', render: <OnCard><AuthForm onSubmit={noop} providers={<Button>Continue with Apple</Button>} /></OnCard> }] },
  content: { formula: <p>Plain labels, Email and Password, and errors that say what to do.</p>, pair: { do: <OnCard><AuthForm onSubmit={noop} errors={{ email: 'Enter an email address' }} /></OnCard>, doNote: 'What to do.', dont: <OnCard><AuthForm onSubmit={noop} errors={{ email: 'No account with that email' }} /></OnCard>, dontNote: 'Tells strangers who has an account.' }, overflow: { text: 'A long description wraps.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><AuthForm onSubmit={noop} description="to the North Light Prints shop and gallery in Reine" /></OnCard></div> }, rtl: { text: RTL('AuthForm'), render: <div dir="rtl" lang="ar"><OnCard><AuthForm onSubmit={noop} title="تسجيل الدخول" /></OnCard></div> }, expansion: { text: 'Longer words wrap.', render: <OnCard><AuthForm onSubmit={noop} title="Anmelden" /></OnCard> } },
  behaviours: plain('AuthForm', 'it carries the autocomplete names password managers need', [['Keyboard', 'Tab', 'Email, password, then submit.', 'AuthForm: it carries the autocomplete names password managers need'], ['Keyboard', 'Enter', 'Submits.', 'AuthForm: errors are in the summary and under each field'], ['Mouse', 'Click submit', 'Submits.', 'AuthForm'], ['Touch', 'Tap a saved password', 'Fills both fields.', 'AuthForm']]),
  deepDive: NA_D('AuthForm'),
  modifiers: [{ name: 'pending', rules: <p>Lock the submit and say what is happening while the request runs.</p>, pair: { do: <OnCard><AuthForm onSubmit={noop} pending /></OnCard>, doNote: 'Signing in.', dont: <OnCard><AuthForm onSubmit={noop} /></OnCard>, dontNote: 'Pressed twice while waiting.' } }],
  related: [['/components/password-input', 'PasswordInput', 'The password field.'], ['/components/otp-flow', 'OTPFlow', 'A second step.']],
  references: [ref('web.dev · Sign-in form', 'https://web.dev/articles/sign-in-form-best-practices', 'Autocomplete names.'), ref('GOV.UK · Passwords', 'https://design-system.service.gov.uk/patterns/passwords/', 'Rules and errors.')],
};

export const COMMAND_PALETTE: Depth = {
  overview: (
    <>
      <p>A CommandPalette puts every action in reach of the keyboard. ⌘K or Ctrl+K opens a level-3 pane near the top of the screen over the scrim, with a field and the commands under it, grouped. Typing filters, arrow keys move the highlight while focus stays in the field, Enter runs and Esc closes, with focus back where it was.</p>
      <p>Write commands as verbs first, Open settings, and add keywords for other words people use. Every command must also be reachable another way; the palette is a shortcut, never the only path.</p>
    </>
  ),
  whenToUse: ['Apps with many actions used by keyboard.'],
  whenNot: [{ situation: 'Searching content', to: '/components/search-input', label: 'SearchInput' }, { situation: 'A few actions on one thing', to: '/components/menu', label: 'Menu' }],
  variants: NA_V('CommandPalette'),
  anatomy: { render: <Wide><CommandPalette preview commands={CMDS} /></Wide>, parts: [{ part: 'Field', selector: '[data-component="CommandPalette"] input', what: 'Where the reader types.' }, { part: 'Group', selector: '[data-component="CommandPalette"] [role="group"]', what: 'Commands under a heading.' }, { part: 'Keys', selector: '[data-component="CommandPalette"] > p:last-child', what: 'How to move and run.' }] },
  sizes: NA_S('CommandPalette'),
  emphasis: { na: 'The highlighted row is the only lit thing.' },
  placement: { rows: [['Anywhere in the app', 'Opened by ⌘K or a button.']], examples: [{ title: 'Nothing matches', render: <Wide><CommandPalette preview commands={[]} /></Wide> }] },
  combinations: { good: [['CommandPalette + Kbd', 'Shortcuts at each row’s end.']], avoid: [{ title: 'commands without verbs', why: 'Nouns alone do not say what will happen.', render: <Wide><CommandPalette preview commands={CMDS.map((c) => ({ ...c, label: c.group ?? c.label }))} /></Wide> }] },
  content: { formula: <p>A verb first and its object, Mark as shipped.</p>, pair: { do: <Wide><CommandPalette preview commands={CMDS} /></Wide>, doNote: 'Verbs first.', dont: <Wide><CommandPalette preview commands={CMDS.map((c) => ({ ...c, label: `${c.label}…` }))} /></Wide>, dontNote: 'Ellipses that hide what happens.' }, overflow: { text: 'Long commands wrap.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><CommandPalette preview commands={[{ id: 'x', label: 'Export every print in the March album as full-size JPG', onSelect: noop }]} /></OnCard></div> }, rtl: { text: RTL('CommandPalette'), render: <div dir="rtl" lang="ar"><Wide><CommandPalette preview placeholder="اكتب أمرًا" commands={[{ id: 'n', label: 'طباعة جديدة', onSelect: noop }]} /></Wide></div> }, expansion: { text: 'Longer words wrap.', render: <Wide><CommandPalette preview commands={[{ id: 'n', label: 'Neuen Druck anlegen', onSelect: noop }]} /></Wide> } },
  behaviours: { states: [['Open', 'Over the scrim.', 'P3.'], ['Filtered', 'Results ranked.', 'P6.'], ['Empty', 'Says nothing matches.', 'P6.']], interactions: [['Keyboard', '⌘K / Ctrl+K', 'Opens and closes.', 'CommandPalette: Ctrl+K opens it and Esc closes it'], ['Keyboard', 'Type', 'Filters.', 'CommandPalette: typing filters and focus stays in the field'], ['Keyboard', '↑ / ↓', 'Moves the highlight.', 'CommandPalette: arrow keys move the highlight'], ['Mouse', 'Click a row', 'Runs it.', 'CommandPalette'], ['Touch', 'Tap a row', 'Runs it.', 'CommandPalette']], loading: <p>Show local commands at once; add remote results under them as they arrive.</p>, focus: <p>The field takes focus; closing returns focus where it was.</p> },
  deepDive: NA_D('CommandPalette'),
  modifiers: [{ name: 'hotkey', rules: <p>Keep ⌘K on; turn it off only when the app already uses that key.</p>, pair: { do: <Wide><CommandPalette preview commands={CMDS} /></Wide>, doNote: 'The usual key.', dont: <Wide><CommandPalette preview hotkey={false} commands={CMDS} /></Wide>, dontNote: 'Only by button.' } }],
  related: [['/components/menu', 'Menu', 'Actions on one thing.'], ['/components/search-input', 'SearchInput', 'Content.']],
  references: [ref('WAI-ARIA · Combobox', 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/', 'Focus stays in the field.'), ref('Apple HIG · Searching', 'https://developer.apple.com/design/human-interface-guidelines/searching', 'Quick open.')],
};

export const NOTIFICATION_CENTER: Depth = {
  overview: (
    <>
      <p>A NotificationCenter is a bell that opens a popover of notices grouped by day. Unread ones carry a dot and the word New, so unread reads by a mark and a word, and the bell’s name gives the count, Notifications, 2 unread. An empty list says Nothing new with EmptyState.</p>
      <p>Open what a notice is about when it is pressed, and mark it read. Mark all as read sits at the top. Keep urgent things out of it; they need a Banner or a Dialog the reader cannot miss.</p>
    </>
  ),
  whenToUse: ['Comments, orders and shares the reader may check later.'],
  whenNot: [{ situation: 'Something urgent', to: '/components/banner', label: 'Banner' }, { situation: 'A result of what the reader just did', to: '/components/snackbar', label: 'Snackbar' }],
  variants: NA_V('NotificationCenter'),
  anatomy: { render: <Wide><NotificationCenter preview notices={NOTES} onMarkAllRead={noop} /></Wide>, parts: [{ part: 'Heading', selector: '[data-component="NotificationCenter"] h2', what: 'Notifications.' }, { part: 'Day', selector: '[data-component="NotificationCenter"] h3', what: 'Today or Earlier.' }, { part: 'Unread dot', selector: '[data-component="NotificationCenter"] li button > span:last-child', what: 'With the word New.' }] },
  sizes: NA_S('NotificationCenter'),
  emphasis: { na: 'Unread is a dot and a word; nothing is loud.' },
  placement: { rows: [['The Navbar', 'At the end, before the account.']], examples: [{ title: 'Empty', render: <Wide><NotificationCenter preview notices={[]} /></Wide> }] },
  combinations: { good: [['NotificationCenter + Navbar', 'The bell in the bar.']], avoid: [{ title: 'a payment failure as a notice', why: 'Urgent news hidden behind a bell is missed.', render: <Wide><NotificationCenter preview notices={[{ id: 'x', title: 'Your card was declined', time: 'now', unread: true }]} /></Wide> }] },
  content: { formula: <p>Who did what to which thing, Mara commented on Lofoten, March.</p>, pair: { do: <Wide><NotificationCenter preview notices={NOTES} /></Wide>, doNote: 'Who, what, which.', dont: <Wide><NotificationCenter preview notices={[{ id: 'x', title: 'New activity', time: 'now', unread: true }]} /></Wide>, dontNote: 'Says nothing.' }, overflow: { text: 'Long notices wrap.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><NotificationCenter preview notices={[{ id: 'x', title: 'Mara Lind commented on Lofoten in March from the bridge at Reine', time: 'now' }]} /></OnCard></div> }, rtl: { text: RTL('NotificationCenter'), render: <div dir="rtl" lang="ar"><Wide><NotificationCenter preview label="الإشعارات" notices={[{ id: 'x', title: 'علّقت مارا على لوفوتن', time: 'الآن', unread: true }]} /></Wide></div> }, expansion: { text: 'Longer words wrap.', render: <Wide><NotificationCenter preview label="Benachrichtigungen" notices={[{ id: 'x', title: 'Mara hat Lofoten kommentiert', time: 'jetzt' }]} /></Wide> } },
  behaviours: { states: [['Unread', 'A dot, New and a semibold title.', 'P6.'], ['Read', 'The title in the regular weight.', 'P6.'], ['Empty', 'Nothing new.', 'P6.']], interactions: [['Keyboard', 'Enter on the bell', 'Opens the notices.', 'NotificationCenter: unread notices say New and the bell gives the count'], ['Keyboard', 'Esc', 'Closes.', 'NotificationCenter'], ['Mouse', 'Click a notice', 'Opens what it is about.', 'NotificationCenter'], ['Touch', 'Tap a notice', 'Opens what it is about.', 'NotificationCenter']], loading: <p>Open with what is cached and add new notices at the top.</p>, focus: <p>Focus goes into the popover and back to the bell on close.</p> },
  deepDive: NA_D('NotificationCenter'),
  modifiers: [{ name: 'onMarkAllRead', rules: <p>Offer it whenever there is something unread.</p>, pair: { do: <Wide><NotificationCenter preview notices={NOTES} onMarkAllRead={noop} /></Wide>, doNote: 'One press clears them.', dont: <Wide><NotificationCenter preview notices={NOTES} /></Wide>, dontNote: 'One by one.' } }],
  related: [['/components/banner', 'Banner', 'Urgent news.'], ['/components/popover', 'Popover', 'The pane it opens in.']],
  references: [ref('Atlassian · Notifications', 'https://atlassian.design/', 'Grouping and unread.'), ref('Apple HIG · Notifications', 'https://developer.apple.com/design/human-interface-guidelines/notifications', 'What deserves one.')],
};

export const COACH_MARK: Depth = {
  overview: (
    <>
      <p>A CoachMark is a small level-4 card anchored to one thing on the page, saying what it does, with Next and Skip tour. It never covers the page with a scrim and never blocks what it points at; the thing is ringed while its card is open. Esc skips the tour, and focus moves to the card when it opens.</p>
      <p>Show marks only on a first visit or after a change, one at a time, three at most. Once skipped, a tour never comes back by itself.</p>
    </>
  ),
  whenToUse: ['Pointing out something new.'],
  whenNot: [{ situation: 'Help that is always there', to: '/components/tooltip', label: 'Tooltip' }, { situation: 'An explanation with a form', to: '/components/popover', label: 'Popover' }],
  variants: NA_V('CoachMark'),
  anatomy: { render: <OnCard><CoachMark preview open title="Filter by place" description="Show only the prints from one place." step={1} total={3} onNext={noop} onSkip={noop}><Button variant="glass">Places</Button></CoachMark></OnCard>, parts: [{ part: 'Ringed thing', selector: '[data-coached]', what: 'What is pointed at.' }, { part: 'Card', selector: '[data-component="CoachMark"]', what: 'What it does.' }, { part: 'Actions', selector: '[data-component="CoachMark"] > div:last-child', what: 'Skip tour and Next.' }] },
  sizes: NA_S('CoachMark'),
  emphasis: { text: <p>One mark at a time.</p>, pair: { do: <OnCard><CoachMark preview open title="Sort by date" step={2} total={3} onNext={noop} onSkip={noop}><Button variant="glass">Sort</Button></CoachMark></OnCard>, doNote: 'One mark.', dont: <OnCard><CoachMark preview open title="Sort" onNext={noop} onSkip={noop}><Button variant="glass">Sort</Button></CoachMark><CoachMark preview open title="Share" onNext={noop} onSkip={noop}><Button variant="glass">Share</Button></CoachMark></OnCard>, dontNote: 'Two at once.' } },
  placement: { rows: [['Next to the new thing', 'On the side with room.']], examples: [{ title: 'Last mark', render: <OnCard><CoachMark preview open title="Share an album" step={3} total={3} onNext={noop} onSkip={noop}><Button variant="glass">Share</Button></CoachMark></OnCard> }] },
  combinations: { good: [['CoachMark + a new Button', 'What the button does.']], avoid: [{ title: 'a tour of ten', why: 'Nobody finishes a long tour; show three.', render: <OnCard><CoachMark preview open title="Step one" step={1} total={10} onNext={noop} onSkip={noop}><Button variant="glass">Start</Button></CoachMark></OnCard> }] },
  content: { formula: <p>What the thing does in a few words, and one sentence on why it helps.</p>, pair: { do: <OnCard><CoachMark preview open title="Filter by place" description="Show only the prints from one place." onNext={noop} onSkip={noop}><Button variant="glass">Places</Button></CoachMark></OnCard>, doNote: 'What and why.', dont: <OnCard><CoachMark preview open title="New feature!" onNext={noop} onSkip={noop}><Button variant="glass">Places</Button></CoachMark></OnCard>, dontNote: 'Says nothing.' }, overflow: { text: 'Long sentences wrap in the card.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><CoachMark preview open title="Filter by place" description="Show only the prints taken in one place, such as Lofoten or Senja, and keep the filter as you browse." onNext={noop} onSkip={noop}><Button variant="glass">Places</Button></CoachMark></OnCard></div> }, rtl: { text: RTL('CoachMark'), render: <div dir="rtl" lang="ar"><OnCard><CoachMark preview open title="التصفية حسب المكان" onNext={noop} onSkip={noop}><Button variant="glass">الأماكن</Button></CoachMark></OnCard></div> }, expansion: { text: 'Longer words wrap.', render: <OnCard><CoachMark preview open title="Nach Ort filtern" onNext={noop} onSkip={noop}><Button variant="glass">Orte</Button></CoachMark></OnCard> } },
  behaviours: { states: [['Open', 'The thing ringed, the card beside it.', 'P3.'], ['Last', 'Done instead of Next.', 'P5.']], interactions: [['Keyboard', 'Enter on Next', 'The next mark.', 'CoachMark: the card says its step, with Skip tour and Next'], ['Keyboard', 'Esc', 'Skips the tour.', 'CoachMark: Esc skips the tour'], ['Mouse', 'Click Skip tour', 'Ends the tour.', 'CoachMark'], ['Touch', 'Tap Next', 'The next mark.', 'CoachMark']], loading: <p>Wait until the thing is on screen before showing its mark.</p>, focus: <p>The card’s title takes focus; the tour’s end returns focus to the page.</p> },
  deepDive: NA_D('CoachMark'),
  modifiers: [{ name: 'step / total', rules: <p>Say where the reader is in a tour.</p>, pair: { do: <OnCard><CoachMark preview open title="Sort by date" step={2} total={3} onNext={noop} onSkip={noop}><Button variant="glass">Sort</Button></CoachMark></OnCard>, doNote: '2 of 3.', dont: <OnCard><CoachMark preview open title="Sort by date" onNext={noop} onSkip={noop}><Button variant="glass">Sort</Button></CoachMark></OnCard>, dontNote: 'How many more?' } }],
  related: [['/components/tooltip', 'Tooltip', 'Always-there help.'], ['/components/popover', 'Popover', 'Details on demand.']],
  references: [ref('NN/g · Onboarding tutorials', 'https://www.nngroup.com/articles/onboarding-tutorials/', 'Short and skippable.'), ref('Apple HIG · Onboarding', 'https://developer.apple.com/design/human-interface-guidelines/onboarding', 'Teach in context.')],
};

export const KANBAN_BOARD: Depth = {
  overview: (
    <>
      <p>A KanbanBoard is columns of cards that move by drag and by keyboard alike. Space picks a card up, arrow keys carry it within and across columns, Space drops it and Esc puts it back. Every move is said aloud. Columns are level-2 panes and cards are small lit panes; a held card lifts a little, as an object picked up.</p>
      <p>Use it for work that moves through stages, such as print orders. Keep the columns few and named for the stage, and save each move as it happens.</p>
    </>
  ),
  whenToUse: ['Work that moves through stages.'],
  whenNot: [{ situation: 'Rows to sort and filter', to: '/components/data-grid', label: 'DataGrid' }],
  variants: NA_V('KanbanBoard'),
  anatomy: { render: <Wide><KanbanBoard label="Orders" columns={COLS} onChange={noop} /></Wide>, parts: [{ part: 'Column', selector: '[data-component="KanbanBoard"] section', what: 'A stage.' }, { part: 'Card', selector: '[data-component="KanbanBoard"] [data-card]', what: 'A piece of work.' }, { part: 'Hint', selector: '[data-component="KanbanBoard"] > p:first-child', what: 'How to move by keyboard.' }] },
  sizes: NA_S('KanbanBoard'),
  emphasis: { na: 'Cards are equal; nothing is loud.' },
  placement: { rows: [['A full page', 'The board and its filters.']], examples: [{ title: 'Two columns', render: <Wide><KanbanBoard label="Projects" columns={COLS} onChange={noop} /></Wide> }] },
  combinations: { good: [['KanbanBoard + Sheet', 'A card’s details.']], avoid: [{ title: 'twelve columns', why: 'Columns past the screen hide work.', render: <Wide><KanbanBoard label="Stages" columns={Array.from({ length: 8 }, (_, i) => ({ id: `c${i}`, title: `Stage ${i + 1}`, cards: [] }))} onChange={noop} /></Wide> }] },
  content: { formula: <p>Columns are stages, To print; cards are the thing, Lofoten, March.</p>, pair: { do: <Wide><KanbanBoard label="Orders" columns={COLS} onChange={noop} /></Wide>, doNote: 'Stages and things.', dont: <Wide><KanbanBoard label="Board" columns={COLS.map((c, i) => ({ ...c, title: `Column ${i + 1}` }))} onChange={noop} /></Wide>, dontNote: 'Numbers.' }, overflow: { text: 'Columns scroll sideways.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><KanbanBoard label="Orders" columns={COLS} onChange={noop} /></OnCard></div> }, rtl: { text: 'Columns run from the right; arrows follow.', render: <div dir="rtl" lang="ar"><Wide><KanbanBoard label="الطلبات" columns={[{ id: 'a', title: 'للطباعة', cards: [{ id: 'k', title: 'لوفوتن' }] }, { id: 'b', title: 'جاهز', cards: [] }]} onChange={noop} /></Wide></div> }, expansion: { text: 'Longer titles wrap.', render: <Wide><KanbanBoard label="Aufträge" columns={[{ id: 'a', title: 'Zu drucken', cards: [{ id: 'k', title: 'Lofoten im März' }] }]} onChange={noop} /></Wide> } },
  behaviours: { states: [['Rest', 'Cards on columns.', 'P3.'], ['Held', 'The card lifts with a ring.', 'P4.'], ['Over a column', 'The column lights.', 'P6.']], interactions: [['Keyboard', 'Space', 'Picks up or drops.', 'KanbanBoard: Space picks a card up, arrows carry it and Space drops it, said aloud'], ['Keyboard', 'Esc', 'Puts it back.', 'KanbanBoard: Esc puts a moved card back'], ['Mouse', 'Drag', 'Moves a card.', 'KanbanBoard'], ['Touch', 'Press and drag', 'Moves a card.', 'KanbanBoard']], loading: <p>Show the columns at once and fill cards as they load.</p>, focus: <p>Focus stays on the card as it moves.</p> },
  deepDive: NA_D('KanbanBoard'),
  modifiers: { na: 'KanbanBoard has no optional slots or booleans.' },
  related: [['/components/data-grid', 'DataGrid', 'Rows of work.']],
  references: [ref('Atlassian · Drag and drop', 'https://atlassian.design/components/pragmatic-drag-and-drop/', 'Keyboard moves.'), ref('WCAG 2.5.7', 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements', 'A way without dragging.')],
};

export const FEED: Depth = {
  overview: (
    <>
      <p>A Feed is a stream of articles that loads more as the reader nears the end, the WAI-ARIA feed. Page Down and Page Up move between articles, the feed is busy while it loads, and it ends with words, You are all caught up, instead of a spinner that never stops. A Load more button stays for anyone who does not scroll.</p>
      <p>The feed brings no pane; each article brings its Card. Never put a footer under an endless feed; nobody can reach it.</p>
    </>
  ),
  whenToUse: ['Posts, comments or activity, newest first.'],
  whenNot: [{ situation: 'A list with an end', to: '/components/list', label: 'List' }, { situation: 'Pages of results', to: '/components/pagination', label: 'Pagination' }],
  variants: NA_V('Feed'),
  anatomy: { render: <Feed label="Latest" items={POSTS} getKey={(x) => x.id} getLabel={(x) => x.t} hasMore={false} renderItem={post} />, parts: [{ part: 'Article', selector: '[data-component="Feed"] article', what: 'One post, focusable.' }, { part: 'End', selector: '[data-component="Feed"] > div:last-child', what: 'Said in words.' }] },
  sizes: NA_S('Feed'),
  emphasis: { na: 'Articles are equal.' },
  placement: { rows: [['A home page', 'The main column.']], examples: [{ title: 'Loading', render: <Feed label="Latest" loading items={POSTS} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={post} /> }] },
  combinations: { good: [['Feed + Card', 'Each article a card.']], avoid: [{ title: 'a footer under it', why: 'An endless feed pushes the footer away forever.', render: <div><Feed label="Latest" items={POSTS} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={post} onLoadMore={noop} /><Text size="label" tone="secondary">Footer links</Text></div> }] },
  content: { formula: <p>Each article is named by who and what, Mara posted Lofoten, March.</p>, pair: { do: <Feed label="Latest" hasMore={false} items={POSTS} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={post} />, doNote: 'Named articles.', dont: <Feed label="Feed" hasMore={false} items={POSTS} getKey={(x) => x.id} getLabel={() => 'Post'} renderItem={post} />, dontNote: 'Every article is Post.' }, overflow: { text: 'Articles wrap in their cards.', render: <div data-overflow-demo="" className="overflow-probe"><Feed label="Latest" hasMore={false} items={[{ id: 1, t: 'Mara Lind posted Lofoten in March from the bridge at Reine' }]} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={post} /></div> }, rtl: { text: RTL('Feed'), render: <div dir="rtl" lang="ar"><Feed label="الأحدث" hasMore={false} items={[{ id: 1, t: 'نشرت مارا صورة' }]} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={post} /></div> }, expansion: { text: 'Longer words wrap.', render: <Feed label="Neueste" hasMore={false} items={[{ id: 1, t: 'Mara hat ein Foto veröffentlicht' }]} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={post} /> } },
  behaviours: { states: [['Loading', 'Busy, Loading more.', 'P6.'], ['End', 'You are all caught up.', 'P6.']], interactions: [['Keyboard', 'Page Down / Page Up', 'The next or previous article.', 'Feed: articles are in a feed and Page Down moves between them'], ['Keyboard', 'Enter on Load more', 'Loads more.', 'Feed'], ['Mouse', 'Scroll', 'Loads more near the end.', 'Feed: the end of a feed is said in words'], ['Touch', 'Swipe', 'Loads more near the end.', 'Feed']], loading: <p>Mark the feed busy and say Loading more under the last article.</p>, focus: <p>Focus stays on the article the reader is on as more load.</p> },
  deepDive: NA_D('Feed'),
  modifiers: [{ name: 'hasMore', rules: <p>Set it false at the end so the feed says so.</p>, pair: { do: <Feed label="Activity" hasMore={false} items={POSTS} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={post} />, doNote: 'An end in words.', dont: <Feed label="Activity" loading items={POSTS} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={post} />, dontNote: 'A spinner that never stops.' } }],
  related: [['/components/list', 'List', 'A list with an end.'], ['/components/pagination', 'Pagination', 'Pages.']],
  references: [ref('WAI-ARIA · Feed', 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/', 'Keys and busy state.'), ref('NN/g · Infinite scrolling', 'https://www.nngroup.com/articles/infinite-scrolling/', 'When it helps.')],
};

export const APP_SHELL: Depth = {
  overview: (
    <>
      <p>An AppShell is the frame of an app, with the header on top, a sidebar beside the content on a wide screen, a bottom bar instead on a narrow one, and an optional aside. It measures its own width with container queries, so it works inside a docs stage as well as a whole window, and it adds a skip link to the main content.</p>
      <p>Pass the parts you have, such as Navbar, Sidebar and BottomNav. Give the same destinations to the sidebar and the bottom bar, so the app is the same app at every width.</p>
    </>
  ),
  whenToUse: ['The frame of an app with several sections.'],
  whenNot: [{ situation: 'A reading page', to: '/components/container', label: 'Container' }],
  variants: NA_V('AppShell'),
  anatomy: { render: <div className="demo-wide"><AppShell sidebar={SIDE} bottomNav={<BottomNav position="contained" current="#a" items={[{ href: '#a', label: 'Orders', icon: <span /> }, { href: '#b', label: 'Prints', icon: <span /> }]} />}><OnCard><Text>Orders</Text></OnCard></AppShell></div>, parts: [{ part: 'Main', selector: '[data-component="AppShell"] main', what: 'The page itself.' }, { part: 'Bottom bar', selector: '[data-component="AppShell"] [data-component="BottomNav"]', what: 'Narrow shells; a sidebar replaces it when wide.' }] },
  sizes: NA_S('AppShell'),
  emphasis: { na: 'The frame is quiet; the page is the content.' },
  placement: { rows: [['The root of an app', 'Around every page.']], examples: [{ title: 'Narrow', render: <div className="demo-narrow"><AppShell bottomNav={<BottomNav position="contained" current="#a" items={[{ href: '#a', label: 'Feed', icon: <span /> }, { href: '#b', label: 'You', icon: <span /> }]} />}><OnCard><Text>Feed</Text></OnCard></AppShell></div> }] },
  combinations: { good: [['AppShell + Navbar + Sidebar', 'A wide app.'], ['AppShell + BottomNav', 'A phone.']], avoid: [{ title: 'different destinations by width', why: 'A page that exists only on wide screens is lost on a phone.', render: <div className="demo-wide"><AppShell sidebar={SIDE}><OnCard><Text>Only in the sidebar</Text></OnCard></AppShell></div> }] },
  content: { formula: <p>Name the main landmark for the section when a page has several headings, Orders.</p>, pair: { do: <div className="demo-wide"><AppShell label="Orders" sidebar={SIDE}><OnCard><Text>Orders</Text></OnCard></AppShell></div>, doNote: 'Named.', dont: <div className="demo-wide"><AppShell sidebar={SIDE}><OnCard><Text>Orders</Text></OnCard></AppShell></div>, dontNote: 'An unnamed main among several.' }, overflow: { text: 'The content shrinks; the sidebar keeps its width.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><AppShell sidebar={SIDE}><Text>Orders</Text></AppShell></OnCard></div> }, rtl: { text: 'The sidebar moves to the right.', render: <div dir="rtl" lang="ar" className="demo-wide"><AppShell sidebar={SIDE}><OnCard><Text>الطلبات</Text></OnCard></AppShell></div> }, expansion: { text: 'Longer labels wrap in the sidebar.', render: <div className="demo-wide"><AppShell sidebar={<Sidebar current="#a" sections={[{ items: [{ href: '#a', label: 'Bestellungen' }] }]} />}><OnCard><Text>Bestellungen</Text></OnCard></AppShell></div> } },
  behaviours: plain('AppShell', 'the skip link moves focus to the main content', [['Keyboard', 'Tab, then Enter', 'Skip to content.', 'AppShell: the skip link moves focus to the main content'], ['Mouse', 'Resize', 'Sidebar or bottom bar.', 'AppShell: either the sidebar or the bottom bar shows, never both'], ['Touch', 'Tap the bottom bar', 'Changes section.', 'AppShell']]),
  deepDive: NA_D('AppShell'),
  modifiers: [{ name: 'aside', rules: <p>A details panel for the chosen item, beside the content when very wide.</p>, pair: { do: <div className="demo-wide"><AppShell sidebar={SIDE} aside={<OnCard><Text>Lofoten, March</Text></OnCard>}><OnCard><Text>Prints</Text></OnCard></AppShell></div>, doNote: 'Details beside.', dont: <div className="demo-wide"><AppShell aside={<OnCard><Text>Ads</Text></OnCard>}><OnCard><Text>Prints</Text></OnCard></AppShell></div>, dontNote: 'An aside that is not about the page.' } }],
  related: [['/components/navbar', 'Navbar', 'The top bar.'], ['/components/sidebar', 'Sidebar', 'Wide navigation.'], ['/components/bottom-nav', 'BottomNav', 'Phone navigation.']],
  references: [ref('WAI · Skip links', 'https://webaim.org/techniques/skipnav/', 'The first stop.'), ref('Material · Navigation', 'https://m3.material.io/foundations/layout/applying-layout/window-size-classes', 'Bars by width.')],
};

export const SETTINGS_LAYOUT: Depth = {
  overview: (
    <>
      <p>A SettingsLayout is a settings page with a heading, then groups as inset panes with hairlines between rows, each row a name, a sentence and its control at the end, the way system settings are laid out. On a narrow pane the control drops under its words.</p>
      <p>Save each setting as it changes, and say so near the control if it can fail. Give each control the same name as its row, so a screen reader hears the setting and its state together.</p>
    </>
  ),
  whenToUse: ['Preferences and account settings.'],
  whenNot: [{ situation: 'A form sent all at once', to: '/components/form', label: 'Form' }],
  variants: NA_V('SettingsLayout'),
  anatomy: { render: <OnCard><SettingsLayout title="Settings"><SettingsGroup title="Notifications"><SettingsRow label="Order emails" description="An email for every order." control={<Switch label={hidden('Order emails')} defaultChecked />} /></SettingsGroup></SettingsLayout></OnCard>, parts: [{ part: 'Group', selector: '[data-component="SettingsLayout"] section', what: 'A heading and its rows.' }, { part: 'Row', selector: '[data-component="SettingsLayout"] section > div:last-child > div', what: 'Name, sentence, control.' }] },
  sizes: NA_S('SettingsLayout'),
  emphasis: { na: 'Settings are quiet; nothing is loud.' },
  placement: { rows: [['A settings page', 'Under the app’s header.']], examples: [{ title: 'Account', render: <OnCard><SettingsLayout title="Account"><SettingsGroup title="Sign-in"><SettingsRow label="Email" description="mara@lind.no" control={<Button variant="glass" size="sm">Change</Button>} /></SettingsGroup></SettingsLayout></OnCard> }] },
  combinations: { good: [['SettingsRow + Switch', 'On or off.'], ['SettingsRow + Button', 'Opens a step.']], avoid: [{ title: 'a Save button for switches', why: 'A switch acts at once; a Save button makes the reader wonder.', render: <OnCard><SettingsLayout title="Settings"><SettingsGroup title="Email"><SettingsRow label="Order emails" control={<Switch label={hidden('Order emails')} />} /></SettingsGroup><Button>Save</Button></SettingsLayout></OnCard> }] },
  content: { formula: <p>Name what the setting does, Order emails, with a sentence on its effect.</p>, pair: { do: <OnCard><SettingsLayout title="Settings"><SettingsGroup title="Email"><SettingsRow label="Order emails" description="An email for every new order." control={<Switch label={hidden('Order emails')} />} /></SettingsGroup></SettingsLayout></OnCard>, doNote: 'What it does.', dont: <OnCard><SettingsLayout title="Settings"><SettingsGroup title="Email"><SettingsRow label="Enable" control={<Switch label={hidden('Enable')} />} /></SettingsGroup></SettingsLayout></OnCard>, dontNote: 'Enable what?' }, overflow: { text: 'The control drops under the words when narrow.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><SettingsLayout title="Settings"><SettingsGroup title="Email"><SettingsRow label="Send me an email whenever a print sells" control={<Switch label={hidden('Sales emails')} />} /></SettingsGroup></SettingsLayout></OnCard></div> }, rtl: { text: 'The control moves to the left end.', render: <div dir="rtl" lang="ar"><OnCard><SettingsLayout title="الإعدادات"><SettingsGroup title="البريد"><SettingsRow label="رسائل الطلبات" control={<Switch label={hidden('رسائل الطلبات')} />} /></SettingsGroup></SettingsLayout></OnCard></div> }, expansion: { text: 'Longer names wrap.', render: <OnCard><SettingsLayout title="Einstellungen"><SettingsGroup title="E-Mail"><SettingsRow label="Bestellbenachrichtigungen" control={<Switch label={hidden('Bestellbenachrichtigungen')} />} /></SettingsGroup></SettingsLayout></OnCard> } },
  behaviours: plain('SettingsLayout', 'each row names its control', [['Keyboard', 'Tab', 'Each control in order.', 'SettingsLayout: each row names its control'], ['Mouse', 'Click a control', 'Changes the setting.', 'SettingsLayout'], ['Touch', 'Tap a control', 'Changes the setting.', 'SettingsLayout']]),
  deepDive: NA_D('SettingsLayout'),
  modifiers: [{ name: 'description', rules: <p>Add a sentence when the name alone does not say the effect.</p>, pair: { do: <OnCard><SettingsLayout title="Settings"><SettingsGroup title="Shop"><SettingsRow label="Holiday mode" description="Hides prices and pauses orders." control={<Switch label={hidden('Holiday mode')} />} /></SettingsGroup></SettingsLayout></OnCard>, doNote: 'The effect is said.', dont: <OnCard><SettingsLayout title="Settings"><SettingsGroup title="Shop"><SettingsRow label="Holiday mode" control={<Switch label={hidden('Holiday mode')} />} /></SettingsGroup></SettingsLayout></OnCard>, dontNote: 'What does it do?' } }],
  related: [['/components/list', 'List', 'The inset pane.'], ['/components/switch', 'Switch', 'On or off.']],
  references: [ref('Apple HIG · Settings', 'https://developer.apple.com/design/human-interface-guidelines/settings', 'Groups and rows.'), ref('NN/g · Toggle switches', 'https://www.nngroup.com/articles/toggle-switch-guidelines/', 'Act at once.')],
};

export const RICH_TEXT_EDITOR: Depth = {
  overview: (
    <>
      <p>A RichTextEditor is a field for short formatted text, a description or a comment. A toolbar of the few marks that matter sits over Input’s groove, which holds the text. The toolbar is one tab stop with arrow keys between its buttons, and each button says whether its mark is on with aria-pressed. Pasted text arrives as plain text, so it takes the field’s own type.</p>
      <p>Clean the HTML it hands you on the server before showing it to others. For plain text, use Textarea; for a long document, use a real editor.</p>
    </>
  ),
  whenToUse: ['A description or a comment with bold, lists and links.'],
  whenNot: [{ situation: 'Plain text', to: '/components/textarea', label: 'Textarea' }],
  variants: NA_V('RichTextEditor'),
  anatomy: { render: <OnCard><FormField label="Caption"><RichTextEditor defaultValue="<p>Reine at first light, from the <strong>bridge</strong>.</p>" /></FormField></OnCard>, parts: [{ part: 'Toolbar', selector: '[data-component="RichTextEditor"] [role="toolbar"]', what: 'One tab stop.' }, { part: 'Text', selector: '[data-component="RichTextEditor"] [role="textbox"]', what: 'Input’s groove.' }] },
  sizes: NA_S('RichTextEditor'),
  emphasis: { na: 'A mark that is on takes chosen glass; nothing is loud.' },
  placement: { rows: [['A product form', 'For the description.'], ['Under a post', 'For a comment.']], examples: [{ title: 'Empty', render: <OnCard><FormField label="Comment"><RichTextEditor placeholder="Write a comment" rows={3} /></FormField></OnCard> }] },
  combinations: { good: [['RichTextEditor + FormField', 'Label and help.']], avoid: [{ title: 'for a name', why: 'A name has no formatting; an Input is simpler.', render: <OnCard><FormField label="Name"><RichTextEditor rows={1} /></FormField></OnCard> }] },
  content: { formula: <p>The placeholder says what to write, Say something about the print.</p>, pair: { do: <OnCard><FormField label="Caption"><RichTextEditor placeholder="Say something about the print" rows={2} /></FormField></OnCard>, doNote: 'What to write.', dont: <OnCard><FormField label="Caption"><RichTextEditor placeholder="Type here" rows={2} /></FormField></OnCard>, dontNote: 'Says nothing.' }, overflow: { text: 'Long text wraps and the field grows.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><FormField label="Caption"><RichTextEditor defaultValue="<p>Reine at first light, from the bridge, the morning the fog lifted off the water.</p>" rows={2} /></FormField></OnCard></div> }, rtl: { text: 'Text and toolbar run from the right.', render: <div dir="rtl" lang="ar"><OnCard><FormField label="الوصف"><RichTextEditor defaultValue="<p>ريني عند الفجر</p>" rows={2} /></FormField></OnCard></div> }, expansion: { text: 'Longer words wrap.', render: <OnCard><FormField label="Beschreibung"><RichTextEditor defaultValue="<p>Reine im Morgenlicht</p>" rows={2} /></FormField></OnCard> } },
  behaviours: { states: [['Empty', 'The placeholder.', 'P2.'], ['Mark on', 'Chosen glass and aria-pressed.', 'P6.'], ['Disabled', 'Dimmed, read only.', 'P6.']], interactions: [['Keyboard', '← / → in the toolbar', 'Moves between tools.', 'RichTextEditor: the toolbar is one tab stop with arrow keys between tools'], ['Keyboard', 'Ctrl+B / Ctrl+I / Ctrl+K', 'Bold, italic, link.', 'RichTextEditor'], ['Mouse', 'Click a tool', 'Applies the mark.', 'RichTextEditor: a mark says when it is on'], ['Touch', 'Tap a tool', 'Applies the mark.', 'RichTextEditor']], loading: <p>Show the saved text at once.</p>, focus: <p>Tools keep focus in the text after a press.</p> },
  deepDive: NA_D('RichTextEditor'),
  modifiers: [{ name: 'rows', rules: <p>Size the field to what is usually written.</p>, pair: { do: <OnCard><FormField label="Comment"><RichTextEditor rows={3} /></FormField></OnCard>, doNote: 'Room for a comment.', dont: <OnCard><FormField label="Comment"><RichTextEditor rows={12} /></FormField></OnCard>, dontNote: 'A wall for a sentence.' } }],
  related: [['/components/textarea', 'Textarea', 'Plain text.'], ['/components/editable', 'Editable', 'One value in place.']],
  references: [ref('WAI-ARIA · Toolbar', 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/', 'One tab stop.'), ref('GOV.UK · Textarea', 'https://design-system.service.gov.uk/components/textarea/', 'When plain is better.')],
};
