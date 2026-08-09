import type { Meta, StoryObj } from '@storybook/react';
import { CONTROL_SIZE_TOKENS } from '../../types';
import { Textarea } from './Textarea';
import type { TextareaResize } from './Textarea';

const RESIZE: TextareaResize[] = ['none', 'vertical', 'both'];

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  argTypes: {
    size: { control: 'select', options: CONTROL_SIZE_TOKENS },
    resize: { control: 'select', options: RESIZE },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Plain native textarea at the default md size and 3 rows, with a placeholder and accessible label.' } } },
  args: { 'aria-label': 'Bio', placeholder: 'Tell us about yourself' },
};

export const AllSizes: Story = {
  parameters: { docs: { description: { story: 'Renders every size.control.* t-shirt size stacked, controlling the minimum block-size (height still grows with rows/content).' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {CONTROL_SIZE_TOKENS.map((size) => (
        <Textarea key={size} aria-label={`Textarea ${size}`} size={size} placeholder={size} />
      ))}
    </div>
  ),
};

export const States: Story = {
  parameters: { docs: { description: { story: 'Default, invalid (aria-invalid), disabled (native disabled attribute), and read-only (stays focusable/selectable) side by side.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      <Textarea aria-label="Default" placeholder="Default" />
      <Textarea aria-label="Invalid" placeholder="Invalid" invalid />
      <Textarea aria-label="Disabled" placeholder="Disabled" disabled />
      <Textarea aria-label="Read-only" defaultValue="Read-only value" readOnly />
    </div>
  ),
};

export const ResizeOptions: Story = {
  parameters: { docs: { description: { story: 'Renders every CSS resize option (none, vertical, both) so the resize handle behavior can be compared directly.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      {RESIZE.map((resize) => (
        <Textarea key={resize} aria-label={`Resize ${resize}`} resize={resize} placeholder={resize} />
      ))}
    </div>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { 'aria-label': 'Playground', placeholder: 'Type here', size: 'md', rows: 3, resize: 'vertical' },
};
