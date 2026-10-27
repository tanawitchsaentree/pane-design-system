// @example A checkbox with a description
import { Card, Checkbox } from 'pane-react';

export default function CheckboxBasic() {
  return (
    <Card as="section" aria-label="Privacy" className="demo-card">
      <Checkbox label="Show my email on my profile" description="Anyone who visits your profile can see it." defaultChecked />
    </Card>
  );
}
