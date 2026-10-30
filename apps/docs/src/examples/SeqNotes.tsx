// @example Notes and a call to itself
import { Card, SequenceDiagram } from 'pane-react';

export default function SeqNotes() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <SequenceDiagram label="Signing in" actors={[{ id: 'u', label: 'Browser' }, { id: 's', label: 'Server' }]}
        steps={[{ from: 'u', to: 's', label: 'Send password' }, { from: 's', to: 's', label: 'Check the hash' }, { from: 's', to: 's', label: 'Locks after five tries', kind: 'note' }, { from: 's', to: 'u', label: 'Session cookie', kind: 'reply' }]} />
    </Card>
  );
}
