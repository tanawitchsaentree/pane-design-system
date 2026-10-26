'use client';

/**
 * All of a page's live dial-react renders live in one client-boundary file like this one, per
 * component. See ButtonDemos.tsx for the full rationale.
 */
import { Text } from 'dial-react';

export function BasicText() {
  return <Text>The quick brown fox jumps over the lazy dog.</Text>;
}

export function TextSizesWeights() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Text size="lg" weight="semibold">
        Large semibold text
      </Text>
      <Text size="md" weight="regular">
        Medium regular text (default)
      </Text>
      <Text size="sm" color="subtle">
        Small subtle-colored text
      </Text>
    </div>
  );
}

export function TruncatedText() {
  return (
    <div style={{ inlineSize: 200 }}>
      <Text truncate>This is a long line of text that will be truncated with an ellipsis.</Text>
    </div>
  );
}

export function TextSizeLadder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Text size="xs">Size xs</Text>
      <Text size="sm">Size sm</Text>
      <Text size="md">Size md (default)</Text>
      <Text size="lg">Size lg</Text>
      <Text size="xl">Size xl</Text>
      <Text size="2xl">Size 2xl</Text>
      <Text size="3xl">Size 3xl</Text>
      <Text size="4xl">Size 4xl</Text>
      <Text size="5xl">Size 5xl</Text>
    </div>
  );
}

export function TextColorLadder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Text color="default">Color default</Text>
      <Text color="subtle">Color subtle</Text>
      <Text color="disabled">Color disabled</Text>
      <div style={{ background: 'var(--ds-color-neutral-900)', padding: 'var(--ds-space-inset-sm)' }}>
        <Text color="inverse">Color inverse (on a dark surface)</Text>
      </div>
    </div>
  );
}

export function TextProfileComposition() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Text size="lg" weight="semibold">
        Jordan Lee
      </Text>
      <Text size="sm" color="subtle">
        Senior Product Designer · Joined 2023
      </Text>
      <Text size="md" weight="regular">
        Leads the design systems team. Previously shipped the checkout redesign that cut form
        abandonment by 18%.
      </Text>
    </div>
  );
}
