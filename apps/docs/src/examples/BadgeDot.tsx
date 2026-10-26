// @example Badges with a presence dot
import { Badge, Card, Stack } from 'pane-react';

export default function BadgeDot() {
  return (
    <Card as="div" className="demo-card">
      <Stack direction="row" gap="sm">
        <Badge tone="positive" dot>Online</Badge>
        <Badge tone="warning" dot>Away</Badge>
        <Badge dot>Offline</Badge>
      </Stack>
    </Card>
  );
}
