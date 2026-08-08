import type { Meta, StoryObj } from '@storybook/react';
import { FONT_WEIGHT_TOKENS } from '../../types';
import { Heading } from './Heading';

const HEADING_SIZES = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: HEADING_SIZES },
    weight: { control: 'select', options: FONT_WEIGHT_TOKENS },
    asChild: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: { level: 2, children: 'Section heading' },
};

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <Heading key={level} level={level as 1 | 2 | 3 | 4 | 5 | 6}>
          Heading level {level}
        </Heading>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {HEADING_SIZES.map((size) => (
        <Heading key={size} level={2} size={size}>
          size={size}
        </Heading>
      ))}
    </div>
  ),
};

export const SizeIndependentFromLevel: Story = {
  name: 'Visual size decoupled from semantic level',
  render: () => (
    <Heading level={1} size="sm">
      This is an &lt;h1&gt; (correct document outline) styled at the smallest heading size
    </Heading>
  ),
};

export const Playground: Story = {
  args: {
    level: 2,
    weight: 'semibold',
    children: 'Playground heading',
  },
};
