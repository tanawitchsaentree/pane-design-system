// @example Ghost for a third action, danger to delete
import { Button, Card, Flex } from 'pane-react';

export default function ButtonGhostDanger() {
  return <Card as="div" className="demo-card"><Flex gap="md" wrap><Button>Save changes</Button><Button variant="ghost">Preview</Button><Button variant="danger">Delete album</Button></Flex></Card>;
}
