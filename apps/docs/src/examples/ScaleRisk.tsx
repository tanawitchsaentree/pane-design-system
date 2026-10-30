// @example Lower is better: a rise reads as bad
import { Card, Scale } from 'pane-react';

export default function ScaleRisk() {
  return <Card as="div" className="demo-card demo-wide"><Scale label="Mulligan rate" value={3.6} compare={2.5} compareLabel="last month" higherIsBetter={false} words={['Rare', 'Low', 'Usual', 'High', 'Very high']} /></Card>;
}
