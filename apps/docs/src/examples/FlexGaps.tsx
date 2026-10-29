// @example The gap steps
import { Card, Flex, Stack, Tag } from 'pane-react';

export default function FlexGaps() {
  return (
    <Card as="div" className="demo-card">
      <Stack gap="sm">{(['xs', 'sm', 'md', 'lg'] as const).map((g) => <Flex key={g} gap={g}><Tag>{g}</Tag><Tag>gap</Tag><Tag>step</Tag></Flex>)}</Stack>
    </Card>
  );
}
