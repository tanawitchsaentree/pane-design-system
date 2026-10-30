// @example Folders of prints
import { Card, TreeView } from 'pane-react';

export default function TreeFolders() {
  return <Card as="div" className="demo-card"><TreeView label="Folders" nodes={[{ id: 'prints', label: 'Prints', children: [{ id: '2026', label: '2026', children: [{ id: 'lofoten', label: 'Lofoten, March' }, { id: 'senja', label: 'Senja at night' }] }, { id: '2025', label: '2025', children: [{ id: 'hofn', label: 'Höfn harbour' }] }] }, { id: 'drafts', label: 'Drafts', children: [{ id: 'reine', label: 'Reine, untitled' }] }, { id: 'sold', label: 'Sold out' }]} defaultExpanded={['prints', '2026']} defaultValue="lofoten" /></Card>;
}
