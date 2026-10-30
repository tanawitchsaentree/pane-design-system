// @example A trend under a number
import { Card, Sparkline, Stat } from 'pane-react';

export default function SparkStat() {
  return <Card as="div" className="demo-card"><Stat label="Prints sold" value="1,284" change="12%" direction="up" sentiment="positive" caption="since last week" /><Sparkline label="Sales over the last 12 weeks, rising" values={[40, 42, 38, 45, 50, 48, 55, 58, 54, 61, 66, 70]} /></Card>;
}
