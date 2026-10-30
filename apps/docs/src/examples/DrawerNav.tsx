// @example Navigation in a drawer
import { Button, Drawer, Link, Stack } from 'pane-react';

export default function DrawerNav() {
  return (
    <Drawer side="start" trigger={<Button variant="glass">Menu</Button>} title="Menu">
      <nav aria-label="Main"><Stack gap="xs"><Link variant="standalone" href="#feed">Feed</Link><Link variant="standalone" href="#trips">Trips</Link><Link variant="standalone" href="#prints">Prints</Link></Stack></nav>
    </Drawer>
  );
}
