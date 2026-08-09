import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Flex } from '../Flex/Flex';
import { Stack } from '../Stack/Stack';
import { Image } from '../Image/Image';

const meta: Meta<typeof Card.Root> = {
  title: 'Layout/Card',
  component: Card.Root,
};

export default meta;
type Story = StoryObj<typeof Card.Root>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Card.Root with just a Card.Body — the minimal case, no header/footer/media.' },
    },
  },
  render: () => (
    <Card.Root style={{ maxWidth: 320 }}>
      <Card.Body>
        <Text>A plain card body with no other sections.</Text>
      </Card.Body>
    </Card.Root>
  ),
};

export const HeaderBodyFooter: Story = {
  parameters: {
    docs: {
      description: { story: 'Header (title + trailing action) / Body / Footer (actions) — the demo-app GAP #1 use case: a bordered, sectioned container to replace ad-hoc Stack+Divider grouping.' },
    },
  },
  render: () => (
    <Card.Root style={{ maxWidth: 360 }}>
      <Card.Header>
        <Flex justify="between" align="center">
          <Heading level={3} size="md">
            Notifications
          </Heading>
          <IconButton aria-label="More options" variant="ghost" size="sm">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
              <circle cx="8" cy="3" r="1.2" fill="currentColor" />
              <circle cx="8" cy="8" r="1.2" fill="currentColor" />
              <circle cx="8" cy="13" r="1.2" fill="currentColor" />
            </svg>
          </IconButton>
        </Flex>
      </Card.Header>
      <Card.Body>
        <Stack gap="200">
          <Text>Email notifications</Text>
          <Text size="sm" color="subtle">
            We'll only send account-critical updates.
          </Text>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Flex justify="end" gap="200">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </Flex>
      </Card.Footer>
    </Card.Root>
  ),
};

export const WithMedia: Story = {
  parameters: {
    docs: {
      description: { story: 'Card.Media (cover image, 16/9 via AspectRatio reuse) placed first, followed by Header + Body — the "card with media" use case (product card, article preview).' },
    },
  },
  render: () => (
    <Card.Root style={{ maxWidth: 320 }}>
      <Card.Media ratio="video">
        <Image src="https://picsum.photos/seed/dial-card/640/360" alt="Placeholder cover photo" />
      </Card.Media>
      <Card.Header>
        <Heading level={3} size="md">
          Field Recorder
        </Heading>
      </Card.Header>
      <Card.Body>
        <Text size="sm" color="subtle">
          Compact, all-metal body. Records straight to a memory card.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Text size="sm" weight="semibold">
          $129
        </Text>
      </Card.Footer>
    </Card.Root>
  ),
};

export const ClickableButton: Story = {
  parameters: {
    docs: {
      description: { story: 'clickable renders the whole card as a native <button> (Enter/Space activation, focus-visible ring, tab order — all native, nothing hand-rolled) — for a card that performs an action or toggles selection, not navigation.' },
    },
  },
  render: () => (
    <Card.Root clickable style={{ maxWidth: 320 }} onClick={() => alert('Card activated')}>
      <Card.Body>
        <Stack gap="100">
          <Heading level={3} size="md">
            Upgrade to Pro
          </Heading>
          <Text size="sm" color="subtle">
            Click anywhere on this card to continue.
          </Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  ),
};

export const ClickableLink: Story = {
  parameters: {
    docs: {
      description: { story: 'clickable + asChild renders the whole card as the supplied <a href> (the "product card that navigates to a detail page" case) — same asChild/Slot contract Button and Link already use, so the card is a real anchor, not a div with an onClick bolted on.' },
    },
  },
  render: () => (
    <Card.Root clickable asChild style={{ maxWidth: 320, display: 'block' }}>
      <a href="#product-detail">
        <Card.Media ratio="square">
          <Image src="https://picsum.photos/seed/dial-product/400/400" alt="Placeholder product photo" />
        </Card.Media>
        <Card.Body>
          <Text weight="semibold">Desk Lamp — Warm White</Text>
          <Text size="sm" color="subtle">
            $48
          </Text>
        </Card.Body>
      </a>
    </Card.Root>
  ),
};

export const DisabledClickable: Story = {
  parameters: {
    docs: {
      description: { story: 'disabled on a clickable card uses the native <button disabled> — removed from the tab order and non-interactive, same as any other disabled control in this system.' },
    },
  },
  render: () => (
    <Card.Root clickable disabled style={{ maxWidth: 320 }}>
      <Card.Body>
        <Text>Sold out</Text>
      </Card.Body>
    </Card.Root>
  ),
};

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: 'Interactive playground — adjust props via the Controls panel below.' },
    },
  },
  args: { clickable: false, disabled: false },
  render: (args) => (
    <Card.Root {...args} style={{ maxWidth: 320 }}>
      <Card.Header>
        <Heading level={3} size="md">
          Playground card
        </Heading>
      </Card.Header>
      <Card.Body>
        <Text size="sm" color="subtle">
          Toggle clickable/disabled via Controls.
        </Text>
      </Card.Body>
    </Card.Root>
  ),
};
