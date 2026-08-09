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
  parameters: { docs: { description: { story: 'Renders a level-2 Heading with default size and weight.' } } },
  args: { level: 2, children: 'Section heading' },
};

export const AllLevels: Story = {
  parameters: { docs: { description: { story: 'Renders every heading level from h1 through h6 stacked vertically at default size.' } } },
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
  parameters: { docs: { description: { story: 'Renders one level-2 Heading per visual size token in HEADING_SIZES.' } } },
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
  parameters: { docs: { description: { story: 'Renders an <h1> (level=1, correct document outline) styled at the smallest "sm" visual size to show size and level are independent.' } } },
  render: () => (
    <Heading level={1} size="sm">
      This is an &lt;h1&gt; (correct document outline) styled at the smallest heading size
    </Heading>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: {
    level: 2,
    weight: 'semibold',
    children: 'Playground heading',
  },
};
