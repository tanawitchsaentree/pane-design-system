// @example The five ratios
import { AspectRatio, Card, Flex } from 'pane-react';

export default function AspectRatios() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm" align="end" wrap>
        {(['square', 'photo', 'video', 'portrait', 'wide'] as const).map((r) => <div key={r} className="demo-ratio"><AspectRatio ratio={r} className="demo-media"><span className="demo-ratio-fill">{r}</span></AspectRatio></div>)}
      </Flex>
    </Card>
  );
}
