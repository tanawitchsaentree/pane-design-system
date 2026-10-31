// @example Tags tinted by category
import { Card, Flex, Tag } from 'pane-react';

export default function TagTones() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm" wrap align="center">
        <Tag tone="info">Coast</Tag>
        <Tag tone="positive">Forest</Tag>
        <Tag tone="warning">Desert</Tag>
        <Tag tone="accent">Night</Tag>
        <Tag>Studio</Tag>
      </Flex>
    </Card>
  );
}
