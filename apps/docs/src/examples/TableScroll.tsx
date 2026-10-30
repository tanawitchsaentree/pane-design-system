// @example A long table with its header in view
import { Table } from 'pane-react';

export default function TableScroll() {
  return <Table caption="Sales by day" maxHeight="16rem" columns={[{ key: 'day', header: 'Day' }, { key: 'orders', header: 'Orders', align: 'end' }, { key: 'total', header: 'Total (€)', align: 'end' }]} rows={Array.from({ length: 14 }, (_, i) => ({ id: i, day: `${i + 1} March`, orders: (i * 7) % 11 + 2, total: ((i * 7) % 11 + 2) * 95 }))} />;
}
