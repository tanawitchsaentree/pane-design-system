'use client';

import { Spinner, Button, Flex } from 'dial-react';

export function BasicSpinner() {
  return <Spinner />;
}

export function SpinnerSizesLabel() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" label="Saving changes" />
    </div>
  );
}

export function SpinnerInButton() {
  return (
    <Button loading intent="primary">
      Save changes
    </Button>
  );
}

export function SpinnerStandaloneSection() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        width: 240,
        height: 120,
        border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
        borderRadius: 'var(--ds-radius-md)',
      }}
    >
      <Spinner size="lg" label="Loading results" />
    </Flex>
  );
}
