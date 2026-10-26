'use client';

import type { CSSProperties } from 'react';
import { Flex, Spacer, Stack, Card, Text } from 'dial-react';

const swatch: CSSProperties = {
  padding: 'var(--ds-space-inset-sm)',
  border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
  borderRadius: 'var(--ds-radius-sm)',
  background: 'var(--ds-color-role-brand-subtle-bg)',
  color: 'var(--ds-color-role-brand-subtle-text)',
};

export function GrowingSpacer() {
  return (
    <Flex align="center" style={{ width: '100%' }}>
      <div style={swatch}>Left</div>
      <Spacer />
      <div style={swatch}>Right</div>
    </Flex>
  );
}

export function FixedSizeSpacer() {
  return (
    <Flex align="center">
      <div style={swatch}>Before</div>
      <Spacer size="600" />
      <div style={swatch}>After</div>
    </Flex>
  );
}

export function SpacerCardHeaderActions() {
  return (
    <Card.Root style={{ maxWidth: 320 }}>
      <Card.Header>
        <Flex align="center" style={{ width: '100%' }}>
          <Text weight="medium">Project Alpha</Text>
          <Spacer />
          <Text size="sm" color="subtle">
            Updated 2d ago
          </Text>
        </Flex>
      </Card.Header>
      <Card.Body>Shared workspace for the Alpha launch.</Card.Body>
    </Card.Root>
  );
}

export function SpacerStackSectionBreak() {
  return (
    <Stack gap="200" style={{ maxWidth: 320 }}>
      <div style={swatch}>General settings</div>
      <div style={swatch}>Notifications</div>
      <Spacer size="800" />
      <div style={swatch}>Danger zone</div>
    </Stack>
  );
}
