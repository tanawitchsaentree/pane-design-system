// @example On a list row
import { Card, ContextMenu, Text } from 'pane-react';

export default function ContextMenuRow() {
  return <Card as="div" className="demo-card"><ContextMenu label="Message actions" items={[{ label: 'Reply', onSelect: () => {} }, { label: 'Mark as unread', onSelect: () => {} }]}><div tabIndex={0} className="demo-row-target"><Text>Mara: the prints arrived</Text></div></ContextMenu></Card>;
}
