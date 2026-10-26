// @example The five stack gaps
import { Card, Stack } from 'pane-react';

export default function StackGaps() {
  return (
    <Card as="div" className="demo-card">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((g) => (
        <Stack key={g} direction="row" gap={g} align="center"><code className="gap-label">{g}</code><span className="gap-box" /><span className="gap-box" /><span className="gap-box" /></Stack>
      ))}
    </Card>
  );
}
