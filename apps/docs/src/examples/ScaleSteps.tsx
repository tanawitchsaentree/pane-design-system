// @example Seven steps, no words
import { Card, Scale } from 'pane-react';

export default function ScaleSteps() {
  return <Card as="div" className="demo-card demo-wide"><Scale label="Curve" value={5.5} steps={7} /></Card>;
}
