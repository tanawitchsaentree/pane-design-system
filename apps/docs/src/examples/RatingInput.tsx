// @example Rate a print
import { Card, Rating } from 'pane-react';

export default function RatingInput() {
  return <Card as="div" className="demo-card"><Rating label="Rate this print" defaultValue={4} /></Card>;
}
