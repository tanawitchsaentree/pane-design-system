// @example A menu button whose chevron turns while the menu is open
import { Button, Menu } from 'pane-react';

export default function ButtonMenu() {
  return <Menu label="Sort by" trigger={<Button variant="glass" chevron>Sort by</Button>} items={[{ label: 'Newest', onSelect: () => {} }, { label: 'Price', onSelect: () => {} }, { label: 'Name', onSelect: () => {} }]} />;
}
