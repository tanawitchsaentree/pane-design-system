// @example Prints sold per month
import { BarChart, Card } from 'pane-react';

export default function BarMonths() {
  return <Card as="div" className="demo-card demo-wide"><BarChart label="Prints sold" description="Per month, 2026" categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, 9)} series={[{ name: 'Prints', values: [42, 38, 55, 61, 48, 70, 66, 59, 73] }]} /></Card>;
}
