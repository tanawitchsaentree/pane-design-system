'use client';

import { PinInput } from 'dial-react';

export function BasicPinInput() {
  return <PinInput length={6} aria-label="6-digit verification code" />;
}

export function MaskedPinInput() {
  return <PinInput length={4} mask aria-label="4-digit PIN" />;
}

export function InvalidPinInput() {
  return <PinInput length={6} invalid defaultValue="123" aria-label="6-digit verification code" />;
}

export function DisabledPinInput() {
  return <PinInput length={4} disabled defaultValue="12" aria-label="4-digit PIN" />;
}

export function PinInputSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-inline-sm)' }}>
      <PinInput length={4} size="sm" aria-label="4-digit PIN, small" />
      <PinInput length={4} size="md" aria-label="4-digit PIN, medium" />
      <PinInput length={4} size="lg" aria-label="4-digit PIN, large" />
      <PinInput length={4} size="xl" aria-label="4-digit PIN, extra large" />
    </div>
  );
}

export function PinInputOnComplete() {
  return (
    <PinInput
      length={4}
      aria-label="4-digit PIN"
      onComplete={(value) => alert(`Completed with: ${value}`)}
    />
  );
}
