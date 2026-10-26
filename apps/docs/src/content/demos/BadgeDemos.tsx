'use client';

import { Badge } from 'dial-react';

export function BasicBadge() {
  return <Badge>New</Badge>;
}

export function BadgeVariants() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Badge variant="solid" color="brand">
        Solid
      </Badge>
      <Badge variant="subtle" color="brand">
        Subtle
      </Badge>
      <Badge variant="outline" color="brand">
        Outline
      </Badge>
    </div>
  );
}

export function BadgeColors() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Badge color="neutral">Neutral</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="danger">Danger</Badge>
      <Badge color="info">Info</Badge>
    </div>
  );
}

export function BadgeSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Badge size="sm" color="brand">
        Small
      </Badge>
      <Badge size="md" color="brand">
        Medium
      </Badge>
    </div>
  );
}

export function BadgeCountComposition() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      Inbox
      <Badge variant="solid" color="danger" size="sm">
        3
      </Badge>
    </div>
  );
}

export function BadgeStatusComposition() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      Deployment
      <Badge variant="subtle" color="success">
        Live
      </Badge>
    </div>
  );
}
