// @example A high reading
import { Card, Meter } from 'pane-react';

export default function MeterAlmostFull() {
  return <Card as="div" className="demo-card"><Meter label="Storage" value={43} max={50} high={40} critical={48} valueText="43 of 50 GB" /></Card>;
}
