// @example A title on one side, actions on the other
import { Button, Card, Flex } from 'pane-react';

export default function FlexToolbar() {
  return (
    <Card as="div" className="demo-card">
      <Flex justify="between">
        <h3 className="flush">Drafts</h3>
        <Flex gap="sm"><Button variant="glass" size="sm">Sort</Button><Button size="sm">New</Button></Flex>
      </Flex>
    </Card>
  );
}
