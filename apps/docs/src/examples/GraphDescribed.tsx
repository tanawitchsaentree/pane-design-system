// @example With a description of what to look for
import { Card, NetworkGraph } from 'pane-react';
const NODES = [
  { id: 'a', label: 'Account A', group: 0 }, { id: 'b', label: 'Account B', group: 0 }, { id: 'c', label: 'Device 7', group: 1 },
  { id: 'd', label: 'Card 4411', group: 2 }, { id: 'e', label: 'Account E', group: 0 }, { id: 'f', label: 'Address 9', group: 1 },
];
const EDGES = [
  { from: 'a', to: 'c', label: 'signed in from' }, { from: 'b', to: 'c', label: 'signed in from' }, { from: 'a', to: 'd', label: 'paid with' },
  { from: 'e', to: 'd', label: 'paid with' }, { from: 'e', to: 'f', label: 'ships to' }, { from: 'b', to: 'f', label: 'ships to' },
];

export default function GraphDescribed() {
  return <Card as="div" className="demo-card demo-wide"><NetworkGraph label="Linked accounts" description="Account A and Account E never touch, yet they share Card 4411." nodes={NODES} edges={EDGES} /></Card>;
}
