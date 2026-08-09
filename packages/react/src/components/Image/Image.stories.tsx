import type { Meta, StoryObj } from '@storybook/react';
import { RADIUS_TOKENS } from '../../types';
import { Image } from './Image';

const SAMPLE_SRC = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=480';

const meta: Meta<typeof Image> = {
  title: 'Atoms/Image',
  component: Image,
  argTypes: {
    fit: { control: 'select', options: ['cover', 'contain'] },
    radius: { control: 'select', options: RADIUS_TOKENS },
    ratio: { control: 'select', options: [undefined, 'square', 'video', 'photo', 'portrait', 'golden'] },
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Renders an Image with a src and alt but no ratio or radius applied.' } } },
  args: { src: SAMPLE_SRC, alt: 'Sample landscape photo' },
};

export const WithAspectRatio: Story = {
  name: 'ratio="video" (uses AspectRatio internally)',
  parameters: { docs: { description: { story: 'Sets ratio="video" so the Image is cropped to 16:9 using the AspectRatio component internally.' } } },
  args: { src: SAMPLE_SRC, alt: 'Sample landscape photo', ratio: 'video' },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
};

export const AllRatios: Story = {
  parameters: { docs: { description: { story: 'Renders the same photo at every ratio preset (square/video/photo/portrait/golden) side by side.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 640 }}>
      {(['square', 'video', 'photo', 'portrait', 'golden'] as const).map((ratio) => (
        <div key={ratio} style={{ width: 140 }}>
          <Image src={SAMPLE_SRC} alt={`Sample photo, ${ratio} ratio`} ratio={ratio} radius="md" />
        </div>
      ))}
    </div>
  ),
};

export const RoundedCorners: Story = {
  parameters: { docs: { description: { story: 'Applies the "xl" radius token to round the Image corners.' } } },
  args: { src: SAMPLE_SRC, alt: 'Sample landscape photo', radius: 'xl' },
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { src: SAMPLE_SRC, alt: 'Playground image', fit: 'cover' },
};
