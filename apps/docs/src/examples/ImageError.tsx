// @example A picture that failed to load
import { AspectRatio, Card, Image, Text } from 'pane-react';

export default function ImageError() {
  return (
    <Card as="div" className="demo-card">
      <AspectRatio ratio="video"><Image src="/missing.jpg" alt="A missing photo of a harbour" /></AspectRatio>
      <Text tone="secondary">The space stays a quiet recess.</Text>
    </Card>
  );
}
