// @example Commands for a print shop
import { Card, CommandPalette } from 'pane-react';

export default function PaletteShop() {
  return <Card as="div" className="demo-card demo-wide"><CommandPalette preview commands={[{ id: 'new', label: 'New print', group: 'Prints', shortcut: ['⌘', 'N'], onSelect: () => {} }, { id: 'find', label: 'Find an order', group: 'Orders', keywords: ['search'], onSelect: () => {} }, { id: 'ship', label: 'Mark as shipped', group: 'Orders', onSelect: () => {} }, { id: 'settings', label: 'Open settings', group: 'Shop', keywords: ['preferences'], shortcut: ['⌘', ','], onSelect: () => {} }]} /></Card>;
}
