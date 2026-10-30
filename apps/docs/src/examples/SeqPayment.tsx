// @example A payment from app to bank and back
import { Card, SequenceDiagram } from 'pane-react';

export default function SeqPayment() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <SequenceDiagram label="Paying for an order" actors={[{ id: 'app', label: 'App' }, { id: 'api', label: 'API' }, { id: 'bank', label: 'Bank' }]}
        steps={[{ from: 'app', to: 'api', label: 'Place order' }, { from: 'api', to: 'bank', label: 'Charge 1,200 THB' }, { from: 'bank', to: 'api', label: 'Approved', kind: 'reply' }, { from: 'api', to: 'app', label: 'Order 118 placed', kind: 'reply' }]} />
    </Card>
  );
}
