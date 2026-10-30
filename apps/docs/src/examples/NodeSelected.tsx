// @example Click or press Enter to pick a node
import { useState } from 'react';
import { NodeCard } from 'pane-react';

export default function NodeSelected() {
  const [on, setOn] = useState('b');
  return (
    <div className="demo-row">
      {[['a', 'Source'], ['b', 'Filter'], ['c', 'Sink']].map(([id, title]) => <NodeCard key={id} title={title} meta="Step" selected={on === id} onSelect={() => setOn(id)} ports={{ in: 1, out: 1 }} />)}
    </div>
  );
}
