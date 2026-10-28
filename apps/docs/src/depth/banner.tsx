// Banner's Usage tab (component-depth.md U1–U14). The form is derivation C, a line on the pane
// (Banner.why.json); Carbon's notification page set the depth only.
import { Banner, Button, Card } from 'pane-react';
import type { Depth } from './types';

const Pane = ({ title = 'Billing', children }: { title?: string; children: React.ReactNode }) => (
  <Card as="section" aria-label={title} className="demo-card">{children}<h3 className="flush">{title}</h3><p className="flush muted">Plan Pro · renews 1 Dec</p></Card>
);

export const BANNER: Depth = {
  overview: (
    <>
      <p>A banner tells the reader something about the pane it sits on. A card that will stop working when the payment card expires says so in its first line. A post that failed to upload says so above the post. The message lives where the problem is, so the reader never has to work out which part of the screen it refers to.</p>
      <p>In Pane a banner is a line written on the glass. It has no box, no fill and no coloured stripe on its edge. A pane is one sheet of glass, and a second surface inside it would be a layer that is not there (P3). The scene owns the colour, so the only coloured mark is a small glyph (P1). A hairline separates the message from the rest of the pane.</p>
      <p>Banners report. They never ask. If the reader has to decide something before they can go on, the message belongs in a dialog, which Pane does not have yet. A banner the reader can ignore for a week and still use the pane is the right kind of banner.</p>
    </>
  ),
  whenToUse: [
    'A lasting condition of the pane, such as a card about to expire, a feature in beta or planned maintenance.',
    'The result of something the reader just did, such as Saved or Upload failed, written on the pane they did it in.',
    'A short instruction that unblocks the pane, such as Connect a calendar to see free times.',
  ],
  whenNot: [
    { situation: 'One word of status on an item, such as New or Draft', to: '/components/badge', label: 'Badge' },
    { situation: 'A count or label that belongs to the item', to: '/components/tag', label: 'Tag' },
    { situation: 'The reader must decide before going on', to: '/reference/status', label: 'Dialog (planned, wave 4)' },
    { situation: 'Validation of one form field', to: '/reference/status', label: 'FormField error text (planned, wave 3)' },
  ],
  variants: {
    info: { purpose: 'Neutral news about the pane, such as a feature rollout or a change in terms. Circle glyph, spoken as Info.', pairing: 'Can sit above any other tone. Use it for anything that is not a success, a risk or a failure.' },
    positive: { purpose: 'Confirms that something the reader did worked, such as Saved or Payment received. Check glyph, spoken as Success.', pairing: 'Usually arrives live and polite, and is dismissible or leaves when the reader moves on.' },
    warning: { purpose: 'Something will go wrong unless the reader acts, such as an expiring card. Triangle glyph, spoken as Warning.', pairing: 'Pair it with the action that prevents the problem. Never stack two warnings on one pane.' },
    critical: { purpose: 'Something already went wrong and the pane cannot do its job, such as a failed payment. Octagon glyph, spoken as Error.', pairing: 'The one banner whose action may use the loud solid, when fixing the error is the pane’s only task.' },
  },
  anatomy: {
    render: <Card as="section" aria-label="Billing" className="demo-card"><Banner tone="warning" title="Card expires next month" action={<Button size="sm" variant="glass">Update</Button>} onDismiss={() => {}}>Update it to avoid a pause in your plan.</Banner><h3 className="flush">Billing</h3></Card>,
    parts: [
      { part: 'Glyph', selector: '[data-component="Banner"] svg', what: '18px outline in the tone colour, a different shape for each tone so colour is never the only cue (P6).' },
      { part: 'Title', selector: '[data-component="Banner"] p', what: 'One line saying what happened. Semibold, the heaviest text in the line, read after the tone word.' },
      { part: 'Detail', selector: '[data-component="Banner"] p + div', what: 'Optional. Secondary text under the title saying why and what to do.' },
      { part: 'Action', selector: '[data-component="Banner"] [data-component="Button"]', what: 'Optional, at the end of the line. Quiet by default.' },
      { part: 'Dismiss', selector: '[data-component="Banner"] button[aria-label="Dismiss"]', what: 'Optional. A 32px quiet disc with a 44px press area, named Dismiss.' },
      { part: 'Hairline', selector: '[data-component="Banner"]', what: 'Separates the message from the pane’s own content. The last line of a pane has none.' },
    ],
    perVariant: 'All four tones share these parts. Only the glyph’s shape and colour and the spoken tone word change.',
  },
  sizes: { na: 'Banner has one size. It takes the width of the pane it is written on and its height from its text.' },
  emphasis: {
    text: (
      <>
        <p>A pane holds one banner as a rule and two at most. Each banner competes with the pane’s own content, so a third one usually means the messages belong somewhere else, such as a notification list.</p>
        <p>Critical outranks everything. When it is present it is the first line and the pane’s loud action fixes it. Other tones keep their action quiet, because the pane still has its own job and its own loud button.</p>
      </>
    ),
    pair: {
      do: <Pane><Banner tone="warning" title="Card expires next month" action={<Button size="sm" variant="glass">Update</Button>} /></Pane>,
      doNote: 'One message, a quiet action, and the pane still reads as Billing.',
      dont: <Pane><Banner tone="warning" title="Card expires next month" /><Banner tone="info" title="New invoices layout" /><Banner tone="positive" title="Plan renewed" /></Pane>,
      dontNote: 'Three banners stacked. The pane turns into a notification feed.',
    },
  },
  placement: {
    rows: [
      ['First line of a pane', 'The default. The message is about this pane, so it is the first thing in it.'],
      ['Above one item in a list', 'A message about that item, such as a post that failed to upload.'],
      ['Top of a reading page', 'Docs or settings, with no glass (P7). The same line on an opaque page.'],
    ],
    examples: [
      { title: 'First line of a pane', render: <Pane><Banner tone="info" title="Invoices moved to Documents" /></Pane> },
      { title: 'Above one item', render: <Card as="article" aria-label="Post" className="demo-card"><Banner tone="critical" title="Upload failed" action={<Button size="sm">Retry</Button>}>The photo is larger than 25 MB.</Banner><p className="flush">Blue hour over Bergen harbour.</p></Card> },
    ],
  },
  combinations: {
    good: [
      ['Banner + quiet Button', 'The usual action, such as Update or View.'],
      ['critical Banner + loud Button', 'Fixing the error is the pane’s only task, such as Retry payment.'],
      ['Banner + Dismiss', 'News the reader can clear once read, such as a rollout.'],
      ['positive Banner, live polite', 'Confirming an action the reader just took.'],
    ],
    avoid: [
      { title: 'two loud actions', why: 'The banner’s loud action and the pane’s loud action compete. Keep one.', render: <Card as="div" className="demo-card"><Banner tone="warning" title="Card expires soon" action={<Button size="sm">Update</Button>} /><div className="demo-row"><Button>Upgrade plan</Button></div></Card> },
      { title: 'dismissing a critical message', why: 'An error that can be dismissed without fixing it stays broken and silent.', render: <Card as="div" className="demo-card"><Banner tone="critical" title="Payment failed" onDismiss={() => {}} /></Card> },
    ],
  },
  content: {
    formula: (
      <>
        <p>The title says what happened, in one short sentence, in plain words. The detail says why and what to do next. Leave codes and blame out of both. Upload failed with The file is larger than 25 MB is useful. Error 413 is not.</p>
        <p>Write the title so it still makes sense spoken after the tone word, because a screen reader says Warning, Card expires next month. Skip the word Warning in the title itself. The action label is a verb that fixes the problem, such as Update card.</p>
      </>
    ),
    pair: {
      do: <Card as="div" className="demo-card"><Banner tone="critical" title="Upload failed">The file is larger than 25 MB. Try a smaller photo.</Banner></Card>,
      doNote: 'What happened, why, and what to try next.',
      dont: <Card as="div" className="demo-card"><Banner tone="critical" title="Error 413" /></Card>,
      dontNote: 'A code with no reason and no next step.',
    },
    overflow: { text: 'Long titles and details wrap. The actions drop below the text when the pane is narrow, so nothing is cut off and nothing truncates.', render: <div data-overflow-demo="" className="overflow-probe"><Card as="div" className="demo-card"><Banner tone="warning" title="Your card ending 4421 expires next month and the Pro plan will pause on renewal" action={<Button size="sm" variant="glass">Update</Button>}>Update it before 1 December to keep shared albums online.</Banner></Card></div> },
    rtl: { text: 'In right-to-left languages the line mirrors. The glyph sits on the right, the action and Dismiss on the left.', render: <div dir="rtl" lang="ar"><Card as="div" className="demo-card"><Banner tone="warning" title="تنتهي صلاحية البطاقة الشهر المقبل" action={<Button size="sm" variant="glass">تحديث</Button>} /></Card></div> },
    expansion: { text: 'At 30% longer, as in German, the title wraps to a second line and the action keeps its place at the end.', render: <Card as="div" className="demo-card"><Banner tone="warning" title="Ihre Karte läuft nächsten Monat ab" action={<Button size="sm" variant="glass">Aktualisieren</Button>} /></Card> },
  },
  behaviours: {
    states: [
      ['Present on load', 'Sits in place, silent to screen readers.', 'Announcing what was already there interrupts for nothing.'],
      ['Arriving', 'Its row opens from zero height over 640ms on the soft ease.', 'The content below slides down gently (P4).'],
      ['Dismissed', 'Its row closes over 420ms, then onDismiss runs.', 'The rest of the pane slides up instead of jumping (P4).'],
      ['Reduced motion', 'Appears and leaves at once.', 'Motion is removed entirely (P6).'],
      ['Forced colours', 'The glyph and text take system colours; the hairline stays.', 'Structure survives without glass (P6).'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the action, then to Dismiss.', 'Banner: dismiss is a named button and removes the banner'],
      ['Keyboard', 'Enter', 'Runs the focused action or dismisses.', 'Native button'],
      ['Mouse', 'Click', 'Dismiss closes the row, then calls onDismiss.', 'Banner: dismiss is a named button and removes the banner'],
      ['Touch', 'Tap', 'The 32px Dismiss disc has a 44px press area.', 'Banner.why.json'],
    ],
    loading: <p>A banner can report the end of a long action, such as Upload finished. While the action runs, show progress where the action happened and keep the banner for the outcome. Set <code>live="polite"</code> on a success and <code>live="assertive"</code> on a failure that stops the pane.</p>,
    focus: <p>A banner takes no focus when it appears. Moving focus would pull the reader away from what they were doing. When the reader dismisses a banner with the keyboard, the app should move focus to the pane’s heading so it is not lost.</p>,
  },
  deepDive: {
    info: {
      purpose: <p>Info is for news. Nothing is wrong and nothing needs doing today, but the reader should know. Use it sparingly, because a pane with a permanent info line teaches people to skip the first line of every pane.</p>,
      context: <Pane title="Invoices"><Banner tone="info" title="Invoices now include VAT numbers" onDismiss={() => {}} /></Pane>,
      practices: ['Make info banners dismissible.', 'Retire them after the change is old news.'],
      pair: { do: <Pane><Banner tone="info" title="Invoices moved to Documents" onDismiss={() => {}} /></Pane>, doNote: 'News, and the reader can clear it.', dont: <Pane><Banner tone="info" title="Payment failed" /></Pane>, dontNote: 'A failure dressed as info. The glyph and the word say it is fine.' },
    },
    positive: {
      purpose: <p>Positive confirms that an action worked. It usually arrives right after the reader acts, so it is live and polite, and it can go away on its own when the reader moves on.</p>,
      context: <Card as="section" aria-label="Profile" className="demo-card"><Banner tone="positive" title="Profile saved" live="polite" /><h3 className="flush">Profile</h3></Card>,
      practices: ['Say what was done, as in Profile saved.', 'Keep it short. Confirmation needs no detail.'],
      pair: { do: <Card as="div" className="demo-card"><Banner tone="positive" title="Payment received" /></Card>, doNote: 'States the result.', dont: <Card as="div" className="demo-card"><Banner tone="positive" title="Success!">Your request was processed successfully.</Banner></Card>, dontNote: 'Success with no subject, then the same thing again.' },
    },
    warning: {
      purpose: <p>Warning says something will go wrong unless the reader acts. It always comes with the action that prevents the problem, so the reader can fix it without searching.</p>,
      context: <Pane><Banner tone="warning" title="Card expires next month" action={<Button size="sm" variant="glass">Update card</Button>}>Update it before 1 December to avoid a pause.</Banner></Pane>,
      practices: ['Name the date or the threshold.', 'Offer the fixing action at the end of the line.'],
      pair: { do: <Pane><Banner tone="warning" title="Storage 90% full" action={<Button size="sm" variant="glass">Free up space</Button>} /></Pane>, doNote: 'The problem and the way out.', dont: <Pane><Banner tone="warning" title="Storage 90% full" /></Pane>, dontNote: 'A warning with nowhere to go.' },
    },
    critical: {
      purpose: <p>Critical means the pane cannot do its job until something is fixed. It is the first line of the pane. Its action may be the loud solid, because fixing the error has become the pane’s main task.</p>,
      context: <Card as="section" aria-label="Billing" className="demo-card"><Banner tone="critical" title="Payment failed" action={<Button size="sm">Retry payment</Button>}>Your bank declined the charge on 1 Nov.</Banner><h3 className="flush">Billing</h3></Card>,
      practices: ['Never make it dismissible without fixing the cause.', 'Announce it as assertive only when it appears after an action.'],
      pair: { do: <Card as="div" className="demo-card"><Banner tone="critical" title="Payment failed" action={<Button size="sm">Retry payment</Button>} /></Card>, doNote: 'The error and the fix, with the fix as the pane’s loud action.', dont: <Card as="div" className="demo-card"><Banner tone="critical" title="Something went wrong" /></Card>, dontNote: 'Vague, and nothing to do about it.' },
    },
  },
  modifiers: [
    { name: 'Detail', rules: <p>Children become the detail under the title. Use it for why and what to do. Leave it out when the title says everything, as in Profile saved.</p>, pair: { do: <Card as="div" className="demo-card"><Banner tone="warning" title="Card expires next month">Update it before 1 December.</Banner></Card>, doNote: 'The detail adds the date.', dont: <Card as="div" className="demo-card"><Banner tone="warning" title="Card expires next month">Your card expires next month.</Banner></Card>, dontNote: 'The detail repeats the title.' } },
    { name: 'Action', rules: <p>Pass a Button to <code>action</code>. It is quiet unless fixing this message is the pane’s only task. One action per banner.</p>, pair: { do: <Card as="div" className="demo-card"><Banner tone="warning" title="Card expires" action={<Button size="sm" variant="glass">Update</Button>} /></Card>, doNote: 'One quiet action.', dont: <Card as="div" className="demo-card"><Banner tone="warning" title="Card expires" action={<div className="demo-row"><Button size="sm" variant="glass">Update</Button><Button size="sm" variant="glass">Later</Button><Button size="sm" variant="glass">Help</Button></div>} /></Card>, dontNote: 'Three actions crowd the line.' } },
    { name: 'Dismiss', rules: <p>Set <code>onDismiss</code> to show the Dismiss button. It runs after the line has closed, so remove the banner from state there. Keep critical banners undismissable until the cause is fixed.</p>, pair: { do: <Card as="div" className="demo-card"><Banner tone="info" title="New layout" onDismiss={() => {}} /></Card>, doNote: 'News the reader can clear.', dont: <Card as="div" className="demo-card"><Banner tone="critical" title="Account locked" onDismiss={() => {}} /></Card>, dontNote: 'An error that can be hidden while still true.' } },
    { name: 'Live', rules: <p>Set <code>live</code> only on banners that appear after the page loads. Polite becomes role status and assertive becomes role alert. Leave it unset on banners that were there from the start.</p>, pair: { do: <Card as="div" className="demo-card"><Banner tone="positive" title="Saved" live="polite" /></Card>, doNote: 'Announced once, politely, after the save.', dont: <Card as="div" className="demo-card"><Banner tone="info" title="Welcome back" live="assertive" /></Card>, dontNote: 'An alert for a greeting interrupts whatever the reader was hearing.' } },
  ],
  related: [
    ['/components/badge', 'Badge', 'A single word of status on an item.'],
    ['/components/card', 'Card', 'The pane a banner is written on.'],
    ['/components/button', 'Button', 'The action at the end of the line.'],
    ['/accessibility', 'Accessibility', 'How live regions are tested.'],
  ],
  references: [
    { title: 'Apple Human Interface Guidelines · Alerts', url: 'https://developer.apple.com/design/human-interface-guidelines/alerts', why: 'Pane’s lineage, and when a message should interrupt.' },
    { title: 'WAI-ARIA · status role', url: 'https://www.w3.org/TR/wai-aria-1.2/#status', why: 'What polite announcements mean for screen readers.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why a message that appears must be announced without taking focus.' },
  ],
};
