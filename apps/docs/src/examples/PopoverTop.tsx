// @example Opening above its trigger
import { Button, Popover, Text } from 'pane-react';

export default function PopoverTop() {
  return <Popover side="top" trigger={<Button variant="glass">Why?</Button>}><Text>We ask so we can ship to the right place.</Text></Popover>;
}
