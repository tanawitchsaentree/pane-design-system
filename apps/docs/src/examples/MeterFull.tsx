// @example A full reading
import { Card, Meter } from 'pane-react';

export default function MeterFull() {
  return <Card as="div" className="demo-card"><Meter label="Storage" value={49} max={50} high={40} critical={48} valueText="49 of 50 GB" /></Card>;
}
