// @example Orders by day and hour
import { Card, Heatmap } from 'pane-react';

export default function HeatHours() {
  return <Card as="div" className="demo-card demo-wide"><Heatmap label="Orders by hour" description="Orders" rows={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} columns={['08', '10', '12', '14', '16', '18', '20']} values={[[2, 5, 9, 7, 4, 3, 1], [1, 4, 8, 9, 6, 2, 1], [2, 6, 7, 8, 5, 3, 2], [3, 5, 9, 10, 7, 4, 2], [4, 7, 10, 12, 9, 6, 3], [6, 9, 12, 14, 13, 10, 5], [5, 8, 11, 12, 10, 7, 4]]} /></Card>;
}
