// @example Everything chosen
import { Card, TransferList } from 'pane-react';

export default function TransferAll() {
  return <Card as="div" className="demo-card demo-wide"><TransferList labels={['Available', 'In the newsletter']} options={[{ value: 'a', label: 'Lofoten' }, { value: 'b', label: 'Senja' }, { value: 'c', label: 'Höfn' }]} defaultValue={['a', 'b', 'c']} /></Card>;
}
