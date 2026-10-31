// The state matrix: every interactive component in every state it promises, side by side, so a missing
// or invisible state is seen (and measured by kiln G-SV1: each cell differs from its row's default and
// carries the state's ARIA). Hover and focus are forced by the gate; the cells here are the static states.
import type { ReactNode } from 'react';
import {
  Autocomplete, BarChart, Button, Checkbox, Chip, ColorPicker, Combobox, DataGrid, DatePicker, Dropzone, Editable, FAB, FileUpload, FormField,
  IconButton, Input, RadarChart, Scale, ChatMessage, ChatComposer, AgentStatus, HumanHandoff, ConfidenceChip, NodeCard, NetworkGraph, SequenceDiagram, Listbox, MultiSelect, NumberInput, PasswordInput, PinInput, Radio, RadioCards, RadioGroup, RangeSlider, Rating,
  RichTextEditor, SearchInput, SegmentedControl, Select, Slider, Switch, Table, TagInput, Textarea, TimePicker,
} from 'pane-react';
import { IconMore } from '../icons';
import { MORE_FAMILIES, MORE_ROWS, MORE_TEXT } from './states-more';

const OPTS = [{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }];
const SW = [{ value: '#3A6EA5', name: 'Fjord blue' }, { value: '#C9A227', name: 'Ochre' }, { value: '#5E8C61', name: 'Moss' }];
const ROWS = [{ id: 1, print: 'Lofoten', price: 120 }, { id: 2, print: 'Senja', price: 95 }];
const COLS = [{ key: 'print', header: 'Print', sortable: true }, { key: 'price', header: 'Price', align: 'end' as const, sortable: true }];
const F = (label: string, el: ReactNode, o: { error?: string; required?: boolean; disabled?: boolean } = {}) => <FormField label={label} error={o.error} required={o.required} disabled={o.disabled}>{el}</FormField>;

export type StateRow = { component: string; family: string; cells: [string, ReactNode][] };

const text = (name: string, make: (p: Record<string, unknown>) => ReactNode): StateRow => ({
  component: name, family: 'Fields', cells: [
    ['default', F(name, make({}))],
    ['filled', F(name, make({ filled: true }))],
    ['disabled', F(name, make({}), { disabled: true })],
    ['invalid', F(name, make({}), { error: 'Enter a value' })],
    ['readonly', F(name, make({ readOnly: true, filled: true }))],
    ['required', F(name, make({}), { required: true })],
  ],
});

