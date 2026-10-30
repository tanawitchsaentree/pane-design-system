// @example Three shops compared
import { Card, LineChart } from 'pane-react';

export default function LineCompare() {
  return <Card as="div" className="demo-card demo-wide"><LineChart label="Orders" description="Per month, 2026" points={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, 9)} series={[{ name: 'Oslo', values: [40, 42, 51, 58, 49, 62, 70, 66, 75] }, { name: 'Bergen', values: [22, 25, 24, 31, 35, 33, 41, 44, 40] }, { name: 'Tromsø', values: [8, 12, 15, 14, 19, 26, 30, 28, 24] }]} /></Card>;
}
