// @example Nothing chosen yet
import { Card, TransferList } from 'pane-react';

export default function TransferEmpty() {
  return <Card as="div" className="demo-card demo-wide"><TransferList labels={['Papers', 'In this order']} options={[{ value: 'rag', label: 'Photo Rag' }, { value: 'baryta', label: 'Baryta' }, { value: 'matt', label: 'Matt' }, { value: 'pearl', label: 'Pearl' }]} /></Card>;
}
