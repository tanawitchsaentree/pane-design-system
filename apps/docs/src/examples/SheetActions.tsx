// @example A sheet with actions at its foot
import { Button, Sheet, Text } from 'pane-react';

export default function SheetActions() {
  return (
    <Sheet preview title="Share trip" actions={<Button>Copy link</Button>}><Text>Anyone with the link can view.</Text></Sheet>
  );
}
