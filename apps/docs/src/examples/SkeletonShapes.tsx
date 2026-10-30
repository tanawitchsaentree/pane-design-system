// @example The three shapes
import { Card, Flex, Skeleton } from 'pane-react';

export default function SkeletonShapes() {
  return (
    <Card as="div" className="demo-card" aria-hidden="true">
      <Flex gap="lg" align="center"><Skeleton shape="circle" /><div className="demo-sk-block"><Skeleton shape="block" /></div><div className="demo-grow"><Skeleton lines={2} /></div></Flex>
    </Card>
  );
}
