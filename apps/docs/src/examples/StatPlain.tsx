// @example A figure with no change
import { Card, Stat } from 'pane-react';

export default function StatPlain() {
  return <Card as="div" className="demo-card"><Stat label="Prints in the shop" value="214" /></Card>;
}
