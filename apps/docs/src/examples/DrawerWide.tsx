// @example A drawer with a description
import { Drawer, Text } from 'pane-react';

export default function DrawerWide() {
  return <Drawer preview side="end" title="Activity" description="The last seven days."><Text>Mara liked your print.</Text></Drawer>;
}
