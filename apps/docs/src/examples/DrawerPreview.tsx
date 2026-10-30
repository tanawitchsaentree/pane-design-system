// @example A drawer drawn in place
import { Drawer, Stack, Switch } from 'pane-react';

export default function DrawerPreview() {
  return <Drawer preview title="Filters"><Stack gap="md"><Switch label="Only saved" /><Switch label="Only mine" defaultChecked /></Stack></Drawer>;
}
