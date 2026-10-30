// @example A named refresh
import { Card, PullToRefresh, Text } from 'pane-react';

export default function PTRLabel() {
  return <Card as="div" className="demo-card"><PullToRefresh className="demo-ptr" label="Refresh trips" onRefresh={() => undefined}><Text>Trips</Text></PullToRefresh></Card>;
}
