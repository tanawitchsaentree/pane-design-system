// @example Open and close the body
import { useState } from 'react';
import { NodeCard, Text } from 'pane-react';

export default function NodeCollapsed() {
  const [closed, setClosed] = useState(false);
  return (
    <NodeCard title="Score decks" meta="3 rules" collapsed={closed} onToggle={() => setClosed((c) => !c)} ports={{ in: 1, out: 1 }}>
      <Text as="p">Win rate over the last 30 days, weighted by event size.</Text>
    </NodeCard>
  );
}
