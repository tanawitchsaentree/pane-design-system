// @example Nothing matches
import { Card, CommandPalette } from 'pane-react';

export default function PaletteEmpty() {
  return <Card as="div" className="demo-card demo-wide"><CommandPalette preview empty="No commands match. Try a print or an order number." commands={[]} /></Card>;
}
