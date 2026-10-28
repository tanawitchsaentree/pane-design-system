// @example Neutral badges with a dot
import { Badge, Card, Stack } from 'pane-react';

export default function BadgeDot() {
  return (
    <Card as="div" className="demo-card">
      <Stack direction="row" gap="sm">
        <Badge dot>Draft</Badge>
        <Badge dot>Offline</Badge>
        <Badge tone="positive">Online</Badge>
      </Stack>
    </Card>
  );
}
