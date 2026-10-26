'use client';

import { Image } from 'dial-react';

export function BasicImage() {
  return <Image src="https://picsum.photos/seed/dial/320/180" alt="Decorative landscape placeholder" />;
}

export function ImageRatioRadius() {
  return (
    <Image
      src="https://picsum.photos/seed/dial-card/320/320"
      alt="Placeholder card artwork"
      ratio="video"
      radius="lg"
    />
  );
}

export function ImageFitComparison() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <div style={{ inlineSize: 160, blockSize: 120 }}>
        <Image
          src="https://picsum.photos/seed/dial-fit-cover/320/180"
          alt="Landscape placeholder cropped to fill its frame"
          fit="cover"
          style={{ inlineSize: '100%', blockSize: '100%' }}
        />
      </div>
      <div style={{ inlineSize: 160, blockSize: 120 }}>
        <Image
          src="https://picsum.photos/seed/dial-fit-contain/320/180"
          alt="Landscape placeholder shown in full without cropping"
          fit="contain"
          style={{ inlineSize: '100%', blockSize: '100%', background: 'var(--ds-color-surface-inset)' }}
        />
      </div>
    </div>
  );
}

export function ImageRadiusLadder() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-sm)', flexWrap: 'wrap' }}>
      <Image src="https://picsum.photos/seed/dial-radius-none/96/96" alt="Placeholder tile, no corner rounding" radius="none" style={{ inlineSize: 72, blockSize: 72 }} />
      <Image src="https://picsum.photos/seed/dial-radius-sm/96/96" alt="Placeholder tile with small corner rounding" radius="sm" style={{ inlineSize: 72, blockSize: 72 }} />
      <Image src="https://picsum.photos/seed/dial-radius-md/96/96" alt="Placeholder tile with medium corner rounding" radius="md" style={{ inlineSize: 72, blockSize: 72 }} />
      <Image src="https://picsum.photos/seed/dial-radius-lg/96/96" alt="Placeholder tile with large corner rounding" radius="lg" style={{ inlineSize: 72, blockSize: 72 }} />
      <Image src="https://picsum.photos/seed/dial-radius-xl/96/96" alt="Placeholder tile with extra-large corner rounding" radius="xl" style={{ inlineSize: 72, blockSize: 72 }} />
      <Image src="https://picsum.photos/seed/dial-radius-2xl/96/96" alt="Placeholder tile with 2xl corner rounding" radius="2xl" style={{ inlineSize: 72, blockSize: 72 }} />
      <Image src="https://picsum.photos/seed/dial-radius-full/96/96" alt="Placeholder tile fully rounded into a circle" radius="full" style={{ inlineSize: 72, blockSize: 72 }} />
    </div>
  );
}

export function ImageLoadingStrategy() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Image
        src="https://picsum.photos/seed/dial-eager/160/120"
        alt="Above-the-fold placeholder loaded eagerly"
        loading="eager"
      />
      <Image
        src="https://picsum.photos/seed/dial-lazy/160/120"
        alt="Below-the-fold placeholder loaded lazily"
        loading="lazy"
      />
    </div>
  );
}

export function ImageGalleryComposition() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-sm)' }}>
      {['a', 'b', 'c'].map((seed) => (
        <Image
          key={seed}
          src={`https://picsum.photos/seed/dial-gallery-${seed}/200/200`}
          alt={`Gallery placeholder tile ${seed}`}
          ratio="square"
          radius="md"
          style={{ inlineSize: 96 }}
        />
      ))}
    </div>
  );
}

export function ImageHero() {
  return (
    <Image
      src="https://picsum.photos/seed/dial-hero/640/240"
      alt="Wide hero placeholder image"
      fit="cover"
      loading="eager"
      style={{ inlineSize: '100%', blockSize: 160 }}
    />
  );
}
