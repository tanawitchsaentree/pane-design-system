// @example Loading, rows kept under a scrim
import { Card, Table } from 'pane-react';

export default function TableLoading() {
  return <Card as="div" className="demo-card"><Table caption="Prints" loading columns={[{ key: 'print', header: 'Print' }, { key: 'price', header: 'Price', align: 'end' }]} rows={[{ id: 1, print: 'Lofoten', price: 120 }, { id: 2, print: 'Senja', price: 95 }]} /></Card>;
}
