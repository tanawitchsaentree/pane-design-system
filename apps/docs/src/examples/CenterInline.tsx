// @example Centred inside a line
import { Badge, Card, Center } from 'pane-react';

export default function CenterInline() {
  return (
    <Card as="div" className="demo-card">
      <p className="flush">Status <Center inline><Badge tone="positive">Synced</Badge></Center> at 09:40</p>
    </Card>
  );
}
