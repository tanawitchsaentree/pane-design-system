// @example A node with two inputs and three outputs
import { Card, NodeCard } from 'pane-react';

export default function NodePorts() {
  return <Card as="div" className="demo-card demo-wide"><NodeCard title="Split by format" meta="2 in, 3 out" ports={{ in: 2, out: 3 }} /></Card>;
}
