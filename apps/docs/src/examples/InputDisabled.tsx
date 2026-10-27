// @example Disabled and read-only
import { Card, FormField, Input } from 'pane-react';

export default function InputDisabled() {
  return (
    <Card as="div" className="demo-card">
      <FormField label="Username" help="Usernames cannot be changed after 30 days."><Input defaultValue="maralind" readOnly /></FormField>
      <FormField label="Workspace" disabled help="Ask Ada Park to change the workspace name."><Input defaultValue="Bergen Prints" /></FormField>
    </Card>
  );
}
