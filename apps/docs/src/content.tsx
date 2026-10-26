// Per-component docs content. Props listed here are checked against each component's TS source by
// tooling/conformance.mjs (a documented prop that doesn't exist fails the run), so this file can't
// silently drift from the code.
import { useState, type ReactNode } from 'react';
import { Badge, Button, Panel, Switch, TextField } from 'pane-react';

export interface PropDoc { name: string; type: string; default?: string; description: string }
export interface ComponentDoc {
  name: string;
  summary: string;
  /** harness scene keys (`{backdrop}/{scene}`) whose measurements belong to this component */
  scenes: string[];
  demo: () => ReactNode;
  props: PropDoc[];
  keyboard?: Array<[string, string]>;
  a11y: string[];
  do: string;
  dont: string;
}

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <Panel>
      <div className="demo-row">
        <Switch label="Sync over Wi-Fi only" checked={on} onCheckedChange={setOn} />
        <Switch label="Uncontrolled" />
        <Badge>{on ? 'On' : 'Off'}</Badge>
      </div>
    </Panel>
  );
}

export const COMPONENTS: ComponentDoc[] = [
  {
    name: 'Button',
    summary:
      'Two variants. Primary is an opaque Dessau-red fill for the one main action on a pane; glass is a pane on its own mullion frame for everything else.',
    scenes: ['button-glass', 'button-primary'],
    demo: () => (
      <div className="demo-row">
        <Button>Publish</Button>
        <Button variant="glass">Save draft</Button>
        <Button variant="glass" size="sm">Small</Button>
        <Button disabled>Disabled</Button>
      </div>
    ),
    props: [
      { name: 'variant', type: "'primary' | 'glass'", default: "'primary'", description: 'Opaque fill for the main action, or glass on a mullion frame.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Minimum block size from control.sm / control.md.' },
      { name: '…button attributes', type: 'ButtonHTMLAttributes', description: 'Native <button> — type defaults to "button", not "submit".' },
    ],
    keyboard: [['Tab', 'Moves focus to the button'], ['Enter / Space', 'Activates it (native button)']],
    a11y: [
      'Native <button>, so role, focus and activation come from the browser.',
      'Disabled changes the outer mullion to dashed — the state reads without colour.',
      'Focus ring is two opaque rings (ink inside, white outside), measured ≥3:1 on every backdrop.',
    ],
    do: 'One primary button per pane, for the action the pane exists for.',
    dont: 'Two primary buttons side by side — the red stops meaning "this one".',
  },
  {
    name: 'Badge',
    summary: 'A short status label. Neutral is thick glass; accent is the opaque red fill.',
    scenes: ['badge'],
    demo: () => (
      <div className="demo-row">
        <Badge>Draft</Badge>
        <Badge tone="accent">Live</Badge>
      </div>
    ),
    props: [
      { name: 'tone', type: "'neutral' | 'accent'", default: "'neutral'", description: 'Glass, or opaque red for the one thing that needs attention.' },
      { name: '…span attributes', type: 'HTMLAttributes<HTMLSpanElement>', description: 'Rendered as a <span>.' },
    ],
    a11y: ['Static text — no role. If the badge carries state that changes, put the change in an aria-live region near it.'],
    do: 'One or two words that say what state the thing is in.',
    dont: 'Use the accent tone for decoration — it is the only loud colour the system has.',
  },
  {
    name: 'Panel',
    summary:
      'The pane itself: regular glass infill inside an opaque double mullion. Every piece of text in a Pane interface sits on one of these.',
    scenes: ['panel'],
    demo: () => (
      <Panel title="Quarterly report" headingLevel={4} description="Last updated 2 hours ago">
        <p className="flush">Revenue is up 12% on the previous quarter.</p>
        <div className="demo-row">
          <Button size="sm">Open</Button>
          <Button size="sm" variant="glass">Share</Button>
        </div>
      </Panel>
    ),
    props: [
      { name: 'title', type: 'ReactNode', description: 'Rendered as a heading.' },
      { name: 'headingLevel', type: '2 | 3 | 4', default: '3', description: 'Pick the level that fits the page outline.' },
      { name: 'description', type: 'ReactNode', description: 'Secondary text under the title.' },
      { name: '…section attributes', type: 'HTMLAttributes<HTMLElement>', description: 'Rendered as a <section>.' },
    ],
    a11y: [
      'A <section> with a real heading, so it shows up in the screen-reader outline.',
      'With reduced transparency, forced colours, or no backdrop-filter support the glass becomes opaque paper — measured in all three modes.',
    ],
    do: 'Put text, fields and switches on a Panel.',
    dont: 'Put body text straight on a photo or gradient — the bare-backdrop rows in the evidence table show why.',
  },
  {
    name: 'TextField',
    summary: 'Label, thick-glass input, helper text and an error message that is shown as words, not only as a red edge.',
    scenes: ['field-on-panel', 'field-bare'],
    demo: () => (
      <Panel>
        <div className="demo-stack">
          <TextField label="Full name" helperText="As it appears on your ID" placeholder="Ada Lovelace" />
          <TextField label="Email" defaultValue="ada@" errorText="Error: enter a full email address" />
        </div>
      </Panel>
    ),
    props: [
      { name: 'label', type: 'ReactNode', description: 'Required visible label, tied to the input with for/id.' },
      { name: 'helperText', type: 'ReactNode', description: 'Hint under the input, linked through aria-describedby.' },
      { name: 'errorText', type: 'ReactNode', description: 'Sets aria-invalid and shows the message; read before the helper.' },
      { name: '…input attributes', type: 'InputHTMLAttributes', description: 'Passed to the <input>.' },
    ],
    keyboard: [['Tab', 'Moves focus into the field']],
    a11y: [
      'The label is a real <label> — a placeholder is never the label.',
      'Error text is red.800 (D-007): red.600 measured 3.31:1 on glass over black, so the error colour was changed, not the test.',
      'Error and helper ids go in aria-describedby, error first.',
    ],
    do: 'Write the error as the fix: “Enter a full email address”.',
    dont: 'Put the label on a raw backdrop — see the field-bare rows in the evidence table below.',
  },
  {
    name: 'Switch',
    summary: 'An on/off control. The thumb’s position carries the state; the track turns red when on.',
    scenes: ['switch-on-panel'],
    demo: () => <SwitchDemo />,
    props: [
      { name: 'label', type: 'ReactNode', description: 'Visible label, which is also the accessible name.' },
      { name: 'checked', type: 'boolean', description: 'Controlled state.' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called with the new state.' },
    ],
    keyboard: [['Tab', 'Moves focus to the switch'], ['Space / Enter', 'Toggles it']],
    a11y: [
      'role="switch" on a native <button>, aria-checked reflects the state.',
      'Thumb position follows writing direction (flex-end, not translateX), so RTL needs nothing extra.',
      'In forced-colours mode the thumb keeps CanvasText / Highlight and gains a real edge.',
    ],
    do: 'Use it for a setting that takes effect immediately.',
    dont: 'Use it inside a form that needs a submit — that is a checkbox.',
  },
];
