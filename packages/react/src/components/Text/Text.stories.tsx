import type { Meta, StoryObj } from '@storybook/react';
import { FONT_SIZE_TOKENS, FONT_WEIGHT_TOKENS, TEXT_COLOR_TOKENS } from '../../types';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  argTypes: {
    size: { control: 'select', options: FONT_SIZE_TOKENS },
    weight: { control: 'select', options: FONT_WEIGHT_TOKENS },
    color: { control: 'select', options: TEXT_COLOR_TOKENS },
    truncate: { control: 'boolean' },
    asChild: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Renders a plain sentence of Text with default size, weight, and color.' } } },
  args: { children: 'The quick brown fox jumps over the lazy dog.' },
};

export const AllSizes: Story = {
  parameters: { docs: { description: { story: 'Renders one line of Text per font size token in FONT_SIZE_TOKENS.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {FONT_SIZE_TOKENS.map((size) => (
        <Text key={size} size={size}>
          {size} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
};

export const AllWeights: Story = {
  parameters: { docs: { description: { story: 'Renders one line of Text per font weight token in FONT_WEIGHT_TOKENS.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {FONT_WEIGHT_TOKENS.map((weight) => (
        <Text key={weight} weight={weight}>
          {weight} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  parameters: { docs: { description: { story: 'Renders one line of Text per color token in TEXT_COLOR_TOKENS.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {TEXT_COLOR_TOKENS.map((color) => (
        <Text key={color} color={color}>
          {color} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
};

export const Truncate: Story = {
  parameters: { docs: { description: { story: 'Sets truncate to clip an overflowing long line of text with an ellipsis inside a 200px-wide container.' } } },
  args: {
    truncate: true,
    children: 'This is a very long line of text that should be truncated with an ellipsis once it overflows its container width.',
  },
  decorators: [(Story) => <div style={{ maxWidth: 200 }}><Story /></div>],
};

export const AsChildParagraph: Story = {
  name: 'asChild renders <p> instead of <span>',
  parameters: { docs: { description: { story: 'Uses asChild to merge Text styling onto a child <p> element instead of rendering its own <span>.' } } },
  render: (args) => (
    <Text {...args} asChild>
      <p>I am a paragraph, not a span</p>
    </Text>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: {
    size: 'md',
    weight: 'regular',
    color: 'default',
    truncate: false,
    children: 'Playground text — use controls to explore variants',
  },
};
