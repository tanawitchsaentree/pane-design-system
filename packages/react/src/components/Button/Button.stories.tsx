import type { Meta, StoryObj } from '@storybook/react';
import { ACTION_INTENTS, CONTROL_SIZE_TOKENS } from '../../types';
import { Button } from './Button';
import type { ButtonVariant } from './Button';

const VARIANTS: ButtonVariant[] = ['solid', 'outline', 'ghost', 'link'];

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    intent: { control: 'select', options: ACTION_INTENTS },
    size: { control: 'select', options: CONTROL_SIZE_TOKENS },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    asChild: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Button' },
};

export const AllVariantsByIntent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {ACTION_INTENTS.map((intent) => (
            <Button key={intent} variant={variant} intent={intent}>
              {variant}/{intent}
            </Button>
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
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button leftIcon={<span aria-hidden>&#8592;</span>}>Back</Button>
      <Button rightIcon={<span aria-hidden>&#8594;</span>}>Next</Button>
    </div>
  ),
};

export const AsChildAnchor: Story = {
  name: 'asChild renders <a> instead of <button>',
  render: (args) => (
    <Button {...args} asChild>
      <a href="#anatomy">I am an anchor styled as a button</a>
    </Button>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'solid',
    intent: 'neutral',
    size: 'md',
    loading: false,
    disabled: false,
    children: 'Playground button',
  },
};
