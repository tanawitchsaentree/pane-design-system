// @example Sales by paper
import { BarChart, Card } from 'pane-react';

export default function BarStacked() {
  return <Card as="div" className="demo-card demo-wide"><BarChart label="Sales by paper" description="Per quarter, 2026" stacked categories={['Q1', 'Q2', 'Q3']} series={[{ name: 'Photo Rag', values: [70, 88, 95] }, { name: 'Baryta', values: [40, 51, 62] }, { name: 'Matt', values: [25, 40, 41] }]} /></Card>;
}
