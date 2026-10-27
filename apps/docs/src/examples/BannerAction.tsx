// @example A quiet action, and the loud one when the message is the task
import { useState } from 'react';
import { Banner, Button, Card } from 'pane-react';

export default function BannerAction() {
  const [open, setOpen] = useState(true);
  return (
    <Card as="div" className="demo-card wide-card">
      {open ? (
        <Banner tone="info" title="New sign-in from Zürich" action={<Button size="sm" variant="glass">Review</Button>} onDismiss={() => setOpen(false)}>Safari on a Mac, 2 minutes ago.</Banner>
      ) : (
        <Button size="sm" variant="glass" onClick={() => setOpen(true)}>Show the message again</Button>
      )}
      <Banner tone="critical" title="Payment failed" action={<Button size="sm">Update card</Button>}>This pane has no other job until it is fixed, so the action is the loud one.</Banner>
    </Card>
  );
}
