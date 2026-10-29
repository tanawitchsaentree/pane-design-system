// @example Details next to a button
import { Button, Popover, Text } from 'pane-react';

export default function PopoverInfo() {
  return (
    <Popover trigger={<Button variant="glass">Shipping</Button>} title="Shipping"><Text>Prints ship within a week. Framed prints take two.</Text></Popover>
  );
}
