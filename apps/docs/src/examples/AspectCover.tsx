// @example A cover held at 16:9
import { AspectRatio, Card } from 'pane-react';

export default function AspectCover() {
  return (
    <Card as="article" aria-labelledby="ac-h" className="demo-card">
      <AspectRatio ratio="video" className="demo-media"><img src="/scenes/city-sm.jpg" alt="Cover art for Field notes" /></AspectRatio>
      <h3 id="ac-h" className="flush">Field notes</h3>
    </Card>
  );
}
