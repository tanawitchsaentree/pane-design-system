// @example Print orders by stage
import { useState } from 'react';
import { Card, KanbanBoard } from 'pane-react';
import type { KanbanColumn } from 'pane-react';

export default function KanbanOrders() {
  const [cols, setCols] = useState<KanbanColumn[]>([{ id: 'todo', title: 'To print', cards: [{ id: 'a', title: 'Lofoten, March', meta: '40 × 50 · Photo Rag' }, { id: 'b', title: 'Reine bridge', meta: '30 × 40 · Baryta' }] }, { id: 'print', title: 'Printing', cards: [{ id: 'c', title: 'Senja at night', meta: '50 × 70 · Photo Rag' }] }, { id: 'done', title: 'Ready to ship', cards: [] }]);
  return <Card as="div" className="demo-card demo-wide"><KanbanBoard label="Print orders" columns={cols} onChange={setCols} /></Card>;
}
