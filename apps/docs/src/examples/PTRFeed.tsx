// @example A feed with its Refresh button
import { Card, PullToRefresh, Text } from 'pane-react';

export default function PTRFeed() {
  return <Card as="div" className="demo-card"><PullToRefresh className="demo-ptr" onRefresh={() => new Promise((r) => setTimeout(r, 600))}><Text>Tab here to find the Refresh button.</Text></PullToRefresh></Card>;
}
