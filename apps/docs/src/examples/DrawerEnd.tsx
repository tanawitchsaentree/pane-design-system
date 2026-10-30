// @example Filters from the end
import { Button, Checkbox, Drawer, Stack } from 'pane-react';

export default function DrawerEnd() {
  return (
    <Drawer trigger={<Button variant="glass">Filters</Button>} title="Filters" actions={<Button>Apply</Button>}>
      <Stack gap="sm"><Checkbox label="Norway" defaultChecked /><Checkbox label="Iceland" /></Stack>
    </Drawer>
  );
}
