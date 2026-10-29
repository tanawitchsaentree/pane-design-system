// @example A side sheet from the end
import { Button, Sheet, Text } from 'pane-react';

export default function SheetEnd() {
  return (
    <Sheet side="end" trigger={<Button variant="glass">Details</Button>} title="Print details"><Text>A3, matte, signed.</Text></Sheet>
  );
}
