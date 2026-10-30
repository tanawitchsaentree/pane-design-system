// @example Rows with icons
import { Card, TreeView } from 'pane-react';
import { IconImage, IconInbox } from '../icons';

export default function TreeIcons() {
  return <Card as="div" className="demo-card"><TreeView label="Library" defaultExpanded={['photos']} nodes={[{ id: 'photos', label: 'Photos', icon: <IconImage />, children: [{ id: 'march', label: 'March', icon: <IconImage /> }, { id: 'april', label: 'April', icon: <IconImage /> }] }, { id: 'inbox', label: 'Inbox', icon: <IconInbox /> }]} /></Card>;
}