export const STATE_ROWS: StateRow[] = [
  text('Input', (p) => <Input placeholder="Lofoten" defaultValue={p.filled ? 'Lofoten' : undefined} readOnly={p.readOnly as boolean} />),
  text('Textarea', (p) => <Textarea placeholder="A note" defaultValue={p.filled ? 'Shipped in a tube' : undefined} readOnly={p.readOnly as boolean} />),
  text('PasswordInput', (p) => <PasswordInput placeholder="Password" defaultValue={p.filled ? 'hunter22' : undefined} readOnly={p.readOnly as boolean} />),
  text('SearchInput', (p) => <SearchInput placeholder="Search prints" defaultValue={p.filled ? 'fjord' : undefined} readOnly={p.readOnly as boolean} />),
  text('NumberInput', (p) => <NumberInput label="Quantity" defaultValue={p.filled ? 2 : null} min={1} readOnly={p.readOnly as boolean} />),
  text('Select', (p) => <Select label="Place" hideLabel options={OPTS} placeholder="Choose a place" defaultValue={p.filled ? 'senja' : undefined} readOnly={p.readOnly as boolean} />),
  text('Combobox', (p) => <Combobox label="Place" options={OPTS} defaultValue={p.filled ? 'senja' : undefined} readOnly={p.readOnly as boolean} />),
  text('Autocomplete', (p) => <Autocomplete label="Camera" suggestions={['Leica Q2', 'Ricoh GR III']} defaultValue={p.filled ? 'Leica Q2' : undefined} readOnly={p.readOnly as boolean} />),
  text('MultiSelect', (p) => <MultiSelect label="Places" options={OPTS} defaultValue={p.filled ? ['senja'] : []} readOnly={p.readOnly as boolean} />),
  text('TagInput', (p) => <TagInput label="Tags" defaultValue={p.filled ? ['night'] : []} readOnly={p.readOnly as boolean} />),
  text('DatePicker', (p) => <DatePicker defaultValue={p.filled ? new Date(2026, 9, 30) : null} readOnly={p.readOnly as boolean} />),
  text('TimePicker', (p) => <TimePicker label="Pick-up" hideLabel defaultValue={p.filled ? '09:30' : undefined} readOnly={p.readOnly as boolean} />),
  text('PinInput', (p) => <PinInput length={4} defaultValue={p.filled ? '1234' : undefined} readOnly={p.readOnly as boolean} />),
  text('RichTextEditor', (p) => <RichTextEditor placeholder="Describe the print" defaultValue={p.filled ? '<p>Printed on cotton rag.</p>' : undefined} readOnly={p.readOnly as boolean} />),
  { component: 'Editable', family: 'Fields', cells: [['default', <Editable label="Title" defaultValue="Lofoten" />], ['empty', <Editable label="Title" placeholder="Add a title" />], ['disabled', <Editable label="Title" defaultValue="Lofoten" disabled />]] },
  { component: 'Checkbox', family: 'Choices', cells: [['default', <Checkbox label="Prints" />], ['checked', <Checkbox label="Prints" defaultChecked />], ['indeterminate', <Checkbox label="Prints" checked="indeterminate" />], ['disabled', <Checkbox label="Prints" disabled />], ['disabled checked', <Checkbox label="Prints" disabled defaultChecked />], ['invalid', <Checkbox label="Prints" invalid />]] },
  { component: 'Radio', family: 'Choices', cells: [['default', <RadioGroup label="Paper"><Radio value="a" label="Rag" /></RadioGroup>], ['checked', <RadioGroup label="Paper" defaultValue="a"><Radio value="a" label="Rag" /></RadioGroup>], ['disabled', <RadioGroup label="Paper"><Radio value="a" label="Rag" disabled /></RadioGroup>], ['disabled checked', <RadioGroup label="Paper" defaultValue="a"><Radio value="a" label="Rag" disabled /></RadioGroup>], ['invalid', <RadioGroup label="Paper" invalid><Radio value="a" label="Rag" /></RadioGroup>]] },
  { component: 'Switch', family: 'Choices', cells: [['default', <Switch label="Wi-Fi" />], ['checked', <Switch label="Wi-Fi" defaultChecked />], ['disabled', <Switch label="Wi-Fi" disabled />], ['disabled checked', <Switch label="Wi-Fi" disabled defaultChecked />], ['invalid', <Switch label="Wi-Fi" invalid />]] },
  { component: 'RadioCards', family: 'Choices', cells: [['default', <RadioCards label="Size" options={[{ value: 's', title: 'Small' }]} />], ['checked', <RadioCards label="Size" defaultValue="s" options={[{ value: 's', title: 'Small' }]} />], ['disabled', <RadioCards label="Size" options={[{ value: 's', title: 'Small', disabled: true }]} />], ['invalid', <RadioCards label="Size" invalid options={[{ value: 's', title: 'Small' }]} />]] },
  { component: 'SegmentedControl', family: 'Choices', cells: [['default', <SegmentedControl label="View" defaultValue="map" options={[{ value: 'map', label: 'Map' }, { value: 'list', label: 'List' }]} />], ['disabled', <SegmentedControl label="View" defaultValue="map" disabled options={[{ value: 'map', label: 'Map' }, { value: 'list', label: 'List' }]} />]] },
  { component: 'Listbox', family: 'Choices', cells: [['default', <Listbox label="Place" options={OPTS} />], ['selected', <Listbox label="Place" options={OPTS} defaultValue="senja" />], ['disabled', <Listbox label="Place" options={OPTS} disabled />], ['invalid', <Listbox label="Place" options={OPTS} invalid />]] },
  { component: 'Rating', family: 'Choices', cells: [['default', <Rating label="Rate" />], ['filled', <Rating label="Rate" defaultValue={3} />], ['shown', <Rating label="Rate" value={3} readOnly />], ['disabled', <Rating label="Rate" defaultValue={3} disabled />]] },
  { component: 'Chip', family: 'Choices', cells: [['default', <Chip>Night</Chip>], ['selected', <Chip defaultSelected>Night</Chip>], ['disabled', <Chip disabled>Night</Chip>]] },
  { component: 'ColorPicker', family: 'Choices', cells: [['default', <ColorPicker label="Colour" swatches={SW} />], ['disabled', <ColorPicker label="Colour" swatches={SW} disabled />]] },
  { component: 'Slider', family: 'Ranges', cells: [['default', <Slider label="Volume" defaultValue={40} />], ['disabled', <Slider label="Volume" defaultValue={40} disabled />]] },
  { component: 'RangeSlider', family: 'Ranges', cells: [['default', <RangeSlider label="Price" defaultValue={[20, 80]} />], ['disabled', <RangeSlider label="Price" defaultValue={[20, 80]} disabled />]] },
  { component: 'FileUpload', family: 'Files', cells: [['default', <FileUpload label="Receipts" />], ['disabled', <FileUpload label="Receipts" disabled />], ['invalid', <FileUpload label="Receipts" invalid />]] },
  { component: 'Dropzone', family: 'Files', cells: [['default', <Dropzone label="Drop photos here" />], ['disabled', <Dropzone label="Drop photos here" disabled />], ['invalid', <Dropzone label="Drop photos here" invalid />]] },
  { component: 'Button', family: 'Actions', cells: [['default', <Button>Save</Button>], ['disabled', <Button disabled>Save</Button>], ['loading', <Button loading>Save</Button>]] },
  { component: 'IconButton', family: 'Actions', cells: [['default', <IconButton aria-label="More"><IconMore /></IconButton>], ['disabled', <IconButton aria-label="More" disabled><IconMore /></IconButton>], ['loading', <IconButton aria-label="More" loading><IconMore /></IconButton>]] },
  { component: 'FAB', family: 'Actions', cells: [['default', <FAB icon={<IconMore />} label="New print" position="contained" />], ['disabled', <FAB icon={<IconMore />} label="New print" position="contained" disabled />]] },
  { component: 'Table', family: 'Tables', cells: [['default', <Table caption="Prints" columns={COLS} rows={ROWS} />], ['sorted', <Table caption="Prints" columns={COLS} rows={ROWS} defaultSort={{ key: 'price', direction: 'descending' }} />], ['compact', <Table caption="Prints" density="compact" columns={COLS} rows={ROWS} />], ['empty', <Table caption="Prints" columns={COLS} rows={[]} />], ['loading', <Table caption="Prints" columns={COLS} rows={ROWS} loading />]] },
  { component: 'DataGrid', family: 'Tables', cells: [['default', <DataGrid caption="Prints" selectable columns={COLS} rows={ROWS} />], ['selected', <DataGrid caption="Prints" selectable selected={[1]} columns={COLS} rows={ROWS} />], ['empty', <DataGrid caption="Prints" selectable columns={COLS} rows={[]} />], ['loading', <DataGrid caption="Prints" selectable columns={COLS} rows={ROWS} loading />]] },
  { component: 'Scale', family: 'Tables', cells: [['default', <Scale label="Speed" value={3} words={['Slow', 'Steady', 'Medium', 'Fast', 'Very fast']} />], ['compared above', <Scale label="Speed" value={4.4} compare={3} words={['Slow', 'Steady', 'Medium', 'Fast', 'Very fast']} />], ['compared below', <Scale label="Speed" value={1.8} compare={3} words={['Slow', 'Steady', 'Medium', 'Fast', 'Very fast']} />]] },
  { component: 'ConfidenceChip', family: 'Tables', cells: [['very low', <ConfidenceChip level={1} />], ['medium', <ConfidenceChip level={3} />], ['very high', <ConfidenceChip level={5} />]] },
  { component: 'NodeCard', family: 'Tables', cells: [['default', <NodeCard title="Filter" meta="Step" />], ['selected', <NodeCard title="Filter" meta="Step" selected />], ['dragging', <NodeCard title="Filter" meta="Step" dragging />], ['collapsed', <NodeCard title="Filter" meta="Step" collapsed onToggle={() => {}}>Rules</NodeCard>]] },
  { component: 'NetworkGraph', family: 'Tables', cells: [['full', <NetworkGraph label="Links" blockSize={180} nodes={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }]} edges={[{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]} />], ['mini', <NetworkGraph label="Links" size="mini" nodes={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]} edges={[{ from: 'a', to: 'b' }]} />]] },
  { component: 'SequenceDiagram', family: 'Tables', cells: [['message and reply', <SequenceDiagram label="Order" actors={[{ id: 'a', label: 'App' }, { id: 'b', label: 'API' }]} steps={[{ from: 'a', to: 'b', label: 'Place' }, { from: 'b', to: 'a', label: 'Placed', kind: 'reply' }]} />], ['note', <SequenceDiagram label="Order" actors={[{ id: 'a', label: 'App' }]} steps={[{ from: 'a', to: 'a', label: 'Retries twice', kind: 'note' }]} />]] },
  { component: 'ChatMessage', family: 'AI', cells: [['assistant', <ChatMessage sender="assistant" author="Lumen">Thursday at 08:30.</ChatMessage>], ['user', <ChatMessage sender="user" author="You">Can I move it?</ChatMessage>], ['streaming', <ChatMessage sender="assistant" author="Lumen" streaming>Your cholesterol has come down</ChatMessage>]] },
  { component: 'ChatComposer', family: 'AI', cells: [['default', <ChatComposer placeholder="Write a message" onSend={() => {}} />], ['busy', <ChatComposer placeholder="Ask a follow-up" busy onSend={() => {}} onStop={() => {}} />], ['disabled', <ChatComposer placeholder="A nurse is writing" disabled onSend={() => {}} />]] },
  { component: 'AgentStatus', family: 'AI', cells: [['thinking', <AgentStatus state="thinking" title="Reading your question" />], ['working', <AgentStatus state="working" title="Booking it" />], ['waiting', <AgentStatus state="waiting" title="Which clinic?" />], ['done', <AgentStatus state="done" title="Booked" />], ['failed', <AgentStatus state="failed" title="Could not book it" />]] },
  { component: 'HumanHandoff', family: 'AI', cells: [['offer', <HumanHandoff state="offer" who="a nurse" onAccept={() => {}} onDecline={() => {}} />], ['connecting', <HumanHandoff state="connecting" who="a nurse" wait="About 3 min" />], ['connected', <HumanHandoff state="connected" who="Nurse Ida Holm" />], ['returned', <HumanHandoff state="returned" who="Nurse Ida Holm" />]] },
  { component: 'RadarChart', family: 'Tables', cells: [['default', <RadarChart label="Shape" blockSize={180} max={5} axes={['Speed', 'Interaction', 'Late game']} series={[{ name: 'Deck', values: [4, 2, 3] }]} />], ['two series', <RadarChart label="Shape" blockSize={180} max={5} axes={['Speed', 'Interaction', 'Late game']} series={[{ name: 'Deck', values: [4, 2, 3] }, { name: 'Other', values: [2, 4, 3] }]} />]] },
  { component: 'BarChart', family: 'Tables', cells: [['default', <BarChart label="Sold" categories={['Jan', 'Feb']} series={[{ name: 'Prints', values: [4, 7] }]} />], ['empty', <BarChart label="Sold" categories={[]} series={[{ name: 'Prints', values: [] }]} />]] },
  ...MORE_ROWS,
];

