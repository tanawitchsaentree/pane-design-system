// @example Above the format average
import { Card, Scale } from 'pane-react';

export default function ScaleCompared() {
  return <Card as="div" className="demo-card demo-wide"><Scale label="Speed" value={4.4} compare={3} compareLabel="the format average" words={['Slow', 'Steady', 'Medium', 'Fast', 'Very fast']} /></Card>;
}
