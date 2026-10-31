// @example Square tiles in a grid
import { AspectRatio, Card, Flex } from 'pane-react';

export default function AspectSquare() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm">{(['room', 'forest', 'city'] as const).map((p) => <div key={p} className="demo-ratio"><AspectRatio ratio="square" className="demo-media"><img src={`/scenes/${p}-sm.jpg`} alt="" /></AspectRatio></div>)}</Flex>
    </Card>
  );
}
