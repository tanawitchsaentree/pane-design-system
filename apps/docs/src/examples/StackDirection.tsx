// @example Column and row stacks
import { Card, Stack, Tag } from 'pane-react';

export default function StackDirection() {
  return (
    <Card as="div" className="demo-card">
      <Stack direction="row" gap="sm">{['Design', 'Spatial', 'Glass', 'Motion', 'Tokens'].map((t) => <Tag key={t}>{t}</Tag>)}</Stack>
      <Stack gap="xs"><span>Column item 1</span><span>Column item 2</span></Stack>
    </Card>
  );
}
