// @example Full bleed with the inner corner
import { Card, Image } from 'pane-react';

export default function ImageInner() {
  return (
    <Card as="div" className="demo-card">
      <Image src="/scenes/night-sm.jpg" alt="Café terrace at night" radius="inner" className="demo-img" />
    </Card>
  );
}
