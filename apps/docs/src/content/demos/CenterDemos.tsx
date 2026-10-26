'use client';

import type { CSSProperties } from 'react';
import { Center, Spinner, Text } from 'dial-react';

const swatch: CSSProperties = {
  padding: 'var(--ds-space-inset-sm)',
  border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
  borderRadius: 'var(--ds-radius-sm)',
  background: 'var(--ds-color-role-brand-subtle-bg)',
  color: 'var(--ds-color-role-brand-subtle-text)',
};

const frame: CSSProperties = {
  height: 160,
  width: '100%',
  border: 'var(--ds-border-width-hairline) dashed var(--ds-color-border-hairline)',
  borderRadius: 'var(--ds-radius-md)',
};

export function BasicCenter() {
  return (
    <Center style={frame}>
      <div style={swatch}>Centered content</div>
    </Center>
  );
}

export function CenterColumn() {
  return (
    <Center direction="column" gap="200" style={frame}>
      <div style={swatch}>Row one</div>
      <div style={swatch}>Row two</div>
    </Center>
  );
}

export function CenterGap() {
  return (
    <Center direction="row" gap="900" style={{ ...frame, height: 100 }}>
      <div style={swatch}>Left</div>
      <div style={swatch}>Right</div>
    </Center>
  );
}

export function CenterWrap() {
  return (
    <Center wrap="wrap" gap="200" style={{ ...frame, width: 220 }}>
      <div style={swatch}>Item 1</div>
      <div style={swatch}>Item 2</div>
      <div style={swatch}>Item 3</div>
      <div style={swatch}>Item 4</div>
    </Center>
  );
}

export function CenterLoadingState() {
  return (
    <Center style={frame}>
      <Spinner size="lg" label="Loading dashboard" />
    </Center>
  );
}

export function CenterEmptyState() {
  return (
    <Center direction="column" gap="200" style={frame}>
      <Text weight="semibold">No results found</Text>
      <Text size="sm" color="subtle">
        Try adjusting your filters.
      </Text>
    </Center>
  );
}
