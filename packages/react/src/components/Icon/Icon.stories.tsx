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
  parameters: { docs: { description: { story: 'Renders a star SVG wrapped in Icon with default size and color.' } } },
  args: { children: <Star /> },
};

export const AllSizes: Story = {
  parameters: { docs: { description: { story: 'Renders one Icon per size token in ICON_SIZE_TOKENS side by side.' } } },
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
  parameters: { docs: { description: { story: 'Renders the Icon with no label, so it is aria-hidden and skipped by assistive tech.' } } },
  args: { children: <Star /> },
};

export const Labeled: Story = {
  name: 'Meaningful (label -> role=img)',
  parameters: { docs: { description: { story: 'Passes a label prop ("Star rating") so the Icon gets role="img" and is announced to assistive tech.' } } },
  args: { label: 'Star rating', children: <Star /> },
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: {
    size: 'md',
    color: 'currentColor',
    children: <Star />,
  },
};
