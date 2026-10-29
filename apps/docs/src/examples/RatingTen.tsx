// @example Out of ten
import { Card, Rating } from 'pane-react';

export default function RatingTen() {
  return <Card as="div" className="demo-card"><Rating label="How likely are you to recommend us" max={10} defaultValue={8} /></Card>;
}
