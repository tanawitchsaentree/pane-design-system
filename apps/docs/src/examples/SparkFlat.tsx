// @example A steady trend
import { Card, Sparkline } from 'pane-react';

export default function SparkFlat() {
  return <Card as="div" className="demo-card"><Sparkline label="Visitors over the last 12 days, steady" values={[50, 52, 49, 51, 50, 53, 51, 50, 52, 51, 49, 50]} showLast={false} /></Card>;
}
