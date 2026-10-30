// @example Cells drawn with other components
import { Badge, Table } from 'pane-react';

export default function TableStatus() {
  return <Table caption="Orders" columns={[{ key: 'order', header: 'Order' }, { key: 'buyer', header: 'Buyer' }, { key: 'status', header: 'Status', render: (r: { status: string }) => <Badge tone={r.status === 'Shipped' ? 'positive' : 'neutral'}>{r.status}</Badge> }]} rows={[{ id: 1, order: '#1042', buyer: 'Mara Lind', status: 'Shipped' }, { id: 2, order: '#1043', buyer: 'Jon Berg', status: 'Packing' }]} />;
}
