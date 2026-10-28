// @example Primary + secondary at the foot of a card
import { Button, Card } from 'pane-react';

export default function ButtonPair() {
  return (
    <Card as="section" aria-labelledby="pair-h" className="demo-card">
      <h3 id="pair-h" className="flush">Discard draft?</h3>
      <p className="flush muted">Your changes to “Lauterbrunnen trip” will be lost.</p>
      <div className="demo-row">
        <Button>Keep editing</Button>
        <Button variant="glass">Discard</Button>
      </div>
    </Card>
  );
}
