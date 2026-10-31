// @example Six tones as crystals
import { Badge, Card, Flex } from 'pane-react';

export default function BadgeTones() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm" wrap align="center">
        <Badge>Draft</Badge>
        <Badge tone="info">Beta</Badge>
        <Badge tone="positive">Live</Badge>
        <Badge tone="warning">Expiring</Badge>
        <Badge tone="critical">Failed</Badge>
        <Badge tone="accent">New</Badge>
      </Flex>
    </Card>
  );
}
