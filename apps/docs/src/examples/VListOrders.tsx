// @example Five thousand orders
import { Card, VirtualList } from 'pane-react';

export default function VListOrders() {
  return <Card as="div" className="demo-card demo-wide"><VirtualList label="All orders" blockSize="18rem" items={Array.from({ length: 5000 }, (_, i) => ({ id: 100000 + i, who: ['Mara Lind', 'Jon Berg', 'Ida Holm'][i % 3] }))} getKey={(o) => o.id} renderItem={(o) => <span>Order {o.id} · {o.who}</span>} /></Card>;
}
