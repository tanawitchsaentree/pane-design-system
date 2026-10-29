// @example The fixed sizes
import { Card, Flex, Spacer } from 'pane-react';

export default function SpacerSizes() {
  return (
    <Card as="div" className="demo-card">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((s) => <Flex key={s} gap="none"><span className="demo-mark" /><Spacer size={s} /><span className="demo-mark" /><span className="demo-label">{s}</span></Flex>)}
    </Card>
  );
}
