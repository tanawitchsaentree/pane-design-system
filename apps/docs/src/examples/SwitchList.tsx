// @example A list of settings
import { Card, Switch } from 'pane-react';

export default function SwitchList() {
  return (
    <Card as="div" className="demo-card">
      <Switch label="Push notifications" defaultChecked />
      <Switch label="Weekly summary" />
      <Switch label="Show activity status" defaultChecked />
    </Card>
  );
}
