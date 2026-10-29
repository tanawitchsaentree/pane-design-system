// @example A rise that is bad news
import { Card, Stat } from 'pane-react';

export default function StatReturns() {
  return <Card as="div" className="demo-card"><Stat label="Returns" value="7" change="3" direction="up" sentiment="negative" caption="since last week" /></Card>;
}
