// @example Sizes and states
import { Button, Card } from 'pane-react';

export default function ButtonSizes() {
  return (
    <Card as="div" className="demo-card">
      <div className="demo-row">
        <Button size="md">Medium</Button>
        <Button size="sm">Small</Button>
        <Button variant="glass" size="sm">Small glass</Button>
        <Button disabled>Disabled</Button>
      </div>
    </Card>
  );
}
