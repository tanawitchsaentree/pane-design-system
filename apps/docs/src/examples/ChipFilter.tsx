// @example Filter chips
import { Card, Chip, Stack } from 'pane-react';

export default function ChipFilter() {
  return (
    <Card as="div" className="demo-card">
      <Stack direction="row" gap="sm" role="group" aria-label="Filter posts">
        <Chip defaultSelected>Photos</Chip>
        <Chip>Videos</Chip>
        <Chip>Links</Chip>
      </Stack>
    </Card>
  );
}
