// @example A row of figures, each in its card
import { Card, Grid, Stat } from 'pane-react';

export default function StatRow() {
  return <Grid><Card as="div" className="demo-card"><Stat label="Orders" value="86" change="4" direction="up" sentiment="positive" caption="since yesterday" /></Card><Card as="div" className="demo-card"><Stat label="Returns" value="3" change="2" direction="up" sentiment="negative" caption="since yesterday" /></Card><Card as="div" className="demo-card"><Stat label="Rating" value="4.8" change="0" direction="flat" caption="since last week" /></Card></Grid>;
}
