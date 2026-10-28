// @example CardCover with a real image
import { Card, CardCover } from 'pane-react';

export default function CardCoverImage() {
  return (
    <Card aria-label="Forest walk" className="demo-card">
      <CardCover src="/scenes/forest-sm.jpg" />
      <h3 className="flush">Forest walk</h3>
      <p className="flush muted">6.4 km · 2 h 10 min · moderate</p>
    </Card>
  );
}
