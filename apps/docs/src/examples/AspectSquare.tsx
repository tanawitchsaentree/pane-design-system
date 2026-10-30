// @example Square tiles in a grid
import { AspectRatio, Card, Flex, Mesh } from 'pane-react';

export default function AspectSquare() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm">{(['aurora', 'tide', 'ember'] as const).map((p) => <div key={p} className="demo-ratio"><AspectRatio ratio="square" className="demo-media"><Mesh preset={p} /></AspectRatio></div>)}</Flex>
    </Card>
  );
}