const FAMILIES = ['Fields', 'Choices', 'Ranges', 'Files', 'Actions', 'Tables', ...MORE_FAMILIES];
const FAMILY_TEXT: Record<string, string> = {
  Fields: 'Every field has the same six states. Disabled dims the groove and refuses focus. Invalid adds the critical ring, and FormField says what is wrong in words. Read-only drops the groove for a hairline, so the value reads as settled but can still be focused and copied. Required is announced and marked on the label.',
  Choices: 'A choice says its state by shape as well as tone. A checkbox shows a check, a radio a filled dot, a switch moves its knob and a card turns to chosen glass. Invalid rings the control in the critical mark; disabled dims it and refuses presses.',
  Ranges: 'A slider keeps its length and its bead in every state; disabled dims both and stops the keys.',
  Files: 'File controls take the field states. Disabled refuses drops and presses. Invalid takes the critical ring, and a refused file is listed with its reason in words.',
  Actions: 'Loading keeps the button in place and at its width, with a spinner over unseen content, says it is busy and ignores presses. Disabled dims it and takes it out of the tab order.',
  Tables: 'A table says when it is sorted (aria-sort and the arrow), when rows are chosen (chosen glass and a check), when it is empty (one quiet line) and when it is loading (a scrim over the rows it keeps). A scale compared with another value adds a ring, a band and an arrow; a chart with a second series adds a legend.',
  ...MORE_TEXT,
};

/** The book page: every row of the matrix, by family, each cell captioned with its state. */
export function StatesPage({ Page, Section }: { Page: (p: { eyebrow: string; title: string; lede: ReactNode; children: ReactNode }) => ReactNode; Section: (p: { id: string; title: string; children: ReactNode; wide?: boolean }) => ReactNode }) {
  return (
    <Page eyebrow="Patterns" title="States" lede={<p>Every interactive component in every state it promises, side by side. A state that is missing or looks the same as the default shows up here first, and kiln measures each cell against its row.</p>}>
      {FAMILIES.map((f) => (
        <Section key={f} id={f.toLowerCase()} title={f} wide>
          <p>{FAMILY_TEXT[f]}</p>
          {STATE_ROWS.filter((r) => r.family === f).map((r) => (
            <div key={r.component} className="state-row">
              <h3 className="state-name">{r.component}</h3>
              <div className="state-cells">
                {r.cells.map(([state, el]) => (
                  <figure key={state} className="state-cell" data-state-cell={`${r.component}|${state}`}>
                    <div className="state-stage" data-harness="" data-tone-skip="">{el}</div>
                    <figcaption>{state}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </Section>
      ))}
    </Page>
  );
}
