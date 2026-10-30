// @example Two years side by side
import { BarChart, Card } from 'pane-react';

export default function BarGrouped() {
  return <Card as="div" className="demo-card demo-wide"><BarChart label="Prints sold" description="Per quarter" categories={['Q1', 'Q2', 'Q3', 'Q4']} series={[{ name: '2025', values: [120, 150, 170, 210] }, { name: '2026', values: [135, 179, 198, 0] }]} /></Card>;
}
