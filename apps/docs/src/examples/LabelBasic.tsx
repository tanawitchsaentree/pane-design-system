// @example A label above its field
import { Card, Input, Label } from 'pane-react';

export default function LabelBasic() {
  return (
    <Card as="div" className="demo-card">
      <Label htmlFor="label-demo" required>Display name</Label>
      <Input id="label-demo" defaultValue="Mara Lind" />
    </Card>
  );
}
