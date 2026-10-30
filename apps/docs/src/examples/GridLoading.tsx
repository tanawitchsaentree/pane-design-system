// @example Loading new rows
import { Card, DataGrid } from 'pane-react';

export default function GridLoading() {
  return <Card as="div" className="demo-card demo-wide"><DataGrid caption="Prints" loading columns={[{ key: 'print', header: 'Print', sortable: true }, { key: 'size', header: 'Size (cm)' }, { key: 'sold', header: 'Sold', align: 'end' as const, sortable: true }, { key: 'price', header: 'Price (€)', align: 'end' as const, sortable: true }]} rows={[{ id: 1, print: 'Lofoten, March', size: '40 × 50', sold: 18, price: 120 }, { id: 2, print: 'Senja at night', size: '30 × 40', sold: 9, price: 95 }, { id: 3, print: 'Höfn harbour', size: '50 × 70', sold: 4, price: 180 }, { id: 4, print: 'Reine bridge', size: '40 × 50', sold: 12, price: 120 }]} /></Card>;
}
