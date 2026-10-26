// @example A disabled button with its reason
import { Button, Card } from 'pane-react';

export default function ButtonDisabled() {
  return (
    <Card as="div" className="demo-card">
      <Button disabled aria-describedby="why-disabled">Publish</Button>
      <p id="why-disabled" className="flush muted">Add a title to publish.</p>
    </Card>
  );
}
