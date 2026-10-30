// @example Below, where lower is worse
import { Card, Scale } from 'pane-react';

export default function ScaleBelow() {
  return <Card as="div" className="demo-card demo-wide"><Scale label="Consistency" value={1.8} compare={3.2} compareLabel="the format average" words={['Very low', 'Low', 'Medium', 'High', 'Very high']} /></Card>;
}
