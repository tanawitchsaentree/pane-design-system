// @example Choosing a stay
import { Calendar, Card } from 'pane-react';

export default function CalRange() {
  return <Card as="div" className="demo-card"><Calendar mode="range" label="Stay" defaultValue={{ start: new Date(2026, 10, 9), end: new Date(2026, 10, 13) }} /></Card>;
}
