// @example Free space pushes the action to the end
import { Button, Card, Flex, Spacer } from 'pane-react';

export default function SpacerPush() {
  return (
    <Card as="div" className="demo-card">
      <Flex><p className="flush">3 items selected</p><Spacer /><Button size="sm">Move</Button></Flex>
    </Card>
  );
}
