import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from './Tooltip';

const meta: Meta = {
  title: 'Overlays/Tooltip',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button>Hover me</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Helpful hint text</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const Placements: Story = {
  render: () => (
    <Tooltip.Provider>
      <div style={{ display: 'flex', gap: 48, padding: 64 }}>
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip.Root key={side}>
            <Tooltip.Trigger asChild>
              <Button variant="outline">{side}</Button>
            </Tooltip.Trigger>
            <Tooltip.Content side={side}>On the {side}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  ),
};

export const OnIconButton: Story = {
  name: 'On an IconButton (common real-world usage)',
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton aria-label="Settings">
            <span aria-hidden>&#9881;</span>
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Settings</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const KeyboardFocusOpens: Story = {
  name: 'Opens on keyboard focus, not just hover',
  render: () => (
    <Tooltip.Provider>
      <p>Tab to the button below — the tooltip opens on focus too (D-002: hover is first-class, not exclusive).</p>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button>Focus me via Tab</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Also reachable by keyboard</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const Playground: Story = {
  render: () => (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button intent="primary">Playground trigger</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Shorter delay via Provider delayDuration</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};
