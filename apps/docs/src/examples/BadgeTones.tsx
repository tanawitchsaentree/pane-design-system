// @example Neutral and status badges
import { Badge, Card, Stack } from 'pane-react';

export default function BadgeTones() {
  return (
    <Card as="div" className="demo-card">
      <Stack direction="row" gap="sm">
        <Badge>Draft</Badge>
        <Badge tone="info">Beta</Badge>
        <Badge tone="positive">Live</Badge>
        <Badge tone="warning">Expiring</Badge>
        <Badge tone="critical">Failed</Badge>
      </Stack>
    </Card>
  );
}
