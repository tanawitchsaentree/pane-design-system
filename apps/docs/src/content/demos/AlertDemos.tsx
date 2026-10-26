'use client';

import { useState } from 'react';
import { Alert } from 'dial-react';

export function BasicAlert() {
  return <Alert title="Update available">A new version of this page is available.</Alert>;
}

export function AlertVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Alert variant="success" title="Saved">Your changes were saved successfully.</Alert>
      <Alert variant="warning" title="Heads up">This action can't be undone.</Alert>
      <Alert variant="danger" title="Something went wrong">Please try again.</Alert>
      <Alert variant="info" title="Did you know?">You can customize this in Settings.</Alert>
    </div>
  );
}

export function DismissibleAlert() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <Alert variant="warning" title="Storage almost full" dismissible onDismiss={() => setVisible(false)}>
      You're using 92% of your available storage.
    </Alert>
  );
}

export function DescriptionOnlyAlert() {
  return <Alert variant="info">No title needed for a short single sentence.</Alert>;
}
