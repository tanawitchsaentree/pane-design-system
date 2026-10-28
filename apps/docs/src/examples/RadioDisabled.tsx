// @example One option turned off
import { Card, Radio, RadioGroup } from 'pane-react';

export default function RadioDisabled() {
  return (
    <Card as="section" aria-label="Plan" className="demo-card">
      <RadioGroup label="Plan" defaultValue="free">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
        <Radio value="team" label="Team, for 3 people or more" disabled />
      </RadioGroup>
    </Card>
  );
}
