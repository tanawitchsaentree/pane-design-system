// @example Glass card with a cover and an inset section
import { Button, Card, CardCover } from 'pane-react';

export default function CardVariants() {
  return (
    <Card aria-label="Trip to Lauterbrunnen" className="demo-card">
      <CardCover />
      <h3 className="flush">Trip to Lauterbrunnen</h3>
      <p className="flush muted">Saturday · 3 people going</p>
      <Card variant="inset" as="div">
        <p className="flush">Meet at the station at 07:40. Bring layers. It’s 4°C at the falls.</p>
      </Card>
      <Button>Join</Button>
    </Card>
  );
}
