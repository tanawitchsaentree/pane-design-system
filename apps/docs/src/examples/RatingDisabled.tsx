// @example Off until the print arrives
import { Card, Rating } from 'pane-react';

export default function RatingDisabled() {
  return <Card as="div" className="demo-card"><Rating label="Rate this print" defaultValue={0} disabled /></Card>;
}
