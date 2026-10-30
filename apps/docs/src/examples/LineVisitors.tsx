// @example Visitors per day
import { Card, LineChart } from 'pane-react';

export default function LineVisitors() {
  return <Card as="div" className="demo-card demo-wide"><LineChart label="Shop visitors" description="Per day, last two weeks" area points={Array.from({ length: 14 }, (_, i) => `${i + 1} Nov`)} series={[{ name: 'Visitors', values: [320, 290, 410, 380, 450, 520, 610, 480, 430, 470, 500, 560, 640, 700] }]} /></Card>;
}
