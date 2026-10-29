// @example Storage used
import { Card, Meter } from 'pane-react';

export default function MeterStorage() {
  return <Card as="div" className="demo-card"><Meter label="Storage" value={18} max={50} high={40} critical={48} valueText="18 of 50 GB" /></Card>;
}
