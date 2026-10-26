// @example With an action and a dismiss button
import { useState } from 'react';
import { Banner, Button, Card } from 'pane-react';

export default function BannerAction() {
  const [open, setOpen] = useState(true);
  return (
    <Card as="div" className="demo-card wide-card">
      {open ? (
        <Banner tone="info" title="Get verified" action={<Button size="sm">Subscribe</Button>} onDismiss={() => setOpen(false)}>Subscribe to unlock new features.</Banner>
      ) : (
        <Button variant="glass" onClick={() => setOpen(true)}>Show banner again</Button>
      )}
    </Card>
  );
}
