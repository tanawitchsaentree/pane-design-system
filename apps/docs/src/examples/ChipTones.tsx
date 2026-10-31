// @example Chips that turn to crystal when chosen
import { Card, Chip, Flex } from 'pane-react';

export default function ChipTones() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm" wrap align="center">
        <Chip tone="info" defaultSelected>Ferries</Chip>
        <Chip tone="positive" defaultSelected>Open now</Chip>
        <Chip tone="accent">New this week</Chip>
        <Chip tone="warning">Few seats left</Chip>
      </Flex>
    </Card>
  );
}
