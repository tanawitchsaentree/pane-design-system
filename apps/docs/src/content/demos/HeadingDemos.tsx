'use client';

import { Heading, Text } from 'dial-react';

export function BasicHeading() {
  return <Heading level={2}>Section title</Heading>;
}

export function HeadingLevels() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4} size="sm">
        Heading level 4, small visual size
      </Heading>
    </div>
  );
}

export function HeadingLevelLadder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Heading level={1}>Level 1 — h1</Heading>
      <Heading level={2}>Level 2 — h2</Heading>
      <Heading level={3}>Level 3 — h3</Heading>
      <Heading level={4}>Level 4 — h4</Heading>
      <Heading level={5}>Level 5 — h5</Heading>
      <Heading level={6}>Level 6 — h6</Heading>
    </div>
  );
}

export function HeadingSizeLadder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Heading level={2} size="sm">
        Size sm
      </Heading>
      <Heading level={2} size="md">
        Size md
      </Heading>
      <Heading level={2} size="lg">
        Size lg
      </Heading>
      <Heading level={2} size="xl">
        Size xl
      </Heading>
      <Heading level={2} size="2xl">
        Size 2xl
      </Heading>
      <Heading level={2} size="3xl">
        Size 3xl
      </Heading>
    </div>
  );
}

export function HeadingWeightLadder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Heading level={3} weight="regular">
        Weight regular
      </Heading>
      <Heading level={3} weight="medium">
        Weight medium
      </Heading>
      <Heading level={3} weight="semibold">
        Weight semibold (default)
      </Heading>
      <Heading level={3} weight="bold">
        Weight bold
      </Heading>
    </div>
  );
}

export function HeadingArticleComposition() {
  return (
    <article>
      <Heading level={1} size="2xl">
        Shipping a design system that survives contact with real product teams
      </Heading>
      <Text size="sm" color="subtle">
        Published August 8, 2026 · 6 min read
      </Text>
      <Heading level={2} size="lg" style={{ marginBlockStart: 'var(--ds-space-stack-md)' }}>
        Why token tiers matter
      </Heading>
      <Text style={{ marginBlockStart: 'var(--ds-space-stack-sm)' }}>
        A three-tier token structure keeps component code free of raw hex/px values, so a single
        semantic change (like darkening a border for contrast) never requires touching every
        component that uses it.
      </Text>
    </article>
  );
}
