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
  args: { children: 'We will never share your email.' },
};

export const Error: Story = {
  args: { tone: 'error', children: 'This field is required.' },
};

export const AllTones: Story = {
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
  args: { tone: 'default', children: 'Playground helper text' },
};
