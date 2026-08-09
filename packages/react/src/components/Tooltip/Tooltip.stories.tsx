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
  parameters: {
    docs: {
      description: { story: 'Basic hint bubble that opens on hover (or keyboard focus) of its trigger.' },
    },
  },
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
  parameters: {
    docs: {
      description: { story: "Compares the top/right/bottom/left sides the tooltip can render against via Tooltip.Content's side prop." },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Attaches the tooltip to an icon-only IconButton, the most common real-world pairing since the icon alone has no visible label.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Tab to the trigger to prove the tooltip also opens on keyboard focus, not exclusively on mouse hover.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: { story: 'Interactive playground — adjust props via the Controls panel below.' },
    },
  },
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
