// @example Sales by month and paper
import { Card, Heatmap } from 'pane-react';

export default function HeatMonths() {
  return <Card as="div" className="demo-card demo-wide"><Heatmap label="Sales by paper" description="Prints sold" rows={['Photo Rag', 'Baryta', 'Matt']} columns={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, 6)} values={[[20, 24, 31, 28, 35, 40], [10, 12, 15, 18, 16, 21], [5, 8, 7, 9, 12, 10]]} /></Card>;
}
