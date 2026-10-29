// @example Groups with a groove between
import { Button, Menu } from 'pane-react';

export default function MenuGroups() {
  return <Menu label="Trip" trigger={<Button variant="glass">Trip</Button>} items={[{ label: 'Rename', onSelect: () => {} }, { label: 'Duplicate', onSelect: () => {} }, 'separator', { label: 'Archive', onSelect: () => {} }, { label: 'Delete trip', tone: 'critical', onSelect: () => {} }]} />;
}
