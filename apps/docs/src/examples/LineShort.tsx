// @example A short line
import { Card, LineChart } from 'pane-react';

export default function LineShort() {
  return <Card as="div" className="demo-card demo-wide"><LineChart label="Returns" description="Per week" blockSize={180} points={['W40', 'W41', 'W42', 'W43', 'W44']} series={[{ name: 'Returns', values: [6, 4, 5, 3, 2] }]} /></Card>;
}
