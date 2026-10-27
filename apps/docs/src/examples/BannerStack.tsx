// @example Several messages on one pane
import { useState } from 'react';
import { Banner, Button, Card } from 'pane-react';

const START = [
  { id: 1, tone: 'critical' as const, title: 'Two photos failed to upload' },
  { id: 2, tone: 'warning' as const, title: 'Storage is 92% full' },
  { id: 3, tone: 'info' as const, title: 'Albums can now be shared with a link' },
];

export default function BannerStack() {
  const [items, setItems] = useState(START);
  return (
    <Card as="div" className="demo-card wide-card">
      {items.map((m) => <Banner key={m.id} tone={m.tone} title={m.title} onDismiss={() => setItems((l) => l.filter((x) => x.id !== m.id))} />)}
      {items.length < START.length && <Button size="sm" variant="glass" onClick={() => setItems(START)}>Bring them back</Button>}
    </Card>
  );
}
