import type { Meta, StoryObj } from '@storybook/react';
import { ICON_SIZE_TOKENS } from '../../types';
import { Icon } from './Icon';

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
  </svg>
);

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  argTypes: {
    size: { control: 'select', options: ICON_SIZE_TOKENS },
    color: { control: 'select', options: ['currentColor', 'default', 'subtle', 'disabled', 'inverse'] },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: { children: <Star /> },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {ICON_SIZE_TOKENS.map((size) => (
        <Icon key={size} size={size}>
          <Star />
        </Icon>
      ))}
    </div>
  ),
};

export const Decorative: Story = {
  name: 'Decorative (default — aria-hidden)',
  args: { children: <Star /> },
};

export const Labeled: Story = {
  name: 'Meaningful (label -> role=img)',
  args: { label: 'Star rating', children: <Star /> },
};

export const Playground: Story = {
  args: {
    size: 'md',
    color: 'currentColor',
    children: <Star />,
  },
};
