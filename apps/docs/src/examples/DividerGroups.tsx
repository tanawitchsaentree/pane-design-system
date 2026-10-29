// @example Groups in a settings pane
import { Card, Divider, Stack, Switch } from 'pane-react';

export default function DividerGroups() {
  return (
    <Card as="section" aria-labelledby="dg-h" className="demo-card">
      <h3 id="dg-h" className="flush">Notifications</h3>
      <Stack gap="md"><Switch label="Mentions" defaultChecked /><Switch label="New followers" /></Stack>
      <Divider />
      <Stack gap="md"><Switch label="Weekly summary" /></Stack>
    </Card>
  );
}
