// @example Container sizes
import { Container, Stack } from 'pane-react';

export default function ContainerSizes() {
  return (
    <Stack gap="sm" className="demo-full">
      {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Container key={s} size={s} className="container-demo"><span>{s}</span></Container>
      ))}
    </Stack>
  );
}
