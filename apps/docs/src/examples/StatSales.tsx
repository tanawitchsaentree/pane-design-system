// @example Sales this week
import { Card, Stat } from 'pane-react';

export default function StatSales() {
  return <Card as="div" className="demo-card"><Stat label="Prints sold" value="1,284" change="12%" direction="up" sentiment="positive" caption="since last week" /></Card>;
}
