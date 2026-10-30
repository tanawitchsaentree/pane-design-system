// @example The round corner for a pill-shaped group
import { Box, Card, Flex, Tag } from 'pane-react';

export default function BoxRound() {
  return (
    <Card as="div" className="demo-card">
      <Box radius="round" paddingInline="lg" paddingBlock="sm" className="demo-box"><Flex gap="sm"><Tag>Norway</Tag><Tag>Fjords</Tag></Flex></Box>
    </Card>
  );
}
