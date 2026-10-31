// @example Crystal, muted, solid and plain
import { Badge, Card, Flex, Stack } from 'pane-react';

const LOOKS = ['crystal', 'muted', 'solid', 'plain'] as const;

export default function BadgeLooks() {
  return (
    <Card as="div" className="demo-card">
      <Stack gap="md">
        {LOOKS.map((a) => (
          <Flex key={a} gap="sm" wrap align="center">
            <span className="demo-label">{a}</span>
            <Badge appearance={a} tone="positive">Paid</Badge>
            <Badge appearance={a} tone="warning">Pending</Badge>
            <Badge appearance={a} tone="critical">Failed</Badge>
            <Badge appearance={a} tone="accent">New</Badge>
          </Flex>
        ))}
      </Stack>
    </Card>
  );
}
