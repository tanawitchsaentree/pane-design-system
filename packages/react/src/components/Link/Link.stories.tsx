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
  parameters: { docs: { description: { story: 'Renders a basic internal Link pointing to "/docs".' } } },
  args: { href: '/docs', children: 'Read the docs' },
};

export const Variants: Story = {
  parameters: { docs: { description: { story: 'Compares the "subtle" (body copy) and "default" (accent, primary action) variants side by side.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Link href="/docs" variant="subtle">Subtle link (default, most body copy)</Link>
      <Link href="/docs" variant="default">Default link (accent — reserve for the primary action)</Link>
    </div>
  ),
};

export const ExternalAutoTargetBlank: Story = {
  name: 'External href auto target=_blank rel=noopener',
  parameters: { docs: { description: { story: 'Passes an external href and shows the Link automatically adding target="_blank" and rel="noopener".' } } },
  args: { href: 'https://example.com', children: 'Visit example.com' },
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { href: '/docs', variant: 'subtle', children: 'Playground link' },
};
