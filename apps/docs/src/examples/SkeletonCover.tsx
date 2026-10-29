// @example A cover and its title
import { AspectRatio, Card, Skeleton } from 'pane-react';

export default function SkeletonCover() {
  return (
    <Card as="div" className="demo-card" role="group" aria-busy="true" aria-label="Loading an album">
      <AspectRatio ratio="video"><Skeleton shape="block" /></AspectRatio>
      <Skeleton lines={2} />
    </Card>
  );
}
