// @example Prints, sortable by name, sales and price
import { Table } from 'pane-react';
const ROWS = [{ id: 'l', print: 'Lofoten, March', size: '40 × 50', sold: 18, price: 120 }, { id: 's', print: 'Senja at night', size: '30 × 40', sold: 9, price: 95 }, { id: 'h', print: 'Höfn harbour', size: '50 × 70', sold: 4, price: 180 }, { id: 'v', print: 'Vík in fog', size: '30 × 40', sold: 12, price: 95 }];
const COLUMNS = [{ key: 'print', header: 'Print', sortable: true }, { key: 'size', header: 'Size (cm)' }, { key: 'sold', header: 'Sold', align: 'end' as const, sortable: true }, { key: 'price', header: 'Price (€)', align: 'end' as const, sortable: true }];
export default function TablePrints() {
  return <Table caption="Prints in the shop" columns={COLUMNS} rows={ROWS} defaultSort={{ key: 'sold', direction: 'descending' }} />;
}
