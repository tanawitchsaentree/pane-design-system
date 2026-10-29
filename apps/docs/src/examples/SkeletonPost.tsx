// @example A post on its way
import { Card, Flex, Skeleton, Stack } from 'pane-react';

export default function SkeletonPost() {
  return (
    <Card as="div" className="demo-card" role="group" aria-busy="true" aria-label="Loading a post">
      <Flex gap="md"><Skeleton shape="circle" /><Stack gap="xs" className="demo-grow"><Skeleton /><Skeleton lines={1} /></Stack></Flex>
      <Skeleton lines={3} />
    </Card>
  );
}
