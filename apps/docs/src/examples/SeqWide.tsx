// @example Five lanes scroll sideways on a phone
import { Card, SequenceDiagram } from 'pane-react';

const A = ['Client', 'Gateway', 'Orders', 'Stock', 'Mail'].map((label) => ({ id: label, label }));

export default function SeqWide() {
  return <Card as="div" className="demo-card demo-wide"><SequenceDiagram label="Placing an order" actors={A} steps={[{ from: 'Client', to: 'Gateway', label: 'POST /order' }, { from: 'Gateway', to: 'Orders', label: 'Create' }, { from: 'Orders', to: 'Stock', label: 'Reserve' }, { from: 'Stock', to: 'Orders', label: 'Reserved', kind: 'reply' }, { from: 'Orders', to: 'Mail', label: 'Send receipt' }]} /></Card>;
}
