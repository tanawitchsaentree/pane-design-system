'use client';

import type { CSSProperties } from 'react';
import { Container, Stack, Heading, Text, Button } from 'dial-react';

const inner: CSSProperties = {
  padding: 'var(--ds-space-inset-md)',
  border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
  borderRadius: 'var(--ds-radius-sm)',
  background: 'var(--ds-color-role-brand-subtle-bg)',
  color: 'var(--ds-color-role-brand-subtle-text)',
  textAlign: 'center',
};

export function BasicContainer() {
  return (
    <Container size="lg" style={{ background: 'var(--ds-color-surface-inset)' }}>
      <div style={inner}>size=&quot;lg&quot; (default) — capped and centered</div>
    </Container>
  );
}

export function ContainerSmall() {
  return (
    <Container size="sm" style={{ background: 'var(--ds-color-surface-inset)' }}>
      <div style={inner}>size=&quot;sm&quot; — a narrower reading width</div>
    </Container>
  );
}

export function ContainerFullBleed() {
  return (
    <Container size="full" style={{ background: 'var(--ds-color-surface-inset)' }}>
      <div style={inner}>size=&quot;full&quot; — no max-width cap, spans the available width</div>
    </Container>
  );
}

export function ContainerPageSection() {
  return (
    <Container
      size="lg"
      style={{ background: 'var(--ds-color-surface-inset)', padding: 'var(--ds-space-inset-lg)' }}
    >
      <Stack gap="200">
        <Heading level={2} size="lg">
          Team settings
        </Heading>
        <Text color="subtle">
          Manage your team&apos;s members, roles, and billing details from one place.
        </Text>
        <Button intent="primary" style={{ alignSelf: 'flex-start' }}>
          Invite member
        </Button>
      </Stack>
    </Container>
  );
}
