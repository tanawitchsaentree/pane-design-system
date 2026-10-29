// @example With shortcuts
import { Card, ContextMenu, Text } from 'pane-react';

export default function ContextMenuShortcuts() {
  return <Card as="div" className="demo-card"><ContextMenu label="Text actions" items={[{ label: 'Copy', shortcut: '⌘C', onSelect: () => {} }, { label: 'Paste', shortcut: '⌘V', onSelect: () => {} }]}><div tabIndex={0} className="demo-row-target"><Text>Field notes, 12 March</Text></div></ContextMenu></Card>;
}
