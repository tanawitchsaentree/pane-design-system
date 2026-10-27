// @example Container sizes
import { Card, Container, Stack } from 'pane-react';

export default function ContainerSizes() {
  return (
    // text sits on a pane, never straight on the scene (P1, P3)
    <Card as="div" className="demo-full">
    <Stack gap="sm">
      {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Container key={s} size={s} className="container-demo"><span>{s}</span></Container>
      ))}
    </Stack>
    </Card>
  );
}
