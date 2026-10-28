// @example Light, accent and glass buttons
import { Button, Card } from 'pane-react';

export default function ButtonVariants() {
  return (
    <Card as="div" className="demo-card">
      <div className="demo-row">
        <Button>Follow</Button>
        <Button variant="accent">Get verified</Button>
        <Button variant="glass">Message</Button>
      </div>
    </Card>
  );
}
