// @example The padding steps side by side
import { Box, Card, Flex } from 'pane-react';

export default function BoxSteps() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm" wrap>{(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => <Box key={s} padding={s} radius="inner" className="demo-box">{s}</Box>)}</Flex>
    </Card>
  );
}
