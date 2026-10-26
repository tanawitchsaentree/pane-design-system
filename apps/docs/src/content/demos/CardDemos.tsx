'use client';

import { Card, Button } from 'dial-react';

export function BasicCard() {
  return (
    <Card.Root style={{ maxWidth: 320 }}>
      <Card.Header>Team settings</Card.Header>
      <Card.Body>Manage your team's members, roles, and billing details.</Card.Body>
      <Card.Footer>
        <Button variant="outline">Manage</Button>
      </Card.Footer>
    </Card.Root>
  );
}

export function ClickableCard() {
  return (
    <Card.Root clickable aria-label="Open project Alpha" style={{ maxWidth: 320 }}>
      <Card.Header>Project Alpha</Card.Header>
      <Card.Body>Last updated 2 days ago.</Card.Body>
    </Card.Root>
  );
}

export function CardWithMedia() {
  return (
    <Card.Root style={{ maxWidth: 320 }}>
      <Card.Media ratio={16 / 9}>
        <div style={{ width: '100%', height: '100%', background: 'var(--ds-card-media-bg)' }} />
      </Card.Media>
      <Card.Body>
        <strong>Mountain retreat</strong>
        <p>A quiet place to focus, three hours from the city.</p>
      </Card.Body>
      <Card.Footer>
        <Button intent="primary">Book now</Button>
      </Card.Footer>
    </Card.Root>
  );
}
