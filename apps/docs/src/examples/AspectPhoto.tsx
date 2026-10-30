// @example A photo at 4:3 that never jumps while it loads
import { AspectRatio, Card } from 'pane-react';

export default function AspectPhoto() {
  return (
    <Card as="div" className="demo-card">
      <AspectRatio ratio="photo" className="demo-media"><img src="/scenes/forest-sm.jpg" alt="Spruce forest in morning fog" /></AspectRatio>
    </Card>
  );
}
