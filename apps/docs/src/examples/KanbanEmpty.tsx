// @example An empty column to drop into
import { useState } from 'react';
import { Card, KanbanBoard } from 'pane-react';
import type { KanbanColumn } from 'pane-react';

export default function KanbanEmpty() {
  const [cols, setCols] = useState<KanbanColumn[]>([{ id: 'in', title: 'Inbox', cards: [{ id: 'p', title: 'Reprint Höfn harbour' }] }, { id: 'out', title: 'Done', cards: [] }]);
  return <Card as="div" className="demo-card demo-wide"><KanbanBoard label="Tasks" columns={cols} onChange={setCols} /></Card>;
}
