// @example A column that centres its items
import { Avatar, Card, Flex } from 'pane-react';

export default function FlexColumn() {
  return (
    <Card as="div" className="demo-card">
      <Flex direction="column" gap="sm" align="center">
        <Avatar name="Mara Lind" size="lg" />
        <h3 className="flush">Mara Lind</h3>
        <p className="flush">Bergen, Norway</p>
      </Flex>
    </Card>
  );
}
