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
  args: { children: 'Badge' },
};

export const AllVariantsByColor: Story = {
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
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge size="sm">sm</Badge>
      <Badge size="md">md</Badge>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'subtle',
    color: 'neutral',
    size: 'md',
    children: 'Playground badge',
  },
};
