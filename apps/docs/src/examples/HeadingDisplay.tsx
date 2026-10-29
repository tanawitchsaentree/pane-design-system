// @example The display size for a page title
import { Card, Heading } from 'pane-react';

export default function HeadingDisplay() {
  return (
    <Card as="div" className="demo-card">
      <Heading level={1}>Northern light</Heading>
    </Card>
  );
}
