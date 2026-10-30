// @example A fall that is good news
import { Card, Stat } from 'pane-react';

export default function StatCostsDown() {
  return <Card as="div" className="demo-card"><Stat label="Shipping costs" value="€ 412" change="8%" direction="down" sentiment="positive" caption="since last month" /></Card>;
}
