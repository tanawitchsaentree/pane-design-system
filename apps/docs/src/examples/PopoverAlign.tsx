// @example Aligned to the start of its trigger
import { Button, Popover, Text } from 'pane-react';

export default function PopoverAlign() {
  return <Popover align="start" trigger={<Button variant="glass">Price</Button>} title="Price"><Text>Includes tax and shipping in Norway.</Text></Popover>;
}
