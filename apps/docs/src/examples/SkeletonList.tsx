// @example A list of rows on its way
import { Card, Flex, Skeleton, Stack } from 'pane-react';

export default function SkeletonList() {
  return (
    <Card as="div" className="demo-card" role="group" aria-busy="true" aria-label="Loading messages">
      <Stack gap="md">{[0, 1, 2].map((i) => <Flex key={i} gap="md"><Skeleton shape="circle" /><div className="demo-grow"><Skeleton lines={2} /></div></Flex>)}</Stack>
    </Card>
  );
}
