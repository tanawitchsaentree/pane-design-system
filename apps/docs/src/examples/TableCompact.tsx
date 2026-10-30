// @example Compact, for dense data
import { Table } from 'pane-react';
const ROWS = [{ id: 'l', print: 'Lofoten, March', size: '40 × 50', sold: 18, price: 120 }, { id: 's', print: 'Senja at night', size: '30 × 40', sold: 9, price: 95 }, { id: 'h', print: 'Höfn harbour', size: '50 × 70', sold: 4, price: 180 }, { id: 'v', print: 'Vík in fog', size: '30 × 40', sold: 12, price: 95 }];
const COLUMNS = [{ key: 'print', header: 'Print', sortable: true }, { key: 'size', header: 'Size (cm)' }, { key: 'sold', header: 'Sold', align: 'end' as const, sortable: true }, { key: 'price', header: 'Price (€)', align: 'end' as const, sortable: true }];
export default function TableCompact() {
  return <Table caption="Prints in the shop" showCaption density="compact" columns={COLUMNS} rows={ROWS} />;
}
