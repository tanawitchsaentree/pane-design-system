// @example A caption under a picture
import { AspectRatio, Card, Mesh, Text } from 'pane-react';

export default function TextCaption() {
  return (
    <Card as="article" aria-label="Photo" className="demo-card">
      <AspectRatio ratio="video" className="demo-media"><Mesh preset="tide" /></AspectRatio>
      <Text as="span" size="caption" tone="secondary">Low tide at Ramberg, 06:10.</Text>
    </Card>
  );
}
