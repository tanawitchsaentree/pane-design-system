import type { Meta, StoryObj } from '@storybook/react';
import { ACTION_INTENTS, CONTROL_SIZE_TOKENS } from '../../types';
import { IconButton } from './IconButton';
import type { ButtonVariant } from '../Button/Button';

const VARIANTS: ButtonVariant[] = ['solid', 'outline', 'ghost'];

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    intent: { control: 'select', options: ACTION_INTENTS },
    size: { control: 'select', options: CONTROL_SIZE_TOKENS },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: { 'aria-label': 'Add to favorites', children: <Star /> },
};

export const AllVariantsByIntent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {ACTION_INTENTS.map((intent) => (
            <IconButton key={intent} variant={variant} intent={intent} aria-label={`${variant} ${intent}`}>
              <Star />
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {CONTROL_SIZE_TOKENS.map((size) => (
        <IconButton key={size} size={size} aria-label={`size ${size}`}>
          <Star />
        </IconButton>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <IconButton aria-label="Default"><Star /></IconButton>
      <IconButton aria-label="Disabled" disabled><Star /></IconButton>
      <IconButton aria-label="Loading" loading><Star /></IconButton>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'solid',
    intent: 'neutral',
    size: 'md',
    loading: false,
    disabled: false,
    'aria-label': 'Playground icon button',
    children: <Star />,
  },
};
