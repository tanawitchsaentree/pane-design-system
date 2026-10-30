// @example A count that also says what it counts
import { Badge, Card, Flex, VisuallyHidden } from 'pane-react';

export default function VHCount() {
  return (
    <Card as="div" className="demo-card">
      <Flex justify="between"><h3 className="flush">Inbox</h3><Badge>3<VisuallyHidden> unread messages</VisuallyHidden></Badge></Flex>
    </Card>
  );
}
