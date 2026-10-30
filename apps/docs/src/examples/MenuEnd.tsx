// @example Aligned to the end of its trigger
import { Button, Menu } from 'pane-react';

export default function MenuEnd() {
  return <Menu label="Sort" align="end" trigger={<Button variant="glass">Sort</Button>} items={[{ label: 'Newest first', onSelect: () => {} }, { label: 'Oldest first', onSelect: () => {} }]} />;
}
