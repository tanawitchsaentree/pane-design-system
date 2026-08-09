import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Popover } from './Popover';

const meta: Meta = {
  title: 'Overlays/Popover',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Basic non-modal popover panel with plain content — no title required.' },
    },
  },
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
  parameters: {
    docs: {
      description: { story: "Compares the top/right/bottom/left sides the panel can render against via Popover.Content's side prop." },
    },
  },
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
  parameters: {
    docs: {
      description: { story: 'Adds Popover.Arrow, a pointer that visually connects the panel back to its trigger element.' },
    },
  },
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
  parameters: {
    docs: {
      description: { story: 'Adds an explicit Popover.Close button instead of relying on click-outside/Escape alone to dismiss.' },
    },
  },
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
  // Excluded from the autodocs page: `defaultOpen` renders the panel via Radix's portal to
  // `document.body`, which visually breaks out of its story box and covers every other story
  // stacked on the same docs page (autodocs renders all stories inline, not each in its own
  // iframe) — still a normal sidebar story, just not part of the generated Docs tab.
  tags: ['!autodocs'],
  parameters: {
    docs: {
      description: {
        story: 'Starts open via defaultOpen (uncontrolled) — click outside or Escape closes it.',
      },
    },
  },
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

// --- Collision/flip conformance fixtures (W4 hardening) -------------------------------------
// jsdom has no layout engine, so these three stories exist purely so a real-browser Playwright
// spec (packages/conformance/specs/w4-popover-positioning.spec.ts) can prove Radix's
// Popper-based collision detection actually flips the panel to the opposite side when the
// preferred side has no room, and does NOT flip when there's room (false-positive guard).

export const Centered: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Trigger centered in the viewport with room on every side — a baseline fixture proving Radix does NOT flip the panel off its preferred side when there is no collision.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button>Centered trigger</Button>
        </Popover.Trigger>
        <Popover.Content side="bottom">
          <p>Centered baseline — room on every side, so this must stay on `bottom` (no flip).</p>
        </Popover.Content>
      </Popover.Root>
    </div>
  ),
};

export const EdgeCollisionBottom: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Trigger pinned to the viewport bottom edge — proves Radix collision detection flips the panel from bottom to top when there is no room below.',
      },
    },
  },
  render: () => (
    <div style={{ position: 'fixed', insetBlockEnd: 8, insetInlineStart: 8 }}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button>Near bottom edge</Button>
        </Popover.Trigger>
        <Popover.Content side="bottom">
          <p>Trigger pinned to the viewport's bottom edge — no room below, so Radix must flip this
          panel to `top` and keep it fully inside the viewport.</p>
        </Popover.Content>
      </Popover.Root>
    </div>
  ),
};

export const EdgeCollisionRight: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Trigger pinned to the viewport right edge — proves Radix collision detection flips the panel from right to left when there is no room to the right.',
      },
    },
  },
  render: () => (
    <div style={{ position: 'fixed', insetBlockStart: 8, insetInlineEnd: 8 }}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button>Near right edge</Button>
        </Popover.Trigger>
        <Popover.Content side="right">
          <p>Trigger pinned to the viewport's right edge — no room to the right, so Radix must flip
          this panel to `left` and keep it fully inside the viewport.</p>
        </Popover.Content>
      </Popover.Root>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: 'Interactive playground — adjust props via the Controls panel below.' },
    },
  },
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
