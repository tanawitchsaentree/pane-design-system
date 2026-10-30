// @example Columns shown in a table
import { Card, TransferList } from 'pane-react';

export default function TransferColumns() {
  return <Card as="div" className="demo-card demo-wide"><TransferList labels={['Hidden columns', 'Shown columns']} options={[{ value: 'print', label: 'Print' }, { value: 'size', label: 'Size' }, { value: 'paper', label: 'Paper' }, { value: 'price', label: 'Price' }, { value: 'sold', label: 'Sold' }, { value: 'stock', label: 'In stock' }]} defaultValue={['print', 'price', 'sold']} /></Card>;
}
