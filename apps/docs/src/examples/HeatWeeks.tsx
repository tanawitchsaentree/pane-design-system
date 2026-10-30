// @example A long row of weeks
import { Card, Heatmap } from 'pane-react';

export default function HeatWeeks() {
  return <Card as="div" className="demo-card demo-wide"><Heatmap label="Visits by week" description="Visits" labelEvery={4} rows={['Shop', 'Blog']} columns={Array.from({ length: 16 }, (_, i) => `W${i + 30}`)} values={[Array.from({ length: 16 }, (_, i) => 200 + ((i * 37) % 160)), Array.from({ length: 16 }, (_, i) => 40 + ((i * 23) % 90))]} /></Card>;
}
