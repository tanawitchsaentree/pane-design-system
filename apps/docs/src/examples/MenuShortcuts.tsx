// @example With keyboard shortcuts
import { Button, Menu } from 'pane-react';

export default function MenuShortcuts() {
  return <Menu label="File" trigger={<Button variant="glass">File</Button>} items={[{ label: 'New trip', shortcut: '⌘N', onSelect: () => {} }, { label: 'Open', shortcut: '⌘O', onSelect: () => {} }, { label: 'Export', onSelect: () => {}, disabled: true }]} />;
}
