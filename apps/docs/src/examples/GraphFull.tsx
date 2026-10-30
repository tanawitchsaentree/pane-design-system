// @example Accounts linked by a shared device, card and address
import { Card, NetworkGraph } from 'pane-react';
const NODES = [
  { id: 'a', label: 'Account A', group: 0 }, { id: 'b', label: 'Account B', group: 0 }, { id: 'c', label: 'Device 7', group: 1 },
  { id: 'd', label: 'Card 4411', group: 2 }, { id: 'e', label: 'Account E', group: 0 }, { id: 'f', label: 'Address 9', group: 1 },
];
const EDGES = [
  { from: 'a', to: 'c', label: 'signed in from' }, { from: 'b', to: 'c', label: 'signed in from' }, { from: 'a', to: 'd', label: 'paid with' },
  { from: 'e', to: 'd', label: 'paid with' }, { from: 'e', to: 'f', label: 'ships to' }, { from: 'b', to: 'f', label: 'ships to' },
];

export default function GraphFull() {
  return <Card as="div" className="demo-card demo-wide"><NetworkGraph label="Linked accounts" nodes={NODES} edges={EDGES} /></Card>;
}
