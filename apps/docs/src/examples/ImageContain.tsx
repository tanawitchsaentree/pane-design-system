// @example Contain shows the whole picture
import { AspectRatio, Card, Image } from 'pane-react';

export default function ImageContain() {
  return (
    <Card as="div" className="demo-card">
      <AspectRatio ratio="square"><Image src="/scenes/city-sm.jpg" alt="City street at dusk" fit="contain" radius="none" /></AspectRatio>
    </Card>
  );
}
