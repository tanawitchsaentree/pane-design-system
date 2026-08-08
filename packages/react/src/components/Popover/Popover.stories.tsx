import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Popover } from './Popover';

const meta: Meta = {
  title: 'Overlays/Popover',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Open popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <p>This is a popover panel — plain content, no title required.</p>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 64 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover.Root key={side}>
          <Popover.Trigger asChild>
            <Button variant="outline">{side}</Button>
          </Popover.Trigger>
          <Popover.Content side={side}>
            <p>Placed on the {side} side.</p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Open with arrow</Button>
      </Popover.Trigger>
      <Popover.Content>
        <p>Panel with a pointer arrow back to the trigger.</p>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  ),
};

export const WithCloseButton: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Open with close</Button>
      </Popover.Trigger>
      <Popover.Content>
        <p>Explicit dismiss affordance instead of relying on click-outside/Escape only.</p>
        <Popover.Close asChild>
          <Button size="sm" variant="ghost">
            Close
          </Button>
        </Popover.Close>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    return (
      <Popover.Root defaultOpen>
        <Popover.Trigger asChild>
          <Button>Starts open</Button>
        </Popover.Trigger>
        <Popover.Content>
          <p>Opened via `defaultOpen` (uncontrolled) — click outside or press Escape to close.</p>
        </Popover.Content>
      </Popover.Root>
    );
  },
};

export const Playground: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button intent="primary">Playground trigger</Button>
      </Popover.Trigger>
      <Popover.Content side="bottom" sideOffset={8}>
        <p>Adjust props via Storybook controls on the underlying Radix primitives.</p>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  ),
};
