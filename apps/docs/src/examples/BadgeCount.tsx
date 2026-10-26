// @example A count inside a button
import { Badge, Button, Card } from 'pane-react';

export default function BadgeCount() {
  return (
    <Card as="div" className="demo-card">
      <Button variant="glass">Messages <Badge tone="info">3 new</Badge></Button>
    </Card>
  );
}
