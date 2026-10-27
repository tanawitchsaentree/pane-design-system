// @example A setting that applies at once
import { Card, Switch } from 'pane-react';

export default function SwitchBasic() {
  return (
    <Card as="section" aria-label="Account" className="demo-card">
      <Switch label="Private account" description="Only followers see your posts." defaultChecked />
    </Card>
  );
}
