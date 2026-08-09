import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { Key } from '@react-types/shared';
import { Listbox } from './Listbox';
import { FormField } from '../FormField/FormField';

const meta: Meta<typeof Listbox> = {
  title: 'Selection/Listbox',
  component: Listbox,
};

export default meta;
type Story = StoryObj<typeof Listbox>;

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

export const Default: Story = {
  args: { 'aria-label': 'Fruit' },
  render: (args) => (
    <Listbox {...args}>
      {FRUITS.map((fruit) => (
        <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
      ))}
    </Listbox>
  ),
};

export const WithDefaultSelection: Story = {
  args: { 'aria-label': 'Fruit', defaultSelectedKeys: new Set(['Banana']) },
  render: (args) => (
    <Listbox {...args}>
      {FRUITS.map((fruit) => (
        <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
      ))}
    </Listbox>
  ),
};

export const Multiple: Story = {
  args: {
    'aria-label': 'Fruit (multi-select)',
    selectionMode: 'multiple',
    defaultSelectedKeys: new Set(['Apple', 'Cherry']),
  },
  render: (args) => (
    <Listbox {...args}>
      {FRUITS.map((fruit) => (
        <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
      ))}
    </Listbox>
  ),
};

export const WithDisabledOption: Story = {
  args: { 'aria-label': 'Fruit', disabledKeys: ['Cherry'] },
  render: (args) => (
    <Listbox {...args}>
      {FRUITS.map((fruit) => (
        <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
      ))}
    </Listbox>
  ),
};

/**
 * Controlled selection — verifies `selectedKeys`/`onSelectionChange` (BLUEPRINT §7 controlled
 * mode) drives the UI the same way `defaultSelectedKeys` does uncontrolled. `onSelectionChange`
 * always hands back a plain `ReadonlySet<Key>` (never the string `'all'`) per the API review's
 * item 4 — no branch needed here even though `Mod+A` (select-all) is reachable in `Multiple`.
 */
export const Controlled: Story = {
  render: () => {
    function ControlledListbox() {
      const [selected, setSelected] = useState<ReadonlySet<Key>>(new Set(['Apple']));
      return (
        <Listbox aria-label="Fruit (controlled)" selectedKeys={selected} onSelectionChange={setSelected}>
          {FRUITS.map((fruit) => (
            <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
          ))}
        </Listbox>
      );
    }
    return <ControlledListbox />;
  },
};

// 26 distinctly-lettered options (A-Z) so typeahead can jump to a letter with exactly one match,
// and so the fixed max-block-size root (160px, `space.1100`) must scroll to reach the tail —
// needed by w5-listbox.spec.ts's `expectScrollIntoView` (an option must start off-screen).
const ALPHABET_OPTIONS = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Icaco', 'Jackfruit',
  'Kiwi', 'Lemon', 'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince', 'Raspberry', 'Strawberry',
  'Tangerine', 'Ugli', 'Vanilla bean', 'Watermelon', 'Ximenia', 'Yuzu', 'Zucchini',
];

/**
 * Scrollable — many options inside the fixed-height root, used by conformance to prove
 * scroll-into-view (an option must start outside the scroll container's viewport) and typeahead
 * (every option starts with a distinct letter, so pressing e.g. "z" has exactly one match).
 */
export const Scrollable: Story = {
  args: { 'aria-label': 'Fruit (long list)' },
  render: (args) => (
    <Listbox {...args}>
      {ALPHABET_OPTIONS.map((fruit) => (
        <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
      ))}
    </Listbox>
  ),
};

/**
 * TabOut — a real focusable element after the listbox, used by w5-listbox.spec.ts's
 * `expectTabOut` to prove Tab leaves the widget entirely (roving-focus.md contract item 8) rather
 * than landing on the next option (which would mean roving tabindex is broken).
 */
export const TabOut: Story = {
  args: { 'aria-label': 'Fruit' },
  render: (args) => (
    <>
      <Listbox {...args}>
        {FRUITS.map((fruit) => (
          <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
        ))}
      </Listbox>
      <button type="button">After listbox</button>
    </>
  ),
};

/**
 * WithSections — grouped options via `Listbox.Section` (needed by Select/Combobox in this wave —
 * e.g. "Recent" / "All countries"). Each section gets its own visual heading and `role="group"`
 * with `aria-labelledby` pointing at that heading (see Listbox.tsx module doc's Anatomy note).
 */
export const WithSections: Story = {
  args: { 'aria-label': 'Fruit (grouped)' },
  render: (args) => (
    <Listbox {...args}>
      <Listbox.Section title="Citrus">
        <Listbox.Item key="Lemon">Lemon</Listbox.Item>
        <Listbox.Item key="Orange">Orange</Listbox.Item>
      </Listbox.Section>
      <Listbox.Section title="Stone fruit">
        <Listbox.Item key="Cherry">Cherry</Listbox.Item>
        <Listbox.Item key="Peach">Peach</Listbox.Item>
      </Listbox.Section>
    </Listbox>
  ),
};

/**
 * InFormField — Listbox nested inside `FormField` needs neither `aria-label` nor
 * `aria-labelledby`: `FormField` clones its child with `aria-labelledby` pointing at its own
 * generated label id (the same wiring `Input`/`Textarea`/`Checkbox` already get). Used by
 * w5-listbox.spec.ts's `FormField integration` test to prove the accessible name is announced
 * exactly once, not duplicated.
 */
export const InFormField: Story = {
  render: () => (
    <FormField label="Favorite fruit">
      <Listbox>
        {FRUITS.map((fruit) => (
          <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
        ))}
      </Listbox>
    </FormField>
  ),
};

export const Playground: Story = {
  args: { 'aria-label': 'Playground listbox', selectionMode: 'single' },
  render: (args) => (
    <Listbox {...args}>
      {FRUITS.map((fruit) => (
        <Listbox.Item key={fruit}>{fruit}</Listbox.Item>
      ))}
    </Listbox>
  ),
};
