// @example Two columns
import { useState } from 'react';
import { Card, KanbanBoard } from 'pane-react';
import type { KanbanColumn } from 'pane-react';

export default function KanbanTwo() {
  const [cols, setCols] = useState<KanbanColumn[]>([{ id: 'idea', title: 'Ideas', cards: [{ id: 'x', title: 'A winter album' }, { id: 'y', title: 'Harbour series' }] }, { id: 'doing', title: 'Shooting', cards: [{ id: 'z', title: 'Senja coast' }] }]);
  return <Card as="div" className="demo-card demo-wide"><KanbanBoard label="Projects" columns={cols} onChange={setCols} /></Card>;
}
