// @example Click or press Enter to pick a node
import { useState } from 'react';
import { Card, NodeCard } from 'pane-react';

export default function NodeSelected() {
  const [on, setOn] = useState('b');
  return (
    <Card as="div" className="demo-card demo-wide">
      <div className="demo-flow">
        {[['a', 'Source'], ['b', 'Filter'], ['c', 'Sink']].map(([id, title]) => <NodeCard key={id} title={title} meta="Step" selected={on === id} onSelect={() => setOn(id)} ports={{ in: 1, out: 1 }} />)}
      </div>
    </Card>
  );
}
