// @example A short form in a popover
import { Button, FormField, Input, Popover } from 'pane-react';

export default function PopoverForm() {
  return (
    <Popover trigger={<Button variant="glass">Add note</Button>} title="Add a note"><FormField label="Note"><Input /></FormField><Button size="sm">Save</Button></Popover>
  );
}
