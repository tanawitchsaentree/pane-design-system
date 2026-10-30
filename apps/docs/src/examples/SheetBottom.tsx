// @example A bottom sheet
import { Button, Sheet, Stack, Switch } from 'pane-react';

export default function SheetBottom() {
  return (
    <Sheet trigger={<Button variant="glass">Filters</Button>} title="Filters" description="Show only what you want to see.">
      <Stack gap="md"><Switch label="Photos" defaultChecked /><Switch label="Videos" /></Stack>
    </Sheet>
  );
}
