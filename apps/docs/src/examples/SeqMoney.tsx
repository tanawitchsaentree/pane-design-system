// @example A money trail with times
import { Card, SequenceDiagram } from 'pane-react';

export default function SeqMoney() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <SequenceDiagram label="Money trail, case 2026-118" actors={[{ id: 'v', label: 'Victim' }, { id: 'm', label: 'Mule' }, { id: 'x', label: 'Exchange' }]}
        steps={[{ from: 'v', to: 'm', label: 'Transfers 40,000 THB', time: '09:12' }, { from: 'm', to: 'x', label: 'Buys USDT', time: '09:31' }, { from: 'x', to: 'm', label: 'Credits 1,150 USDT', kind: 'reply', time: '09:32' }]} />
    </Card>
  );
}
