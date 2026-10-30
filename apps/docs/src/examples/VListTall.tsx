// @example Taller rows
import { Card, VirtualList } from 'pane-react';

export default function VListTall() {
  return <Card as="div" className="demo-card demo-wide"><VirtualList label="Customers" blockSize="16rem" rowHeight={56} items={Array.from({ length: 800 }, (_, i) => `Customer ${i + 1}`)} renderItem={(c) => <span>{c}</span>} /></Card>;
}
