// @example Bars for long names
import { BarChart, Card } from 'pane-react';

export default function BarSideways() {
  return <Card as="div" className="demo-card demo-wide"><BarChart label="Best sellers" description="Prints sold this year" layout="bar" categories={['Lofoten, March', 'Reine bridge', 'Senja at night', 'Höfn harbour']} series={[{ name: 'Prints', values: [180, 124, 96, 41] }]} /></Card>;
}
