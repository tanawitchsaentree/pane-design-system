import type { Meta, StoryObj } from '@storybook/react';
import { HelperText } from './HelperText';
import type { HelperTextTone } from './HelperText';

const TONES: HelperTextTone[] = ['default', 'error'];

const meta: Meta<typeof HelperText> = {
  title: 'Forms/HelperText',
  component: HelperText,
  argTypes: {
    tone: { control: 'select', options: TONES },
  },
};

export default meta;
type Story = StoryObj<typeof HelperText>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Default tone helper text rendered under a field, using the subtle text color.' } } },
  args: { children: 'We will never share your email.' },
};

export const Error: Story = {
  parameters: { docs: { description: { story: "Error tone helper text — switches to color.action.danger.default, self-checked for AA contrast against surface.raised/canvas." } } },
  args: { tone: 'error', children: 'This field is required.' },
};

export const AllTones: Story = {
  parameters: { docs: { description: { story: 'Renders every HelperTextTone (default, error) stacked for visual comparison.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {TONES.map((tone) => (
        <HelperText key={tone} tone={tone}>
          {tone} helper text
        </HelperText>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { tone: 'default', children: 'Playground helper text' },
};
