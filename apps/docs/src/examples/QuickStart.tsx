// @example Your first pane
import 'pane-tokens/css';
import { Button, Card, Environment } from 'pane-react';

export default function QuickStart() {
  return (
    // Declare how bright the world behind the glass is; bright is the safe default.
    <Environment brightness="bright">
      <Card as="section" aria-labelledby="qs-title">
        <h3 id="qs-title" className="flush">Welcome back</h3>
        <p className="flush muted">Three new posts since your last visit.</p>
        <Button>Open feed</Button>
      </Card>
    </Environment>
  );
}
