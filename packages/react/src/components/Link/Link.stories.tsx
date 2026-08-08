import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  argTypes: {
    variant: { control: 'select', options: ['default', 'subtle'] },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { href: '/docs', children: 'Read the docs' },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Link href="/docs" variant="subtle">Subtle link (default, most body copy)</Link>
      <Link href="/docs" variant="default">Default link (accent — reserve for the primary action)</Link>
    </div>
  ),
};

export const ExternalAutoTargetBlank: Story = {
  name: 'External href auto target=_blank rel=noopener',
  args: { href: 'https://example.com', children: 'Visit example.com' },
};

export const Playground: Story = {
  args: { href: '/docs', variant: 'subtle', children: 'Playground link' },
};
