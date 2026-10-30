// @example Arrow keys move the node, ten steps with Shift
import { useState } from 'react';
import { NodeCard, Text } from 'pane-react';

export default function NodeMove() {
  const [at, setAt] = useState({ x: 0, y: 0 });
  return (
    <div className="demo-row">
      <NodeCard title="Move me" meta="Focus, then use the arrows" onMove={(dx, dy) => setAt((p) => ({ x: p.x + dx, y: p.y + dy }))} />
      <Text as="p" aria-live="polite">At {at.x}, {at.y}</Text>
    </div>
  );
}
