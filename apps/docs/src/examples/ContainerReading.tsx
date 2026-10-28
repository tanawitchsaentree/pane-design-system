// @example A reading column
import { Card, Container } from 'pane-react';

export default function ContainerReading() {
  return (
    <Container size="sm" className="demo-full">
      <Card as="article" aria-label="Article"><p className="flush">Long-form text reads best at roughly 60–75 characters per line. A small container holds that measure on wide screens without a special style.</p></Card>
    </Container>
  );
}
