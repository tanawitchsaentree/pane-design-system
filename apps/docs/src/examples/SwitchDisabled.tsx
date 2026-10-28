// @example Disabled, with the reason
import { Card, Switch } from 'pane-react';

export default function SwitchDisabled() {
  return (
    <Card as="section" aria-label="Account" className="demo-card">
      <Switch label="Two-step sign-in" description="Your organisation turns this on for you." defaultChecked disabled />
    </Card>
  );
}
