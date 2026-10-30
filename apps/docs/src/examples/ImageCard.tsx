// @example A photo at the top of a card
import { AspectRatio, Card, Image, Text } from 'pane-react';

export default function ImageCard() {
  return (
    <Card as="article" className="demo-card" aria-label="Photo">
      <AspectRatio ratio="photo"><Image src="/scenes/forest-sm.jpg" alt="Spruce forest in morning fog" /></AspectRatio>
      <Text weight="semibold">Morning fog, Vestland</Text>
    </Card>
  );
}
