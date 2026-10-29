// @example A bottom sheet drawn in place
import { Sheet, Stack, Switch } from 'pane-react';

export default function SheetPreview() {
  return (
    <Sheet preview title="Filters" description="Show only what you want to see."><Stack gap="md"><Switch label="Photos" defaultChecked /><Switch label="Videos" /></Stack></Sheet>
  );
}
