// @example A popover drawn in place
import { Button, Popover, Text } from 'pane-react';

export default function PopoverPreview() {
  return <Popover preview trigger={<Button variant="glass">Shipping</Button>} title="Shipping"><Text>Prints ship within a week.</Text></Popover>;
}
