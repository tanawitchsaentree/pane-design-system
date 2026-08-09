import type { Meta, StoryObj } from '@storybook/react';
import { COLOR_ROLE_TOKENS } from '../../types';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';

const VARIANTS: BadgeVariant[] = ['solid', 'subtle', 'outline'];

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLOR_ROLE_TOKENS },
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Renders a Badge with default variant and color settings.' } } },
  args: { children: 'Badge' },
};

export const AllVariantsByColor: Story = {
  parameters: { docs: { description: { story: 'Renders the full matrix of every variant (solid/subtle/outline) crossed with every color role token.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {COLOR_ROLE_TOKENS.map((color) => (
            <Badge key={color} variant={variant} color={color}>
              {variant}/{color}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { docs: { description: { story: 'Compares the "sm" and "md" size options side by side.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge size="sm">sm</Badge>
      <Badge size="md">md</Badge>
    </div>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: {
    variant: 'subtle',
    color: 'neutral',
    size: 'md',
    children: 'Playground badge',
  },
};
